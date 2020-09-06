import { Role } from '@aws-cdk/aws-iam'
import { Construct } from '@aws-cdk/core';
import { CfnDataSource } from '@aws-cdk/aws-appsync';
import { CfnResolver } from '@aws-cdk/aws-appsync';
import { Function } from '@aws-cdk/aws-lambda'

export const buildLambdaEndpoint = (
  scope: Construct,
  id: string,
  apiId: string,
  func: Function,
  role: Role,
  typeName: string,
  fieldName: string,
) => {
  const datasource = new CfnDataSource(scope, `${id}-${fieldName}-ds`, {
		apiId,
		name: fieldName,
    type: "AWS_LAMBDA",
		lambdaConfig: {
			lambdaFunctionArn: func.functionArn,
    },
    serviceRoleArn: role.roleArn
  });

  const resolver = new CfnResolver(scope, `${fieldName}-resolver`, {
    apiId,
    typeName,
    fieldName,
    dataSourceName: datasource.name
  });
  resolver.addDependsOn(datasource);

  return func;
}