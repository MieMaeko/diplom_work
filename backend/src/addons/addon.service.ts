import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Addon } from './addon.entity';

@Injectable()
export class AddonsService {
  constructor(
    @InjectRepository(Addon)
    private addonRepository: Repository<Addon>,
  ) {}

  findAll(): Promise<Addon[]> {
    return this.addonRepository.find();
  }
}
