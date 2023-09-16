import postgresqlConnection from '../connection/postgresql.connection.js';
import { UserModel } from './model.js';
import { ApolloInternalServerError } from '../../shared/error/error-handler.js';
import { User } from '../connection/entity/user.js';

/**
 * @description Create a query object to collect all back-end query functions.
 */
export const Query = {
  getAllUsers: async (): Promise<UserModel[]> => {
    const source = postgresqlConnection.dataSource();
    if (source instanceof Error) throw new ApolloInternalServerError("Can't connect to database.");
    const Users = source.getRepository(User);
    return await Users.find();
  }
};