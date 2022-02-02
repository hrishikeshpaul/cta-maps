'use strict';

const express = require('express');
const Fuse = require('fuse.js');
const { getRoutes, getPatterns } = require('./train-service');

const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        let data = await getRoutes();
        data = data.map((item) => ({ ...item, type: 'T' }));
        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/patterns', async (req, res) => {
    const { route, color } = req.query;

    try {
        let data = await getPatterns(route);
        const patterns = [];

        data.forEach((item) => {
            const pattern = {
                fillColor: color,
                strokeColor: color,
                id: item.id,
                route,
                paths: []
            };

            item.shape.forEach((s) => {
                pattern.paths = s.paths.map(p => ({...p, latitude: p.lat, longitude: p.lng}))
            }); 

            patterns.push(pattern);
        });

        res.send(patterns);
    } catch (err) {
        res.send(err).status(400);
    }
});

module.exports = router;
