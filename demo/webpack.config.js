'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const resolve = require('path').resolve;

const config = require('./package').config;

module.exports = {
  entry: resolve('components/Page.js'),

  output: {
    filename: '_.js',
    path: resolve('static'),
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
          `css?modules&localIdentName=${config.css}!postcss`),
      },
    ],
  },

  postcss: [
    // small sugar for CSS
    require('postcss-font-magician'),
    require('autoprefixer'),
  ],

  plugins: [
    new ExtractTextPlugin('common.css', {
      allChunks: true
    }),
    new NpmInstallPlugin({
      cacheMin: 999999,
      saveDev: true,
      saveExact: true,
    }),
  ],

  externals: [
    {
      react: true,
    },
  ]
};
