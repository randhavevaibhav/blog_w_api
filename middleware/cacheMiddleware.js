import { redisClient } from "../utils/redis.js";

export const cacheMiddleware =
  (keyGenFn, ttl = 60) =>
  async (req, res, next) => {
    const key = keyGenFn(req);
    const cached = await redisClient.get(key);

    if (cached) {
      return res.json(cached);
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      // Cache only if response is successful (status code 200–299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await redisClient.setex(key, ttl, JSON.stringify(body));
      }
      res.sendResponse(body);
    };

    next();
  };
