
import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';



// export default {
//     query: (text, params) => pool.query(text, params),
//     connect:()=>pool.connect()
//   }
// import { Sequelize } from '@sequelize/core';
// import { PostgresDialect } from '@sequelize/postgres';
// import { Users } from './model/users.js';


 const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'blog_app',
  user: 'test',
  password: 'test',
  host: 'localhost',
  port: 5432,
  sync:true
});


export default sequelize;