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
        this.cache.set(key, value);
        this.log_stats();
    }

    log_stats() {
        console.info(this.cache.getStats());
    }

    log_hit(key) {
        this.log_stats();
        console.info(`Cache Hit - [${key}]`);
    }

    log_miss(key) {
        console.info(`Cache Miss - [${key}]`);
    }
}
