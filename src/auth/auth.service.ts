import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from './google/UserDetails';
import { UserSettings } from 'src/user_settings/entities/user_setting.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
  ) {}

  async validateUserGoogle(details: UserDetails): Promise<any> {
    const user = await this.userSettingsRepository.findOneBy({
      email: details.email,
    });
    if (user) {
      return user.user_id;
    }
    const newUser = await this.userRepository.create({
      access: 'google',
    });
    const savedNewUser = await this.userRepository.save(newUser);
    const newUserSettings = this.userSettingsRepository.create({
      email: details.email,
      full_name: details.displayName,
      user_id: savedNewUser.id,
    });
    await this.userSettingsRepository.save(newUserSettings);
    return savedNewUser.id;
  }

  async findUser(id: string): Promise<User> {
    return await this.userRepository.findOneBy({id});
  }
}
