# Documentation
## Todo Postgres
### API Documentation for Todo Task

---

__POST - Get All Users__

URL: http://localhost:4000/graphql

Request all Users known to the postgres database.

__Query__
```graphql
query GetAllUsers {
  getAllUsers {
    id
    firstName
    lastName
    username
    email
    password
  }
}
```

---

__POST - Create Task__

URL: http://localhost:4000/graphql

Create a new task for user to complete.

__Query__
```graphql
mutation CreateTask($user: String!, $title: String!, $description: String!) {
  createTask(user: $user, title: $title, description: $description) {
    message
    status
  }
}
```

__GraphQL Variables__
```json
{
  "user": "aca036fd-4226-48a5-afc0-2bba2681cdbb",
  "title": "Task created on api",
  "description": ""
}
```

---

__POST - Get All Tasks__

URL: http://localhost:4000/graphql

Get all task known to the postgres database. Irrespective of its owner. This is for testing purposes only.

__Query__
```graphql
query GetAllTasks {
  getAllTasks {
    id
    title
    description
    complete
    owner
  }
}
```

---

__POST - Get All User Task By Id__

URL: http://localhost:4000/graphql

Get a all the tasks created but user id provided.

__Query__
```graphql
query GetUserTasks($userId: String!) {
  getUserTasks(userId: $userId) {
    id
    title
    description
    complete
    owner
  }
}
```

__GraphQL Variables__
```json
{
  "userId": "280dbaf4-f0a8-4e0d-ab08-704dbd3b9e97"
}
```

---

__POST - Get User By Id__

URL: http://localhost:4000/graphql

Get single user details based on information provided.

__Query__
```graphql
query GetUserById($userId: String!) {
  getUserById(userId: $userId) {
    id
    firstName
    lastName
    username
    email
    password
  }
}
```

__GraphQL Variables__
```json
{
  "userId": "50f11730-9101-474b-8d9f-ea008986e08a"
}
```

---

__POST - Register User__

URL: http://localhost:4000/graphql

Add new user to postgres database.

__Query__
```graphql
mutation RegisterUser($username: String!, $email: String!, $firstName: String!, $lastName: String!, $password: String!) {
  registerUser(username: $username, email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
    status
    message
  }
}
```

__GraphQL Variables__
```json
{
  "username": "Del",
  "email": "dell@gmail.com",
  "firstName": "Delamane",
  "lastName": "Auto",
  "password": "password"
}
```

---

__POST - Update Task__

URL: http://localhost:4000/graphql

Update the information of a single task. Everything but the id can be changed.

__Query__
```graphql
mutation UpdateTask($taskId: String!, $complete: Boolean!, $description: String!, $title: String!) {
  updateTask(taskId: $taskId, complete: $complete, description: $description, title: $title) {
    message
    status
  }
}
```

__GraphQL Variables__
```json
{
  "taskId": "40c43717-ea0c-4adb-8f85-0518721d9d8c",
  "complete": false,
  "description": "More information needs to be added",
  "title": "Updated task via api version two"
}
```

---

__POST - Remove User__

URL: http://localhost:4000/graphql

Remove a user from database.

__Query__
```graphql
mutation RemoveUser($userId: String!) {
  removeUser(userId: $userId) {
    status
    message
  }
}
```

__GraphQL Variables__
```json
{
  "userId": "1f21dd7d-395e-47cb-b11e-ae34f509184d"
}
```

---

__POST - Mark Task As Complete__

URL: http://localhost:4000/graphql

Update a task to be complete.

__Query__
```graphql
mutation MarkTaskAsComplete($taskId: String!) {
  markTaskAsComplete(taskId: $taskId) {
    message
    status
  }
}
```

__GraphQL Variables__
```json
{
  "taskId": "650022e8-f414-4861-8848-1c3b78f54a06"
}
```

---

__POST - Mark Task As Incomplete__

URL: http://localhost:4000/graphql

Update a task to be incomplete.

__Query__
```graphql
mutation MarkTaskAsIncomplete($taskId: String!) {
  markTaskAsIncomplete(taskId: $taskId) {
    message
    status
  }
}
```

__GraphQL Variables__
```json
{
  "taskId": "650022e8-f414-4861-8848-1c3b78f54a06"
}
```