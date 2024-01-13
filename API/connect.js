import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const connectDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "social_app",
});

export default connectDB;
