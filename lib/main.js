const Path = require('path');
// const { CompositeDisposable, ScopeDescriptor } = require('atom');
const {
  AutoLanguageClient,
  CommandExecutionAdapter
} = require('@savetheclocktower/atom-languageclient');

const ROOT = Path.normalize(Path.join(__dirname, '..'));

// The TypeScript server won't suggest any of these kinds of code actions
// unless you specifically ask for them.
const CODE_ACTION_KINDS = [
  'quickfix',
  'refactor',
  'refactor.extract',
  'refactor.inline',
  'refactor.rewrite',
  'source',
  'source.organizeImports',
  'source.fixAll'
];

class TypeScriptLanguageClient extends AutoLanguageClient {
  activate (...args) {
    super.activate(...args);

    this.commandDisposable = atom.commands.add(
      'atom-workspace',
      {
        'pulsar-ide-typescript-alpha:toggle-project-symbols': () => {
          // This command doesn't do anything on its own. Its purpose is to
          // start the language server manually when the user wants to use it
          // for non-TypeScript files.
          //
          // It'd be rude to start the language server 100% of the time, and
          // there's no way to programmatically add to the list of
          // `activationHooks` present in `package.json`, so the compromise
          // option is to provide automatic startup for TypeScript files and
          // ask the user to invoke startup for everything else.
          console.debug(`Starting language server...`);
        },
        'pulsar-ide-typescript-alpha:organize-imports': async (event) => {
          let editor = atom.workspace.getActiveTextEditor();
          let connection = await this.getConnectionForEditor(editor);
          if (!connection) {
            event.abortKeyBinding();
            return;
          }

          let path = editor.getPath();
          return await CommandExecutionAdapter.executeCommand(
            connection,
            '_typescript.organizeImports',
            [path]
          );
        }
      }
    );
  }

  destroy (...args) {
    super.destroy(...args);
    this.commandDisposable.dispose();
  }

  getGrammarScopes () {
    let includeJs = atom.config.get(
      'pulsar-ide-typescript-alpha.includeJavaScript'
    );
    let additionalScopes = atom.config.get(
      'pulsar-ide-typescript-alpha.advanced.additionalScopes'
    );
    let scopes = ['source.ts', 'source.tsx'];
    if (includeJs) scopes.push('source.js');
    if (additionalScopes) scopes.push(...additionalScopes);
    return scopes;
  }

  getLanguageName () { return 'TypeScript/JavaScript'; }
  getServerName () { return 'TypeScript Language Server'; }

  getPackageName () {
    return Path.basename(ROOT) ?? 'pulsar-ide-typescript-alpha';
  }

  getKindsForCodeActionRequest (_editor, _range, diagnostics) {
    // If there are any diagnostic messages associated with this position in
    // the editor, don't add any kinds. The only things that should appear in
    // the menu are actions associated with fixing that diagnostic.
    if (diagnostics.length > 0) return [];

    // Otherwise the user has asked for code actions in some other section of
    // the editor that has no diagnostic message. We should present them with
    // all the possible actions they can do on this file.
    return CODE_ACTION_KINDS;
  }

  constructor () {
    super();
  }

  startServerProcess () {
    let bin = Path.join(ROOT, 'node_modules', '.bin', 'typescript-language-server');
    return super.spawnChildNode([bin, '--stdio']);
  }

  _constructSettingsForScope (scope) {
    let editor = atom.config.get('editor', { scopes: [scope] });
    return {
      // Let's default to `false` on checking JavaScript files. A user can
      // override this with a `jsconfig.json` file, or we could decide to make
      // this a setting.
      implicitProjectConfiguration: {
        checkJs: false
      },
      format: {
        indentSize: editor.tabLength,
        tabSize: editor.tabLength,
        convertTabsToSpaces: editor.softTabs,
        completions: {
          completeFunctionCalls: true // TEMP
        }
      }
    };
  }

  postInitialization (server) {
    this._server = server;

    // Send some base config settings. We do our best to get the user's config
    // for TypeScript files and JavaScript files; if settings vary between
    // (say) `source.ts` and `source.tsx`, then the user is a monster.
    server.connection.didChangeConfiguration({
      settings: {
        typescript: this._constructSettingsForScope('source.ts'),
        javascript: this._constructSettingsForScope('source.js')
      }
    });
  }

  // AUTOCOMPLETE
  // ============

  provideAutocomplete (...args) {
    let enabled = atom.config.get('pulsar-ide-typescript-alpha.autocomplete.enable');
    if (!enabled) return;

    return super.provideAutocomplete(...args);
  }

  // LINTER
  // ======

  shouldIgnoreMessage (_diagnostic, editor, _range) {
    let grammar = editor.getGrammar();

    // This lets us set a scope-specific override to the `enable` setting. It
    // also saves the user from having to restart before changing this setting
    // takes effect.
    let enabled = atom.config.get(
      'pulsar-ide-typescript-alpha.linter.enable',
      { scope: [grammar.scopeName] }
    );
    return !enabled;
  }

  getScopedSettingsForKey (key, editor) {
    let grammar = editor.getGrammar();
    let base = atom.config.get(key);
    let scoped = atom.config.get(key, { scope: [grammar.scopeName] });
    return { ...base, ...scoped };
  }

  getLinterSettings (editor) {
    let settings = this.getScopedSettingsForKey('pulsar-ide-typescript-alpha.linter', editor);
    let grammar = editor.getGrammar();

    // Tweak the settings if we're in a JavaScript file.
    if ((/\.jsx?/).test(grammar.scopeName)) {
      let ignoredCodes = [...settings.ignoredCodes];

      // 80001 warns about usage of `require`. This is silly.
      // TODO: I'm sure there are other codes that are not applicable to JS;
      // add them as we discover them.
      ignoredCodes.push("80001");

      // Warns about lack of type files in imports.
      ignoredCodes.push("7016");

      // Warns about "any" type.
      ignoredCodes.push("7006");

      ignoredCodes = Array.from(new Set(ignoredCodes));
      let result = {
        ...settings,
        ignoredCodes
      };
      return result;
    } else {
      return settings;
    }
  }

  // SYMBOLS
  // =======

  getSymbolSettings (editor) {
    return this.getScopedSettingsForKey('pulsar-ide-typescript-alpha.symbols', editor);
  }

  // INTENTIONS
  // ==========

  // TODO: Refactor. More of this can live in the language client.
  //
  // This is annoying because it should be almost entirely a package-specific
  // concern. But `atom-languageclient` must be aware of this because there's
  // no concept of a “code” or “message type” in the `linter` service contract.
  // So we can't pull this off just by inspecting the linter messages; we have
  // to look at the original `Diagnostic` objects from the language server.
  getIgnoreIntentionsForLinterMessage ({ code, callback }, editor) {
    const IGNORED_CODES_NAME = 'pulsar-ide-typescript-alpha.linter.ignoredCodes';
    const IGNORED_UNTIL_SAVE_NAME = 'pulsar-ide-typescript-alpha.linter.ignoredCodesWhenBufferIsModified';
    let intentions = [];
    let settings = this.getLinterSettings(editor);
    let {
      ignoredCodes = [],
      ignoredCodesWhenBufferIsModified = []
    } = settings(editor);

    // What are the existing ignore settings for this kind of message?
    let isAlwaysIgnored = ignoredCodes.includes(code);
    let isIgnoredUntilSave = ignoredCodesWhenBufferIsModified.includes(code);

    if (!isAlwaysIgnored) {
      intentions.push({
        priority: 1,
        icon: 'mute',
        title: `Always ignore this type of message (${code})`,
        selected: () => {
          let ignoredCodes = atom.config.get(IGNORED_CODES_NAME);
          let ignoredUntilSave = atom.config.get(IGNORED_UNTIL_SAVE_NAME);
          if (ignoredUntilSave.includes(code)) {
            let index = ignoredUntilSave.indexOf(code);
            ignoredUntilSave.splice(index, 1);
          }
          atom.config.set(IGNORED_CODES_NAME, [...ignoredCodes, code]);
          callback();
        }
      });
    }

    if (!isIgnoredUntilSave) {
      intentions.push({
        priority: 1,
        icon: 'mute',
        title: `Always ignore this type of message until save (${code})`,
        selected: () => {
          let ignoredUntilSave = atom.config.get(IGNORED_UNTIL_SAVE_NAME);
          let ignoredCodes = atom.config.get(IGNORED_CODES_NAME);
          if (ignoredCodes.includes(code)) {
            let index = ignoredCodes.indexOf(code);
            ignoredCodes.splice(index, 1);
          }
          atom.config.set(IGNORED_UNTIL_SAVE_NAME, [...ignoredUntilSave, code]);
          callback();
        }
      });
    }

    return intentions;
  }
}

module.exports = new TypeScriptLanguageClient();
