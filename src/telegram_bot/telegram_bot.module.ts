import { Module } from '@nestjs/common';
import { TelegramBotController } from './telegram_bot.controller';
import { TelegramBotService } from './telegram_bot.service';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { UserSettingsModule } from 'src/user_settings/user_settings.module';
import { SmmPackModule } from 'src/smm_pack/smm_pack.module';
import { UsersModule } from 'src/users/users.module';
import { TgChannelsModule } from 'src/tg_channel/tg_channels.module';

@Module({
  imports: [UserSettingsModule, UserSmmPackRelationModule, SmmPackModule, UsersModule, TgChannelsModule],
  controllers: [TelegramBotController],
  providers: [TelegramBotService]
})
export class TelegramBotModule {}
