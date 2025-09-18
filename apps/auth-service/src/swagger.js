import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Auth Service API',
    description: 'API Documentation for Auth Service',
    version: '1.0.0',
  },
  host: 'localhost:6001',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints related to authentication',
    },
  ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.router.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
