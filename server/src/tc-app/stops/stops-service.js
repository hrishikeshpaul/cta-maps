'use strict';

const Stops = require('../../utils/db/schemas/stops-schema');

const milesToRadian = (miles) => {
    var earthRadiusInMiles = 3963.2;
    return miles / earthRadiusInMiles;
};

const getClosestStops = () => {
    const currentLocation = [41.865808, -87.623225];

    return Stops.aggregate([
        {
            $geoNear: {
                near: currentLocation,
                distanceField: 'distance',
                maxDistance: 0.05 / 3963.2,
                spherical: true,
                distanceMultiplier: 3963.2,
            },
        },
        {
            $project: {
                _id: 0,
                name: 1,
                location: 1,
                distance: 1,
            },
        },
        {
            $sort: {
                dist: 1,
            },
        },
    ]);

    // return Stops.find({
    //     location: {
    //         $geoWithin: {
    //             $centerSphere: [currentLocation, milesToRadian(0.05)],
    //         },
    //     },
    //     // location: {
    //     //     $nearSphere: {
    //     //         $geometry: {
    //     //             type: 'Point',
    //     //             coordinates: currentLocation,
    //     //         },
    //     //         $maxDistance: 0.06 * 1609.34, // in meters. 0.2 miles
    //     //     },
    //     // },
    // });
};

module.exports = {
    getClosestStops,
};
