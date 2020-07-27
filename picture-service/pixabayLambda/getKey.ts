import { SSM } from 'aws-sdk';

const ssm = new SSM();

export const getKey = async (paramName: string): Promise<string> => {
  const params: SSM.GetParameterRequest = {
    Name: paramName,
    WithDecryption: true,
  }
  const response = await ssm.getParameter(params).promise();

  if (!response.Parameter?.Value) {
    throw new Error(`Error fetching SSM parameter '${paramName}'`)
  }
  return response.Parameter?.Value;
}
