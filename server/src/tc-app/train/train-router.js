'use strict';

const express = require('express');
const { getRoutes, getPatterns, getStops } = require('./train-service');

const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        const { filter } = req.query;

        let data = await getRoutes();
        data = data.map((item) => ({ ...item, type: 'T' }));

        if (filter) {
            const filterRoutes = filter.split(',');

            filterRoutes.forEach((route) => {
                data = data.filter((d) => d.route !== route);
            });
        }

        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/patterns', async (req, res) => {
    const { route, color } = req.query;

    try {
        const data = await getPatterns(route);
        const stops = await getStops(route);

        const patterns = [];

        data.forEach((item) => {
            const pattern = {
                fillColor: color,
                strokeColor: color,
                id: item.id,
                route,
                paths: [],
                stops: [],
            };

            item.shape.forEach((s) => {
                pattern.paths = s.paths.map((p) => ({ ...p, latitude: p.lat, longitude: p.lng }));
            });

            patterns.push(pattern);
        });

        if (patterns.length) {
            patterns[0].stops = stops;
        }

        res.send(patterns);
    } catch (err) {
        res.send(err).status(400);
    }
});

router.get('/stops', async (req, res) => {
    const { route } = req.query;

    try {
        const data = await getStops(route);

        res.send(data);
    } catch (err) {
        res.send(err).status(400);
    }
});

module.exports = router;
