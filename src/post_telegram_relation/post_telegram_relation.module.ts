import { Module } from '@nestjs/common';
import { PostTelegramRelationService } from './post_telegram_relation.service';
import { PostTelegramRelationResolver } from './post_telegram_relation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTelegramRelation } from './entities/post_telegram_relation.entity';
import { JwtService } from '@nestjs/jwt';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { PostModule } from 'src/post/post.module';
import { TgChannelsModule } from 'src/tg_channel/tg_channels.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostTelegramRelation]), UserSmmPackRelationModule, TgChannelsModule, PostModule],
  providers: [PostTelegramRelationResolver, PostTelegramRelationService, JwtService],
  exports: [PostTelegramRelationService]
})
export class PostTelegramRelationModule {}
