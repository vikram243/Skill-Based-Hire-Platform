import redisClient from '../config/redis.config.js';

const LEAKY_BUCKET_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local capacity = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

local data = redis.call('HMGET', key, 'tokens', 'last')
local tokens = tonumber(data[1]) or 0
local last = tonumber(data[2]) or now
local elapsed = math.max(0, now - last)
local leaked = elapsed * rate
tokens = math.max(0, tokens - leaked)

local allowed = 0
if tokens + 1 <= capacity then
  tokens = tokens + 1
  allowed = 1
  last = now
end

redis.call('HMSET', key, 'tokens', tokens, 'last', last)
redis.call('EXPIRE', key, ttl)
return {allowed, tokens, capacity}
`;

const inMemoryBuckets = new Map();

function computeBucketState(bucket, now, rate, capacity) {
  const elapsed = Math.max(0, now - bucket.last);
  const leaked = elapsed * rate;
  let tokens = Math.max(0, bucket.tokens - leaked);
  let allowed = 0;
  if (tokens + 1 <= capacity) {
    tokens += 1;
    allowed = 1;
    bucket.last = now;
  }
  bucket.tokens = tokens;
  return { allowed, tokens };
}

export function leakyBucketRateLimiter(options = {}) {
  const {
    maxRequests = 100,
    windowMs = 5 * 60 * 1000,
    getIdentifier = (req) => req.ip,
    message = 'Too many requests, please try again later.',
  } = options;

  const rate = maxRequests / windowMs;
  const ttlSeconds = Math.ceil(windowMs / 1000) + 1;
  const headerLimit = maxRequests;

  return async function rateLimitMiddleware(req, res, next) {
    const identifier = getIdentifier(req);
    const key = `leakybucket:${identifier}`;
    const now = Date.now();

    try {
      const result = await redisClient.eval(LEAKY_BUCKET_LUA, {
        keys: [key],
        arguments: [now.toString(), rate.toString(), maxRequests.toString(), ttlSeconds.toString()],
      });

      const allowed = Number(result[0]);
      const tokens = Number(result[1]);
      const capacity = Number(result[2]);
      const remaining = Math.max(0, Math.floor(capacity - tokens));
      const resetSeconds = Math.ceil(tokens / rate / 1000);

      res.set('X-RateLimit-Limit', headerLimit);
      res.set('X-RateLimit-Remaining', remaining);
      res.set('X-RateLimit-Reset', resetSeconds);

      if (!allowed) {
        return res.status(429).json({
          success: false,
          message,
          error: 'Rate limit exceeded',
        });
      }

      return next();
    } catch (err) {
      console.warn('Redis leaky bucket error, falling back to in-memory rate limiting:', err?.message || err);

      const bucket = inMemoryBuckets.get(key) || { tokens: 0, last: now };
      const { allowed, tokens } = computeBucketState(bucket, now, rate, maxRequests);
      inMemoryBuckets.set(key, bucket);

      const remaining = Math.max(0, Math.floor(maxRequests - tokens));
      const resetSeconds = Math.ceil(tokens / rate / 1000);

      res.set('X-RateLimit-Limit', headerLimit);
      res.set('X-RateLimit-Remaining', remaining);
      res.set('X-RateLimit-Reset', resetSeconds);

      if (!allowed) {
        return res.status(429).json({
          success: false,
          message,
          error: 'Rate limit exceeded',
        });
      }

      return next();
    }
  };
}
