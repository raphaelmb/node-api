import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses, users } from "../database/schema.ts"
import { eq } from "drizzle-orm";
import { z } from "zod"

export const getUserByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/users/:id", {
    schema: {
      params: z.object({
        id: z.uuid()
      }),
      tags: ["users"],
      summary: "Retrieve user by id",
      response: {
        200: z.object({
          user: z.object({
            id: z.uuid(),
            name: z.string(),
            email: z.email()
          })
        }),
        404: z.null().describe("User not found")
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const [user] = await db.select().from(users).where(eq(users.id, id))

    if (!user) return reply.status(404).send()

    return reply.send({ user })
  })
}