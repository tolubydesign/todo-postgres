// import "reflect-metadata"
import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./core/resolver/resolver";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
// import * as express from 'express';
import { LambdaSchemaGraphQL } from './shared/schema/schema';
import * as dotenv from 'dotenv'
import { ApolloQueries } from "./core/resolver/query/query";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// require("reflect-metadata");
// const { ApolloServer } = require("apollo-server-lambda");
// const { ApolloServerPluginLandingPageLocalDefault } = require("apollo-server-core");
// const { expressMiddleware } = require('@apollo/server/express4');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { resolvers } = require("./core/resolver/resolver.js");
// const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
// const express = require('express');
// const http = require('http');
// const { ApolloQueries } = require("./core/resolver/query/query.js");
// const bodyParser = require("body-parser");
// const { LambdaSchemaGraphQL } = require("./shared/schema/schema.js");
// const { startServerAndCreateLambdaHandler, handlers } = require("@as-integrations/aws-lambda");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const serverPath = "/api";
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

type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: Record<string, string>
}

// const handler = server.createHandler({
//   expressAppFromMiddleware(middleware) {
//     const app = express();
//     app.use(
//       serverPath,
//       middleware
//     );
//     return app;
//   }
// })

// Default
exports.handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, world!`,
  };
};

// exports.handler = server.createHandler({
//   expressAppFromMiddleware(middleware) {
//     const app = express();
//     app.use(
//       serverPath,
//       middleware
//     );
//     return app;
//   }
// });


// exports.handler = async (event: AppSyncEvent) => {
//   switch (event.info.fieldName) {
//     case "getAllUsers":
//       return await ApolloQueries().getAllUsers(undefined, {}, {}, undefined);
//     case "getAllTasks":
//       return await ApolloQueries().getAllTasks(undefined, {}, {}, undefined);
//     // case "listNotes":
//     //   return await listNotes();
//     // case "deleteNote":
//     //   return await deleteNote(event.arguments.noteId);
//     // case "updateNote":
//     //   return await updateNote(event.arguments.note);
//     default:
//       return null;
//   }
// }

// export async function handler(event: any, context: any, callback: any) {
//   switch (event.info.fieldName) {
//     case "getAllUsers":
//       return await ApolloQueries().getAllUsers(undefined, {}, {}, undefined);
//     case "getAllTasks":
//       return await ApolloQueries().getAllTasks(undefined, {}, {}, undefined);
//     // case "listNotes":
//     //   return await listNotes();
//     // case "deleteNote":
//     //   return await deleteNote(event.arguments.noteId);
//     // case "updateNote":
//     //   return await updateNote(event.arguments.note);
//     default:
//       return null;
//   }
// };