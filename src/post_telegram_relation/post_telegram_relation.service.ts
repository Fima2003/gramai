import { Injectable } from '@nestjs/common';
import { CreatePostTelegramRelationInput } from './dto/create-post_telegram_relation.input';
import { UpdatePostTelegramRelationInput } from './dto/update-post_telegram_relation.input';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTelegramRelation } from './entities/post_telegram_relation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostTelegramRelationService {
  constructor(
    @InjectRepository(PostTelegramRelation)
    private readonly postTelegramRelationRepo: Repository<PostTelegramRelation>,
  ) {}

  async create(
    createPostTelegramRelationInput: CreatePostTelegramRelationInput,
  ) {
    const newPostTelegramRelation = this.postTelegramRelationRepo.create(
      createPostTelegramRelationInput,
    );
    const relationSaved = await this.postTelegramRelationRepo.save(
      newPostTelegramRelation,
    );
    return relationSaved;
  }

  findAll() {
    return this.postTelegramRelationRepo.find();
  }

  findRelations(post_id?: string, tg_channel_id?: number) {
    if (!post_id && !tg_channel_id) {
      return this.postTelegramRelationRepo.find();
    }
    if (post_id && !tg_channel_id) {
      return this.postTelegramRelationRepo.find({
        where: { post_id },
      });
    }
    if (!post_id && tg_channel_id) {
      return this.postTelegramRelationRepo.find({
        where: { tg_channel_id },
      });
    }
    return this.postTelegramRelationRepo.findOne({
      where: { post_id, tg_channel_id },
      relations: ['tg_channel', 'post'],
    });
  }

  update(updatePostTelegramRelationInput: UpdatePostTelegramRelationInput) {
    const { post_id, tg_channel_id, tg_message_id } =
      updatePostTelegramRelationInput;
    return this.postTelegramRelationRepo.update(
      { post_id, tg_channel_id },
      { tg_message_id },
    );  
  }
}
