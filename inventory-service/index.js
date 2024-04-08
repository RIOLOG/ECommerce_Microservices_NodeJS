// const express = require('express');
// const colors = require('colors');
// const cors = require('cors');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// const connectDb = require('./db');



// //configure and connections:
// dotenv.config();
// connectDb();


// const app = express();



// //middleware:
// app.use(cors());
// app.use(express.json());



// //calling routes:
// app.use('/api/inventory', require("./src/route/inventoryRoute"));



// //PORT:
// const PORT = process.env.PORT;

// app.listen(PORT, () => {
//     console.log(`innventory-service is running on port ${PORT}`.bgMagenta);
// })



const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./db');
const Consul = require('consul'); // Import Consul library

// Configure and connect to the database
dotenv.config();
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', require("./src/route/inventoryRoute"));

app.get('/api/inventory/health-check', (req, res) => {
    res.status(200).json({ message: 'User service is healthy' });
});

// PORT
const PORT = process.env.PORT;
const CONSUL_PORT = 8500; 

app.listen(PORT, async () => {
    console.log(`inventory-service is running on port ${PORT}`.bgMagenta);

 
    const consul = new Consul({ host: '127.0.0.1', port: CONSUL_PORT });
    const serviceName = 'inventory-service';
    const serviceId = `${serviceName}-${PORT}`;

    try {
        await consul.agent.service.register({
            name: serviceName,
            id: serviceId,
            address: 'localhost',
            port: parseInt(PORT), 
            check: {
                http: `http://localhost:${PORT}/api/inventory/health-check`, // Health check endpoint
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
});



