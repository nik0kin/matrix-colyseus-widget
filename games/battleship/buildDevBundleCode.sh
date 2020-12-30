#!/bin/bash

rm -rf ./dist/bundleCode

# run webpack
./node_modules/.bin/webpack --config bundleCode.webpack.js

# copy general.json
cp src/backend/general.json ./dist/bundleCode
