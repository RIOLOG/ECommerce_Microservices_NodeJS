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
app.use('/api/user', require('./src/routes/userRoute'));


app.get('/api/user/health-check', (req, res) => {
    res.status(200).json({ message: 'User service is healthy' });
});

const PORT = process.env.PORT;
const CONSUL_PORT = 8500; 

app.listen(PORT, async () => {
    console.log(`User service is running on port ${PORT}`.bgMagenta);


    ///IMPLEMENT THE SERVICE REGISTY:(USING CONSUL);
    const consul = new Consul({ host: '127.0.0.1', port: CONSUL_PORT });
    const serviceName = 'user-service';
    const serviceId = `${serviceName}-${PORT}`;

    try {
        await consul.agent.service.register({
            name: serviceName,
            id: serviceId,
            address: 'localhost',
            port: parseInt(PORT), 
            check: {
                http: `http://localhost:${PORT}/api/user/health-check`,
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

