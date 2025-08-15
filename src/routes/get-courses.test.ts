import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { faker } from "@faker-js/faker"
import { makeCourse } from "../tests/factories/make-course.ts"
import { randomUUID } from "node:crypto"

test("get courses", async () => {
  await server.ready()

  const titleId = randomUUID()

  const course = await makeCourse(titleId)

  const response = await request(server.server)
    .get(`/courses?search=${titleId}`)

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    total: expect.any(Number),
    courses: [
      {
        id: expect.any(String),
        title: course.title,
        enrollments: 0
      }
    ]
  })
})