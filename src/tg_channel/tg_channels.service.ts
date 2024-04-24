import { Injectable } from '@nestjs/common';
import { CreateTgChannelInput } from './dto/create-tg_channel.input';
import { UpdateTgChannelInput } from './dto/update-tg_channel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { TgChannel } from './entities/tg_channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TgChannelsService {
  constructor(
    @InjectRepository(TgChannel)
    private readonly tgChannelRepo: Repository<TgChannel>,
  ) {}

  async create(createTgChannelInput: CreateTgChannelInput) {
    const exists = await this.tgChannelRepo.findOne({
      where: { id: createTgChannelInput.id },
    });
    if (exists) {
      return exists;
    }
    const newTgChannel = this.tgChannelRepo.create(createTgChannelInput);
    const savedTgChannel = await this.tgChannelRepo.save(newTgChannel);
    return savedTgChannel;
  }

  findAll() {
    return this.tgChannelRepo.find();
  }

  findOne(id: number) {
    return this.tgChannelRepo.findOne({ where: { id } });
  }

  async update(id: number, updateTgChannelInput: UpdateTgChannelInput) {
    return (await this.tgChannelRepo.update({ id }, updateTgChannelInput)).affected;
  }

  async remove(id: number) {
    return (await this.tgChannelRepo.delete({ id })).affected;
  }
}
