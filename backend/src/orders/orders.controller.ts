import {
  Controller, Post, Body, Get, Put, Param, Query,
  UploadedFile, UseInterceptors, Session, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { OrderStatus } from './dto/order-status.enum';
import * as fs from 'fs/promises';

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = allowedTypes.test(file.mimetype);
  const extnameValid = allowedTypes.test(ext);

  if (mimetype && extnameValid) {
    return cb(null, true);
  } else {
    return cb(new BadRequestException('Разрешены только изображения: jpg, jpeg, png'), false);
  }
};
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    console.log('createOrderDto.items', createOrderDto.items);
    console.log('typeof items', typeof createOrderDto.items);
    try {
         const newOrder = await this.ordersService.createOrder(createOrderDto);
      return newOrder;
    } catch (error) {
     console.error('Ошибка при оформлении заказа:', error);
      throw new Error('Ошибка при оформлении заказа');
    }
  }
  @Post('custom')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    }),
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  }))
  async createCustomOrder(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Session() session: Record<string, any>,
  ): Promise<Order> {
    if (!session?.userId) throw new BadRequestException('Пользователь не авторизован');

    const imageUrl = file ? `/uploads/${file.filename}` : undefined;

    const dto: CreateOrderDto = {
      user_id: session.userId,
      user_name: session.user_name || '',
      user_phone: session.user_phone || '',
      user_email: session.user_email || '',
      address: session.address || '',
      delivery_date: new Date().toISOString(),
      delivery_method: 'самовывоз',
      total_price: 1500,
      status: OrderStatus.ОФОРМЛЕН,
      items: [
        {
          fillingId: Number(body.filling),
          quantity: 1,
          weight: parseFloat(body.weight),
          price: 1500,
          is_custom: true,
          custom_data: {
            shape: body.shape,
            decor: body.decor,
            wishes: body.wishes,
            imageUrl,
          },
        }
      ]
    };

    try {
      return await this.ordersService.createOrder(dto);
    } catch (error) {

      if (file) {
        const filePath = join(__dirname, '..', '..', 'uploads', file.filename);
        try {
          await fs.unlink(filePath);
          console.warn(`Удалён файл после ошибки: ${file.filename}`);
        } catch (unlinkError) {
          console.error('Ошибка при удалении файла:', unlinkError);
        }
      }

      throw new BadRequestException('Ошибка при создании кастомного заказа');
    }
  }

  @Get()
  async getAll(@Query('filter') filter?: string) {
    return this.ordersService.getOrders(filter);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(+id, body.status);
  }
}