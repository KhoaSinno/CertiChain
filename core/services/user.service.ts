import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();
export class UserService {
  async getUserById(userId: number) {
    return userRepository.findUserById(userId);
  }

  async getAllUsers() {
    return userRepository.findAllUsers();
  }

  async getAllStudents() {
    return userRepository.findAllStudents();
  }
}
