import { Role } from '@aws-cdk/aws-iam'
import { RemovalPolicy, Construct } from '@aws-cdk/core';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';

export const buildTable = (
  scope: Construct,
  id: string,
  role: Role,
) => {
  const table = new Table(scope, `${id}-table`, {
    partitionKey: {
      name: 'name',
      type: AttributeType.STRING
    },
    sortKey: {
      name: 'version',
      type: AttributeType.NUMBER
    },
    removalPolicy: RemovalPolicy.DESTROY
  });
  table.grantFullAccess(role);

  return table;
}
