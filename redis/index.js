const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({ port: 6379 });

exports.redisGet = promisify(client.get).bind(client);
exports.redisSet = promisify(client.set).bind(client);