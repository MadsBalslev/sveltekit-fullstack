import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { lucia } from '$lib/server/auth';
import { github, type GitHubUser } from '$lib/server/providers';
import PrismaClient from '$lib/server/db';

import {error, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await PrismaClient.user.findUnique({
			where: {
				email: githubUser.email
			},
			include: {
				accounts: true
			}
		});

		if (existingUser) {
      console.log('existingUser:', existingUser)
			const existingGitHubAccount = existingUser.accounts.find(
				(account) => account.providerType === 'GITHUB'
			);

			if (!existingGitHubAccount) {
				// Associate the GitHub account with the user
				await PrismaClient.account.create({
					data: {
						userId: existingUser.id,
						providerId: githubUser.id.toString(),
						providerType: 'GITHUB'
					}
				});

				if (!existingUser.avatarUrl) {
					await PrismaClient.user.update({
						where: {
							id: existingUser.id
						},
						data: {
							avatarUrl: githubUser.avatar_url
						}
					});
				}
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

      await PrismaClient.user.create({
        data: {
          id: userId,
          name: githubUser.name,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
          accounts: {
            create: {
              providerId: githubUser.id.toString(),
              providerType: 'GITHUB',
            }
          }
        }
      });

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return error(400, e.message);
		}

		return error(500, 'An error occurred')
	}
}
