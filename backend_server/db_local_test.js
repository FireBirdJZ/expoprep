require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
});

async function testDatabaseConnection() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Database connection successful:", res.rows[0]);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    } finally {
        pool.end();
    }
}

// Run test
testDatabaseConnection();
