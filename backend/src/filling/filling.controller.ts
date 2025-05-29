
import { Controller, Get } from '@nestjs/common';
import { FillingService } from './filling.service';
import { Filling } from './filling.entity';

@Controller('filling')
export class FillingController {
  constructor(private readonly fillingService: FillingService) {}

  @Get()
  async getAllFillings(): Promise<Filling[]> {
    return this.fillingService.findAll();
  }
}
