import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SmmPackService } from './smm_pack.service';
import { SmmPack } from './entities/smm_pack.entity';
import { CreateSmmPackInput } from './dto/create-smm_pack.input';
import { UpdateSmmPackInput } from './dto/update-smm_pack.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/paramDecorators/jwt-payload.decorator';

@Resolver(() => SmmPack)
@UseGuards(JwtAuthGuard)
export class SmmPackResolver {
  constructor(private readonly smmPackService: SmmPackService) {}


  // TODO create a custom response that would take template(f.e. SmmPack), but have a general response data, message, error, code
  @Mutation(() => SmmPack)
  createSmmPack(
    @CurrentUser() { user_id }: JwtUserPayload,
    @Args('createSmmPackInput', { nullable: true })
    createSmmPackInput: CreateSmmPackInput,
  ) {
    return this.smmPackService.create(user_id, createSmmPackInput);
  }

  // TODO SHOULD BE ONLY ACCESSIBLE BY ADMIN
  // @Query(() => [SmmPack], { name: 'smmPacks' })
  // findAll() {
  //   return this.smmPackService.findAll();
  // }

  @Query(() => SmmPack, { name: 'smmPack', nullable: true })
  findOne(@Args('id') id: string, @CurrentUser() { user_id }: JwtUserPayload) {
    return this.smmPackService.findOne(user_id, id);
  }

  @Mutation(() => Int)
  updateSmmPack(
    @Args('pack_id') pack_id: string,
    @Args('updateSmmPackInput') updateSmmPackInput: UpdateSmmPackInput,
    @CurrentUser() { user_id }: JwtUserPayload,
  ) {
    return this.smmPackService.update(pack_id, updateSmmPackInput, user_id);
  }

  @Mutation(() => Int)
  addUserToSmmPack(@Args("id_to_add") id_to_add: string, @Args('pack_id') pack_id: string, @CurrentUser() {user_id} : JwtUserPayload){
    return this.smmPackService.addUserToPack(id_to_add, pack_id, user_id);
  }

  @Mutation(() => Int)
  removeSmmPack(@Args('id') pack_id: string, @CurrentUser() { user_id }: JwtUserPayload) {
    return this.smmPackService.remove(pack_id, user_id);
  }
}
