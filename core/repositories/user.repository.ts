import { prisma } from "@/lib/db";

const db = prisma;
export class UserRepository {
  async findUserById(userId: number) {
    return db.user.findUnique({
      where: { id: userId },
    });
  }

  //   async createUser(userData: any) {
  //     return db.user.create({
  //       data: userData,
  //     });
  //   }

  //   async updateUser(userId: string, userData: any) {
  //     return db.user.update({
  //       where: { id: Number(userId) },
  //       data: userData,
  //     });
  //   }

  //   async deleteUser(userId: string) {
  //     return db.user.delete({
  //       where: { id: Number(userId) },
  //     });
  //   }

  async findAllUsers() {
    return db.user.findMany();
  }

  async findAllStudents() {
    return db.user.findMany({
      where: { role: "STUDENT" },
    });
  }
}
