'use strict';

import express from 'express';
import { getPatterns, getRoutes, getVehicles, getPredictions } from './util.js';

const checkHeading = (heading) => {
    if (heading >= 0 && heading <= 90) {
        return 'N';
    } else if (heading > 90 && heading <= 180) {
        return 'E';
    } else if (heading > 180 && heading <= 270) {
        return 'S';
    } else if (heading > 270 && heading <= 360) {
        return 'W';
    } else {
        return 'F';
    }
};

const router = express.Router();

router.get('/routes', async (req, res) => {
    try {
        let data = await getRoutes();

        data = data.map((item) => ({
            route: item.rt,
            name: item.rtnm,
            color: item.rtclr,
        }));

        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/vehicles', async (req, res) => {
    try {
        let data = await getVehicles(req.query.rt);
        data = data.map((item) => ({
            id: item.vid,
            timestamp: item.tmstmp,
            position: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
            route: item.rt,
            destination: item.des,
            delayed: item.dly,
            heading: checkHeading(parseInt(item.hdg, 10)),
        }));

        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/patterns', async (req, res) => {
    const { route, color } = req.query;
    try {
        const patterns = [];

        const data = await getPatterns(route);

        data.forEach((item) => {
            const paths = [];
            const stops = [];

            item.pt.forEach((p) => {
                if (p.typ === 'W') {
                    paths.push({ lat: p.lat, lng: p.lon });
                } else if (p.typ === 'S') {
                    stops.push({
                        lat: p.lat,
                        lng: p.lon,
                        name: p.stpnm,
                        id: p.stpid,
                        route,
                    });
                }
            });

            patterns.push({
                fillColor: color,
                strokeColor: color,
                dir: item.dir,
                pid: item.pid,
                route,
                paths,
                stops,
            });
        });

        res.send(patterns);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/predictions', async (req, res) => {
    try {
        let data = await getPredictions(req.query.stop);

        data = data.map((item) => ({
            reqTime: item.tmstmp,
            type: item.typ,
            name: item.stpnm,
            id: item.stpid,
            route: item.rt,
            direction: item.rtdir,
            predTime: item.prdtm,
            delayed: item.dly,
        }));

        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;
