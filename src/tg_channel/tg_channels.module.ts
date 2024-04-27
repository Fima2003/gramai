import { Module } from '@nestjs/common';
import { TgChannelsService } from './tg_channels.service';
import { TgChannelsResolver } from './tg_channels.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TgChannel } from './entities/tg_channel.entity';
import { JwtService } from '@nestjs/jwt';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';

@Module({
  imports: [TypeOrmModule.forFeature([TgChannel]), UserSmmPackRelationModule],
  providers: [TgChannelsResolver, TgChannelsService, JwtService],
  exports: [TgChannelsService]
})
export class TgChannelsModule {}
