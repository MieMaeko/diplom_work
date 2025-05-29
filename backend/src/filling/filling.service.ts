
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filling } from './filling.entity';

@Injectable()
export class FillingService {
  constructor(
    @InjectRepository(Filling)
    private readonly fillingRepository: Repository<Filling>,
  ) {}

  async findAll(): Promise<Filling[]> {
    return this.fillingRepository.find();
  }
}
