import "reflect-metadata"
import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./core/resolver/resolver.js";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import express from 'express';
import { LambdaSchemaGraphQL } from './shared/schema/schema.js';
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// const serverPath = "/graphql";
const server = new ApolloServer({
  typeDefs: LambdaSchemaGraphQL,
  resolvers,
  introspection: true,
  // playground: {
  //   endpoint: "/dev/graphql"
  // },
  // context: ({ event, context }) => ({
  //   headers: event.headers,
  //   functionName: context.functionName,
  //   event,
  //   context,
  // }),
});

exports.handler = server.createHandler({
  
});

