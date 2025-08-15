import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(client, {
  logger: process.env.NODE_ENV === "development",
})

await client.connect()