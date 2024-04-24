import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserSettingsService } from './user_settings.service';
import { UserSettings } from './entities/user_setting.entity';
import { UpdateUserSettingInput } from './dto/update-user_setting.input';
import { UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/auth/google/google.guard';

@Resolver(() => UserSettings)
export class UserSettingsResolver {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Query(() => [UserSettings], { name: 'userSettingsAll', nullable: true })
  async findAll() {
    return await this.userSettingsService.findAll();
  }

  @Query(() => UserSettings, { name: 'userSettings', nullable: true })
  async findOne(@Args('id') id: string) {
    return await this.userSettingsService.findOne(id);
  }

  @Mutation(() => Int, { nullable: true })
  async updateUserSettings(
    @Args('id') id: string,
    @Args('updateUserSettingInput')
    updateUserSettingInput: UpdateUserSettingInput,
  ) {
    return await this.userSettingsService.update(id, updateUserSettingInput);
  }
}
