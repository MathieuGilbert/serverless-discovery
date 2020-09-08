import { DynamoDB } from 'aws-sdk';

import { Service } from '../types/Service'

const documentClient = new DynamoDB.DocumentClient();

export const get = async (tableName: string, name: string, version?: string): Promise<Service> => {
  try {
    if (version?.length) {
      console.log('getting version: ', version)

      const params: DynamoDB.GetItemInput = {
        TableName: tableName,
        Key: {
          name: { 'S': name },
          version: { 'N': version }
        },
      }
      const service = await documentClient.get(params).promise();

      return service.Item as Service
    } else {
      console.log('getting latest version')

      const params: DynamoDB.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': name as DynamoDB.AttributeValue
        },
        Limit: 1,
        ScanIndexForward: false
      }
      const service = await documentClient.query(params).promise();
      return service.Items![0] as Service
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
