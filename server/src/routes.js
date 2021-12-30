'use strict';

import express from 'express';
import { getPatterns, getRoutes, getVehicles, getPredictions, getGitHubWorkflow } from './util.js';

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

const convertTimestamp = (timestamp) => {
    const [date, time] = timestamp.split(' ');
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time}`;
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

        data = data.map((item) => {
            const predTime = convertTimestamp(item.prdtm);
            const reqTime = convertTimestamp(item.tmstmp);
            const diff = Math.round((new Date(predTime) - new Date(reqTime)) / 60000);

            return {
                type: item.typ,
                name: item.stpnm,
                stopId: item.stpid,
                id: item.vid,
                route: item.rt,
                direction: item.rtdir,
                time: diff,
                timestamp: new Date(predTime).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
                delayed: item.dly,
            };
        });

        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/app-status', async (req, res) => {
    try {
        const data = await getGitHubWorkflow();

        const response = {
            web: {
                conclusion: data.web.workflow_runs[0].conclusion,
                status: data.web.workflow_runs[0].status,
            },
            server: {
                conclusion: data.server.workflow_runs[0].conclusion,
                status: data.server.workflow_runs[0].status,
            },
        };
        res.send(response);
    } catch (err) {
        res.status(400).send('Failed to update app status');
    }
});

export default router;
