import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { users } from "../database/schema.ts"
import { uuid, z } from "zod"

export const createUserRoute: FastifyPluginAsyncZod = async (server) => {
server.post("/users", {
  schema: {
    tags: ["users"],
    summary: "Creates a user",
    body: z.object({
      name: z.string(),
      email: z.email(),
      password: z.string()
    }),
    response: {
      201: z.object({ userId: uuid() }).describe("User created successfully")
    }
  }
}, async (request, reply) => {
  const { name, email, password } = request.body

  const [result] = await db.insert(users).values({ name, email, password }).returning()

  return reply.status(201).send({ userId: result.id })
})
}