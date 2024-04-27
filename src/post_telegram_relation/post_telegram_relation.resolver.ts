import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostTelegramRelationService } from './post_telegram_relation.service';
import { PostTelegramRelation } from './entities/post_telegram_relation.entity';
import { CreatePostTelegramRelationInput } from './dto/create-post_telegram_relation.input';
import { UpdatePostTelegramRelationInput } from './dto/update-post_telegram_relation.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Resolver(() => PostTelegramRelation)
@UseGuards(JwtAuthGuard)
export class PostTelegramRelationResolver {
  constructor(
    private readonly postTelegramRelationService: PostTelegramRelationService,
  ) {}

  @Mutation(() => PostTelegramRelation)
  createPostTelegramRelation(
    @Args('createPostTelegramRelationInput')
    createPostTelegramRelationInput: CreatePostTelegramRelationInput,
    @CurrentUser()
    { user_id }: JwtUserPayload,
  ) {
    return this.postTelegramRelationService.create(
      createPostTelegramRelationInput,
      user_id,
    );
  }

  // TODO ONLY ACCESSIBLE BY ADMINS
  // @Query(() => [PostTelegramRelation], { name: 'postTelegramRelations' })
  // findAll() {
  //   return this.postTelegramRelationService.findAll();
  // }

  @Query(() => PostTelegramRelation, { name: 'postTelegramRelation' })
  findOne(
    @Args('tg_channel_id', { type: () => Int, nullable: true })
    tg_channel_id: number,
    @Args('post_id', { type: () => String, nullable: true }) post_id: string,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.postTelegramRelationService.findRelations(
      user_id,
      post_id,
      tg_channel_id,
    );
  }

  @Mutation(() => Int)
  updatePostTelegramRelation(
    @Args('updatePostTelegramRelationInput')
    updatePostTelegramRelationInput: UpdatePostTelegramRelationInput,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.postTelegramRelationService.update(
      updatePostTelegramRelationInput,
      user_id
    );
  }
}
