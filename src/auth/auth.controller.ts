import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from './google/google.guard';

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
}
