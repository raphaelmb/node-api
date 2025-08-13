import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { uuid, z } from "zod"

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
server.post("/courses", {
  schema: {
    tags: ["courses"],
    summary: "Create a course",
    body: z.object({
      title: z.string().min(5, "Title must have at least 5 characters")
    }),
    response: {
      201: z.object({ courseId: uuid() }).describe("Course created successfully")
    }
  }
}, async (request, reply) => {
  const { title } = request.body

  const [result] = await db.insert(courses).values({ title }).returning()

  return reply.status(201).send({ courseId: result.id })
})
}