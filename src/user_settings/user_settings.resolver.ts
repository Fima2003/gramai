import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserSettingsService } from './user_settings.service';
import { UserSettings } from './entities/user_setting.entity';
import { UpdateUserSettingInput } from './dto/update-user_setting.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Resolver(() => UserSettings)
@UseGuards(JwtAuthGuard)
export class UserSettingsResolver {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  // TODO ONLY ACCESSIBLE BY ADMIN
  // @Query(() => [UserSettings], { name: 'userSettingsAll', nullable: true })
  // async findAll() {
  //   return await this.userSettingsService.findAll();
  // }

  @Query(() => UserSettings, { name: 'userSettings', nullable: true })
  async findOne(
    @Args('id') id: string,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    if (user_id !== id) throw new UnauthorizedException('Unauthorized');
    return await this.userSettingsService.findOne(id);
  }

  @Mutation(() => Int, { nullable: true })
  async updateUserSettings(
    @Args('updateUserSettingInput')
    updateUserSettingInput: UpdateUserSettingInput,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return await this.userSettingsService.update(user_id, updateUserSettingInput);
  }
}
