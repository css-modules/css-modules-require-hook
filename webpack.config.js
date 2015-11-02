'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  entry: path.resolve('test/cases/webpack/source.js'),

  output: {
    filename: 'result.js',
    path: path.resolve('test/cases/webpack')
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('result.css', {
      allChunks: true
    })
  ]
};
