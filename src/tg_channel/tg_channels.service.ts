import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTgChannelInput } from './dto/create-tg_channel.input';
import { UpdateTgChannelInput } from './dto/update-tg_channel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { TgChannel } from './entities/tg_channel.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { UserSmmPackRelation } from 'src/users_smm_pack_relationship/entities/users_smm_pack_relation.entity';

@Injectable()
export class TgChannelsService {
  constructor(
    @InjectRepository(TgChannel)
    private readonly tgChannelRepo: Repository<TgChannel>,
    @Inject(UserSmmPackRelationService)
    private readonly userSmmPackRelationService: UserSmmPackRelationService,
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

  async userHasConnectionToTgChannel(
    tg_id: number,
    user_id: string,
  ): Promise<boolean> {
    const channels = (await this.userSmmPackRelationService.findRelations({
      user_id,
    })) as UserSmmPackRelation[];
    const tgChannel = await this.tgChannelRepo.findOne({
      where: { id: tg_id },
    });
    const relation = channels.find(
      (relation) => relation.smm_pack_id === tgChannel.smm_pack_id,
    );
    return relation != null;
  }

  async update(
    tg_id: number,
    updateTgChannelInput: UpdateTgChannelInput,
    user_id: string,
  ) {
    const relation = await this.userHasConnectionToTgChannel(tg_id, user_id);
    if (!relation) {
      throw new UnauthorizedException();
    }
    return (
      await this.tgChannelRepo.update({ id: tg_id }, updateTgChannelInput)
    ).affected;
  }

  async remove(id: number, user_id: string) {
    const relation = await this.userHasConnectionToTgChannel(id, user_id);
    if (!relation) {
      throw new UnauthorizedException();
    }
    return (await this.tgChannelRepo.delete({ id })).affected;
  }
}
