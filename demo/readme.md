Universal Usage demo
====================

It's a small demo to show how to set up [css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook/) with [webpack](https://webpack.github.io/) and [react](https://facebook.github.io/react/). If you are familiar with the technologies you can jump to the quick start. Otherwise, you can find detailed description below.


## Quick start

Make sure that you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) and run these commands:

```bash
$ npm install
$ npm run compile
$ npm run start
```

Open <a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a>.


## Detailed description

In short [CSS&nbsp;Modules](https://github.com/css-modules/css-modules) provide modularity with generated class names. Therefore, generated names should be present in CSS styles and in templates which form resulting html. Since, we talk about server rendering in the current example I'll show you how to set require hook to generate the same names in runtime as the CSS styles.


### Frontend

The modern frontend is so tough that you have to use particular bundler systems in order to generate a simple CSS file. My favourite one is [webpack](https://webpack.github.io/), so I'll show you how to set it with the require hook.

To understand [webpack](https://webpack.github.io/) configs you should be familiar with [loaders](https://webpack.github.io/docs/using-loaders.html). In order to use [CSS&nbsp;Modules](https://github.com/css-modules/css-modules) with [webpack](https://webpack.github.io/) you should set [css-loader](https://github.com/webpack/css-loader#css-modules). Also [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) provides you possibility to create pure CSS file. So eventually, your configuration should look similar to this:

```javascript
module: {
  loaders: [
    {
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract('style',
        'css?modules&localIdentName=[name]_[local]__[hash:base64:5]'),
    },
  ],
},

plugins: [
  new ExtractTextPlugin('styles.css', {
    allChunks: true
  }),
],
```

### Backend

I use [express](http://expressjs.com/) to handle user requests and [react](https://facebook.github.io/react/) components to serve html for them. In order to make it independent and good looking I decided to use a custom [template engine](http://expressjs.com/en/advanced/developing-template-engines.html) to isolate all the rendering stuff and to have neat calls in the middlewares. So, here is my structure:

- *app/*
  - `view-engine.js`
  - `worker.js`

#### `worker.js`

Is an entry point for the app. It sets react [template engine](http://expressjs.com/en/advanced/developing-template-engines.html):

```javascript
// sets react rendering engine
app.engine('js', viewEngine);
app.set('views', path.join(__dirname, '../components'));
app.set('view engine', 'js');
```

and declares basic middlewares:

```javascript
app.get('/', (req, res) => res.render('Page'));
```

#### `view-engine.js`

Describes the simple [template engine](http://expressjs.com/en/advanced/developing-template-engines.html) and attaches require hook:

```javascript
// teaches node.js to load css files
// uses external config cmrh.conf.js
require('css-modules-require-hook/preset');
```

**Note** that to generate the same names in runtime as the CSS styles you should provide the same pattern to [webpack](https://webpack.github.io/) and to the require hook.

Use `localIdentName` for [webpack](https://webpack.github.io/):

```javascript
loader: ExtractTextPlugin.extract('style',
  'css?modules&localIdentName=[name]_[local]__[hash:base64:5]'),
```

and `generateScopedName` for the require hook. For example, if you use presets then you can put it to the `cmrh.conf.js` file:

```javascript
module.exports = {
  // the custom template for the generic classes
  generateScopedName: '[name]_[local]__[hash:base64:5]',
};

```
