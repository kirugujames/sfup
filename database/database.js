import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DB_NAME = process.env.MYSQL_DB || "sfu";
const DB_USER = process.env.MYSQL_USER || "root";
const DB_PASS = process.env.MYSQL_PASSWORD || "maina@254";
const DB_HOST = process.env.MYSQL_HOST || "localhost";
const DB_PORT = process.env.MYSQL_PORT || 3307;

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
    process.exit(1);
  }
}

// Initialize Sequelize after ensuring the database exists
await ensureDatabase();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("Connected to database successfully!");
} catch (error) {
  console.error("Database connection failed:", error);
}

export default sequelize;
