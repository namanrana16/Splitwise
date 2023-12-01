const { Pool } = require('pg');

const poolUsers = new Pool({
  host: 'localhost',
  database: 'users',
  user: 'postgres',
  password: 'krypton',
  port: 5432
});

const poolGroups = new Pool({
  host: 'localhost',
  database: 'groups',
  user: 'postgres',
  password: 'krypton',
  port: 5432
});

module.exports = {
  queryUsers: (text, params) => poolUsers.query(text, params),
  queryGroups: (text, params) => poolGroups.query(text, params)
};
