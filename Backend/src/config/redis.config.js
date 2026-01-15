import { createClient } from 'redis';
import config from './config.js';

const redis = createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: config.redis.port
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

let connected = false;
async function connect() {
  if (!connected) {
    await redis.connect();
    connected = true;
  }
}

// Ensure we connect before running any debug commands and handle errors
(async () => {
  try {
    await connect();
    if (config.nodeEnv === "development") {
      try {
        await redis.set('foo', 'bar');
        const result = await redis.get('foo');
        console.log('Redis dev check:', result);
      } catch (e) {
        console.warn('Redis dev check failed', e);
      }
    }
    console.log('✅ Redis connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis', err);
  }
})();

export async function setRefreshToken(key, token, expirySeconds = 7 * 24 * 60 * 60) {
  await connect();
  // store token under key (e.g., userId) with TTL
  await redis.set(key, token, { EX: expirySeconds });
}

export async function getRefreshToken(key) {
  await connect();
  return await redis.get(key);
}

export async function deleteRefreshToken(key) {
  await connect();
  return await redis.del(key);
}

export default redis;
