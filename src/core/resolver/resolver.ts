import { Mutation } from './mutation.js';
import { Query } from './query.js';
import type { IExecutableSchemaDefinition } from '@graphql-tools/schema';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: IExecutableSchemaDefinition<any>['resolvers'] = {
  Query,
  Mutation,
};