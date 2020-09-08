import { DynamoDB } from 'aws-sdk';

import { Service } from '../types/Service'

const documentClient = new DynamoDB.DocumentClient();

export const register = async (tableName: string, name: string, endpoint: string): Promise<Service> => {
  console.log('registering new service: ', name)

  try {
    const service = {
      name: name as DynamoDB.AttributeValue,
      version: { 'N': '1' },
      endpoint: endpoint as DynamoDB.AttributeValue
    };

    const params: DynamoDB.PutItemInput = {
      TableName: tableName,
      Item: service,
    };

    await documentClient.put(params).promise();

    return {
      name,
      endpoint,
      version: 1
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}