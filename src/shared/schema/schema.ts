import { gql } from "apollo-server-lambda";

export const SchemaGraphQL = `#graphql
  type User {
    id: String,
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
  }

  type Task {
    id: String,
    title: String,
    description: String,
    complete: Boolean,
    owner: String,
  }

  type SuccessfulHTTPResponse {
    status: String!,
    message: String!,
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllUsers: [User],
    getAllTasks: [Task],
  }

  type Mutation {
    initialiseDatabase: SuccessfulHTTPResponse,
    registerUser(username: String!, email: String!, firstName: String!, lastName: String!, password: String!): SuccessfulHTTPResponse,
    createTask(user: String!, title: String!, description: String!): SuccessfulHTTPResponse,
    updateTask(taskId: String!, complete: Boolean!, description: String!, title: String!): SuccessfulHTTPResponse,
    deleteTask(taskId: String!): SuccessfulHTTPResponse,
    markTaskAsComplete(taskId: String!): SuccessfulHTTPResponse,
    markTaskAsIncomplete(taskId: String!): SuccessfulHTTPResponse,
  }
`;

/**
 * Lambda implementation of graphql schema.
 * @see _link_ [Build a simple GraphQL server with Apollo Server and AWS CDK](https://cloudash.dev/blog/build-a-simple-graphql-server-with-apollo-and-cdk)
 */
export const LambdaSchemaGraphQL = gql`${SchemaGraphQL}`;