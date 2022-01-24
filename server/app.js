'use strict';

const dotenv = require('dotenv');
const chalk = require('chalk');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const router = require('./src/app/routes');
const clientRouter = require('./src/tc-client/routes');
const { onConnection } = require('./src/app/socket');
const { logger } = require('./src/utils/logger');

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: '*', transports: ['websocket'], allowUpgrades: false });

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/v1/api', router);
app.use('/v1/api', clientRouter);

io.on('connection', onConnection);

if (process.env.CTA_KEY) {
    httpServer.listen(process.env.PORT, () => {
        console.log('Server started on port', process.env.PORT);
    });
} else {
    console.log(chalk.red('CTA key missing. Failed to start server'));
}
