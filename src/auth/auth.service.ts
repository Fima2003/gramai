import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from './google/UserDetails';
import { UserSettings } from 'src/user_settings/entities/user_setting.entity';
import { createHash, createHmac } from 'crypto';
import { TelegramCallbackInput } from './telegram/telegramCallback.input';

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
    const newUser = this.userRepository.create({
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
    return await this.userRepository.findOneBy({ id });
  }

  checkTelegramHash({ hash, ...data }: any): boolean {
    const secret = createHash('sha256').update(process.env.BOT_TOKEN).digest();
    const checkString = Object.keys(data)
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join('\n');
    const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
    return hmac === hash;
  }

  async addTelegramToUser({ user_id, ...rest }: TelegramCallbackInput) {
    // const { user_id, ...rest } = query;
    if (this.checkTelegramHash(rest) === false) {
      throw new HttpException('Invalid hash', HttpStatus.I_AM_A_TEAPOT);
    }
    const user = await this.userSettingsRepository.findOneBy({
      telegram: parseInt(rest.id),
    });
    if (user.user_id != user_id && user) {
      throw new HttpException(
        'Telegram account already linked',
        HttpStatus.CONFLICT,
      );
    }
    return (
      await this.userSettingsRepository.update(user_id, {
        telegram: parseInt(rest.id),
      })
    ).affected;
  }
}
