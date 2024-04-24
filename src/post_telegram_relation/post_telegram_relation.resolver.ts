import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostTelegramRelationService } from './post_telegram_relation.service';
import { PostTelegramRelation } from './entities/post_telegram_relation.entity';
import { CreatePostTelegramRelationInput } from './dto/create-post_telegram_relation.input';
import { UpdatePostTelegramRelationInput } from './dto/update-post_telegram_relation.input';

@Resolver(() => PostTelegramRelation)
export class PostTelegramRelationResolver {
  constructor(
    private readonly postTelegramRelationService: PostTelegramRelationService,
  ) {}

  @Mutation(() => PostTelegramRelation)
  createPostTelegramRelation(
    @Args('createPostTelegramRelationInput')
    createPostTelegramRelationInput: CreatePostTelegramRelationInput,
  ) {
    return this.postTelegramRelationService.create(
      createPostTelegramRelationInput,
    );
  }

  @Query(() => [PostTelegramRelation], { name: 'postTelegramRelations' })
  findAll() {
    return this.postTelegramRelationService.findAll();
  }

  @Query(() => PostTelegramRelation, { name: 'postTelegramRelation' })
  findOne(
    @Args('tg_channel_id', { type: () => Int, nullable: true })
    tg_channel_id: number,
    @Args('post_id', { type: () => String, nullable: true }) post_id: string,
  ) {
    return this.postTelegramRelationService.findRelations(
      post_id,
      tg_channel_id,
    );
  }

  @Mutation(() => Int)
  updatePostTelegramRelation(
    @Args('updatePostTelegramRelationInput')
    updatePostTelegramRelationInput: UpdatePostTelegramRelationInput,
  ) {
    return this.postTelegramRelationService.update(
      updatePostTelegramRelationInput,
    );
  }
}
