import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserSettingsService } from 'src/user_settings/user_settings.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userSettingsService: UserSettingsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate({ user_id }: JwtUserPayload) {
    const user = await this.userSettingsService.findOne(user_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { user_id: user.user_id, telegram: user.telegram };
  }
}
