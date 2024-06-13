import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UserSettingsModule } from 'src/user_settings/user_settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { JwtService } from '@nestjs/jwt';
import { PostModule } from 'src/post/post.module';
import { SmmPackModule } from 'src/smm_pack/smm_pack.module';
import { TelegramBotModule } from 'src/telegram_bot/telegram_bot.module';

@Module({
  imports: [
    UserSettingsModule,
    TypeOrmModule.forFeature([User]),
    UserSmmPackRelationModule,
    // forwardRef(() => TelegramBotModule),
    forwardRef(() => PostModule),
    forwardRef(() => SmmPackModule),
  ],
  providers: [UsersResolver, UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
