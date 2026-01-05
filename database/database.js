import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Railway provides MYSQL_URL, parse it or use individual vars
const MYSQL_URL = process.env.MYSQL_URL;

let DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT;

if (MYSQL_URL) {
  // Parse Railway's MYSQL_URL (format: mysql://user:pass@host:port/dbname)
  const url = new URL(MYSQL_URL);
  DB_USER = url.username;
  DB_PASS = url.password;
  DB_HOST = url.hostname;
  DB_PORT = url.port || 3306;
  DB_NAME = url.pathname.substring(1); // Remove leading '/'
} else {
  // Fallback to individual environment variables
  DB_NAME = process.env.MYSQL_DATABASE || process.env.MYSQL_DB || "sfu";
  DB_USER = process.env.MYSQL_USER || "root";
  DB_PASS = process.env.MYSQL_PASSWORD || "maina@254";
  DB_HOST = process.env.MYSQL_HOST || "localhost";
  DB_PORT = process.env.MYSQL_PORT || 3307;
}

// Create the database if it doesn't exist
async function ensureDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      port: DB_PORT,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database "${DB_NAME}" is ready.`);
    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error);
    throw error; // Don't exit, let Railway handle restarts
  }
}

// Initialize Sequelize after ensuring the database exists
await ensureDatabase();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

try {
  await sequelize.authenticate();
  console.log("Connected to database successfully!");
} catch (error) {
  console.error("Database connection failed:", error);
  throw error;
}

export default sequelize;