import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from './google/UserDetails';
import { UserSettings } from 'src/user_settings/entities/user_setting.entity';
import { createHash, createHmac } from 'crypto';
import { TelegramCallbackInput } from './telegram/telegramCallback.input';
import { SmmPackService } from 'src/smm_pack/smm_pack.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
    @Inject(SmmPackService) private readonly smmPackService: SmmPackService,
  ) {}

  async validateUserGoogle(details: UserDetails): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: details.email,
      },
      relations: ['userSettings'],
    });
    if (user) {
      return user;
    }

    const newUser = this.userRepository.create({
      access: 'google',
      email: details.email,
    });

    const savedNewUser = await this.userRepository.save(newUser);
    const newUserSettings = this.userSettingsRepository.create({
      full_name: details.displayName,
      user_id: savedNewUser.id,
    });
    await this.userSettingsRepository.save(newUserSettings);

    await this.smmPackService.create(newUser.id, {});

    return { ...savedNewUser, userSettings: newUserSettings };
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
    if (this.checkTelegramHash(rest) === false) {
      throw new HttpException('Invalid hash', HttpStatus.I_AM_A_TEAPOT);
    }
    const userByTelegram= await this.userRepository.findOne({
      where: {
        telegram: rest.id,
      },
      relations: ['userSettings'],
    });
    if (userByTelegram && userByTelegram.id != user_id) {
      throw new HttpException(
        'Telegram account already linked',
        HttpStatus.CONFLICT,
      );
    }
    await this.userRepository.update(user_id, {
      telegram: rest.id,
    });

    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['userSettings'],
    });

    await this.userSettingsRepository.update(user_id, {
      telegram_first_name: rest.first_name,
    });

    return user.userSettings.full_name;
  }
}
