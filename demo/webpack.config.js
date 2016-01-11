'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve('browser.js'),

  output: {
    filename: 'browser.js',
    path: path.resolve('static'),
  },

  module: {
    loaders: [
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract('style', 'css?modules'),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('result.css', {
      allChunks: true
    }),
  ],
};
