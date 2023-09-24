#!/bin/bash

echo 'Copying files to dist/src'

# "node_modules/@as-integrations/**/*",
# "node_modules/@apollo/server/**/*",
# "node_modules/apollo-server-core/**/*",
# "node_modules/apollo-server-lambda/**/*",
# "node_modules/@as-integrations/aws-lambda/**/*",
# "node_modules/typeorm/**/*",
# "node_modules/reflect-metadata/**/*",
# "node_modules/@types/node/http.d.ts",
# "node_modules/@types/body-parser/index.d.ts"

# mkdir -p /foo/bar && cp myfile "$_"

mkdir -p dist/src/node_modules/@as-integrations/ && cp -r node_modules/@as-integrations/ "$_"
mkdir -p dist/src/node_modules/@apollo/server/ && cp -r node_modules/@apollo/server/ "$_"
mkdir -p dist/src/node_modules/apollo-server-core/ && cp -r node_modules/apollo-server-core/ "$_"
mkdir -p dist/src/node_modules/apollo-server-lambda/ && cp -r node_modules/apollo-server-lambda/ "$_"
mkdir -p dist/src/node_modules/@as-integrations/aws-lambda/ && cp -r node_modules/@as-integrations/aws-lambda/ "$_"
mkdir -p dist/src/node_modules/typeorm/ && cp -r node_modules/typeorm/ "$_"
mkdir -p dist/src/node_modules/reflect-metadata/ && cp -r node_modules/reflect-metadata/ "$_"
mkdir -p dist/src/node_modules/@types/node/ && cp -r node_modules/@types/node/http.d.ts dist/src/node_modules/@types/node/http.d.ts
mkdir -p dist/src/node_modules/@types/body-parser/index.d.ts && cp -r node_modules/@types/body-parser/index.d.ts dist/src/node_modules/@types/body-parser/index.d.ts
