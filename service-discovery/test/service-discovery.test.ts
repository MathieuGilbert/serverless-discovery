import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ServiceDiscovery from '../lib/service-discovery-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ServiceDiscovery.ServiceDiscoveryStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
