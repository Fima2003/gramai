import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  static key = 'telegram';
  constructor() {
    super();
  }

  async validate({ user }: { user: JwtUserPayload }) {
    if (user.telegram) return user;
    throw new Error('Telegram not connected');
  }
}
