const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'javierpassword',
  host: 'localhost',
  port: 5432,
  database: 'cachureando',
});

module.exports = pool;
