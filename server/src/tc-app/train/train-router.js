'use strict';

const express = require('express');
const Fuse = require('fuse.js');
const { getRoutes, getPatterns } = require('./train-service');

const router = express.Router();

router.get('/routes', async (req, res, next) => {
    try {
        const data = await getRoutes();
        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/patterns', async (req, res, next) => {
    const { route, color } = req.query;
    try {
        const data = await getPatterns(route);

        // console.log(data[0].seq.length);
        // console.log(data[1].seq.length);
        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

module.exports = router;
