import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const MYSQL_URL = process.env.MYSQL_URL;

let sequelize;

if (MYSQL_URL) {
  console.log("✅ MYSQL_URL found, connecting to Railway MySQL");
  
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
  console.log("⚠️  MYSQL_URL not found, using local configuration");
  
  const DB_NAME = process.env.MYSQL_DB || "sfu";
  const DB_USER = process.env.MYSQL_USER || "root";
  const DB_PASS = process.env.MYSQL_PASSWORD || "maina@254";
  const DB_HOST = process.env.MYSQL_HOST || "localhost";
  const DB_PORT = process.env.MYSQL_PORT || 3307;

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
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
}

// Test the connection
try {
  await sequelize.authenticate();
  console.log("Database connected successfully!");
} catch (error) {
  console.error("Database connection failed:", error.message);
  // Don't throw - let the app handle it gracefully
}

export default sequelize;