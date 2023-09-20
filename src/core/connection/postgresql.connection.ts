import "reflect-metadata";
import path from 'path';
import { fileURLToPath } from 'url';
import { DataSource, Repository } from "typeorm";
import { User } from "./entity/user.js";
import { Task } from "./entity/task.js";
import dotenv from 'dotenv'
import { ApolloBadRequestError, ApolloInternalServerError } from "../../shared/error/error-handler.js";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * A class to manage our connection to the postgresql 
 */
class PostgreSQLConnection {
  private host = process.env.HOST;
  private username = process.env.POSTGRES_USER;
  private password = process.env.POSTGRES_PASSWORD;
  private database = process.env.POSTGRES_DB;
  private port = process.env.POSTGRES_PORT;
  AppDataSource: DataSource = new DataSource({
    type: "postgres",
    host: this.host,
    port: parseFloat(this.port ? this.port : ""),
    username: this.username,
    password: this.password,
    database: this.database,
    // connectTimeoutMS: 10000,
    uuidExtension: "uuid-ossp",
    synchronize: true,
    logging: false,
    entities: [
      User, Task
    ],
    migrations: [],
    subscribers: [],
  });

  private userRepository: Repository<User> | undefined;
  private taskRepository: Repository<Task> | undefined;

  constructor() {
    this.establishConnection();
  }

  private async establishConnection() {
    await this.initializeDatabase();
    this.userRepository = this.AppDataSource.getRepository(User);
    this.taskRepository = this.AppDataSource.getRepository(Task);
  }

  // initialise application data source.
  async initializeDatabase(): Promise<void> {
    if (!this.AppDataSource) throw new Error("Cannot access source data.");
    // Check that there are users. if there's nothing then add them
    return await this.AppDataSource.initialize().then(async () => {

      const hasUsers = await this.AppDataSource.manager.find(User)
      console.log("Initialising database.")
      if (!hasUsers || hasUsers.length <= 0) {
        console.log("Inserting a new user into the database...");
        const user1 = this.createNewUser({
          email: "timbersaw@gmail.com",
          firstName: "Timber",
          lastName: "Saw",
          password: "password",
          username: "tim"
        });

        const user2 = this.createNewUser({
          email: "jeff_ken@gmail.com",
          firstName: "Jeff",
          lastName: "Ken",
          password: "password",
          username: "jeff"
        });

        const user3 = this.createNewUser({
          email: "tom@gmail.com",
          firstName: "Tom",
          lastName: "Joe",
          password: "password",
          username: "tom"
        })

        await this.AppDataSource.manager.save(user1);
        await this.AppDataSource.manager.save(user2);
        await this.AppDataSource.manager.save(user3);

        console.log("Saved a new user with id: " + user1.id)
        console.log("Loading users from the database...")

        const users = await this.AppDataSource?.manager.find(User)

        console.log("Loaded users: ", users)
        console.log("Here you can setup and run express / fastify / any other framework.")
      }

    }).catch((error) => {
      console.log("ERROR host", this.host);
      console.log("ERROR password", this.password);
      console.log("ERROR database", this.database);
      console.log("ERROR port", this.port);
      console.log("ERROR",);
      console.log("CONNECTION ERROR: ", error);
    })
  }

  /**
   * Create a new User() class. Attach param details to new class to create new user.
   * Will error if all relevant information hasn't been provided.
   * @param param.username 
   * @param param.email 
   * @param param.firstName 
   * @param param.lastName 
   * @param param.password 
   * @returns user. Created user with relevant user information.
   */
  createNewUser({ username, email, firstName, lastName, password }: Partial<User>): User {
    // error if insufficient values are provided. Error will bubble up
    if (!username || !email || !firstName || !lastName || !password)
      throw new ApolloBadRequestError("Missing relevant user information.");

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;

    return user
  }

  /**
   * Create a new Task() class. Attach param details to new class to create new task.
   * Will error if all relevant information have not been provided.
   * @param param.description
   * @param param.title
   * @param param.owner ID of the user who created the task.
   * @returns 
   */
  createTask({ description, owner, title }: Partial<Task>): Task {
    // error if insufficient values are provided. Error will bubble up
    if (!owner || !title)
      throw new ApolloBadRequestError("Missing relevant task information.");

    const task = new Task();
    task.complete = false;
    task.description = description ?? "";
    task.title = title;
    task.owner = owner;

    return task
  };

  getUserDataSource(): Repository<User> {
    if (!this.userRepository) throw new ApolloInternalServerError("Cannot access users.");
    return this.userRepository;
  };

  getTaskDataSource(): Repository<Task> {
    if (!this.taskRepository) throw new ApolloInternalServerError("Cannot access tasks.");
    return this.taskRepository;
  }

  dataSource(): DataSource {
    if (!this.AppDataSource) throw new ApolloInternalServerError("Cannot access data source.");
    return this.AppDataSource;
  }
};

const postgresqlSingleton = new PostgreSQLConnection();
export default postgresqlSingleton;
