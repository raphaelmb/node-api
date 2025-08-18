import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { eq } from "drizzle-orm";
import { z } from "zod"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";

export const getCoursesByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses/:id", {
    preHandler: [checkRequestJWT],
    schema: {
      params: z.object({
        id: z.uuid()
      }),
      tags: ["courses"],
      summary: "Retrieve course by id",
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          })
        }),
        404: z.null().describe("Course not found")
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const [course] = await db.select().from(courses).where(eq(courses.id, id))

    if (!course) return reply.status(404).send()

    return reply.send({ course })
  })
}