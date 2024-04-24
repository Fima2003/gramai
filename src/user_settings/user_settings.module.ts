import { Module } from '@nestjs/common';
import { UserSettingsService } from './user_settings.service';
import { UserSettingsResolver } from './user_settings.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from './entities/user_setting.entity';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  providers: [UserSettingsResolver, UserSettingsService],
})
export class UserSettingsModule {}
