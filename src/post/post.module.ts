import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostTelegramRelationModule } from 'src/post_telegram_relation/post_telegram_relation.module';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserSmmPackRelationModule],
  providers: [PostResolver, PostService],
})
export class PostModule {}
