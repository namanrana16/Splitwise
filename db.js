const { Pool } = require('pg');

const pool = new Pool({
  user: 'pranshu.chandra',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
