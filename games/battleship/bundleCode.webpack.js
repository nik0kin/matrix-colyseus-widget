/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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

module.exports = (env) => {
  var isProd = env && env.prod;

  var plugins = [];

  if (isProd) {
    plugins.push(
      new UglifyJsPlugin()
    )
  }

  return {
    cache: true,
    entry: './src/backend/index.ts',
    output: {
      path: path.resolve(__dirname, './dist/bundleCode'),
      filename: 'index.js',
      library: 'mule-backgammon',
      libraryTarget: 'umd'
    },
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: [/node_modules/, /src\/(frontend|mock-sdk)/],
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
    plugins: plugins,
    resolve: {
      extensions: ['.ts']
    },
  };
};
