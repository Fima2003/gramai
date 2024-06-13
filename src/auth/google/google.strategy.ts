import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
// import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      // callbackURL: `${configService.get('URL')}/api/auth/google/redirect`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    try {
      const { emails, displayName } = profile;
      const user = await this.authService.validateUserGoogle({
        email: emails[0].value,
        displayName,
      });
      const userReq = {
        user_id: user.id,
        telegram_id: user.telegram,
        full_name: user.userSettings.full_name,
        telegram_first_name: user.userSettings.telegram_first_name,
      };
      return done(null, userReq || null);
    } catch (error) {
      return done(error);
    }
  }
}
