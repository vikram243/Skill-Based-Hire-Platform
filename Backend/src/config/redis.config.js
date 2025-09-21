import Redis from "ioredis";
import config from "./config.js";

// connect to redis
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;