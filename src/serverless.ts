import "reflect-metadata"
import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./core/resolver/resolver.js";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import express from 'express';
import { LambdaSchemaGraphQL } from './shared/schema/schema.js';
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const serverPath = "/graphql";
const server: ApolloServer = new ApolloServer({
  typeDefs: LambdaSchemaGraphQL,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  context: ({ event, context, express }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    expressRequest: express.req,
  }),
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  formatError: (error) => {
    return error
  },
});

exports.handler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(
      serverPath,
      middleware
    );
    return app;
  }
});

// exports.graphqlHandler = server.createHandler();
