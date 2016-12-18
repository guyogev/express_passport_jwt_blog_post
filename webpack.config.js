/*
* This webpack config will generate 2 files:
*  - client/application.js - all js files under client appliaction
*  - client/application.css - all js files under client appliaction
*/
'use strict';
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

var PATHS = {
  app: __dirname + '/client',
};

module.exports = {
  context: PATHS.app,
  entry: [
     'babel-polyfill',
     './js/bootstrap.js',
  ],
  debug: true,
  devtool: "#eval-source-map",
  output: {
    path: PATHS.app,
    filename: 'application.js'
  },
  plugins: [
    new ExtractTextPlugin('application.css')
  ],
  module: {
    loaders: [
      // pipe all .scss files trough scss-loader, css-loader, and bundle all generated css files into application.css
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass'),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  }
};
