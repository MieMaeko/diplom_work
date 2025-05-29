import { Controller, Get, Post, Put, Body, Session, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';

import { UserService } from './users.service'; 

@Controller('user')  
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Session() session: Record<string, any>) {
    if (!session.userId) {
      return { message: 'User not authenticated' }; 
    }

    const user = await this.userService.getUserProfile(session.userId);
    if (!user) {
      return { message: 'User not found' }; 
    }
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      role: user.role
    };
  }

  @Put('profile')
async updateProfile(@Body() body: Record<string, any>, @Session() session: Record<string, any>) {
  if (!session.userId) throw new UnauthorizedException();

  const allowedFields: (keyof User)[] = ['name', 'phone', 'address'];
  const keys = Object.keys(body);
  
  if (keys.length !== 1) throw new BadRequestException('Нужно одно поле для обновления');
  
  const key = keys[0];
  if (!allowedFields.includes(key as keyof User)) {
    throw new BadRequestException(`Поле ${key} не разрешено к редактированию`);
  }
  
  const fieldName = key as keyof User;
  const newValue = body[fieldName];
  
  try {
    const updated = await this.userService.updateUserData(session.userId, fieldName, newValue);
    if (!updated) throw new BadRequestException('Пользователь не найден');

    return { message: 'Обновлено', [fieldName]: (updated as any)[fieldName] };
  } catch (e) {
    throw new BadRequestException(e.message);
  }
}

  @Post('register')
  async register(@Body() body: { email: string, password: string }) {
    const { email, password } = body;
    return this.userService.register(email, password);
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }, @Session() session: Record<string, any>) {
    const { email, password } = body;
    const user = await this.userService.validateUser(email  , password);
    if (user) {
      session.userId = user.id;
      return { message: 'Login successful' };
    }
    return { message: 'Invalid credentials' };
  }
}
