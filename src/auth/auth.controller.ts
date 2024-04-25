import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}
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
  telegramLogin(@Req() req: Request) {
    console.log(req.user);
    const { id } = req.user as any;
    return { user_id: id };
  }

  @Get('telegram/callback')
  handleTelegramCallback(@Query() query: TelegramCallbackInput) {

    return { message: 'ID received successfully', user_id: query.user_id, telegram_id: query.id };
  }
}
