import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserSettingsService } from 'src/user_settings/user_settings.service';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @Inject(UserSmmPackRelationService)
    private readonly userSmmPackRelationService: UserSmmPackRelationService,
    @Inject(UserSettingsService)
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async create(user_id: string, createPostInput: CreatePostInput) {
    const userSmmPackRelation =
      await this.userSmmPackRelationService.findRelations(
        {user_id,
        pack_id: createPostInput.smm_pack_id,}
      );
    if (!userSmmPackRelation)
      throw new Error('No relation between user and the given pack');
    const user = await this.userSettingsService.findOne(user_id);
    if (!user) throw new Error('User not found');
    const name = user.full_name;

    const post = this.postRepo.create({
      ...createPostInput,
      user_id,
      author: name,
    });
    return await this.postRepo.save(post);
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
      await this.postRepo.update(post.id, { user_id: null });
    }
    return posts.length;
  }

  async onPackRemove(pack: SmmPack) {
    const posts = await this.postRepo.find({ where: { smm_pack_id: pack.id } });
    if (!posts) return null;
    for (const post of posts) {
      await this.postRepo.update(post.id, { smm_pack_id: null });
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
