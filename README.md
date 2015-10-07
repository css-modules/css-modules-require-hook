css-modules-require-hook
========================

The require hook compiles [CSS Modules](https://github.com/css-modules/css-modules) in runtime. This is similar to Babel's [babel/register](https://babeljs.io/docs/usage/require/).

## What is CSS Modules

A **CSS Module** is a CSS file in which all class names and animation names are scoped locally by default. Learn more in the article [CSS Modules - Welcome to the Future](http://glenmaddern.com/articles/css-modules) by Glen&nbsp;Maddern.

## Features

Compiling in runtime, [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) usage.


## Requirements

To use this tool we require [Node.js v0.12.x](https://github.com/nodejs/node) (or higher) and several modules to be installed.

- [postcss](https://github.com/postcss/postcss) version 4 or higher
- [postcss-modules-extract-imports](https://github.com/css-modules/postcss-modules-extract-imports)
- [postcss-modules-local-by-default](https://github.com/css-modules/postcss-modules-local-by-default)
- [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope)

## Installation

```bash
$ npm i css-modules-require-hook
```

## Usage

In this section I've tried to cover the common cases of usage.

### Basic example

Basically to attach the require hook you need to require this module. If you need to adjust it see the tuning section below.

```javascript
require('css-modules-require-hook');

// var styles = require('./icon.css');
```

### Adding custom PostCSS plugins

```javascript
var hook = require('css-modules-require-hook');
var cssnext = require('cssnext');

hook({
  prepend: [
    // adding CSS Next plugin
    cssnext(),
  ],
});
```

### Specify custom function to build generic names

```javascript
var hook = require('css-modules-require-hook');

// specify your custom function
function generateScopedName(exportedName, path) {/* your code here */}

hook({
  generateScopedName: generateScopedName,
});
```

### Using Stylus as a preprocessor

```javascript
var hook = require('css-modules-require-hook');
var stylus = require('stylus');

hook({
  extensions: ['.styl'],
  preprocessCss: function (css, filename) {
    return stylus(css)
      .set('filename', filename)
      .render();
  },
});

// var styles = require('./demo.styl');
```

## Tuning (options)

To adjust the require hook you need to provide params to the exported function.

```javascript
var hook = require('css-modules-require-hook');

hook({
  // append: [],
  // generateScopedName: function () {},
  // or any other options
  // see the list below
});
```

### `append` array

Appends custom plugins to the end of the PostCSS pipeline.

### `prepend` array

Prepends custom plugins to the beginning of the PostCSS pipeline.

### `use` array

Provides the full list of PostCSS plugins to the pipeline. Providing this cancels `append`, `prepend`, `createImportedName`, `generateScopedName` options.

### `preprocessCss` function

In rare cases you may want to precompile styles, before they will be passed to the PostCSS pipeline. You should use **synchronous** transformations, since `require` function is synchronous.

### `processCss` function

In rare cases you may want to get compiled styles in runtime, so providing this option helps.

### `extensions` array

Attach the require hook to additional file extensions (for example `['.scss']`).

### `rootDir` string

Provides absolute path to the project directory. Providing this will result in better generated class names. It can be obligatory, if you run require hook and build tools (like [css-modulesify](https://github.com/css-modules/css-modulesify)) from different working directories.

### `to` string

Provides `to` option to the [LazyResult instance](https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts).

### `createImportedName` function

Short alias for the [postcss-modules-extract-imports](https://github.com/css-modules/postcss-modules-extract-imports) plugin's `createImportedName` option.

### `generateScopedName` function

Short alias for the [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope) plugin's option. Helps you to specify the custom way to build generic names for the class selectors.

### `mode` string

Short alias for the [postcss-modules-local-by-default](https://github.com/css-modules/postcss-modules-local-by-default) plugin's option.

## Debugging

[debug](https://www.npmjs.com/package/debug) package is used for debugging. So to turn it on simply specify the **DEBUG** environment variable:
- `DEBUG=css-modules:fetch` &mdash; to see resolved paths to the files.
- `DEBUG=css-modules:setup` &mdash; to see the new options list.
- `DEBUG=css-modules:*` &mdash; to see everything.

## Links

- Electon support: [css-modules-electron](https://github.com/KenPowers/css-modules-electron)
