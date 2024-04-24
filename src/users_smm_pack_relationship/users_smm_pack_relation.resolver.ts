import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserSmmPackRelationService } from './users_smm_pack_relation.service';
import { CreateUsersSmmPackRelationshipInput } from './dto/create-users_smm_pack_relationship.input';
import { UserSmmPackRelation } from './entities/users_smm_pack_relation.entity';

@Resolver(() => UserSmmPackRelation)
export class UserSmmPackRelationResolver {
  constructor(
    private readonly usersSmmPackRelationService: UserSmmPackRelationService,
  ) {}

  @Mutation(() => UserSmmPackRelation)
  createUsersSmmPackRelationship(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('pack_id', { type: () => ID }) pack_id: string,
  ) {
    return this.usersSmmPackRelationService.create(
      { user_id, smm_pack_id: pack_id},
    );
  }

  @Query(() => [UserSmmPackRelation], { name: 'usersSmmPackRelationship' })
  findAll() {
    return this.usersSmmPackRelationService.findAll();
  }

  @Query(() => [UserSmmPackRelation], {
    name: 'usersSmmPackRelationshipsByUserId',
  })
  findByUser(
    @Args('user_id', { type: () => ID, nullable: true }) user_id?: string,
    @Args('pack_id', { type: () => ID, nullable: true }) pack_id?: string,
  ) {
    const res = this.usersSmmPackRelationService.findRelations(user_id, pack_id);
    console.log(res);
    return res;
  }
}
