# Serverless Service Discovery

## Picture Service

Wrapper API for Pixabay.com stock images.
Registers its latest endpoint with the Service Discovery Registrar.

## Picture Frontend

Web frontend that consumes the Picture Service.
Provides a picture search interface.

## Service Discovery Registrar

Provides endpoints to:

- Register a service.
- Update a service endpoint.
- Get a service's latest endpoint, or a specific version.
