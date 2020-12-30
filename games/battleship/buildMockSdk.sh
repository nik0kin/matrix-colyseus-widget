#!/bin/bash

rm -rf ./dist/mock-sdk

# run webpack
./node_modules/.bin/webpack --config mock-sdk.webpack.js

# copy types
cp -r ./node_modules/mule-sdk-js/dist/src/* ./dist/mock-sdk/mule-sdk-js/
