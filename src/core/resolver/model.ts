import { GraphQLFieldResolverParams } from "@apollo/server";

export type MutationGraphQLFieldResolverParams<ArgumentType = any> = GraphQLFieldResolverParams<undefined, any, ArgumentType>;

export type UserModel = {
  id?: any,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
}

export type UserDetail = Omit<UserModel, "password">

export type HTTPResponse = {
  status: string,
  message: string,
}

export type GetByIdArgs = {
  id: string
}

export type GetByUserIdArgs = {
  userId: string
}