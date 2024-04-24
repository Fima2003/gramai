import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UserSettingsModule } from './user_settings/user_settings.module';
import { PassportModule } from '@nestjs/passport';
import { SmmPackModule } from './smm_pack/smm_pack.module';
import { UserSmmPackRelationModule } from './users_smm_pack_relationship/users_smm_pack_relation.module';
import { TgChannelsModule } from './tg_channel/tg_channels.module';
import { PostModule } from './post/post.module';
import { PostTelegramRelationModule } from './post_telegram_relation/post_telegram_relation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    UserSettingsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req }) => ({ req }),
    }),
    PassportModule.register({ session: true }),
    UserSmmPackRelationModule,
    SmmPackModule,
    TgChannelsModule,
    PostModule,
    PostTelegramRelationModule,
  ],
})
export class AppModule {}
