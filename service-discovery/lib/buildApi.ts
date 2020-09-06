import * as path from 'path';
import * as fs from 'fs';
import { Construct }  from '@aws-cdk/core';
import { CfnGraphQLApi, CfnApiKey, CfnGraphQLSchema } from '@aws-cdk/aws-appsync';
const moment = require("moment-timezone");

export const buildApi = (
  scope: Construct,
  id: string
): CfnGraphQLApi => {
  const appsyncApi = new CfnGraphQLApi(scope, `${id}-api`, {
		name: `${id}-api`,
    authenticationType: "API_KEY",
  });

  new CfnApiKey(scope, `${id}-poc-key`, {
    apiId: appsyncApi.attrApiId,
    description: "API key for proof-of-concept.",
    expires: moment().add(1, 'year').unix(),
  })

  const schemaPath = path.resolve(__dirname, "..", "api", "schema.graphql");
  const definition = fs.readFileSync(schemaPath).toString();

  new CfnGraphQLSchema(scope, `${id}-schema`, {
    apiId: appsyncApi.attrApiId,
    definition,
  });

  return appsyncApi;
}