import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserSettingInput } from './dto/update-user_setting.input';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettings } from './entities/user_setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
  ) {}

  findAll() {
    return this.userSettingsRepository.find();
  }

  findOne(id: string) {
    return this.userSettingsRepository.findOne({where: {user_id: id}});
  }

  update(id: string, updateUserSettingInput: UpdateUserSettingInput) {
    const result = this.userSettingsRepository.update(id, updateUserSettingInput);
    return result.then((res) => res.affected);
  }
}
