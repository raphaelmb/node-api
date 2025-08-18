import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { faker } from "@faker-js/faker"
import { hash } from "argon2"

test("create a user", async () => {
  await server.ready()

  const response = await request(server.server)
    .post("/users")
    .set("Content-Type", "application/json")
    .send({ 
      name: faker.person.fullName(), 
      email: faker.internet.email(),
      role: "student",
      password: await hash("12345")
    })

  expect(response.status).toBe(201)
  expect(response.body).toEqual({
    userId: expect.any(String)
  })
})