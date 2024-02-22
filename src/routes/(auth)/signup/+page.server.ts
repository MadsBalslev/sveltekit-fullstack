import { lucia } from "$lib/server/auth"
import { fail, redirect } from "@sveltejs/kit"
import { generateId } from "lucia"
import { Argon2id } from "oslo/password"
import PrismaClient from "$lib/server/db"

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/");
	}
	return {};
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    const email = formData.get("email")
    const password = formData.get("password")

    if (
      typeof email !== "string" ||
      !/^[^@]+@[^@]+\.[^@]+$/.test(email)
    ) {
      return fail(400, {
        message: "Invalid email"
      })
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 255
    ) {
      return fail(400, {
        message: "Invalid password"
      })
    }

    const userId = generateId(15)
    const hashedPassword = await new Argon2id().hash(password)

    const userExists = await PrismaClient.user.findUnique({
      where: {
        email
      }
    })

    if (userExists) {
      return fail(400, {
        message: "User already exists"
      })
    }

    await PrismaClient.user.create({
      data: {
        id: userId,
        email,
        hashed_password: hashedPassword
      }
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    })

    redirect(302, "/")
  }
}
