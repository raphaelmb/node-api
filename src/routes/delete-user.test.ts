import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeUser } from "../tests/factories/make-user.ts"

test("delete user", async () => {
  await server.ready()

  const { user } = await makeUser()

  const response = await request(server.server)
    .delete(`/users/${user.id}`)

  expect(response.status).toBe(204)
})