'use strict';

require('dotenv').config();

const { initializeDatabase } = require('./src/db');

initializeDatabase();
