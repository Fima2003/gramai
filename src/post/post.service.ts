import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @Inject(UserSmmPackRelationService)
    private readonly userSmmPackRelationService: UserSmmPackRelationService,
  ) {}

  async create(createPostInput: CreatePostInput) {
    // check that there exists relation with user_id and smm_pack_id
    const userSmmPackRelation =
      await this.userSmmPackRelationService.findRelations(
        createPostInput.user_id,
        createPostInput.smm_pack_id,
      );
    if (!userSmmPackRelation)
      throw new Error('No relation between user and the given pack');

    const post = this.postRepo.create(createPostInput);
    return await this.postRepo.save(post);
  }

  findAll() {
    return this.postRepo.find();
  }

  findOne(id: string) {
    return this.postRepo.findOne({ where: { id } });
  }

  async update(id: string, updatePostInput: UpdatePostInput) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return 0;
    if (post.status === 'SENT') throw new Error('Cannot update a sent post.');
    const updateResult = await this.postRepo.update(id, updatePostInput);
    return updateResult.affected;
  }

  async remove(id: string) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return 0;
    if (post.status === 'SENT') throw new Error('Cannot delete a sent post.');
    const deleteResult = await this.postRepo.delete(id);
    return deleteResult.affected;
  }
}
