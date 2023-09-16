import "reflect-metadata"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from "./core/resolver/resolver.js";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { SchemaGraphQL } from './shared/schema/schema.js';
import cors from "cors";
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();
const serverPath = "/graphql";
const httpServer = http.createServer(app)

const server: ApolloServer<any> = new ApolloServer({
  typeDefs: SchemaGraphQL,
  resolvers,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
  formatError: (error) => {
    return error
  },
});

// Ensure we wait for our server to start
await server.start();

// Specify the path where we'd like to mount our server

app.use(
  serverPath,
  cors<cors.CorsRequest>({ origin: ['http://localhost:3000'] }),
  bodyParser.json(), 
  expressMiddleware(server)
);

// Modified server startup
await new Promise<void>((resolve) => {
  console.log(`Sever up. On port: http://localhost:4000${serverPath}`)

  return httpServer.listen({ port: 4000 }, resolve)
});