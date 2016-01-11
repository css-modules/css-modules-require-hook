'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const config = require('./package').config;

module.exports = {
  entry: path.resolve('app/browser.js'),

  output: {
    filename: 'browser.js',
    path: path.resolve('static'),
  },

  module: {
    loaders: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015,presets[]=react,presets[]=stage-0',
      },
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract('style',
          `css?modules&localIdentName=${config.css}`),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('common.css', {
      allChunks: true
    }),
  ],
};
