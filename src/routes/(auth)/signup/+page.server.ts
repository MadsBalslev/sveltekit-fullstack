import { lucia } from "$lib/server/auth"
import { fail, redirect } from "@sveltejs/kit"
import { generateId } from "lucia"
import { Argon2id } from "oslo/password"
import PrismaClient from "$lib/server/db"
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signUpSchema } from '$lib/schemas';

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/");
	}

  const form = await superValidate(zod(signUpSchema));

	return {
    form
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(signUpSchema));

    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const email = form.data.email
    const password = form.data.password
    const confirmPassword = form.data.confirmPassword

    if (password !== confirmPassword) {
      return message(form, "Passwords do not match")
    }

    const userId = generateId(15)
    const hashedPassword = await new Argon2id().hash(password)

    const userExists = await PrismaClient.user.findUnique({
      where: {
        email
      }
    })

    if (userExists) {
      return message(form, "User already exists")
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

    return { form };
  }
}
