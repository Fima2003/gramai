import { Module } from '@nestjs/common';
import { PostTelegramRelationService } from './post_telegram_relation.service';
import { PostTelegramRelationResolver } from './post_telegram_relation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTelegramRelation } from './entities/post_telegram_relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostTelegramRelation])],
  providers: [PostTelegramRelationResolver, PostTelegramRelationService],
  exports: [PostTelegramRelationService]
})
export class PostTelegramRelationModule {}
