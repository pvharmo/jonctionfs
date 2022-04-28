import { dotEnvConfig, listenAndServe } from "./deps.ts"
import * as routes from './routes.ts'
import { addConnection, getConnections } from './connections/connections.ts'

dotEnvConfig({export: true})

listenAndServe(":3000", async (req) => {
  if (req.method == "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400"
      }
    })
  } else if (req.method == "PUT") {
    const body = await req.json()
    const user: string = req.headers.get('authenticated-user') as string
    return await addConnection(user, body.name, body.type, body.data)
  } else if (req.method == "POST") {
    return await routes.actionHandler(req)
  } else if (req.method == "GET") {
    const user: string = req.headers.get('authenticated-user') as string
    return await getConnections(user)
  }

  return new Response("Route not found", { status: 404 })
});
