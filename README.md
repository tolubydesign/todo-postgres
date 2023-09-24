# TODO PostgreSQL

## Description

#### Running the Apollo Graphql Server Locally

To run the project, you will need Docker and Docker Compose installed on your machine. Docker Compose was used to handle test data.
I have provided a link to how to install docker and docker-compose below.

[Install Docker Compose](https://docs.docker.com/compose/install/)
[Install Docker](https://docs.docker.com/engine/install/)

To run the docker compose yml input this into your terminal
```sh
$ docker compose up
```

Once docker has been installed locally you can start the server.

```sh
1 npm i
2 npm run serve
```

Note this project uses .env values.
To run the project locally you'll need to create a `.env.development` file at root with these as its values.
```
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="postgres"
PORT=4000
HOST="localhost"
POSTGRES_PORT=5432
```

Doing this will open the port 4000. The GraphQL API can be accessed on `http://localhost:4000/graphql`

#### Deploying CDK

The application can be deployed via these commands.

```sh
1 npx cdk bootstrap
2 npm run cdk-deploy
```

##### Basic Structure of Server

This back-end was built with GraphQL (in combination with Express) and PostgreSQL Database.

#### API Documentation

A full list of requests that can be made has been exported to `todo-postgres.postman_collection.json`.

This JSON file can be imported into Postman and used by others to understand how to make API requests.

I have left further api documentation within the api.md file.

#### Improvement

Unfortunately, due to limited time, I was unable to properly deploy this project.
Information regarding the CDK deployment can be found here `lib/graphql-lambda-stack.ts`. With more time, these issues can be solved.
Issues arose when trying to deploy typeorm serverlessly.

Improvements needed:
- Logging can be implemented to better understand what is happening in the database.
- JWT Authentication token can be utilised to authenticate users on login and restrict access to information to preve to select users. 
