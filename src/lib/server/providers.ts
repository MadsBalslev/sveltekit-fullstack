import { GitHub } from 'arctic'
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private'

export const github = new GitHub(
  GITHUB_ID,
  GITHUB_SECRET,
)

export interface GitHubUser {
	id: number;
	login: string;
	email: string;
	name: string;
	avatar_url: string;
}
