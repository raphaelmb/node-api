import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeCourse } from "../tests/factories/make-course.ts"
import { randomUUID } from "node:crypto"

test("delete course", async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)

  expect(response.status).toBe(204)
})

test("course not found", async () => {
  await server.ready()

  const response = await request(server.server)
    .delete(`/courses/${randomUUID()}`)

  expect(response.status).toBe(404)
})