import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserSmmPackRelationService } from './users_smm_pack_relation.service';
import { CreateUsersSmmPackRelationshipInput } from './dto/create-users_smm_pack_relationship.input';
import { UserSmmPackRelation } from './entities/users_smm_pack_relation.entity';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Resolver(() => UserSmmPackRelation)
export class UserSmmPackRelationResolver {
  constructor(
    private readonly usersSmmPackRelationService: UserSmmPackRelationService,
  ) {}

  // @Mutation(() => UserSmmPackRelation)
  // createUsersSmmPackRelationship(
  //   @Args('user_id', { type: () => ID }) user_id: string,
  //   @Args('pack_id', { type: () => ID }) pack_id: string,
  // ) {
  //   return this.usersSmmPackRelationService.create({
  //     user_id,
  //     smm_pack_id: pack_id,
  //   });
  // }

  // TODO SHOULD BE ONLY ACCESSIBLE BY ADMIN
  // @Query(() => [UserSmmPackRelation], { name: 'usersSmmPackRelationship' })
  // findAll() {
  //   return this.usersSmmPackRelationService.findAll();
  // }

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserSmmPackRelation], {
    name: 'usersSmmPackRelationships',
  })
  findBy(
    @CurrentUser() { user_id }: JwtUserPayload,
    // @Args('user_id', { type: () => ID, nullable: true }) user_id?: string,
    @Args('pack_id', { type: () => ID, nullable: true }) pack_id?: string,
  ) {
    const res = this.usersSmmPackRelationService.findRelations({
      user_id,
      pack_id,
    });
    return res;
  }
}
