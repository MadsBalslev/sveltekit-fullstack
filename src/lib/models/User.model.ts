import PrismaClient from '$lib/server/db'

export default class User {
  static async findUserById(id: string) {
    return await PrismaClient.user.findUnique({
      where: {
        id
      }
    })
  }
}
