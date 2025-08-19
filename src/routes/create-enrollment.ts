import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { enrollments } from "../database/schema.ts"
import { uuid, z } from "zod"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { checkUserRole } from "./hooks/check-user-role.ts"
import { validate } from "uuid"
import { eq, and } from "drizzle-orm"

export const createEnrollmentRoute: FastifyPluginAsyncZod = async (server) => {
server.post("/enrollments", {
  preHandler: [checkRequestJWT, checkUserRole("student")],
  schema: {
    tags: ["enrollment"],
    summary: "Creates an enrollment",
    body: z.object({
      courseId: z.uuid()
    }),
    response: {
      201: z.object({ enrollmentId: uuid() }).describe("Enrollment created successfully"),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      409: z.object({ message: z.string(), enrollmentId: z.uuid() })
    }
  }
}, async (request, reply) => {
  const { courseId } = request.body
  const userId = request.user?.sub

  if (!courseId || !validate(courseId)) return reply.status(400).send({ message: 'Invalid or missing course id' });
    
  if (!userId) return reply.status(401).send({ message: 'User not authenticated' });

  if (!validate(userId)) return reply.status(400).send({ message: "Invalid user id" })

  const [existingEnrollment] = await db
    .select()
    .from(enrollments)
    .where(and(
      eq(enrollments.courseId, courseId),
      eq(enrollments.userId, userId)
    ))
    .limit(1);
    
  if (existingEnrollment) return reply.status(409).send({ message: 'User already enrolled in this course', enrollmentId: existingEnrollment.id });

  const [result] = await db.insert(enrollments).values({ userId, courseId }).returning()

  return reply.status(201).send({ enrollmentId: result.id })
  })
}