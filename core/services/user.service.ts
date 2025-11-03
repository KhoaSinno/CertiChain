import { prisma } from "@/lib/db";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();
export class UserService {
  async getUserById(userId: string) {
    return userRepository.findUserById(userId);
  }

  async getAllUsers() {
    return userRepository.findAllUsers();
  }

  async getAllStudents() {
    return userRepository.findAllStudents();
  }
}
