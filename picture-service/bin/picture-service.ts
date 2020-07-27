#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PictureServiceStack } from '../lib/picture-service-stack';

const app = new cdk.App();
new PictureServiceStack(app, 'PictureServiceStack');
