#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { GraphqlLambdaCdkStack } from "../lib/graphql-lambda-stack";
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

const app = new cdk.App();
new GraphqlLambdaCdkStack(app, 'GraphqlLambdaCdkStack', {
  // stackName: "graphql-lambda-stack",
  env: {
    account: process.env.AWS_ACCOUNT_ID, // process.env.AWS_ACCOUNT_ID!,
    region: process.env.AWS_REGION, // process.env.AWS_REGION!
  }
});
