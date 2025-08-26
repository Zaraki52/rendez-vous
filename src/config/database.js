// PostgreSQL database configuration
const { Client } = require("pg")

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "rendez-vous",
  password: "passer",
  port: 5432,
}

// Create a new client instance
const client = new Client(dbConfig)

// Connect to the database
const connectDB = async () => {
  try {
    await client.connect()
    console.log("Connected to PostgreSQL database")
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

// Disconnect from the database
const disconnectDB = async () => {
  try {
    await client.end()
    console.log("Disconnected from PostgreSQL database")
  } catch (error) {
    console.error("Database disconnection error:", error)
  }
}

export { client, connectDB, disconnectDB }
