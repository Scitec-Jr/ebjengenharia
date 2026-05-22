import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

export async function getConnection() {
	return mysql.createConnection({
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "",
		database: process.env.DB_NAME || "ebjengenharia",
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
	});
}
