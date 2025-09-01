import { server } from "./app.ts"
import { env } from "./env.ts"

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running")
})