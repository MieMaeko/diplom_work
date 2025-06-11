import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addon } from './addon.entity';
import { AddonsService } from './addon.service';
import { AddonsController } from './addon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Addon])],
  providers: [AddonsService],
  controllers: [AddonsController],
})
export class AddonsModule {}
