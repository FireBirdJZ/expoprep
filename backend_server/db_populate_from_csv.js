require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const csv = require("csv-parser");
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


async function createTable() {
    let client;
    try {
        client = await pool.connect();
        const query = `
            CREATE TABLE IF NOT EXISTS energy_consumption (
                                                              id SERIAL PRIMARY KEY,
                                                              timestamp TIMESTAMP WITH TIME ZONE NOT NULL,  -- Changed to TIMESTAMPTZ
                                                              fridge_kwh FLOAT,
                                                              oven_kwh FLOAT,
                                                              lights_kwh FLOAT,
                                                              ev_charger_kwh FLOAT
            );
        `;
        await client.query(query);
        console.log("Table created successfully");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        if (client) client.release();
    }
}

async function dropTable() {
    let client;
    try {
        client = await pool.connect();
        await client.query('DROP TABLE IF EXISTS energy_consumption;');
        console.log("Table 'energy_consumption' dropped.");
    } catch (error) {
        console.error("Error dropping table:", error);
    } finally {
        if (client) {
            client.release();
            pool.end();
        }
    }
}

/**
 * Checks if the CSV file exists at the specified path.
 */
function checkCSVPath() {
    const filePath = "mock_energy_consumption.csv";
    if (fs.existsSync(filePath)) {
        console.log(`CSV file found at: ${filePath}`);
    } else {
        console.log(`CSV file NOT found at: ${filePath}`);
    }
}

/**
 * Shows the first 5 rows in the 'energy_consumption' table.
 */
async function queryTable() {
    let client;
    try {
        client = await pool.connect();
        const res = await client.query("SELECT * FROM energy_consumption LIMIT 5;");
        console.log("First 5 rows in 'energy_consumption':", res.rows);
    } catch (error) {
        console.error("Error querying the table:", error);
    } finally {
        if (client) client.release();
    }
}

/**
 * Inspects the table structure (columns, data types, etc.).
 */
async function checkTableStructure() {
    let client;
    try {
        client = await pool.connect();
        const columnQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'energy_consumption'
      ORDER BY ordinal_position;
    `;
        const { rows } = await client.query(columnQuery);
        console.log("Table 'energy_consumption' structure:\n", rows);
    } catch (error) {
        console.error("Error checking table structure:", error);
    } finally {
        if (client) client.release();
    }
}

/**
 * Reads the CSV file and populates the `energy_consumption` table with rows
 * exactly as in the CSV, maintaining local timestamps.
 */
async function populateDatabase() {
    let client;
    try {
        client = await pool.connect();
        const filePath = "mock_energy_consumption.csv";
        const data = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row) => data.push(row))
                .on("end", resolve)
                .on("error", reject);
        });

        await client.query("BEGIN");

        // Fixed insert query syntax
        const insertQuery = `
            INSERT INTO energy_consumption
                (timestamp, fridge_kwh, oven_kwh, lights_kwh, ev_charger_kwh)
            VALUES (
                       ($1 || ' Europe/Oslo')::timestamptz,
                       $2, $3, $4, $5
                   );
        `;

        for (const row of data) {
            const {
                Timestamp,
                "Fridge (kWh)": fridge,
                "Oven (kWh)": oven,
                "Lights (kWh)": lights,
                "EV Charger (kWh)": ev,
            } = row;

            await client.query(insertQuery, [
                Timestamp,
                parseFloat(fridge) || 0,
                parseFloat(oven) || 0,
                parseFloat(lights) || 0,
                parseFloat(ev) || 0,
            ]);
        }

        await client.query("COMMIT");
        console.log("Data inserted successfully");
    } catch (error) {
        console.error("Error:", error);
        if (client) await client.query("ROLLBACK");
    } finally {
        if (client) client.release();
        pool.end();
    }
}

async function queryOsloTimes() {
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT
                id,
                timestamp,  -- Stored as TIMESTAMPTZ (UTC under the hood)
                to_char(timestamp AT TIME ZONE 'Europe/Oslo', 'YYYY-MM-DD HH24:MI:SS.US')
                AS local_time_oslo_str,
                fridge_kwh,
                oven_kwh,
                lights_kwh,
                ev_charger_kwh
            FROM energy_consumption
            ORDER BY timestamp
                LIMIT 10;
        `;

        const { rows } = await client.query(query);
        console.log("\n=== Norway (Oslo) Timezone Data ===");
        console.log(rows);
    } catch (error) {
        console.error("Error querying Oslo times:", error);
    } finally {
        if (client) client.release();
    }
}

// ---------------------------------------------------------------------------
// New function to query the first 10 rows with local Chicago time as a string
async function queryChicagoTimes() {
    let client;
    try {
        client = await pool.connect();
        const query = `
      SELECT
        id,
        timestamp,  -- Stored as TIMESTAMPTZ (UTC under the hood)
        to_char(timestamp AT TIME ZONE 'America/Chicago', 'YYYY-MM-DD HH24:MI:SS.US')
          AS local_time_chicago_str,
        fridge_kwh,
        oven_kwh,
        lights_kwh,
        ev_charger_kwh
      FROM energy_consumption
      ORDER BY timestamp
      LIMIT 10;
    `;

        const { rows } = await client.query(query);
        console.log("\n=== Chicago Timezone Data ===");
        console.log(rows);
    } catch (error) {
        console.error("Error querying Chicago times:", error);
    } finally {
        if (client) client.release();
    }
}

// ---------------------------------------------------------------------------
// Test both time zones in one go
async function testTimeZones() {
    try {
        await queryOsloTimes();
        await queryChicagoTimes();
    } catch (error) {
        console.error("Error testing timezones:", error);
    } finally {
        pool.end();
    }
}







// Example usage
// dropTable();
// createTable();         // 2) Create table if not exists
// checkCSVPath();             // 3) Check CSV path
// checkTableStructure(); // 4) Check columns
// populateDatabase();    // 5) Insert CSV data as-is
// queryTable();          // 6) Show first 5 rows
testTimeZones();

