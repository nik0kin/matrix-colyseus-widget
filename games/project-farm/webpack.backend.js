/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = (env) => {
  var isProd = env && env.prod;

  var plugins = [];

  // if (isProd) {
  //   plugins.push(
  //     new UglifyJsPlugin()
  //   )
  // }

  return {
    mode: isProd ? 'production' : 'development',
    devtool: false,
    cache: true,
    entry: './src/backend/index.ts',
    output: {
      path: path.resolve(__dirname, './backend-dist'),
      filename: 'index.js',
      library: 'colyseus-project-farm',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: [/node_modules/, /src\/(frontend)/],
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.backend.json'
        }
      }]
    },
    externals: {
      colyseus: 'colyseus',
      '@colyseus/command': '@colyseus/command',
      '@colyseus/schema': '@colyseus/schema',
      'node-fetch': 'node-fetch'
    },
    plugins: plugins,
    resolve: {
      extensions: ['.ts', '.js']
    },
  };
};