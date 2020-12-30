/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');


var babelOptions = {
  /*"presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "es2016"
  ]*/
};

module.exports = {
  cache: true,
  entry: './src/mock-sdk/index.ts',
  output: {
    path: path.resolve(__dirname, './dist/mock-sdk/mule-sdk-js'),
    filename: 'index.js',
    library: 'mule-sdk-js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: [/node_modules/, /src\/(frontend|backend)/],
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        },
        {
          loader: 'ts-loader'
        }
      ]
    }]
  },
  plugins: [],
  resolve: {
    extensions: ['.ts']
  },
};
