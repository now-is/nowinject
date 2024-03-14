NowInject
=========

`NowInject` is a feather-light CSS and JS injection kit for developers. It is similar to browser extensions for userscripts, but there are differences:

- You use your tools to develop your styles and scripts
- You build the extension and install it—it is easy
- You enjoy the fact that there is *nothing* in the extension beyond your scripts

It is hence a kit, not a browser extension. The "kit" code is minimal and implements a few conventions.

Userscripts
------------

A directory called `inject` in the base directory contains your user styles and scripts, organized in subdirectories. *This directory must exist for the subsequent steps to work.*

You could symlink the `inject` directory or maintain it as a submodule. See [NowInject Scripts][2] for an example.

Each subdirectory contains a single spec, consisting of three files:

- `matches.json`, a file containing patterns to match URLs
- optional `inject.css`, the styles to inject into pages matching the patterns
- optional `inject.js`, the code to inject into pages matching the patterns

The format of `matches.json` is described on [MDN][1].

Two files, `inject/base.css` and `inject/base.js`, serve as common code for all your styles and scripts. You might use them for e.g. a theme and a tiny DOM library, respectively.

It is helpful to give the subdirectories somewhat mnemonic names.

Usage
-----

*Note:* The instructions below are Chrome-specific for now.

- In the top directory, run `node build`. This will create a `manifest.json` file.
- Bring up Chrome's extension manager. Currently it is at `chrome://extensions/`.
- Switch on developer mode if it is not already.
- Choose `Load unpacked`, browse to the current repository's top directory, and load.
- Testing your scripts is up to you. In Chrome, devtools and extension manager are both helpful.
- Rerun `node build` and reload the extension when you make changes to `inject`.

Note
----

The build leaves files named `built-path.js` in your inject subdirectories, which is unfortunate but makes for a convenient way to load CSS. If you are maintaining `inject` as a submodule, you could add `built-path.js` to your `.gitignore`, or you could create the entire `inject` directory as a temporary build artifact, copied over from another repo. Naturally, you shouldn't have your own files named `built-path.js`.

TODO
----

- Fix FOUC

Icon
----

[Pottery][3] icon by [Icons8][4].

[1]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
[2]: https://github.com/now-is/nowinject-scripts
[3]: https://icons8.com/icon/25058/potter's-wheel
[4]: https://icons8.com
