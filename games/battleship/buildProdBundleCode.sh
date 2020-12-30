#!/bin/bash

rm -rf ./dist/bundleCode

# run webpack
./node_modules/.bin/webpack --env.prod --config bundleCode.webpack.js

# copy general.json
cp src/backend/general.json ./dist/bundleCode
