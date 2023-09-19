#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GraphqlLambdaCdkStack } from '../lib/graphql-lambda-stack';

const app = new cdk.App();
new GraphqlLambdaCdkStack(app, 'GraphqlLambdaCdkStack');