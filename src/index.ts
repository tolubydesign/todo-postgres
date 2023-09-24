import { ApolloServer } from "@apollo/server";
import { resolvers } from "./core/resolver/resolver";
import { LambdaSchemaGraphQL } from './shared/schema/schema';
import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';

const server = new ApolloServer({
  typeDefs: LambdaSchemaGraphQL,
  resolvers,
  introspection: true,
});

// This final export is important!
exports.handler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventRequestHandler(),
);
