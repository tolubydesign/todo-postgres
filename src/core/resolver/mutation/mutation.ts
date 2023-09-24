import { GraphQLResolveInfo } from "graphql";
import { GetByUserIdArgs, HTTPResponse, MutationGraphQLFieldResolverParams } from "../model";
import { RegisterUserArgs, CreateTaskArgs, UpdateTaskArgs, DeleteTaskArgs } from "./model.mutation"
import { ApolloInternalServerError } from "../../../shared/error/error-handler";
import postgresqlConnection from '../../connection/postgresql.connection';
import { Task } from "../../../core/connection/entity/task";

/**
 * Full collection of Apollo mutations.
 * @returns dictionary of mutations.
 */
export function ApolloMutations(): Record<string, (
  _: MutationGraphQLFieldResolverParams['source'],
  args: MutationGraphQLFieldResolverParams['args'],
  context: MutationGraphQLFieldResolverParams['contextValue'],
  info: GraphQLResolveInfo
) => any> {
  return {
    registerUser: async (_, { username, email, firstName, lastName, password }: RegisterUserArgs, context: any, info: any): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      // create new user 
      const user = postgresqlConnection.createNewUser({
        username,
        email,
        firstName,
        lastName,
        password,
      });

      const userRepository = postgresqlConnection.getUserDataSource();
      await userRepository.save(user);

      return {
        status: "OK",
        message: "Request was successful.",
      };
    },

    createTask: async (_, { user, title, description }: CreateTaskArgs, context, info): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      // TODO: check that user exists

      // Create new task.
      const task = postgresqlConnection.createTask({
        owner: user,
        title,
        description,
      });

      const taskRepository = postgresqlConnection.getTaskDataSource();
      await taskRepository.save(task);

      return {
        status: "OK",
        message: "Task was created successfully.",
      };
    },

    updateTask: async (_, { taskId, complete, description, title }: UpdateTaskArgs): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      const updates = {
        complete,
        description,
        title,
      };

      // update task details
      await source.createQueryBuilder()
        .update(Task)
        .set({ ...updates })
        .where("id = :id", { id: taskId })
        .execute()

      return {
        status: "OK",
        message: "Task was updated successfully.",
      };
    },

    deleteTask: async (_, { taskId }: DeleteTaskArgs): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      const taskRepository = postgresqlConnection.getTaskDataSource();
      // delete task details
      await taskRepository.delete({
        id: taskId
      });

      return {
        status: "OK",
        message: "Task was deleted successfully.",
      };
    },

    markTaskAsComplete: async (_, { taskId },): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      const taskRepository = postgresqlConnection.getTaskDataSource();
      // delete task details
      await taskRepository.update({ id: taskId }, { complete: true });

      // TODO: return tasks or task.
      return {
        status: "OK",
        message: "Task was updated successfully.",
      };
    },

    markTaskAsIncomplete: async (_, { taskId },): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      const taskRepository = postgresqlConnection.getTaskDataSource();
      // delete task details
      await taskRepository.update({ id: taskId }, { complete: false });

      // TODO: return tasks or task.
      return {
        status: "OK",
        message: "Task was updated successfully.",
      };
    },

    removeUser: async (_, { userId }: GetByUserIdArgs, context: any, info: any): Promise<HTTPResponse> => {
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError("Cannot connect to database.");

      const userRepository = postgresqlConnection.getUserDataSource();
      await userRepository.delete({
        id: userId
      })
      return {
        status: "OK",
        message: "User was deleted successfully.",
      };
    },
  }
}