import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { faker } from "@faker-js/faker"
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts"

test("create a course", async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser("manager")

  const response = await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ title: faker.lorem.words(4) })

  expect(response.status).toBe(201)
  expect(response.body).toEqual({
    courseId: expect.any(String)
  })
})

test("same title error", async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser("manager")

  await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ title: "test-title" })

  const response = await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ title: "test-title" })

  expect(response.status).toBe(409)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})