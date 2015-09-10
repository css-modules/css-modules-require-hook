css-modules-require-hook
========================

The require hook compiles [CSS Modules](https://github.com/css-modules/css-modules) in runtime. This is similar to Babel's [babel/register](https://babeljs.io/docs/usage/require/).

## What is CSS Modules

A **CSS Module** is a CSS file in which all class names and animation names are scoped locally by default. Learn more in the article [CSS Modules - Welcome to the Future](http://glenmaddern.com/articles/css-modules) by Glen&nbsp;Maddern.

## Features

Compiling in runtime, [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) usage.

## Usage

### Requirements

To use this tool we require [Node.js v0.12.x](https://github.com/nodejs/node) (or higher) and several modules to be installed.

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
 * `function` **preprocessCss** &mdash; in rare cases you may want to precompile styles, before they will be passed to the postcss pipeline. You should use **synchronous** transformations, since `require` function is synchronous.
 * `function` **processCss** &mdash; in rare cases you may want to get compiled styles in runtime, so providing this option helps.
 * `string`   **rootDir** &mdash; absolute path to the project directory. Providing this will result in better generated class names. It can be obligatory, if you run require hook and build tools (like [css-modulesify](https://github.com/css-modules/css-modulesify)) from different working directories.
 * `string`   **to** &mdash; provides `to` option to the [LazyResult instance](https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts).
 * `array`    **use** &mdash; custom subset of postcss plugins.
 * `array`    **extensions** &mdash; attach the hook to additional file extensions (for example `['.scss']`).

### Examples

Basically you need to load this module before you start loading css-modules. Otherwise you'll get an exception. For&nbsp;example:

*icon.css*
```css
.icon
{
  composes: fa fa-hand-peace-o from 'font-awesome/css/font-awesome.css';
}
```

*server.js*
```javascript
require('css-modules-require-hook');

var styles = require('./icon.css');
var html = '<i class="' + styles.icon + '"></i>';
// send it somehow :)
```

You'll get:

```html
<i class="_icon_font-awesome-css-font-awesome__fa _icon_font-awesome-css-font-awesome__fa-hand-peace-o"></i>'
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

If you want to add any postcss plugins to the pipeline - you should use the `use` option.

```javascript
var hook = require('css-modules-require-hook');

hook({
  use: [
    // adding CSS Next plugin
    require('cssnext')(),

    // adding basic css-modules plugins
    require('postcss-modules-extract-imports'),
    require('postcss-modules-local-by-default'),
    require('postcss-modules-scope')
  ]
});
```
