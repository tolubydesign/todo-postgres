import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGateway from "@aws-cdk/aws-apigateway";

export class GraphqlLambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const graphqlLambda = new lambda.Function(this, "graphqlLambda", {
      // The code being used
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/serverless.ts")),
      // the function being initialised
      handler: "graphql.handler",
      runtime: lambda.Runtime.NODEJS_16_X,
    });

    new apiGateway.LambdaRestApi(this, "graphqlEndpoint", {
      handler: graphqlLambda,
    });
  }
}

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