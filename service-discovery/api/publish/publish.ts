import { DynamoDB } from 'aws-sdk';

import { get } from '../get/get'
import { Service } from '../types/Service'

const documentClient = new DynamoDB.DocumentClient();

export const publish = async (tableName: string, name: string, endpoint: string): Promise<Service> => {
  console.log('publishing new version of service: ', name)

  try {
    const current = await get(tableName, name)

    const updated = {
      name,
      endpoint,
      version: current.version + 1
    }

    const params: DynamoDB.PutItemInput = {
      TableName: tableName,
      Item: {
        name: updated.name as DynamoDB.AttributeValue,
        endpoint: updated.endpoint as DynamoDB.AttributeValue,
        version: updated.version as DynamoDB.AttributeValue,
      }
    };

    await documentClient.put(params).promise();

    return updated
  } catch (error) {
    console.log('error', error);
    throw error;
  }
}