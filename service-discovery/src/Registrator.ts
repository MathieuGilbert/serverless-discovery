import { Aws, Construct } from "@aws-cdk/core";
import {
	AwsCustomResource,
	AwsSdkCall,
	AwsCustomResourcePolicy,
	PhysicalResourceId,
	AwsCustomResourceProps,
} from "@aws-cdk/custom-resources";

export interface RegistratorProps {
	parameterName: string;
}

export class Registrator extends AwsCustomResource {
	constructor(
		scope: Construct,
		name: string,
		props: RegistratorProps
	) {
		const { parameterName } = props;

		const notifyUp: AwsSdkCall = {
			service: "SSM",
			action: "putParameter",
			parameters: {
        Name: parameterName,
        Value: "up",
        Type: "String",
        Overwrite: true
			},
			physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
    };

    const notifyDown: AwsSdkCall = {
			service: "SSM",
			action: "putParameter",
			parameters: {
        Name: parameterName,
        Value: "down",
        Type: "String",
        Overwrite: true
			},
			physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
		};

		const customResourceProps: AwsCustomResourceProps = {
      onUpdate: notifyUp,
      onDelete: notifyDown,
			policy: AwsCustomResourcePolicy.fromSdkCalls({
				resources: [
					`arn:aws:ssm:us-west-2:${Aws.ACCOUNT_ID}:parameter/${parameterName}`,
				],
			}),
		};

		super(scope, name, customResourceProps);
	}
}
