import dotenv from "dotenv";

dotenv.config();

const environments = {
  PROD: {
    DB_URL: process.env.DB_REMOTE_URL,
    REDIS_URL: process.env.REDIS_URL,
  },
  DEV: {
    DB_URL: process.env.DB_LOCAL_URL,
    REDIS_URL: process.env.REDIS_LOCAL_URL,
  },
};

export const config = environments[process.env.ENV];
