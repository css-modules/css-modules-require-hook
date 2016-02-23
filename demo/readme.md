Universal Usage demo
====================

Small demo of configuring [css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook/) with [webpack](https://webpack.github.io/) and [react](https://facebook.github.io/react/). See the detailed description below.

## Quick start

```bash
$ npm install
$ npm run compile
$ npm run start
```

## Description

Hi, I tried to make a simple demo. So if you are familiar with technologies [webpack](https://webpack.github.io/), [react](https://facebook.github.io/react/) and [express](http://expressjs.com/), then it will be easy for to understand that example. Anyways, I'll point on the main parts to save your time.

### Backend

In this demo I use [express](http://expressjs.com/) to handle user requests and [react](https://facebook.github.io/react/) components to serve html for them:

- **app/**
  - `view-engine.js`
  - `worker.js`
- **components/**
  - `Page.js`

#### `worker.js`

Is an entry point for the server application. It contains main middlewares and helpers for the server rendering. Here I attach require hook:

```javascript
require('css-modules-require-hook/preset');
```

It helps to process calls to the css files in runtime and build necessary class names:

```javascript
import styles from './Page.css'; // Page.js
```

Also, I made a small [template engine](http://expressjs.com/en/advanced/developing-template-engines.html) for express to make render step isolated from the main program. It's connected here:

```javascript
// setting rendering engine
app.engine('js', viewEngine);
app.set('views', path.join(__dirname, '../components'));
app.set('view engine', 'js');
```

and implemented in the `view-engine.js` file. So, I can use neat calls to build html:

```javascript
app.get('/', (req, res) => res.render('Page'));
```

#### `view-engine.js`

Is a [template engine](http://expressjs.com/en/advanced/developing-template-engines.html) implementation. Requires necessary react components and builds html.

#### `Page.js`

Main react component, which describes the page and contains all the necessary dependencies.

```javascript
// get the necessary class names
import styles from './Page.css';

// pass particular generated class name to the component
<section className={ styles.wrapper }>
  // ...
</section>
```

### Frontend

The modern frontend is so tough that you have to use particular bundler systems in order to build necessary styles and scripts. My favourite one is [webpack](https://webpack.github.io/), so I'll describe how to configure it. Usually to build necessary styles using [CSS&nbsp;Modules](https://github.com/css-modules/) you have to use a [css-loader](https://github.com/webpack/css-loader):

```javascript
module: {
  loaders: [
    {
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract('style',
        `css?modules&localIdentName=[name]_[local]__[hash:base64:5]`),
    },
  ],
},
```

In this example I provide a custom template for the generic class names `[name]_[local]__[hash:base64:5]` which is also used by require hook (see the `cmrh.conf.js` file).
