const swaggerAutogen = require('swagger-autogen')();
const url = process.env.DEPLOY_URL || 'localhost:3000';
const scheme = process.env.DEPLOY_URL ? 'https' : 'http';

const doc = {
    info: {
        title: 'Hackathon API',
        description: 'API autodocumentada con swagger-autogen',
    },
    host: url,
    schemes: [scheme],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Añade "Bearer " seguido del token JWT.',
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/appRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Documentación Swagger generada exitosamente.');
});
