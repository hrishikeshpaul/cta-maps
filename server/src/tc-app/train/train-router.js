'use strict';

const express = require('express');
const Fuse = require('fuse.js');
const { getRoutes } = require('./train-service');

const router = express.Router();

router.get('/routes', async (req, res, next) => {
    try {
        const data = await getRoutes();
        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

module.exports = router;
