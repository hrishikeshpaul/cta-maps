'use strict';

const express = require('express');
const Fuse = require('fuse.js');

const paginate = (array, limit, index) => {
    return array.slice((index - 1) * limit, index * limit);
};

const router = express.Router();

router.get('/closest-stops', (req, res) => {
    
})

module.exports = router;
