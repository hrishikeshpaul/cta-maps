'use strict';

const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const router = require('./src/routes');
const { onConnection } = require('./src/socket');

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: '*', transports: ['websocket'], allowUpgrades: false });

app.use(cors());
app.use(express.json());

app.use('/v1/api', router);

io.on('connection', onConnection);

if (process.env.CTA_KEY) {
    httpServer.listen(process.env.PORT, () => {
        console.log('Server started on port', process.env.PORT);
    });
} else {
    console.log(chalk.red('CTA key missing. Failed to start server'));
}
