import { DataSource } from "typeorm";
import { ApolloInternalServerError } from "../../error/error-handler.js";
import { PoolClient } from "pg";

/**
 * Create a connection to the postgresql database.
 * This reusable function will throw an error if a connection cant be established.
 * @param pg postgresql connection as promise.
 * @returns 
 */
export async function createPostgreSQLConnection(pg: Promise<PoolClient | undefined>): Promise<PoolClient> {
  const connection = await pg;
  if (!connection) throw new ApolloInternalServerError("Can't connect to database.");
  return connection;
}
