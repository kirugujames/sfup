import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Try individual variables first (Railway V2 approach)
const DB_HOST = process.env.MYSQL_HOST;
const DB_PORT = process.env.MYSQL_PORT || 3306;
const DB_USER = process.env.MYSQL_USER;
const DB_PASS = process.env.MYSQL_PASSWORD;
const DB_NAME = process.env.MYSQL_DATABASE || process.env.MYSQL_DB;

// Fallback to MYSQL_URL if available
const MYSQL_URL = process.env.MYSQL_URL;

let sequelize;

if (DB_HOST && DB_USER && DB_PASS && DB_NAME) {
  console.log("✅ Using individual MySQL environment variables");
  console.log(`📍 Connecting to: ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else if (MYSQL_URL) {
  console.log("✅ Using MYSQL_URL connection string");
  
  sequelize = new Sequelize(MYSQL_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  console.log("⚠️  No MySQL config found, using local development defaults");
  
  sequelize = new Sequelize("sfu", "root", "maina@254", {
    host: "localhost",
    port: 3307,
    dialect: "mysql",
    logging: false,
  });
}

// Test the connection
try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully!");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  console.error("Please check your database configuration and ensure MySQL service is running");
}

export default sequelize;