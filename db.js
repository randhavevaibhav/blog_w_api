import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { config } from "./utils/config.js";


const sequelize = new Sequelize({
  dialect: PostgresDialect,
  url: config.DB_URL,
});

export default sequelize;
