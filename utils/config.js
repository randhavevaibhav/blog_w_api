import dotenv from "dotenv";
import { PORT } from "./constants.js";

dotenv.config();

const environments = {
  PROD: {
    DB_URL: process.env.DB_REMOTE_URL,
    API_URL: process.env.API_URL,
  },
  DEV: {
    DB_URL: process.env.DB_LOCAL_URL,
    API_URL: `http://localhost:${PORT}`,
  },
  TEST: {
    DB_URL: process.env.DB_TEST_URL,
  },
};

export const config = environments[process.env.ENV];
