css-modules-require-hook
========================

Automatically compiles a CSS Module to a low-level interchange format called ICSS or [Interoperable&nbsp;CSS](https://github.com/css-modules/icss).

One of the ways you can compile [CSS Modules](https://github.com/css-modules/css-modules) to the ICSS format is through the require hook. The require hook will bind itself to node's require and automatically compile files on the fly. This is similar to Babel's [babel/register](https://babeljs.io/docs/usage/require/).

## Requirements

To use this tool we require postcss and few plugins to be installed on your project. See the list below:

- `"postcss": "4.x"`
- `"postcss-modules-extract-imports": "0.x"`
- `"postcss-modules-local-by-default": "0.x"`
- `"postcss-modules-scope": "0.x"`

## Install

```bash
$ npm i css-modules-require-hook
```

## Usage

```javascript
require('css-modules-require-hook');
```

## Available options

Providing additional options allows you to get advanced experience. See the variants below.

```javascript
var hook = require('css-modules-require-hook');
hook({ /* options */ });
```

### `rootDir` option

Aliases are `root`, `d`.

Absolute path to your project's root directory. This is optional but providing it will result in better generated classnames. It can be obligatory, if you run require hook and build tools, like [css-modulesify](https://github.com/css-modules/css-modulesify) from different working directories.

### `use` option

Alias is `u`.

Custom list of plugins. This is optional but helps you to extend list of basic [postcss](https://github.com/postcss/postcss) plugins. Also helps to specify options for particular plugins.

### `createImportedName` option

Alias for the `createImportedName` option from the [postcss-modules-extract-imports](https://github.com/css-modules/postcss-modules-extract-imports) plugin. This is optional. Won't work if you `use` option.

### `generateScopedName` option

Custom function to generate class names. This is optional. Alias for the `generateScopedName` option from the [postcss-modules-scope](https://github.com/css-modules/postcss-modules-scope) plugin. Won't work if you `use` option.

### `mode` option

Alias for the `mode` option from the [postcss-modules-local-by-default](https://github.com/css-modules/postcss-modules-local-by-default) plugin. This is optional. Won't work if you `use` option.

## Examples

If you want to add custom functionality, for example [CSS Next](http://cssnext.io/setup/#as-a-postcss-plugin) plugin, you should provide the `use` option.

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
