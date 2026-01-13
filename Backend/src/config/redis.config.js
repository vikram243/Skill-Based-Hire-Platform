import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redis = createClient({ url: REDIS_URL });

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

let connected = false;
async function connect() {
  if (!connected) {
    await redis.connect();
    connected = true;
  }
}

// Remove it on production this is only for dbug
if(config.nodeEnv == "development"){
  await redis.set('foo', 'bar');
  const result = await redis.get('foo');
  console.log(result)
}
console.log('✅ Redis connected successfully')

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
