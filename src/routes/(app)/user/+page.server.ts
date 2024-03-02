import { redirect } from "@sveltejs/kit"
import Account from "$lib/models/Account.model"
import User from "$lib/models/User.model"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, "/login");
	}

  const user = await User.findUserById(event.locals.user.id);
  const accounts = await Account.findAccountsByUser(event.locals.user);
	return {
    accounts,
		user
	};
};
