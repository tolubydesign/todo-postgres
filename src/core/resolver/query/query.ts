import postgresqlConnection from '../../connection/postgresql.connection.js';
import { MutationGraphQLFieldResolverParams, UserModel } from '../model.js';
import { ApolloInternalServerError } from '../../../shared/error/error-handler.js';
import { User } from '../../connection/entity/user.js';
import { Task } from '../../connection/entity/task.js';
import { GraphQLResolveInfo } from "graphql";
import { GetTaskResponse } from "./model.query.js";

/**
 * Full collection of Apollo queries.
 * @see {@link https://graphql.org/learn/schema/}
 * @returns 
 */
export function ApolloQueries(): Record<string, (
  _: MutationGraphQLFieldResolverParams['source'],
  args: MutationGraphQLFieldResolverParams['args'],
  context: MutationGraphQLFieldResolverParams['contextValue'],
  info: GraphQLResolveInfo
) => unknown> {
  return {
    // TODO: remove for production
    getAllUsers: async (): Promise<UserModel[]> => {
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError("Cannot connect to database.");
      const Users = source.getRepository(User);
      return await Users.find();
    },

    // TODO: remove for production
    // get all tasks
    getAllTasks: async (): Promise<GetTaskResponse[]> => {
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError("Cannot connect to database.");
      const Tasks = source.getRepository(Task);
      return await Tasks.find();
    },

    // get user tasks
    // --
    // remove user
    // --
  }
};
