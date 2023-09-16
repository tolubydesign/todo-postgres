import { HTTPResponse } from "./model.js";

/**
 * @description Mutation object to collect all back-end mutations functions.
 * Note: As a project grows these function can be placed in separate files and folder. Helping to maintain clean and understandable code.
 */
export const Mutation = {
  initialiseDatabase: async (): Promise<HTTPResponse> => {
    return {
      status: "OK",
      message: "Database was successfully populated.",
    };
  },
};