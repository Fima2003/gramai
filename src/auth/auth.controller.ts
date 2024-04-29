import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './google/google.guard';
import { Request } from 'express';
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

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async hangleRedirect(@Req() req) {
    const access_token = await this.jwtService.signAsync({
      user_id: req.user.id,
    });
    if (!access_token) {
      throw new InternalServerErrorException();
    }
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      access_token: access_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('telegram/login')
  @Render('index')
  telegramLogin(@CurrentUser() req: JwtUserPayload) {
    const { user_id } = req;
    return { user_id: user_id, URL: process.env.URL };
  }

  @Get('telegram/callback')
  async handleTelegramCallback(@Query() query: TelegramCallbackInput) {
    await this.authService.addTelegramToUser(query);
    return { message: 'Successfully connected to telergam' };
  }
}
