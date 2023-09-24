import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGateway from "@aws-cdk/aws-apigateway";
import { CfnOutput, Duration, Expiration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdkLambda from 'aws-cdk-lib/aws-lambda'
import * as cdkApiGateway from 'aws-cdk-lib/aws-apigateway'
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from "aws-cdk-lib/aws-rds";
import * as cdkRDS from 'aws-cdk-lib/aws-rds';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  AppsyncFunction,
  AuthorizationType,
  Code as AppSyncCode,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
  Resolver,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync'
import { LambdaSchemaGraphQL, SchemaGraphQL } from "../src/shared/schema/schema"
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
config({ path: `.env.${process.env.NODE_ENV}` });

/**
 * Graphql Lambda Stack containing the lambda instance and the code that will be run on the server.
 * @see _link_ [aws-cdk-lib.aws_rds module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds-readme.html)
 * @see _link_ [Learn how to create an RDS...](https://levelup.gitconnected.com/learn-how-to-create-an-rds-instance-using-aws-cdk-typescript-a688d9f13cba)
 * @see _link_ [Creating a serverless application...](https://docs.aws.amazon.com/cdk/v2/guide/serverless_example.html)
 * @see _link_ [Build a simple GraphQL server...](https://cloudash.dev/blog/build-a-simple-graphql-server-with-apollo-and-cdk) !
 * @see _link_  -> [GitHub: CDK + Apollo Server + AWS Lambda example](https://github.com/tlakomy/cdk-graphql-lambda-example) !
 * @see _link_ [Building Scalable GraphQL APIs on AWS with CDK...](https://aws.amazon.com/blogs/mobile/building-scalable-graphql-apis-on-aws-with-cdk-and-aws-appsync/) !
 * @see _link_  -> [GitHub: CDK AppSync GraphQL API](https://github.com/dabit3/cdk-graphql-backend) !
 */
export class GraphqlLambdaCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_15_4 });
    const instanceType = InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO);
    const port = '5432';
    const databaseName = "postgres";

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'GraphqlAppSyncApi', {
      name: 'todo-graphql-cdk-appsync-api',
      schema: SchemaFile.fromAsset('src/shared/schema/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(60))
          }
        },
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new CfnOutput(this, "GraphQLAPIURL", { value: api.graphqlUrl });
    // Prints out the AppSync GraphQL API key to the terminal
    new CfnOutput(this, "GraphQLAPIKey", { value: api.apiKey || 'no-api-key' });
    // Prints out the stack region to the terminal
    new CfnOutput(this, "Stack Region", { value: this.region });
    new CfnOutput(this, "Graphql api env", { value: `${api.env}` });
    new CfnOutput(this, "Graphql Stack", { value: `${api.stack}` });
    new CfnOutput(this, "Stack Name", { value: this.stackName });


    // 👇 3rd party library layers
    const apolloServerLayer = new cdkLambda.LayerVersion(this, 'apollo_server-layer', {
      removalPolicy: RemovalPolicy.RETAIN,
      code: cdkLambda.Code.fromAsset("src/layers/apollo_server"),
      compatibleArchitectures: [cdkLambda.Architecture.X86_64, cdkLambda.Architecture.ARM_64],
      description: 'Uses a 3rd party library called @apollo/server',
    });
    const asIntegrationsAWSLambdaLayer = new cdkLambda.LayerVersion(this, 'as-integrations_aws-lambda-layer', {
      removalPolicy: RemovalPolicy.RETAIN,
      code: cdkLambda.Code.fromAsset("src/layers/as-integrations_aws-lambda"),
      compatibleArchitectures: [cdkLambda.Architecture.X86_64, cdkLambda.Architecture.ARM_64],
      description: 'Uses a 3rd party library called @as-integrations/aws-lambda',
    });
    // const apolloServerCoreLayer = new cdkLambda.LayerVersion(this, 'apollo-server-core-layer', {
    //   removalPolicy: RemovalPolicy.RETAIN,
    //   code: cdkLambda.Code.fromAsset("src/layers/apollo-server-core"),
    //   compatibleArchitectures: [cdkLambda.Architecture.X86_64, cdkLambda.Architecture.ARM_64],
    //   description: 'Uses a 3rd party library called apollo-server-core',
    // });
    const apolloServerLambdaLayer = new cdkLambda.LayerVersion(this, 'apollo-server-lambda-layer', {
      removalPolicy: RemovalPolicy.RETAIN,
      code: cdkLambda.Code.fromAsset("src/layers/apollo-server-lambda"),
      compatibleArchitectures: [cdkLambda.Architecture.X86_64, cdkLambda.Architecture.ARM_64],
      description: 'Uses a 3rd party library called apollo-server-lambda',
    });
    const typeormLayer = new cdkLambda.LayerVersion(this, 'typeorm-layer', {
      removalPolicy: RemovalPolicy.RETAIN,
      code: cdkLambda.Code.fromAsset("src/layers/typeorm"),
      compatibleArchitectures: [cdkLambda.Architecture.X86_64, cdkLambda.Architecture.ARM_64],
      description: 'Uses a 3rd party library called typeorm',
    });

    // Lambda 
    const graphqlLambda = new cdkLambda.Function(this, "graphqlLambda", {
      // The code being used
      code: cdkLambda.Code.fromAsset('dist/src'),
      // the function being initialised
      handler: "index.handler",
      runtime: cdkLambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      environment: {
        ENV: "development",
        REGION: Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          Stack.of(this).availabilityZones,
        ),
        POSTGRES_USER: process.env.POSTGRES_USER!,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
        POSTGRES_DB: process.env.POSTGRES_DB!,
        PORT: process.env.PORT!,
        HOST: process.env.HOST!,
        POSTGRES_PORT: process.env.POSTGRES_PORT!,
      },
      layers: [
        apolloServerLayer,
        typeormLayer,
        apolloServerLambdaLayer,
        // apolloServerCoreLayer,
        asIntegrationsAWSLambdaLayer,
      ],
    });

    new cdkApiGateway.LambdaRestApi(this, "graphqlEndpoint", {
      handler: graphqlLambda,
    });

    // We know this VPC already exists
    const myVpc = Vpc.fromLookup(this, "Next JS VPC", { vpcId: "vpc-0a78e0c27092cdf34" });

    // looking up an SG by its ID
    const dbSg = SecurityGroup.fromSecurityGroupId(this, 'default', 'sg-0816b70e643a8cb3b');
    // Create a Security Group
    // const dbSg = new SecurityGroup(this, "Database-SG", {
    //   securityGroupName: "Database-SG",
    //   vpc: myVpc,
    // });

    // Add Inbound rule
    dbSg.addIngressRule(
      Peer.ipv4(myVpc.vpcCidrBlock),
      Port.tcp(parseInt(port)),
      `Allow port ${port} for database connection from only within the VPC (${myVpc.vpcId})`
    );

    // set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', graphqlLambda);


    // create resolvers to match GraphQL operations in schema
    lambdaDs.createResolver("GetAllUsers", {
      typeName: "Query",
      fieldName: "getAllUsers"
    });
    lambdaDs.createResolver("GetAllTasks", {
      typeName: "Query",
      fieldName: "getAllTasks"
    });
    lambdaDs.createResolver("RegisterUser", {
      typeName: "Mutation",
      fieldName: "registerUser"
    });
    lambdaDs.createResolver("CreateTask", {
      typeName: "Mutation",
      fieldName: "createTask"
    });
    lambdaDs.createResolver("UpdateTask", {
      typeName: "Mutation",
      fieldName: "updateTask"
    });
    lambdaDs.createResolver("DeleteTask", {
      typeName: "Mutation",
      fieldName: "deleteTask"
    });
    lambdaDs.createResolver("MarkTaskAsComplete", {
      typeName: "Mutation",
      fieldName: "markTaskAsComplete"
    });
    lambdaDs.createResolver("MarkTaskAsIncomplete", {
      typeName: "Mutation",
      fieldName: "markTaskAsIncomplete"
    });

    const RDSDatabase = new cdkRDS.DatabaseInstance(this, 'graphqlRDS', {
      vpc: myVpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      engine,
      instanceType,
      // credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      multiAz: false,
      allocatedStorage: 10,
      maxAllocatedStorage: 30,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: 'todoPostgresDB',
      publiclyAccessible: true,
    });

    // RDSDatabase.connections.allowFrom(ec2Instance, Port.tcp(5432));
    new CfnOutput(this, 'dbEndpoint', {
      value: RDSDatabase.instanceEndpoint.hostname,
    });
    new CfnOutput(this, 'secretName', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      value: RDSDatabase.secret?.secretName!,
    });
  }
};
