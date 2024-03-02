import User from './User.model';
import PrismaClient from '$lib/server/db'

export default class Account {
  // model Account {
  //   providerId   String
  //   providerType Provider
  //   userId       String
  //   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  //   createdAt    DateTime @default(now())
  //   updatedAt    DateTime @updatedAt

  //   @@id([providerId, providerType])
  //   @@unique([providerId, providerType])
  // }

  static async findAccountsByUser(user: User) {
    return await PrismaClient.account.findMany({
      where: {
        user
      }
    })
  }
}

