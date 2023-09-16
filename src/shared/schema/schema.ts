
export const SchemaGraphQL = `#graphql
  type User {
    id: String,
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
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
  }

  type Mutation {
    initialiseDatabase: SuccessfulHTTPResponse
  }

`;