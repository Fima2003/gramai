import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TgChannelsService } from './tg_channels.service';
import { TgChannel } from './entities/tg_channel.entity';
import { CreateTgChannelInput } from './dto/create-tg_channel.input';
import { UpdateTgChannelInput } from './dto/update-tg_channel.input';

@Resolver(() => TgChannel)
export class TgChannelsResolver {
  constructor(private readonly tgChannelsService: TgChannelsService) {}

  @Mutation(() => TgChannel)
  createTgChannel(
    @Args('createTgChannelInput') createTgChannelInput: CreateTgChannelInput,
  ) {
    return this.tgChannelsService.create(createTgChannelInput);
  }

  @Query(() => [TgChannel], { name: 'tgChannels', nullable: true })
  findAll() {
    return this.tgChannelsService.findAll();
  }

  @Query(() => TgChannel, { name: 'tgChannel', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tgChannelsService.findOne(id);
  }

  @Mutation(() => Int)
  updateTgChannel(
    @Args('id') id: number,
    @Args('updateTgChannelInput') updateTgChannelInput: UpdateTgChannelInput,
  ) {
    return this.tgChannelsService.update(id, updateTgChannelInput);
  }

  @Mutation(() => Int)
  removeTgChannel(@Args('id', { type: () => Int }) id: number) {
    return this.tgChannelsService.remove(id);
  }
}
