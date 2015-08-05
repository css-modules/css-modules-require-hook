css-modules-require-hook
========================

Automatically compiles a CSS Module to a low-level interchange format called ICSS or [Interoperable&nbsp;CSS](https://github.com/css-modules/icss).

One of the ways you can compile [CSS Modules](https://github.com/css-modules/css-modules) to the ICSS format is through the require hook. The require hook will bind itself to node's require and automatically compile files on the fly. This is similar to Babel's [babel/register](https://babeljs.io/docs/usage/require/).

## Install

```bash
$ npm i css-modules-require-hook
```

## Usage

```javascript
require('css-modules-require-hook');
```

## Specifying options

```javascript
require('css-modules-require-hook')({
  // Setting this allows you to specify custom PostCSS plugins
  // You may use functions or strings, which match to the modules with the same name
  use: [] // may use `u` for short
});
```
