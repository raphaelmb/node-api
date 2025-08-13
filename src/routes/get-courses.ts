import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { z } from "zod"

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses", {
    schema: {
      tags: ["courses"],
      summary: "Retrieve all courses",
      response: {
        200: z.object({
          courses: z.array(
            z.object({
              id: z.uuid(),
              title: z.string(),
           })
          )
        })
      }
    }
  }, async (request, reply) => {
    const result = await db.select().from(courses)

    return reply.send({ courses: result })
  })
}
