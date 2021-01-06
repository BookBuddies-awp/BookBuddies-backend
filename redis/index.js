const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  url:
    'redis://:p84552eaa0fd7ef9cf9232e0fe974ba32a406e569c251747bf8677c6875025ac9@ec2-50-17-242-160.compute-1.amazonaws.com:20589',
});

exports.redisGet = promisify(client.get).bind(client);
exports.redisSet = promisify(client.set).bind(client);
