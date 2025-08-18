import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeUser } from "../tests/factories/make-user.ts"

test("login", async () => {
  await server.ready()

  const { user, passwordBeforeHash } = await makeUser()

  const response = await request(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({ email: user.email, password: passwordBeforeHash })

  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    token: expect.any(String)
  })
})

test("Missing email failed login", async () => {
  await server.ready()

  const { passwordBeforeHash } = await makeUser()

  const response = await request(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({ email: "invalid@gmail.com", password: passwordBeforeHash })

  expect(response.status).toBe(400)
  expect(response.body).toEqual({
    message: "Invalid credentials"
  })
})

test("Wrong password failed login", async () => {
  await server.ready()

  const { user } = await makeUser()

  const response = await request(server.server)
    .post("/sessions")
    .set("Content-Type", "application/json")
    .send({ email: user.email, password: "wrongpass" })

  expect(response.status).toBe(400)
  expect(response.body).toEqual({
    message: "Invalid credentials"
  })
})