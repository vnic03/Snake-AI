#!/bin/bash

tsc

find ./dist -name '*.js' -exec sed -i 's/\(import.*from.*\)\("\)/\1.js\2/' {} \;
