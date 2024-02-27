import { GitHub } from 'arctic'
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private'

export const github = new GitHub(
  GITHUB_ID,
  GITHUB_SECRET,
)
