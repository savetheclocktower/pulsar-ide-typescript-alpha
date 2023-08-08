# pulsar-ide-typescript-alpha

An attempt to write a non-invasive IDE provider for TypeScript and JavaScript.

_(The package name envisions that this could eventually be an official or semi-official Pulsar package, but it’s too early to presume that.)_

## What’s the philosophy?

Here’s how we think the IDE experience should work:

* IDE provider packages (like this one) provide services.
* Various packages consume those services and make them visible to the user. The user can pick and choose among those packages.
* Provider packages **should not care** whether a consumer package is installed for a given service, nor should it mandate that any package be installed at all.

This lets the user choose the exact features they want in an IDE experience.

## What can it do that similar packages can’t?

### Symbol navigation

This package integrates with `symbols-view-redux`, the successor to the builtin `symbols-view` package.

You can view a comprehensive list of file symbols with <kbd>Ctrl-R</kbd>/<kbd>Cmd-R</kbd>:

[screenshot]

Or search the entire package for symbols via <kbd>Ctrl-Shift-R</kbd>/<kbd>Cmd-Shift-R</kbd>:

[screenshot]

Or use <kbd>Ctrl-Alt-Down</kbd>/<kbd>Cmd-Opt-Down</kbd> to jump to the definition of the symbol under the cursor — even if it’s in another file — then use <kbd>Ctrl-Alt-Up</kbd>/<kbd>Cmd-Opt-Up</kbd> to return to your original cursor position.

### Ability to ignore certain diagnostic messages

This package allows you to ignore certain kinds of diagnostic messages. You can choose whether to ignore them altogether or just until the file is saved:

[screenshot]

The latter is useful for annoying messages that point out “problems” in your code that you simply haven’t had a chance to fix yet because you’re _literally still typing_.

### Optional JavaScript support

Like `ide-typescript`, this package can be configured to start a language server for JavaScript-only projects. Enable the **Include JavaScript** setting in this package’s settings menu. No separate package is required.

## What does it do?

Install this package, then install any of the following packages to get special features:

* `autocomplete-plus` (builtin)
  * See autocompletion options as you type
* [linter](https://web.pulsar-edit.dev/packages/linter) and [linter-ui-default](https://web.pulsar-edit.dev/packages/linter-ui-default)
  * View diagnostic messages as you type
* [intentions](https://web.pulsar-edit.dev/packages/intentions)
  * Open a menu to view possible code actions for a diagnostic message
  * Open a menu to view possible code actions for the file at large
* [symbols-view-redux](https://web.pulsar-edit.dev/packages/symbols-view-redux)
  * View and filter a list of symbols in the current file
  * View and filter a list of symbols across all files in the project
  * Jump to the definition of the symbol under the cursor
* [atom-ide-definitions](atom-ide-definitions)
  * Jump to the definition of the symbol under the cursor
* [pulsar-outline-view](https://web.pulsar-edit.dev/packages/pulsar-outline-view)
  * View a hierarchical list of the file’s symbols
* [atom-ide-outline](https://web.pulsar-edit.dev/packages/atom-ide-outline)
  * View a hierarchical list of the file’s symbols
  * View the call hierarchy for a given file
* [atom-ide-datatip](https://web.pulsar-edit.dev/packages/atom-ide-datatip)
  * Hover over a symbol to see any related documentation, including method signatures
* [atom-ide-signature-help](https://web.pulsar-edit.dev/packages/atom-ide-signature-help)
  * View a function’s parameter signature as you type its arguments
* [atom-ide-code-format](atom-ide-code-format)
  * Invoke on a buffer (or a subset of your buffer) to reformat your code according to the language server’s settings

### Expected features

Other features are implemented, but don’t yet have proper standalone packages:

* Code refactoring (e.g., renaming symbols on a project-wide basis)
* Finding references for a given symbol


## Service list

This package **provides** the following services. Click on each link to find packages that can consume each service:

* [intentions:list](https://web.pulsar-edit.dev/packages?service=intentions:list&serviceType=consumed)
* [symbol.provider](https://web.pulsar-edit.dev/packages?service=symbol.provider&serviceType=consumed)
* [autocomplete.provider](https://web.pulsar-edit.dev/packages?service=autocomplete.provider&serviceType=consumed)
* [code-actions](https://web.pulsar-edit.dev/packages?service=code-actions&serviceType=consumed)
* [code-format.range](https://web.pulsar-edit.dev/packages?service=code-format.range&serviceType=consumed)
* [call-hierarchy](https://web.pulsar-edit.dev/packages?service=call-hierarchy&serviceType=consumed)
* [code-highlight](https://web.pulsar-edit.dev/packages?service=code-highlight&serviceType=consumed)
* [definitions](https://web.pulsar-edit.dev/packages?service=definitions&serviceType=consumed)
* [find-references](https://web.pulsar-edit.dev/packages?service=find-references&serviceType=consumed)
* [outline-view](https://web.pulsar-edit.dev/packages?service=outline-view&serviceType=consumed)
* [refactor](https://web.pulsar-edit.dev/packages?service=refactor&serviceType=consumed)

This package **consumes** the following services. Click on each link to find packages that can provide each service:

* [linter-indie](https://web.pulsar-edit.dev/packages?service=linter-indie&serviceType=provided)
* [datatip](https://web.pulsar-edit.dev/packages?service=datatip&serviceType=provided)
* [signature-help](https://web.pulsar-edit.dev/packages?service=signature-help&serviceType=provided)
