import { Controller, Get, Post, Put, Body, Session, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';

import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
      orders: user.orders,
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
  async register(@Body() body: { name: string; email: string; password: string }) {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      throw new BadRequestException('Необходимо указать имя, почту и пароль');
    }

    try {
      return await this.userService.register(name, email, password);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('check-email')
  async checkEmail(@Body() body: { email: string }) {
    const user = await this.userService.getUserByEmail(body.email);
    return { unique: !user };
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }, @Session() session: Record<string, any>) {
    const { email, password } = body;
    const user = await this.userService.validateUser(email, password);
    if (user) {
      session.userId = user.id;
      return {
        message: 'Login successful',
        role: user.role,
      };
    }
    return { message: 'Invalid credentials' };
  }
  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    session.userId = null;
    return { message: 'Выход выполнен' };
  }
  @Get('admin/users')
  async getUsersWithOrders() {
    return this.userService.findUsersWithOrders();
  }
}
