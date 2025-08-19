import { test, expect } from "vitest"
import request from "supertest"
import { server } from "../app.ts"
import { makeAuthenticatedUser, makeUser } from "../tests/factories/make-user.ts"
import { makeCourse } from "../tests/factories/make-course.ts"

test("create an enrollment", async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser("student")
  const { id } = await makeCourse()

  const response = await request(server.server)
    .post("/enrollments")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ courseId: id })

  expect(response.status).toBe(201)
  expect(response.body).toEqual({
    enrollmentId: expect.any(String)
  })
})

test("course id missing", async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser("student")

  const response = await request(server.server)
    .post("/enrollments")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({})

  expect(response.status).toBe(400)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})

test("course id not uuid format", async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser("student")

  const response = await request(server.server)
    .post("/enrollments")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ courseId: "1234" })

  expect(response.status).toBe(400)
  expect(response.body).toEqual({
    message: expect.any(String)
  })
})

test("already enrolled", async () => {
    await server.ready()
    const { token } = await makeAuthenticatedUser("student")
    const { id } = await makeCourse()
    
    await request(server.server)
      .post("/enrollments")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ courseId: id })
    
    const response = await request(server.server)
      .post("/enrollments")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ courseId: id })
      
    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: expect.any(String),
      enrollmentId: expect.any(String)
    })
  })