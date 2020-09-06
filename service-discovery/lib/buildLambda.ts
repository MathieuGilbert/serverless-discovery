import * as path from 'path';
import { Role } from '@aws-cdk/aws-iam'
import { Construct, Duration } from '@aws-cdk/core';
import { Table } from '@aws-cdk/aws-dynamodb'
import { AssetCode, Function, FunctionProps, Runtime } from '@aws-cdk/aws-lambda';

export const buildGetLambda = (
  scope: Construct,
  role: Role,
  table: Table,
): Function => {
  const sourcePath = path.resolve(__dirname, '../', 'api', 'get', 'dist');

  const functionProps: FunctionProps = {
    runtime: Runtime.NODEJS_12_X,
    handler: "get/index.handler",
    code: new AssetCode(sourcePath),
    environment: {
      TABLE_NAME: table.tableName
    },
    timeout: Duration.seconds(10)
  };

  const func = new Function(scope, 'get-lambda', functionProps);
  table.grantReadData(func);
  func.grantInvoke(role);

  return func;
}

export const buildRegisterLambda = (
  scope: Construct,
  role: Role,
  table: Table,
): Function => {
  const sourcePath = path.resolve(__dirname, '../', 'api', 'register', 'dist');

  const functionProps: FunctionProps = {
    runtime: Runtime.NODEJS_12_X,
    handler: "register/index.handler",
    code: new AssetCode(sourcePath),
    environment: {
      TABLE_NAME: table.tableName
    },
    timeout: Duration.seconds(10)
  };

  const func = new Function(scope, 'register-lambda', functionProps);
  table.grantWriteData(func);
  func.grantInvoke(role);

  return func;
}

export const buildPublishLambda = (
  scope: Construct,
  role: Role,
  table: Table,
): Function => {
  const sourcePath = path.resolve(__dirname, '../', 'api', 'publish', 'dist');

  const functionProps: FunctionProps = {
    runtime: Runtime.NODEJS_12_X,
    handler: "publish/index.handler",
    code: new AssetCode(sourcePath),
    environment: {
      TABLE_NAME: table.tableName
    },
    timeout: Duration.seconds(10)
  };

  const func = new Function(scope, 'publish-lambda', functionProps);
  table.grantReadWriteData(func);
  func.grantInvoke(role);

  return func;
}
