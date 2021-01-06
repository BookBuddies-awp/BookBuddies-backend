const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: 'bookbuddies-redis.keiqgf.ng.0001.aps1.cache.amazonaws.com',
  port: '6379',
});

exports.redisGet = promisify(client.get).bind(client);
exports.redisSet = promisify(client.set).bind(client);
