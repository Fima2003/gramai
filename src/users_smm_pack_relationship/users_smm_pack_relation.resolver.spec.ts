import { Test, TestingModule } from '@nestjs/testing';
import { UsersSmmPackRelationshipResolver } from './users_smm_pack_relation.resolver';
import { UsersSmmPackRelationshipService } from './users_smm_pack_relation.service';

describe('UsersSmmPackRelationshipResolver', () => {
  let resolver: UsersSmmPackRelationshipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersSmmPackRelationshipResolver, UsersSmmPackRelationshipService],
    }).compile();

    resolver = module.get<UsersSmmPackRelationshipResolver>(UsersSmmPackRelationshipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
