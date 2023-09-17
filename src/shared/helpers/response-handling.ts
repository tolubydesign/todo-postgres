import { ApolloServerErrorCode } from '@apollo/server/errors';
type RequestResponseCode = 200 | 201 | 202 | 400 | 401 | 403 | 404 | 500 | 501 | 502;

export type GraphQLResponseCode =
  "FORBIDDEN" |
  "CREATED" |
  "OK" |
  "ACCEPTED" | "NOT_FOUND" | "BAD_GATEWAY"
  ;

export type KeyTypeApolloServerErrorCode = keyof typeof ApolloServerErrorCode;

export type Response = {
  status: string,
  message: string,
  code: ServerResponseCode
};

type ResponseStatus = { [key in RequestResponseCode]: Response };

export type ServerResponseCode = KeyTypeApolloServerErrorCode | GraphQLResponseCode | null

const responses: ResponseStatus = {
  200: {
    status: "OK",
    code: "OK",
    message: "Request completed Successful."
  },
  201: {
    status: "Created",
    code: 'CREATED',
    message: "The created succeeded."
  },
  202: {
    status: "Accepted",
    code: "ACCEPTED",
    message: "The request has been received but not yet acted upon."
  },
  400: {
    status: "Bad Request",
    code: "BAD_REQUEST",
    message: "The server cannot or will not process the request due to something that is perceived to be a client error."
  },
  401: {
    status: "Unauthorized",
    code: "FORBIDDEN",
    message: "Unauthorised action requested. Please provide a valid authentication."
  },
  403: {
    status: "Forbidden",
    code: "FORBIDDEN",
    message: "The client does not have access rights to the content.",
  },
  404: {
    status: 'Not Found',
    code: "NOT_FOUND",
    message: "The server cannot find the requested resource.",
  },
  500: {
    status: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: "The server has encountered a situation it does not know how to handle.",
  },
  501: {
    status: "Not Implemented",
    code: "INTERNAL_SERVER_ERROR",
    message: "The request method is not supported by the server and cannot be handled."
  },
  502: {
    status: "Bad Gateway",
    code: "BAD_GATEWAY",
    message: "Server got an invalid response."
  }
};

export type ResponseCode = keyof typeof responses;

/**
 * Return the relevant response message, bases on `code` number provided.
 * @param code Number denoting the error type.
 * @returns 
 */
export function ReturnResponseMessage(code: ResponseCode): string {
  return responses[code].message
};

/**
 * Get a relevant status, bases on `code` number provided.
 * @param code Number denoting the error type.
 * @returns 
 */
export function ReturnResponseStatus(code: ResponseCode): string {
  return responses[code].status
};

/**
 * Get a relevant http code, bases on `statusCode` number provided.
 * @param statusCode Number denoting the error type.
 * @returns 
 */
export function ReturnResponseCode(statusCode: ResponseCode): ServerResponseCode {
  return responses[statusCode].code;
};

/**
 * Return the relevant request response, bases on `code` number provided.
 * @param code Number denoting the error type.
 * @returns 
 */
export function ReturnResponse(code: ResponseCode): Response {
  return responses[code]
}

type SuccessResponseTitles = "completed" | "successful";
type SuccessResponseContent = {
  code: 200,
  status: Capitalize<SuccessResponseTitles>,
  message: string
};
