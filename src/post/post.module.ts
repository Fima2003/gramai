import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { JwtService } from '@nestjs/jwt';
import { UserSettingsModule } from 'src/user_settings/user_settings.module';
import { AiModule } from 'src/ai/ai.module';
import { TelegramBotModule } from 'src/telegram_bot/telegram_bot.module';
import { PostTelegramRelationModule } from 'src/post_telegram_relation/post_telegram_relation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserSmmPackRelationModule,
    UserSettingsModule,
    AiModule,
    forwardRef(() => PostTelegramRelationModule),
    forwardRef(() => TelegramBotModule),
  ],
  providers: [PostResolver, PostService, JwtService],
  exports: [PostService],
})
export class PostModule {}
