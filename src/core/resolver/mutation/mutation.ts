import { GraphQLResolveInfo } from "graphql";
import { HTTPResponse, MutationGraphQLFieldResolverParams } from "../model";
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
    initialiseDatabase: async (): Promise<HTTPResponse> => {
      return {
        status: "OK",
        message: "Database was successfully populated.",
      };
    },
    // Create user request
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

    // create task
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

    // update task information
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

    // delete task
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

    // mark task as complete
    markTaskAsComplete: async (_, { taskId }, ): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      const taskRepository = postgresqlConnection.getTaskDataSource();
      // delete task details
      await taskRepository.update({ id: taskId }, { complete: true});

      // TODO: return tasks or task.
      return {
        status: "OK",
        message: "Task was updated successfully.",
      };
    },

    // mark task as incomplete
    markTaskAsIncomplete: async (_, { taskId }, ): Promise<HTTPResponse> => {
      // make sure database is accessible.
      const source = postgresqlConnection.dataSource();
      if (source instanceof Error) throw new ApolloInternalServerError(source.message);

      const taskRepository = postgresqlConnection.getTaskDataSource();
      // delete task details
      await taskRepository.update({ id: taskId }, { complete: false});

      // TODO: return tasks or task.
      return {
        status: "OK",
        message: "Task was updated successfully.",
      };
    },
  }
}