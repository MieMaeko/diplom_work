
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FillingController } from './filling.controller';
import { FillingService } from './filling.service';
import { Filling } from './filling.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Filling])],
  controllers: [FillingController],
  providers: [FillingService],
})
export class FillingModule {}
