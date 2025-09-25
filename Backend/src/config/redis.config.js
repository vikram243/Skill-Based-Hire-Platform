import { createClient } from 'redis'
import config from './config.js'

const redis = createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: config.redis.port
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

// Remove it on production this is only for dbug
if(config.nodeEnv == "development"){
  await redis.set('foo', 'bar');
  const result = await redis.get('foo');
  console.log(result)
}

console.log('✅ Redis connected successfully')

export default redis