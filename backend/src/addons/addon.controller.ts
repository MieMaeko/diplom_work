import { Controller, Get } from '@nestjs/common';
import { AddonsService } from './addon.service';

@Controller('addons')
export class AddonsController {
  constructor(private readonly addonsService: AddonsService) {}

  @Get()
  getAllAddons() {
    return this.addonsService.findAll();
  }
}
