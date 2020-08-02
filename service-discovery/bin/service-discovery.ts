#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServiceDiscoveryStack } from '../lib/service-discovery-stack';

const app = new cdk.App();
new ServiceDiscoveryStack(app, 'ServiceDiscoveryStack');
