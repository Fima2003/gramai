import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UserSettingsModule } from 'src/user_settings/user_settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserSmmPackRelationModule, UserSettingsModule],
  providers: [PostResolver, PostService, JwtService],
  exports: [PostService]
})
export class PostModule {}
