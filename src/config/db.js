import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "javierpassword",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

// console.log(pool);
export default pool;