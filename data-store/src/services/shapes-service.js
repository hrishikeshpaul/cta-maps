'use strict';

const Shape = require('../models/shapes');
const Logger = require('../utils/logger');

const insertShapes = async (shapesData, db) => {
    const logger = new Logger('insertShapes');
    logger.begin();

    try {
        await db.dropCollection('shapes');

        const groupByShapeId = shapesData.reduce((acc, shape) => {
            if (!acc[shape.shape_id]) {
                acc[shape.shape_id] = {
                    id: shape.shape_id,
                    seq: [],
                };
            }

            acc[shape.shape_id].seq.push({
                id: `${shape.shape_id}-${shape.shape_pt_sequence}`,
                lat: parseFloat(shape.shape_pt_lat),
                lng: parseFloat(shape.shape_pt_lon),
                distanceTravelled: parseFloat(shape.shape_dist_traveled),
            });

            return acc;
        }, {});

        const shapes = Object.values(groupByShapeId).map((shape) => shape);

        await Shape.insertMany(shapes);

        logger.success();
    } catch (err) {
        logger.fail();
        throw err;
    }
};

module.exports = {
    insertShapes,
};
