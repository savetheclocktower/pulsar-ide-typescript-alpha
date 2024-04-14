# pulsar-ide-typescript-alpha

An attempt to write a non-invasive IDE provider for TypeScript and JavaScript.

_(The package name envisions that this could eventually be an official or semi-official Pulsar package, but it’s too early to presume that.)_

## What’s the philosophy?

IDE features are great when they make you feel productive, but bad when they get in your way. Because the line between “useful” and “invasive” will vary per person, we want to provide an IDE experience that is, above all, customizable:

* IDE “provider” packages (like this one) act as the “brain” behind a bunch of UI features.
* Each individual UI feature can be implemented by a different Pulsar package. Some of these packages are built into the core Pulsar editor and some are community packages.
* The user can pick and choose among those packages. If you want a maximal experience, you can install a whole slate of packages. If you want only a few features, you can pick only the packages you want, and uninstall or disable the ones you don’t.
* Provider packages **should not care** whether a consumer package is installed for a given service, nor should it mandate that any package be installed at all.

## What can it do that similar packages can’t?

### Symbol navigation

This package integrates with recent versions of Pulsar’s built-in `symbols-view` package.

You can view a comprehensive list of file symbols with <kbd>Ctrl-R</kbd>/<kbd>Cmd-R</kbd>:

<p><img width="632" alt="file-symbols" src="https://github.com/savetheclocktower/pulsar-ide-typescript-alpha/assets/3450/6b07688b-b1f7-48bd-86ae-d3105eb213f9"></p>

Or search the entire package for symbols via <kbd>Ctrl-Shift-R</kbd>/<kbd>Cmd-Shift-R</kbd>:

<p><img width="660" alt="project-wide-symbols" src="https://github.com/savetheclocktower/pulsar-ide-typescript-alpha/assets/3450/90b76096-1562-4f78-8f1a-59b00b1375c2"></p>

Or use <kbd>Ctrl-Alt-Down</kbd>/<kbd>Cmd-Opt-Down</kbd> to jump to the definition of the symbol under the cursor — even if it’s in another file — then use <kbd>Ctrl-Alt-Up</kbd>/<kbd>Cmd-Opt-Up</kbd> to return to your original cursor position:

![jump-to-definition](https://github.com/savetheclocktower/pulsar-ide-typescript-alpha/assets/3450/c2158087-084a-4bda-999e-99b39fb403af)

### Ability to ignore certain diagnostic messages

This package allows you to ignore certain kinds of diagnostic messages. You can choose whether to ignore them altogether or just until the file is saved:

<p><img width="667" alt="intentions" src="https://github.com/savetheclocktower/pulsar-ide-typescript-alpha/assets/3450/a89ec391-dac7-463c-8036-9742f5a28c3c"></p>

The latter is useful for annoying messages that point out “problems” in your code that you simply haven’t had a chance to fix yet because you’re _literally still typing_.

Diagnostic messages require the community `linter` package. The menu shown in the screenshot above is implemented by the community `intentions` package.

### Support for refactoring

You can place the cursor inside of any token and invoke a command to rename it. This package will be able to tell Pulsar which other usages of that symbol need to be renamed as well.

This feature requires the community `pulsar-refactor` package.

### Optional JavaScript support

Like `ide-typescript`, this package can be configured to start a language server for JavaScript-only projects. Enable the **Include JavaScript** setting in this package’s settings menu. No separate package is required.

A smaller feature set is available inside of JavaScript projects; autocompletion and symbol providers are sparser with their suggestions, and features like refactoring may not be available at all. Still, you’ll probably be impressed with what it can do.

## What does it do?

Install this package, then install any of the following packages to get special features:

* [autocomplete-plus](https://web.pulsar-edit.dev/packages/autocomplete-plus) (builtin)
  * See autocompletion options as you type
* [symbols-view](https://web.pulsar-edit.dev/packages/symbols-view) (builtin)
  * View and filter a list of symbols in the current file
  * View and filter a list of symbols across all files in the project
  * Jump to the definition of the symbol under the cursor
* [linter](https://web.pulsar-edit.dev/packages/linter) and [linter-ui-default](https://web.pulsar-edit.dev/packages/linter-ui-default)
  * View diagnostic messages as you type
* [intentions](https://web.pulsar-edit.dev/packages/intentions)
  * Open a menu to view possible code actions for a diagnostic message
  * Open a menu to view possible code actions for the file at large
* [atom-ide-definitions](https://web.pulsar-edit.dev/packages/atom-ide-definitions)
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
* [atom-ide-code-format](https://web.pulsar-edit.dev/packages/atom-ide-code-format)
  * Invoke on a buffer (or a subset of your buffer) to reformat your code according to the language server’s settings
* [pulsar-refactor](https://web.pulsar-edit.dev/packages/pulsar-refactor)
  * Perform project-wide renaming of variables, methods, classes and types
* [pulsar-find-references](https://web.pulsar-edit.dev/packages/pulsar-find-references)
  * Place the cursor inside of a token to highlight other usages of that token
  * Place the cursor inside of a token, then view a `find-and-replace`-style “results” panel containing all usages of that token across your project


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
