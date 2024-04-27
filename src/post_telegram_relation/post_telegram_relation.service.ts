import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostTelegramRelationInput } from './dto/create-post_telegram_relation.input';
import { UpdatePostTelegramRelationInput } from './dto/update-post_telegram_relation.input';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTelegramRelation } from './entities/post_telegram_relation.entity';
import { Repository } from 'typeorm';
import { PostService } from 'src/post/post.service';
import { TgChannelsService } from 'src/tg_channel/tg_channels.service';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';

@Injectable()
export class PostTelegramRelationService {
  constructor(
    @InjectRepository(PostTelegramRelation)
    private readonly postTelegramRelationRepo: Repository<PostTelegramRelation>,
    @Inject(PostService) private readonly postService: PostService,
    @Inject(TgChannelsService)
    private readonly tgChannelsService: TgChannelsService,
    @Inject(UserSmmPackRelationService)
    private readonly userSmmPackRelationService: UserSmmPackRelationService,
  ) {}

  async relationExists(
    post_id: string,
    tg_channel_id: number,
    user_id: string,
  ) {
    // Ensure the post exists
    const post = await this.postService.findOne(post_id, user_id);
    if (!post) throw new NotFoundException('Post not found');

    // Ensure the channel exists
    const tg_channel = await this.tgChannelsService.findOne(tg_channel_id);
    if (!tg_channel) throw new NotFoundException('Telegram channel not found');

    // Ensure the post and channel are connected
    if (tg_channel.smm_pack_id !== post.smm_pack_id)
      throw new NotFoundException('Post and channel are not connected');

    // Ensure the user is connected to the pack
    const relation = await this.userSmmPackRelationService.findRelations({
      user_id,
      pack_id: post.smm_pack_id,
    });
    if (!relation)
      throw new NotFoundException('User not connected to the pack');
    return true;
  }

  async create(
    createPostTelegramRelationInput: CreatePostTelegramRelationInput,
    user_id: string,
  ) {
    await this.relationExists(
      createPostTelegramRelationInput.post_id,
      createPostTelegramRelationInput.tg_channel_id,
      user_id,
    );
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

  async findRelations(user_id: string, post_id?: string, tg_channel_id?: number) {
    if (!post_id && !tg_channel_id) {
      return await this.postTelegramRelationRepo.find();
    }
    if (post_id && !tg_channel_id) {
      return await this.postTelegramRelationRepo.find({
        where: { post_id },
      });
    }
    if (!post_id && tg_channel_id) {
      return await this.postTelegramRelationRepo.find({
        where: { tg_channel_id },
      });
    }
    await this.relationExists(
      post_id,
      tg_channel_id,
      user_id,
    );
    return this.postTelegramRelationRepo.findOne({
      where: { post_id, tg_channel_id },
      relations: ['tg_channel', 'post'],
    });
  }

  async update(updatePostTelegramRelationInput: UpdatePostTelegramRelationInput, user_id: string) {
    const { post_id, tg_channel_id, tg_message_id } =
      updatePostTelegramRelationInput;
    await this.relationExists(post_id, tg_channel_id, user_id);
    return (await this.postTelegramRelationRepo.update(
      { post_id, tg_channel_id },
      { tg_message_id },
    )).affected;
  }
}
