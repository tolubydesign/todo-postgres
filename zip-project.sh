#!/bin/bash

echo 'zipping folder for lambda deployment'
echo Requires zip package

zip -r lambdas.zip dist/src/* node_modules/* 
