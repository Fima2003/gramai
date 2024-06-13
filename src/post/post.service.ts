import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { User } from 'src/users/entities/user.entity';
import { UserSettingsService } from 'src/user_settings/user_settings.service';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';
import { PostStatus } from './utils/post-status.enum';
import { AiService } from 'src/ai/ai.service';
import { GeneratePostInput } from './dto/generate-post.input';
import { PublishPostInput } from './dto/publish-post.input';
import { TelegramBotService } from 'src/telegram_bot/telegram_bot.service';
import { PostTelegramRelationService } from 'src/post_telegram_relation/post_telegram_relation.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @Inject(UserSmmPackRelationService)
    private readonly userSmmPackRelationService: UserSmmPackRelationService,
    @Inject(UserSettingsService)
    private readonly userSettingsService: UserSettingsService,

    @Inject(AiService)
    private readonly aiService: AiService,

    @Inject(forwardRef(() => TelegramBotService))
    private readonly telegramBotService: TelegramBotService,

    @Inject(forwardRef(() => PostTelegramRelationService))
    private readonly postTelegramRelationService: PostTelegramRelationService,
  ) {}

  async generate(
    user_id: string,
    {
      smm_pack_id,
      post_id,
      type,
      prompt,
      settings: { system, positive_keys, negative_keys, language, sources },
    }: GeneratePostInput,
  ) {
    // Authorization
    if (type === 'generate') {
      const userSmmPackRelation =
        await this.userSmmPackRelationService.findRelations({
          user_id,
          pack_id: smm_pack_id,
        });
      if (!userSmmPackRelation)
        throw new Error('No relation between user and the given pack');
    } else if (type === 'regenerate') {
      const post = await this.postRepo.findOne({ where: { id: post_id } });
      if (!post) return null;
      if (post.user_id !== user_id)
        throw new UnauthorizedException('Unauthorized');
      if (post.status === 'SENT')
        throw new UnauthorizedException('Unauthorized');
    } else {
      throw new Error('Invalid type');
    }

    const user = await this.userSettingsService.findOne(user_id);
    if (!user) throw new Error('User not found');
    const name = user.full_name;

    return this.aiService
      .generateText(
        prompt,
        system,
        positive_keys,
        negative_keys,
        language,
        sources,
      )
      .then(async (res: any) => {
        if (type == 'generate') {
          const post = this.postRepo.create({
            smm_pack_id: smm_pack_id,
            text: res,
            user_id,
            author: name,
          });
          return await this.postRepo.save(post);
        } else if (type == 'regenerate') {
          await this.postRepo.update(post_id, {
            text: res,
          });
          return await this.postRepo.findOne({ where: { id: post_id } });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async publish(
    user_id: string,
    { post_id, settings, smm_pack_id, text }: PublishPostInput,
  ) {
    // Post should exist
    let post;
    if (post_id) post = await this.postRepo.findOne({ where: { id: post_id } });
    if (!post) {
      post = await this.create(text, smm_pack_id, user_id);
    }

    // Post should not be sent
    if (post.status === 'SENT') throw new UnauthorizedException('Unauthorized');
    // User sending should have a connection to the SMM Pack of the post
    const userSmmPackRelation =
      await this.userSmmPackRelationService.findRelations({
        user_id,
        pack_id: post.smm_pack_id,
      });
    if (!userSmmPackRelation)
      throw new Error('No relation between user and the given pack');
    const result = await this.telegramBotService.sendPost(
      text,
      settings.post_to,
    );

    if (result !== false) {
      result.forEach(async (tg_channel_id) => {
        await this.postTelegramRelationService.create(
          { post_id, tg_channel_id },
          user_id,
        );
      });
      await this.postRepo.update(post.id, {
        send_at: new Date(),
        status: PostStatus.SENT,
      });
      return true;
    }
    return false;
  }

  findAll() {
    return this.postRepo.find();
  }

  async findOne(post_id: string, user_id: string) {
    const post = await this.postRepo.findOne({ where: { id: post_id } });
    if (!post) return null;
    if (post.user_id !== user_id)
      throw new UnauthorizedException('Unauthorized');
    return post;
  }

  async findBy(
    { user_id, pack_id }: { user_id?: string; pack_id?: string },
    current_user_id: string,
  ) {
    if (current_user_id !== user_id)
      throw new UnauthorizedException('Unauthorized');
    // TODO if current_user_id and user_id are different, check that they have relation through any of the smm_packs
    if (user_id && pack_id) {
      return await this.postRepo.find({
        where: { user_id, smm_pack_id: pack_id },
      });
    }
    if (user_id) {
      return await this.postRepo.find({ where: { user_id } });
    }
    if (pack_id) {
      return await this.postRepo.find({ where: { smm_pack_id: pack_id } });
    }
    return await this.postRepo.find();
  }

  async create(text: string, smm_pack_id: string, user_id: string) {
    // create a user
    const user = await this.userSettingsService.findOne(user_id);
    if (!user) throw new Error('User not found');
    const relations = await this.userSmmPackRelationService.findRelations({
      user_id,
      pack_id: smm_pack_id,
    });
    if (!relations)
      throw new Error('No relation between user and the given pack');

    const post = this.postRepo.create({
      text,
      smm_pack_id,
      user_id,
      author: user.full_name,
    });
    return await this.postRepo.save(post);
  }

  async update(
    post_id: string,
    user_id: string,
    updatePostInput: UpdatePostInput,
  ) {
    const post = await this.postRepo.findOne({ where: { id: post_id } });
    if (!post) return 0;
    if (post.user_id !== user_id)
      throw new UnauthorizedException('Unauthorized');
    if (post.status === 'SENT') throw new UnauthorizedException('Unauthorized');
    const updateResult = await this.postRepo.update(post_id, updatePostInput);
    return updateResult.affected;
  }

  async onUserRemove(user: User) {
    // TODO if a post hasn't been sent, then delete it
    const posts = await this.postRepo.find({ where: { user_id: user.id } });
    if (!posts) return null;
    for (const post of posts) {
      if (post.status != PostStatus.SENT) {
        await this.postRepo.delete(post.id);
      } else {
        await this.postRepo.update(post.id, { user_id: null });
      }
    }
    return posts.length;
  }

  async onPackRemove(pack: SmmPack) {
    const posts = await this.postRepo.find({ where: { smm_pack_id: pack.id } });
    if (!posts) return null;
    for (const post of posts) {
      if (post.status != PostStatus.SENT) {
        await this.postRepo.delete(post.id);
      } else {
        await this.postRepo.update(post.id, { smm_pack_id: null });
      }
    }
    return posts.length;
  }

  async remove(id: string, user_id: string) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return null;
    if (post.user_id !== user_id)
      throw new UnauthorizedException('Unauthorized');
    if (post.status === 'SENT')
      throw new HttpException(
        'Cennot delete a sent post',
        HttpStatus.FORBIDDEN,
      );
    const deleteResult = await this.postRepo.delete(id);
    return deleteResult.affected;
  }
}
