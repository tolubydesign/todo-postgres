
export type RegisterUserArgs = {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string
}

export type CreateTaskArgs = {
  user: string,
  title: string, 
  description: string,
}

export type UpdateTaskArgs = {
  taskId: string,
  title?: string,
  description?: string,
  complete?: boolean,
}

export type DeleteTaskArgs = {
  taskId: string,
}