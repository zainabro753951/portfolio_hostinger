import mysql from "mysql2/promise";
import { configDotenv } from "dotenv";
configDotenv();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  port: 3306,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 sec
  timezone: "Z", // Explicitly UTC (optional, default bhi UTC hota hai)
});

export default pool;
