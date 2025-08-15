import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeCourse } from "../tests/factories/make-course.ts"

test("delete course", async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)

  expect(response.status).toBe(204)
})