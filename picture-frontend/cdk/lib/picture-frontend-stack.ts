import * as fs from "fs";
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deployment from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';

export class PictureFrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, `${id}-bucket`, {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    const sourcePath = path.resolve(__dirname, "..", "..", "spa", "build");
    new s3deployment.BucketDeployment(this, `${id}-bucketdeployment`, {
      sources: [s3deployment.Source.asset(sourcePath)],
      destinationBucket: siteBucket
    })

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, `${id}-oai`);

    new cloudfront.CloudFrontWebDistribution(this, `${id}-distribution`, {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity
          },
          behaviors : [ {isDefaultBehavior: true}]
        }
      ]
    })
  }
}
