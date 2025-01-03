// require("dotenv").config({ path: ".env.local" }); //local testing env
require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const {Pool} = require("pg");
const chrono = require("chrono-node");
const cors = require("cors");
const { isValidTimezone, parseDateInput } = require("./app_helpers");

// index.use(cors(
//     {
//         origin: "",
//     }
// ));

app.use(cors(
));

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Howdy");
});


// Endpoint to fetch data with optional date range and timezone
app.get("/data", async (req, res) => {
    const timezone = req.query.timezone || "UTC";
    const startInput = req.query.start;
    const endInput = req.query.end;

    // First validate timezone
    if (!isValidTimezone(timezone)) {
        return res.status(400).json({
            success: false,
            message: `Invalid timezone: ${timezone}. Please provide a valid timezone.`,
        });
    }

    try {
        // Validate start date
        let start = null;
        if (startInput) {
            try {
                start = parseDateInput(startInput);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid start date: "${startInput}". Please provide a valid date format (e.g., YYYY-MM-DD, MM-DD-YYYY).`
                });
            }
        }

        // Validate end date
        let end = null;
        if (endInput) {
            try {
                end = parseDateInput(endInput);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid end date: "${endInput}". Please provide a valid date format (e.g., YYYY-MM-DD, MM-DD-YYYY).`
                });
            }
        }

        // Validate date range if both dates are provided
        if (start && end && new Date(start) > new Date(end)) {
            return res.status(400).json({
                success: false,
                message: `Invalid date range: Start date (${startInput}) cannot be after end date (${endInput}).`
            });
        }

        let query = `
            SELECT
                id,
                timestamp,
                to_char(timestamp AT TIME ZONE $1, 'YYYY-MM-DD HH24:MI:SS.US') AS local_time,
                fridge_kwh,
                oven_kwh,
                lights_kwh,
                ev_charger_kwh
            FROM energy_consumption
            WHERE 1=1
        `;
        const params = [timezone];

        if (start) {
            query += ` AND timestamp >= (($${params.length + 1})::timestamp AT TIME ZONE 'UTC' AT TIME ZONE $1)::date AT TIME ZONE $1 AT TIME ZONE 'UTC'`;
            params.push(start);
        }
        if (end) {
            query += ` AND timestamp < ((($${params.length + 1})::timestamp AT TIME ZONE 'UTC' AT TIME ZONE $1)::date + INTERVAL '1 day') AT TIME ZONE $1 AT TIME ZONE 'UTC'`;
            params.push(end);
        }

        query += ` ORDER BY timestamp;`;

        const client = await pool.connect();
        const { rows } = await client.query(query, params);
        client.release();

        // Check if no data was found
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No data found for the specified date range${start ? ` from ${new Date(start).toLocaleDateString()}` : ''}${end ? ` to ${new Date(end).toLocaleDateString()}` : ''}.`
            });
        }

        res.json({
            success: true,
            data: rows,
            message: `Data fetched in ${timezone} timezone${start || end ? ` from ${start || 'start'} to ${end || 'now'}` : ''}`,
        });
    } catch (error) {
        console.error("Error querying data:", error);
        // Only return generic error for unexpected errors
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while processing your request. Please try again or contact support if the issue persists."
        });
    }
});


// Endpoint that gets the first and last UTC timestamps in the database
app.get("/data/range", async (req, res) => {
    try {
        const client = await pool.connect();
        const query = `
            SELECT
                MIN(timestamp) AS start_timestamp,
                MAX(timestamp) AS end_timestamp
            FROM energy_consumption;
        `;

        const { rows } = await client.query(query);
        client.release();

        res.json({
            success: true,
            range: rows[0],
            message: "Start and end timestamps retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching range:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});



