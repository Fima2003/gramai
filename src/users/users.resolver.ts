import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users', nullable: true })
  async findAll(@Context() { req }) {
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
