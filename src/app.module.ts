import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UserSettingsModule } from './user_settings/user_settings.module';
import { PassportModule } from '@nestjs/passport';
import { SmmPackModule } from './smm_pack/smm_pack.module';
import { UserSmmPackRelationModule } from './users_smm_pack_relationship/users_smm_pack_relation.module';
import { TgChannelsModule } from './tg_channel/tg_channels.module';
import { PostModule } from './post/post.module';
import { PostTelegramRelationModule } from './post_telegram_relation/post_telegram_relation.module';
import { AuthModule } from './auth/auth.module';
import { TelegramBotModule } from './telegram_bot/telegram_bot.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req }) => ({ req }),
      // playground: false,
    }),
    PassportModule.register({ session: true }),
    UsersModule,
    UserSettingsModule,
    UserSmmPackRelationModule,
    SmmPackModule,
    TgChannelsModule,
    PostModule,
    PostTelegramRelationModule,
    AuthModule,
    TelegramBotModule,
    AiModule,
  ],
})
export class AppModule {}
