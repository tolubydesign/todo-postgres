import { GraphQLError, GraphQLErrorOptions } from 'graphql';

/**
 * Internal Server Error Handler that extends the graphql GraphQL Error class.
 * 
 * Used to return and error if issues occurred when request is made.
 * @constructor Requires message, to return back to user.
 */
export class ApolloInternalServerError extends GraphQLError {
  constructor(
    message: string = 'The server has encountered a situation it does not know how to handle.',
  ) {
    const options: GraphQLErrorOptions = {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      }
    };

    super(message, options)
  }
}
