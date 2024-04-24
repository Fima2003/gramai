import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SmmPackService } from './smm_pack.service';
import { SmmPack } from './entities/smm_pack.entity';
import { CreateSmmPackInput } from './dto/create-smm_pack.input';
import { UpdateSmmPackInput } from './dto/update-smm_pack.input';

@Resolver(() => SmmPack)
export class SmmPackResolver {
  constructor(private readonly smmPackService: SmmPackService) {}

  @Mutation(() => SmmPack)
  createSmmPack(
    @Args('user_id') user_id: string,
    @Args('createSmmPackInput', { nullable: true })
    createSmmPackInput: CreateSmmPackInput,
  ) {
    return this.smmPackService.create(user_id, createSmmPackInput);
  }

  @Query(() => [SmmPack], { name: 'smmPacks' })
  findAll() {
    return this.smmPackService.findAll();
  }

  @Query(() => SmmPack, { name: 'smmPack', nullable: true })
  findOne(@Args('id') id: string) {
    return this.smmPackService.findOne(id);
  }

  @Mutation(() => Int)
  updateSmmPack(
    @Args('id') id: string,
    @Args('updateSmmPackInput') updateSmmPackInput: UpdateSmmPackInput,
  ) {
    return this.smmPackService.update(id, updateSmmPackInput);
  }

  @Mutation(() => Int)
  removeSmmPack(@Args('id') id: string) {
    return this.smmPackService.remove(id);
  }
}
