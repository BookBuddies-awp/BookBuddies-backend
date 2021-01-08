const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

exports.redisGet = promisify(client.get).bind(client);
exports.redisSet = promisify(client.set).bind(client);
