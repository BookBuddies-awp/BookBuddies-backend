"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisSet = exports.redisGet = void 0;
const redis_1 = require("redis");
const util_1 = require("util");
const client = redis_1.createClient({
    url: process.env.REDIS_URL,
});
exports.redisGet = util_1.promisify(client.get).bind(client);
exports.redisSet = util_1.promisify(client.set).bind(client);
//# sourceMappingURL=index.js.map