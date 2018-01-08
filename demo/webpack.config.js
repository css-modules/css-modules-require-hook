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
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      {
        test: /\.css$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: config.css,
              },
            },
            'postcss-loader',
          ],
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('common.css', {
      allChunks: true,
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
  ],
};
