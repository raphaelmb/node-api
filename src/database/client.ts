import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import { env } from "../env.ts"

const client = new Client({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle(client, {
  logger: env.NODE_ENV === "development",
})

await client.connect()