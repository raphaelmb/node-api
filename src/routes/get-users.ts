import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses, enrollments, users } from "../database/schema.ts"
import { z } from "zod"
import { eq, and, asc, ilike, SQL, count } from "drizzle-orm"

export const getUsersRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/users", {
    schema: {
      tags: ["users"],
      summary: "Retrieve all users",
      // querystring: z.object({
        // search: z.string().optional(),
        // orderBy: z.enum(["title"]).optional().default("title"),
        // page: z.coerce.number().optional().default(1)
      // }),
      response: {
        200: z.object({
          users: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              email: z.email()
           })
          ),
          // total: z.number()
        })
      }
    }
  }, async (request, reply) => {
    // const { search, orderBy, page } = request.query

    // const conditions: SQL[] = []

    // if (search) {
      // conditions.push(ilike(users.name, `%${search}%`))
    // }

    // const [result, total] = await Promise.all([
      // db
        // .select({
          // id: users.id,
          // users: users.name,
          // email: count(enrollments.id)
        // })
        // .from(users)
        // .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
        // .orderBy(asc(courses[orderBy]))
        // .offset((page - 1) * 2)
        // .limit(10)
        // .where(and(...conditions))
        // .groupBy(courses.id),
      // db.$count(courses, and(...conditions))
    // ])

    const result = await db.select().from(users)

    return reply.send({ users: result })
  })
}
