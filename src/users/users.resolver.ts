import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // TODO SHOULD BE ONLY ACCESSIBLE BY ADMIN
  // @Query(() => [User], { name: 'users', nullable: true })
  // async findAll(@Context() { req }) {
  //   return await this.usersService.findAll();
  // }

  // TODO SHOULD BE ONLY ACCESSIBLE BY ADMIN
  // @Query(() => User, { name: 'user', nullable: true })
  // async findOne(@Args('id') id: string) {
  //   return await this.usersService.findOne(id);
  // }

  @Mutation(() => Int)
  async removeUser(@CurrentUser() { user_id }: JwtUserPayload) {
    return await this.usersService.remove(user_id);
  }
}
