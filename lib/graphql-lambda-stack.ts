import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGateway from "@aws-cdk/aws-apigateway";
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdkLambda from 'aws-cdk-lib/aws-lambda'
import * as cdkApiGateway from 'aws-cdk-lib/aws-apigateway'
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as cdkRDS from 'aws-cdk-lib/aws-rds';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config();


/**
 * Graphql Lambda Stack containing the lambda instance and the code that will be run on the server.
 * @see _link_ [aws-cdk-lib.aws_rds module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds-readme.html)
 */
export class GraphqlLambdaCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const graphqlLambda = new cdkLambda.Function(this, "graphqlLambda", {
      // The code being used
      code: cdkLambda.Code.fromAsset(path.join(__dirname, "../src")),
      // the function being initialised
      handler: "serverless.handler",
      runtime: cdkLambda.Runtime.NODEJS_18_X,
      environment: {
        ENV: "development",
        POSTGRES_USER: process.env.POSTGRES_USER!,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
        POSTGRES_DB: process.env.POSTGRES_DB!,
        PORT: process.env.PORT!,
        HOST: process.env.HOST!,
        POSTGRES_PORT: process.env.POSTGRES_PORT!,
      }
    });

    new cdkApiGateway.LambdaRestApi(this, "graphqlEndpoint", {
      handler: graphqlLambda,
    });

    new cdkRDS.CfnDBInstance(this, 'graphqlRDS', {
      engine: 'postgres',
      dbInstanceClass: 'db.t3.micro',
      allocatedStorage: '10',
      dbName: 'postgres',
      masterUsername: 'postgres',
      masterUserPassword: process.env.POSTGRES_PASSWORD!,
      publiclyAccessible: true,
      vpcSecurityGroups: [],
      // vpcSecurityGroupIds: [mySecurityGroup.securityGroupId],
    })
  }
}

// export class GraphqlLambdaCdkStack extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const graphqlLambda = new lambda.Function(this, "graphqlLambda", {
//       // The code being used
//       code: lambda.Code.fromAsset(path.join(__dirname, "../src/serverless.ts")),
//       // the function being initialised
//       handler: "graphql.handler",
//       runtime: lambda.Runtime.NODEJS_16_X,
//     });

//     new apiGateway.LambdaRestApi(this, "graphqlEndpoint", {
//       handler: graphqlLambda,
//     });
//   }
// }

// --

// import { Duration, Stack, StackProps } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
// import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import { Construct } from 'constructs';

// export class GraphqlLambdaCdkStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     // defines an AWS Lambda resource
//     const graphqlLambda = new lambda.Function(this, "graphqlLambda", {
//       // The code being used
//       code: lambda.Code.fromAsset(path.join(__dirname, "../src/serverless.ts")),
//       // the function being initialised
//       handler: "graphql.handler",
//       runtime: lambda.Runtime.NODEJS_16_X,
//     });

//     new apiGateway.LambdaRestApi(this, "graphqlEndpoint", {
//       handler: graphqlLambda,
//     });
//   }
// }