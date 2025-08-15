import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeUser } from "../tests/factories/make-user.ts"

const userSchema = {
  id: expect.any(String),
  name: expect.any(String),
  email: expect.any(String)
}

type User = {
  id: string;
  name: string;
  email: string;
}


test("get users", async () => {
  await server.ready()

  await makeUser()

  const response = await request(server.server)
    .get("/users")

  expect(response.status).toBe(200)
  expect(Array.isArray(response.body.users)).toBe(true)
  expect(response.body).toHaveProperty("users")
  response.body.users.forEach((user: User) => expect(user).toEqual(expect.objectContaining(userSchema)))
})