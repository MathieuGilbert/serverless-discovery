#!/usr/bin/env node

const fs = require('fs')
const fetch = require('node-fetch')
const { GraphQLClient, gql } = require('graphql-request')
const config = require('./src/config.json')

global.Headers = fetch.Headers;

// this should be a static domain
const { serviceRegistryEndpoint } = config;

const getPictureService = async (name) => {
  const query = gql`
    query get($name: String!) {
      get(name: $name) {
          name
          version
          endpoint
      }
    }
  `

  const variables = { name }

  const graphQLClient = new GraphQLClient(serviceRegistryEndpoint, {
    headers: {
      'x-api-key': config.serviceRegistryKey,
    },
  })

  try {
    const response = await graphQLClient.request(query, variables)

    const { endpoint } = response.get

    return endpoint
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const updateConfig = async () => {
  const pictureServiceEndpoint = await getPictureService('TestService');

  fs.writeFileSync('./src/config.json', JSON.stringify({
    ...config,
    pictureServiceEndpoint,
  }, null, 2));
}

updateConfig();
