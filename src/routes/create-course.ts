import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { uuid, z } from "zod"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { checkUserRole } from "./hooks/check-user-role.ts"
import { eq } from "drizzle-orm"

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
server.post("/courses", {
  preHandler: [checkRequestJWT, checkUserRole("manager")],
  schema: {
    tags: ["courses"],
    summary: "Creates a course",
    body: z.object({
      title: z.string().min(5, "Title must have at least 5 characters")
    }),
    response: {
      201: z.object({ courseId: uuid() }).describe("Course created successfully"),
      409: z.object({ message: z.string() })
    }
  }
}, async (request, reply) => {
  const { title } = request.body

  const [courseExists] = await db.select().from(courses).where(eq(courses.title, title))
  if (courseExists) return reply.status(409).send({ message: "Title already registered" })

  const [result] = await db.insert(courses).values({ title }).returning()

  return reply.status(201).send({ courseId: result.id })
})
}