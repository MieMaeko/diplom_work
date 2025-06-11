import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './dto/user-role.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async register(name: string, email: string, password: string): Promise<User> {
  const exists = await this.userRepository.findOneBy({ email });
  if (exists) {
    throw new Error('Пользователь с таким email уже зарегистрирован');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = this.userRepository.create({ name, email, password: hashedPassword });
  return this.userRepository.save(user);
}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async getUserProfile(userId: number): Promise<User | null> {
  return this.userRepository.findOne({
    where: { id: userId },
    relations: ['orders', 'orders.items'],
  });
}

  async updateUserData(userId: number, fieldName: keyof Partial<User>, newValue: any): Promise<User | null> {
    const allowedFields: (keyof User)[] = ['name', 'phone', 'address'];
    if (!allowedFields.includes(fieldName)) {
      throw new Error(`Поле ${fieldName} нельзя редактировать`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) return null;

    (user as any)[fieldName] = newValue;
    return this.userRepository.save(user);
  }
  async findUsersWithOrders() {
    return this.userRepository.find({
      where: { role: UserRole.USER },
      relations: ['orders'],
    });
  }
  async getUserByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOneBy({ email });
}
}
