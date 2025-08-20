const { Pool } = require('pg')
require('dotenv').config({override: true}) // Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax

const pool = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432 // The default port
})

module.exports = pool