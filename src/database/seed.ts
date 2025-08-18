import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"
import { faker } from "@faker-js/faker"
import { hash } from "argon2"

(async () => {
  const passwordHash = await hash("123456")

  const usersInsert = await db.insert(users).values([
    { 
      name: faker.person.fullName(), 
      email: faker.internet.email(), 
      role: "student",
      password: passwordHash
    },
    { 
      name: faker.person.fullName(), 
      email: faker.internet.email(), 
      role: "student",
      password: passwordHash
    },
    { 
      name: faker.person.fullName(), 
      email: faker.internet.email(), 
      role: "student",
      password: passwordHash
    },
  ]).returning()

  const coursesInsert = await db.insert(courses).values([
    { title: faker.lorem.words(4)},
    { title: faker.lorem.words(4)},
  ]).returning()

  await db.insert(enrollments).values([
    { courseId: coursesInsert[0].id, userId: usersInsert[0].id },
    { courseId: coursesInsert[0].id, userId: usersInsert[1].id },
    { courseId: coursesInsert[1].id, userId: usersInsert[2].id },
  ])

  await db.$client.end()
})()
