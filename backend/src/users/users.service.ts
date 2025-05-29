import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
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
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUserData(userId: number, fieldName: keyof Partial<User>, newValue: any): Promise<User | null> {
    const allowedFields: (keyof User)[] = ['name', 'phone','address']; 
    if (!allowedFields.includes(fieldName)) {
      throw new Error(`Поле ${fieldName} нельзя редактировать`);
    }
  
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) return null;
  
    (user as any)[fieldName] = newValue;
    return this.userRepository.save(user);
  }
  
}
