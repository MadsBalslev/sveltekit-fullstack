import { Lucia } from "lucia"
import { dev } from "$app/environment"
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import PrismaClient from "$lib/server/db"

const client = PrismaClient
const adapter = new PrismaAdapter(client.session, client.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
      avatarUrl: attributes.avatarUrl
    }
  }
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string,
  name: string,
  avatarUrl?: string
}
