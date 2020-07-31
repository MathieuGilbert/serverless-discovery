#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PictureFrontendStack } from '../lib/picture-frontend-stack';

const app = new cdk.App();
new PictureFrontendStack(app, 'PictureFrontendStack');
