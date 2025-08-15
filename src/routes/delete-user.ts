import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { users } from "../database/schema.ts"
import { eq } from "drizzle-orm";
import { z } from "zod";

export const deleteUserRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete("/users/:id", {
    schema: {
      params: z.object({
        id: z.uuid()
      }),
      tags: ["users"],
      summary: "Delete user by id",
      response: {
        204: z.null(),
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    await db.delete(users).where(eq(users.id, id))

    return reply.status(204).send()
  })
}
  