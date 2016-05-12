#!/bin/bash
set -e
set -u

npm install
grunt test
istanbul cover --report cobertura --dir build/reports/ -- ./node_modules/.bin/_mocha --ui tdd src/test*
