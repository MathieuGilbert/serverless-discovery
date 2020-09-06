import { Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { buildTable } from './buildTable'
import { buildApi } from './buildApi'
import { buildLambdaEndpoint } from './buildLambdaEndpoint'
import {
  buildGetLambda,
  buildPublishLambda,
  buildRegisterLambda
} from './buildLambda'

export class ServiceDiscoveryStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const role = new Role(this, `${id}-role`, {
			assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
		});

    const table = buildTable(this, id, role);

    const appsyncApi = buildApi(this, id);

    buildLambdaEndpoint(
      this,
      id,
      appsyncApi.attrApiId,
      buildRegisterLambda(this, role, table),
      role,
      'Mutation',
      'register'
    );

    buildLambdaEndpoint(
      this,
      id,
      appsyncApi.attrApiId,
      buildPublishLambda(this, role, table),
      role,
      'Mutation',
      'publish'
    );

    buildLambdaEndpoint(
      this,
      id,
      appsyncApi.attrApiId,
      buildGetLambda(this, role, table),
      role,
      'Query',
      'get'
    );
  }
}
