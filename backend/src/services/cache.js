const Redis = require("ioredis");
const logger = require("./logger");

const memoryStore = new Map();
let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on("error", (err) => {
    logger.warn("Redis error", { err: err.message });
  });
}

function buildKey(key) {
  return `flowmaster:${key}`;
}

async function get(key) {
  const namespaced = buildKey(key);
  if (redis) {
    const value = await redis.get(namespaced);
    return value ? JSON.parse(value) : null;
  }

  const entry = memoryStore.get(namespaced);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    memoryStore.delete(namespaced);
    return null;
  }
  return entry.value;
}

async function set(key, value, ttlSeconds) {
  const namespaced = buildKey(key);
  if (redis) {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(namespaced, payload, "EX", ttlSeconds);
      return;
    }
    await redis.set(namespaced, payload);
    return;
  }

  const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
  memoryStore.set(namespaced, { value, expiresAt });
}

async function del(key) {
  const namespaced = buildKey(key);
  if (redis) {
    await redis.del(namespaced);
    return;
  }
  memoryStore.delete(namespaced);
}

module.exports = { get, set, del };
