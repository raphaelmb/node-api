import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { randomUUID } from "node:crypto"
import { makeUser } from "../tests/factories/make-user.ts"

test("get user by id", async () => {
  await server.ready()

  const user = await makeUser()

  const response = await request(server.server)
    .get(`/users/${user.id}`)

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    user: {
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String)
    }
  })
})

test("return 404 for non existing user", async () => {
  await server.ready()

  const response = await request(server.server)
    .get(`/users/${randomUUID()}`)

  expect(response.status).toBe(404)
})