import * as fs from "fs";
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
const moment = require("moment-timezone");

const buildPackageLayer = (scope: cdk.Construct, id: string): lambda.LayerVersion => {
  const sourcePath = path.resolve(__dirname, "..", "packageLayer");
  const code = new lambda.AssetCode(sourcePath);

  return new lambda.LayerVersion(scope, `${id}-layer`, {
    code,
    compatibleRuntimes: [lambda.Runtime.NODEJS_12_X]
  });
};

const buildLambda = (
  scope: cdk.Construct,
  id: string,
  layer: lambda.LayerVersion,
  ssmKeyName: string,
  ssmKeyArn: string,
): lambda.Function => {
  const sourcePath = path.resolve(__dirname, "../", "pixabayLambda", "dist");
  const code = new lambda.AssetCode(sourcePath);

  const functionProps: lambda.FunctionProps = {
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: "index.handler",
    code,
    environment: {
      pixabayKey: ssmKeyName
    },
    layers: [layer],
    timeout: cdk.Duration.seconds(10),
  };

  const func = new lambda.Function(
    scope,
    `pixabayLambda`,
    functionProps
  );

  func.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["ssm:GetParameter"],
      resources: [ssmKeyArn],
    })
  );

  return func;
};

const buildApi = (scope: cdk.Construct, id: string): appsync.CfnGraphQLApi => {
  const appsyncApi = new appsync.CfnGraphQLApi(scope, `${id}-api`, {
		name: `${id}-api`,
    authenticationType: "API_KEY",
  });

  new appsync.CfnApiKey(scope, `${id}-poc-key`, {
    apiId: appsyncApi.attrApiId,
    description: "API key for proof-of-concept.",
    expires: moment().add(1, 'year').unix(),
  })

  const schemaPath = path.resolve(__dirname, "..", "api", "schema.graphql");
  const definition = fs.readFileSync(schemaPath).toString();

  new appsync.CfnGraphQLSchema(scope, `${id}-schema`, {
    apiId: appsyncApi.attrApiId,
    definition,
  });

  return appsyncApi;
}

const buildPictureEndpoint = (
  scope: cdk.Construct,
  id: string,
  apiId: string,
  lambdaFunctionArn: string,
  serviceRoleArn: string
) => {
  const datasource = new appsync.CfnDataSource(scope, `${id}-datasource`, {
		apiId,
		name: "pixabyLambda",
		type: "AWS_LAMBDA",
		lambdaConfig: {
			lambdaFunctionArn,
    },
    serviceRoleArn
  });

  const requestTemplatePath = path.resolve(__dirname, "..", "api", "Query.getPictures.req.vtl");
  const requestTemplate = fs.readFileSync(requestTemplatePath).toString();

  const responseTemplatePath = path.resolve(__dirname, "..", "api", "Query.getPictures.res.vtl");
	const responseTemplate = fs.readFileSync(responseTemplatePath).toString();

  const resolver = new appsync.CfnResolver(scope, `${id}-resolver`, {
		apiId,
		typeName: "Query",
		fieldName: "getPictures",
		dataSourceName: datasource.name,
		requestMappingTemplate: requestTemplate,
		responseMappingTemplate: responseTemplate,
  });

	resolver.addDependsOn(datasource);
}

export class PictureServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const layer = buildPackageLayer(this, id)

    const role = new iam.Role(this, `${id}-role`, {
			assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
		});

    const PIXABAY_KEY = "PIXABAY_KEY";
    const ssmArn = `arn:aws:ssm:${this.region}:${this.account}:parameter/${PIXABAY_KEY}`;
    const func = buildLambda(this, id, layer, PIXABAY_KEY, ssmArn);
    func.grantInvoke(role);

    const appsyncApi = buildApi(this, id);

    buildPictureEndpoint(this, id, appsyncApi.attrApiId, func.functionArn, role.roleArn);
  }
};
