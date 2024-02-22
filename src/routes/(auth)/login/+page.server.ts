import { lucia } from "$lib/server/auth"
import { fail, redirect } from "@sveltejs/kit"
import { Argon2id } from "oslo/password"
import PrismaClient from "$lib/server/db"

import type { Actions, PageServerLoad } from "./$types"

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

        const existingUser = await PrismaClient.user.findUnique({
            where: {
                email
            }
        })

        if (!existingUser) {
            return fail(400, {
                message: "Incorrect email or password"
            })
        }

        const validPassword = await new Argon2id().verify(existingUser.hashed_password, password)

        if (!validPassword) {
            return fail(400, {
                message: "Incorrect email or password"
            })
        }

        const session = await lucia.createSession(existingUser.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        })

        redirect(302, "/")
    }
}
