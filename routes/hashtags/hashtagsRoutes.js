import { Router } from "express";
import hashtagsController from "../../controller/hashtags/index.js";
import {cacheMiddleware} from "../../middleware/cacheMiddleware.js"
import { hashtagRedisKeys } from "../../rediskeygen/hashtags/hashtagRedisKeys.js";
const router = Router();
const { getHashtagsController } = hashtagsController;
const {getHashtagRedisKey} = hashtagRedisKeys()

router.get("/hashtags",cacheMiddleware((req)=>{
return getHashtagRedisKey()
},600),getHashtagsController);

export default router;
