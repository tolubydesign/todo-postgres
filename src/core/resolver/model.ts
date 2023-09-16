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