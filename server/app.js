'use strict';

import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import router from './src/routes.js';
import { onConnection } from './src/socket.js';

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: '*' });

app.use(cors());

app.use('/v1/api', router);

io.on('connection', onConnection);

if (process.env.CTA_KEY) {
    httpServer.listen(process.env.PORT, () => {
        console.log('Server started on port', process.env.PORT);
    });
} else {
    console.log(chalk.red('CTA key missing. Failed to start server'));
}
