import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { users } from "../database/schema.ts"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { verify } from "argon2"
import jwt from "jsonwebtoken"


export const loginRoute: FastifyPluginAsyncZod = async (server) => {

server.post("/sessions", {
  schema: {
    tags: ["auth"],
    summary: "Login",
    body: z.object({
      email: z.string(),
      password: z.string()
    }),
    response: {
      200: z.object({ token: z.string() }),
      400: z.object({ message: z.string() })
    }
  }
}, async (request, reply) => {
  const { email, password } = request.body

  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (!user) return reply.status(400).send({ message: "Invalid credentials" })

  const doesPasswordMatch = await verify(user.password, password)

  if (!doesPasswordMatch) return reply.status(400).send({ message: "Invalid credentials" })

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env variable is required")

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

  return reply.status(200).send({ token })
})
}