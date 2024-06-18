import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Query,
  Redirect,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './google/google.guard';
import { TelegramCallbackInput } from './telegram/telegramCallback.input';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthService,
  ) {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  hangleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Redirect()
  @Get('google/redirect')
  async hangleRedirect(@Req() req) {
    const access_token = await this.jwtService.signAsync({
      user_id: req.user.user_id,
      telegram_id: req.user.telegram_id,
    });

    if (!access_token) {
      throw new InternalServerErrorException();
    }
    if (!req.user) {
      return 'No user from google';
    }

    return {
      url: this.generateLink({ access_token, ...req.user }),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('telegram/login')
  @Render('index')
  telegramLogin(@CurrentUser() req: JwtUserPayload) {
    const { user_id } = req;
    return { user_id: user_id, URL: process.env.URL };
  }

  @Redirect()
  @Get('telegram/callback')
  async handleTelegramCallback(@Query() query: TelegramCallbackInput) {
    const full_name = await this.authService.addTelegramToUser(query);
    const { user_id, id: telegram_id, first_name: telegram_first_name } = query;
    const access_token = await this.jwtService.signAsync({
      user_id: query.user_id,
      telegram_id: query.id,
    });
    return {
      url: this.generateLink({
        access_token,
        full_name,
        user_id,
        telegram_id,
        telegram_first_name,
      }),
    };
  }

  generateLink(params: {
    access_token: string;
    user_id: string;
    full_name: string;
    telegram_id?: string;
    telegram_first_name?: string;
  }) {
    const url = new URL(`${process.env.FRONT_URL}/redirect`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  }
}
