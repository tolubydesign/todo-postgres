"use strict";
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { resolvers } from "./core/resolver/resolver";
import { SchemaGraphQL } from './shared/schema/schema';
import * as dotenv from 'dotenv';
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
