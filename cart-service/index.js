const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db');
const Consul = require('consul');

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', require("./src/routes/cartRoute"));

app.get('/api/cart/health-check', (req, res) => {
    res.status(200).json({ message: 'cart service is healthy' });
});


const PORT = process.env.PORT;
const CONSUL_PORT = 8500; 

app.listen(PORT, async () => {
    console.log(`cart-service is running on port ${PORT}`.bgMagenta);


    const consul = new Consul({ host: '127.0.0.1', port: CONSUL_PORT });
    const serviceName = 'cart-service';
    const serviceId = `${serviceName}-${PORT}`;

    try {
        await consul.agent.service.register({
            name: serviceName,
            id: serviceId,
            address: 'localhost',
            port: parseInt(PORT), 
            check: {
                http: `http://localhost:${PORT}/api/cart/health-check`, 
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
