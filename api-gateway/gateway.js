// const express = require('express')
// const { createProxyMiddleware } = require('http-proxy-middleware')
// const colors = require('colors')


// const app = express();


// //defines routes and their ports
// const routes = {
//     '/api/product':'http://localhost:8081',
//     '/api/inventory':'http://localhost:8082',
//     '/api/user':'http://localhost:8083',
//     '/api/cart':'http://localhost:8084',
// }


// //create a proxy for each route
// for(const route in routes){
//     const target = routes[route];
//     app.use(route,createProxyMiddleware({target}))
// }

// const PORT = 8080;
// app.listen(PORT, () => {
//     console.log(`API GATEWAY STARTED ${PORT}`.bgRed)
// })




const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const colors = require('colors');
const Consul = require('consul');

const app = express();

app.get('/api/gateway/health-check', (req, res) => {
    res.status(200).json({ message: 'User service is healthy' });
});

const routes = {
    '/api/product': 'http://localhost:8081',
    '/api/inventory': 'http://localhost:8082',
    '/api/user': 'http://localhost:8083',
    '/api/cart': 'http://localhost:8084',
};

// Create a proxy for each route
for (const route in routes) {
    const target = routes[route];
    app.use(route, createProxyMiddleware({ target }));
}


const consul = new Consul({ host: '127.0.0.1', port: 8500 });
const serviceName = 'api-gateway';
const serviceId = `${serviceName}-8080`;

try {
    consul.agent.service.register({
        name: serviceName,
        id: serviceId,
        address: 'localhost',
        port: 8080,
        check: {
            http: `http://localhost:8080/api/gateway/health-check`, 
            interval: '10s',
            timeout: '5s',
        },
    });
    console.log(`Service ${serviceName} registered with Consul`.bgBlue);
} 
catch (error) 
{
    console.error('Error registering with Consul:', error);
}

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`API GATEWAY STARTED ${PORT}`.bgRed);
});


