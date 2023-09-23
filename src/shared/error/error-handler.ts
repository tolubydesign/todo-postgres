import { GraphQLError, GraphQLErrorOptions } from 'graphql';
import { GraphQLResponseCode, KeyTypeApolloServerErrorCode, ReturnResponseCode, ReturnResponseMessage, ReturnResponseStatus, ServerResponseCode } from "../helpers/response-handling"



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
        code: ReturnResponseCode(500),
      }
    };

    super(message, options)
  }
}


/**
 * Unauthorised Error Handler that extends the graphql GraphQL Error class.
 * 
 * Used to return and error if issues occurred when request is made.
 * @constructor Requires message, to return back to user.
 */
export class ApolloUnauthorisedError extends GraphQLError {
  constructor(
    message: string = "FORBIDDEN",
    customCode: ServerResponseCode = null
  ) {
    const options: GraphQLErrorOptions = {
      extensions: {
        code: customCode ?? ReturnResponseCode(401),
      }
    };

    super(message, options)
  }
}

/**
 * Bad Gateway Error Handler that extends the graphql GraphQL Error class.
 * 
 * Used to return and error if issues occurred when request is made.
 * @constructor Requires message, to return back to user.
 */
export class ApolloBadGatewayError extends GraphQLError {
  constructor(
    message: string = ReturnResponseMessage(502),
    customCode: ServerResponseCode = null
  ) {
    const options: GraphQLErrorOptions = {
      extensions: {
        code: customCode ?? ReturnResponseCode(502),
      }
    };

    super(message, options)
  }
};

/**
 * Bad Gateway Error Handler that extends the graphql GraphQL Error class.
 * 
 * Used to return and error if issues occurred when request is made.
 * @constructor Requires message, to return back to user.
 */
export class ApolloNotFoundError extends GraphQLError {
  constructor(
    message: string = ReturnResponseMessage(404),
    customCode: ServerResponseCode = null
  ) {
    const options: GraphQLErrorOptions = {
      extensions: {
        code: customCode ?? ReturnResponseCode(404),
      }
    };

    super(message, options)
  }
};

/**
 * Bad Request (400) Error | Invalid inputs Handler that extends the graphql GraphQL Error class.
 * 
 * Used to return and error if issues occurred when request is made.
 * @constructor `{message}` Requires message, to return back to user.
 * 
 */
export class ApolloBadRequestError extends GraphQLError {
  constructor(
    message: string = ReturnResponseMessage(400),
    customCode: ServerResponseCode = null
  ) {
    const options: GraphQLErrorOptions = {
      extensions: {
        code: customCode ?? ReturnResponseCode(400),
      }
    };

    super(message, options)
  }
};
