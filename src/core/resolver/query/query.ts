import postgresqlConnection from '../../connection/postgresql.connection';
import { MutationGraphQLFieldResolverParams, UserModel } from '../model';
import { ApolloInternalServerError } from '../../../shared/error/error-handler';
import { User } from '../../connection/entity/user';
import { Task } from '../../connection/entity/task';
import { GraphQLResolveInfo } from "graphql";
import { GetTaskResponse, GetUserResponse } from "./model.query";
import { GetByUserIdArgs } from "../model";

/**
 * Full collection of Apollo queries.
 * @see {@link https://graphql.org/learn/schema/}
 * @returns 
 */
export function ApolloQueries(): Record<string, (
  _: MutationGraphQLFieldResolverParams['source'],
  args: MutationGraphQLFieldResolverParams['args'],
  context: MutationGraphQLFieldResolverParams['contextValue'],
  info: GraphQLResolveInfo | undefined
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
    getAllTasks: async (): Promise<GetTaskResponse[]> => {
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError("Cannot connect to database.");
      const Tasks = source.getRepository(Task);
      return await Tasks.find();
    },

    // get user by id
    getUserById: async (_, { userId }: GetByUserIdArgs, context: any, info: any): Promise<GetUserResponse> => {
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError("Cannot connect to database.");
      const Users = source.getRepository(User);
      const user = await Users.find({
        where: {
          id: userId,
        },
      })

      return user[0];
    },

    getUserTasks: async (_, { userId }: GetByUserIdArgs, context: any, info: any): Promise<GetTaskResponse[]> => {
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError("Cannot connect to database.");
      const Tasks = source.getRepository(Task);
      const task = await Tasks.find({
        where: {
          owner: userId
        }
      });

      return task;
    },
  }
};
