// swagger.js

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Backend Assignment-  VOOSH',
    version: '1.0.0',
    description: 'Enhanced Authentication API',
    contact: {
      name: 'Rajdeep Nagar',
      email: 'nagarrajdeep08@gmail.com',
    },
  },
  servers: [
    {
      url: 'https://backend-assignment-voosh-cv4kwetet-rajdeep-nagar08s-projects.vercel.app',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      googleOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://backend-assignment-voosh-cv4kwetet-rajdeep-nagar08s-projects.vercel.app/auth/google',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
              'profile': 'View your basic profile info',
              'email': 'View your email address',
            },
          },
        },
      },
    },
  },
};


const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'], 
};

module.exports = swaggerJSDoc(options);
