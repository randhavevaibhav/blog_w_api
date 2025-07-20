import { createClient } from "redis";
import { config } from "./utils/config.js";
export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect();
