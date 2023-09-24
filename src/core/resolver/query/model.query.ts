import { UserModel } from "../model"

export type GetTaskResponse = {
  id: string,
  title: string,
  description: string,
  complete: boolean,
  owner: string,
}

export type GetUserResponse = Omit<UserModel, "password">