'use strict';

import NodeCache from 'node-cache';

export class Cache {
    constructor(ttl) {
        this.cache = new NodeCache({ stdTTL: ttl, checkperiod: ttl * 0.2, useClones: false });
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        return this.cache.set(key, value);
    }

    log_hit(key) {
        console.info(`Cache Hit - [${key}]`);
    }

    log_miss(key) {
        console.info(`Cache Miss - [${key}]`);
    }
}
