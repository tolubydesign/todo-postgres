#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GraphqlLambdaCdkStack } from '../lib/graphql-lambda-stack.js';
import { config } from 'dotenv';
config();

const app = new cdk.App();
new GraphqlLambdaCdkStack(app, 'GraphqlLambdaCdkStack', {
  env: {
    account: "474412487035", // process.env.AWS_ACCOUNT_ID!,
    region: "us-east-2", // process.env.AWS_REGION!
  }
});