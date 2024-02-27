import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import PrismaClient from '$lib/server/db';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	const form = await superValidate(zod(loginSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const email = form.data.email
		const password = form.data.password

		const existingUser = await PrismaClient.user.findUnique({
		    where: {
		        email
		    }
		})

		if (!existingUser) {
		    return message(form, 'E-mail or password is incorrect.');
		}

		const validPassword = await new Argon2id().verify(existingUser.hashed_password, password)

		if (!validPassword) {
		    return message(form, 'E-mail or password is incorrect.');
		}

		const session = await lucia.createSession(existingUser.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
		    path: ".",
		    ...sessionCookie.attributes
		})

		return redirect(302, '/');
	}
};
