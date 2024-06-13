import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from 'src/user_settings/entities/user_setting.entity';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google/google.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TelegramStrategy } from './telegram/telegram.strategy';
import { SmmPackModule } from 'src/smm_pack/smm_pack.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET_KEY,
        global: true,
      }),
    }),
    TypeOrmModule.forFeature([User, UserSettings]),
    UsersModule,
    SmmPackModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    GoogleStrategy,
    JwtStrategy,
    TelegramStrategy,
  ],
})
export class AuthModule {}
