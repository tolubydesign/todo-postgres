"use strict";
// import "reflect-metadata";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from "./core/resolver/resolver";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { SchemaGraphQL } from './shared/schema/schema';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
// import * as cors from "cors";
import * as dotenv from 'dotenv';

// require("reflect-metadata");
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { resolvers } = require("./core/resolver/resolver.js")
// const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
// const express = require('express');
// const http = require('http');
// const bodyParser = require("body-parser");
// const { SchemaGraphQL } = require("./shared/schema/schema.js");
// const { startServerAndCreateLambdaHandler, handlers } = require("@as-integrations/aws-lambda");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();
const serverPath = "/graphql";
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs: SchemaGraphQL,
  resolvers,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
  formatError: (error: any) => {
    return error
  },
});

async function ServerGraphql() {
  // Ensure we wait for our server to start
  await server.start();

  // Specify the path where we'd like to mount our server

  app.use(
    serverPath,
    bodyParser.json(),
    expressMiddleware(server)
  );

  // Modified server startup
  await new Promise<void>((resolve) => {
    console.log(`Sever up. On port: http://localhost:4000${serverPath}`)
    return httpServer.listen({ port: 4000 }, resolve)
  });
}

ServerGraphql();

// This final export is important!
// export const graphqlHandler = startServerAndCreateLambdaHandler(
//   server,
//   // We will be using the Proxy V2 handler
//   handlers.createAPIGatewayProxyEventV2RequestHandler(),
// );