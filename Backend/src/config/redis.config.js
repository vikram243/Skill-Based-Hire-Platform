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
  const redisKey = `refreshTokens:${key}`;
  // use a Redis Set to keep multiple refresh tokens per user
  await redis.sAdd(redisKey, token);
  // ensure key has a TTL (expire) so stale tokens are eventually removed
  if (expirySeconds && expirySeconds > 0) {
    await redis.expire(redisKey, expirySeconds);
  }
}

// returns array of tokens (may be empty)
export async function getRefreshToken(key) {
  await connect();
  const redisKey = `refreshTokens:${key}`;
  return await redis.sMembers(redisKey);
}

// delete a specific token when provided, otherwise delete entire set
export async function deleteRefreshToken(key, token) {
  await connect();
  const redisKey = `refreshTokens:${key}`;
  if (token) {
    return await redis.sRem(redisKey, token);
  }
  return await redis.del(redisKey);
}

export async function setSessionId(key, sessionId, expirySeconds = 7 * 24 * 60 * 60) {
  await connect();
  // store session id under session:<key>
  await redis.set(`session:${key}`, sessionId, { EX: expirySeconds });
}

export async function getSessionId(key) {
  await connect();
  return await redis.get(`session:${key}`);
}

export async function deleteSessionId(key) {
  await connect();
  return await redis.del(`session:${key}`);
}

export async function setSessionMeta(key, meta, expirySeconds = 7 * 24 * 60 * 60) {
  await connect();
  const v = typeof meta === 'string' ? meta : JSON.stringify(meta || {});
  await redis.set(`sessionmeta:${key}`, v, { EX: expirySeconds });
}

export async function getSessionMeta(key) {
  await connect();
  const v = await redis.get(`sessionmeta:${key}`);
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch (e) {
    return { raw: v };
  }
}

export async function deleteSessionMeta(key) {
  await connect();
  return await redis.del(`sessionmeta:${key}`);
}

export default redis;
