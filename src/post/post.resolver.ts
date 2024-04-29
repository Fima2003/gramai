import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  Context,
  GqlExecutionContext,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Resolver(() => Post)
@UseGuards(JwtAuthGuard)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.postService.create(user_id, createPostInput);
  }

  // TODO SHOULD BE ONLY ACCESSIBLE BY ADMIN
  // @Query(() => [Post], { name: 'posts', nullable: true })
  // findAll() {
  //   return this.postService.findAll();
  // }

  @Query(() => Post, { name: 'post', nullable: true })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.postService.findOne(id, user_id);
  }

  @Query(() => [Post], { name: 'posts', nullable: true })
  findBy(
    @CurrentUser() { user_id: current_user_id }: JwtUserPayload,
    @Args('pack_id', { nullable: true }) pack_id?: string,
    @Args('user_id', { nullable: true }) user_id?: string,
  ) {
    return this.postService.findBy({ user_id, pack_id }, current_user_id);
  }

  @Mutation(() => Int)
  updatePost(
    @Args('id') id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.postService.update(id, user_id, updatePostInput);
  }

  @Mutation(() => Int)
  removePost(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.postService.remove(id, user_id);
  }
}
