#!/bin/bash

yarn unlink mule-sdk-js || echo "no link"
rm -rf node_modules/mule-sdk || echo "no install module"

cp -r ./dist/mock-sdk/mule-sdk-js ./node_modules/
