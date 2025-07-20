import { redisClient } from "../redis.js";

export const cacheMiddleware =
  (keyGenFn, ttl = 60) =>
  async (req, res, next) => {
    const key = keyGenFn(req);
    const cached = await redisClient.get(key);
    if (cached) {
      console.log("serving from cache");
      return res.json(JSON.parse(cached));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      await redisClient.setEx(key, ttl, JSON.stringify(body));
      res.sendResponse(body);
    };

    next();
  };
