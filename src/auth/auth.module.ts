import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from 'src/user_settings/entities/user_setting.entity';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google/google.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TelegramStrategy } from './telegram/telegram.strategy';
import { UserSettingsModule } from 'src/user_settings/user_settings.module';
// import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        global: true,
        signOptions: { expiresIn: '60m' },
      }),
    }),
    TypeOrmModule.forFeature([User, UserSettings]),
    UserSettingsModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    GoogleStrategy,
    JwtStrategy,
    TelegramStrategy
  ],
})
export class AuthModule {}
