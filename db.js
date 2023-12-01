const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'postgres',
  user: 'postgres',
  password: 'krypton',
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
