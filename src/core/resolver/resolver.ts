import { ApolloMutations } from './mutation/mutation.js';
import { ApolloQueries } from './query/query.js';
import type { IExecutableSchemaDefinition } from '@graphql-tools/schema';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers: IExecutableSchemaDefinition<any>['resolvers'] = {
  Query: ApolloQueries(),
  Mutation: ApolloMutations(),
};