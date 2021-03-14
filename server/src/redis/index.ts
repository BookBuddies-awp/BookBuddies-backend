import { createClient, RedisClient } from 'redis'
import { promisify } from 'util'

const client: RedisClient = createClient({
  url: process.env.REDIS_URL,
});

export const redisGet = promisify(client.get).bind(client);
export const redisSet = promisify(client.set).bind(client);
