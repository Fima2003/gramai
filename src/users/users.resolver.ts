import { Resolver, Query, Mutation, Args, Int, ObjectType } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users', nullable: true })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async findOne(@Args('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => Int)
  async removeUser(@Args('id') id: string) {
    return await this.usersService.remove(id);
  }
}
