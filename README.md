css-modules-require-hook
========================

Summary

## What is CSS Modules

Summary

## Features

Compiling in runtime, universal apps

## Usage

### Requirements

To use this tool we require [Node.js](https://github.com/nodejs/node) v0.12.x (or higher) and several modules to be installed.

- [postcss](https://github.com/postcss/postcss) version 4 or higher
- [postcss-modules-extract-imports](https://github.com/css-modules/postcss-modules-extract-imports)
- [postcss-modules-local-by-default](https://github.com/css-modules/postcss-modules-local-by-default)
- [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope)

### Installation

```bash
$ npm i css-modules-require-hook
```

### Tuning (options)

 * `function` **createImportedName** &mdash; short alias for the [postcss-modules-extract-imports](https://github.com/css-modules/postcss-modules-extract-imports) plugin's `createImportedName` option.
 * `function` **generateScopedName** &mdash; short alias for the [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope) plugin's option. Helps you to specify the custom way to build generic names for the class selectors.
 * `function` **processCss** &mdash; in rare cases you may want to get compiled styles in runtime, so providing this option helps.
 * `string`   **rootDir** &mdash; absolute path to the project directory. Providing this will result in better generated class names. It can be obligatory, if you run require hook and build tools (like [css-modulesify](https://github.com/css-modules/css-modulesify)) from different working directories.
 * `string`   **to** &mdash; provides `to` option to the [LazyResult instance](https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts).
 * `array`    **use** &mdash; custom subset of postcss plugins.

### Examples

Basically you need to require this plugin before other requires for your styles will occur.

```javascript
require('css-modules-require-hook');
// ...
```

In rare cases you may want to tune the require hook for better experience.

```javascript
var hook = require('css-modules-require-hook');
var path = require('path');

hook({
  // setting root to the parent directory
  rootDir: path.join(__dirname, '..')
});
```
