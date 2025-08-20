import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { eq } from "drizzle-orm";
import { z } from "zod";

export const deleteCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete("/courses/:id", {
    schema: {
      params: z.object({
        id: z.uuid()
      }),
      tags: ["courses"],
      summary: "Delete course by id",
      response: {
        204: z.null(),
        404: z.null()
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const [courseExists] = await db.select().from(courses).where(eq(courses.id, id))
    if (!courseExists) return reply.status(404).send()

    await db.delete(courses).where(eq(courses.id, id))

    return reply.status(204).send()
  })
}
  