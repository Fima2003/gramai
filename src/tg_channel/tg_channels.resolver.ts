import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TgChannelsService } from './tg_channels.service';
import { TgChannel } from './entities/tg_channel.entity';
import { CreateTgChannelInput } from './dto/create-tg_channel.input';
import { UpdateTgChannelInput } from './dto/update-tg_channel.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { TelegramGuard } from 'src/auth/telegram/telegram.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Resolver(() => TgChannel)
@UseGuards(JwtAuthGuard)
export class TgChannelsResolver {
  constructor(private readonly tgChannelsService: TgChannelsService) {}

  @Mutation(() => TgChannel)
  @UseGuards(TelegramGuard)
  createTgChannel(
    @Args('createTgChannelInput') createTgChannelInput: CreateTgChannelInput,
  ) {
    return this.tgChannelsService.create(createTgChannelInput);
  }

  // TODO ONLY AVAILABLE FOR ADMINS
  // @Query(() => [TgChannel], { name: 'tgChannels', nullable: true })
  // findAll() {
  //   return this.tgChannelsService.findAll();
  // }

  @Query(() => TgChannel, { name: 'tgChannel', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tgChannelsService.findOne(id);
  }

  @Mutation(() => Int)
  updateTgChannel(
    @Args('id') id: number,
    @Args('updateTgChannelInput') updateTgChannelInput: UpdateTgChannelInput,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.tgChannelsService.update(id, updateTgChannelInput, user_id);
  }

  @Mutation(() => Int)
  removeTgChannel(@Args('id', { type: () => Int }) id: number, @CurrentUser() { user_id }: JwtUserPayload) {
    return this.tgChannelsService.remove(id, user_id);
  }
}
