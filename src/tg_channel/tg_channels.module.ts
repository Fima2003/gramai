import { Module } from '@nestjs/common';
import { TgChannelsService } from './tg_channels.service';
import { TgChannelsResolver } from './tg_channels.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgChannel } from './entities/tg_channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TgChannel])],
  providers: [TgChannelsResolver, TgChannelsService],
})
export class TgChannelsModule {}
