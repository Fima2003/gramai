import { Test, TestingModule } from '@nestjs/testing';
import { UsersSmmPackRelationshipService } from './users_smm_pack_relation.service';

describe('UsersSmmPackRelationshipService', () => {
  let service: UsersSmmPackRelationshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersSmmPackRelationshipService],
    }).compile();

    service = module.get<UsersSmmPackRelationshipService>(UsersSmmPackRelationshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
