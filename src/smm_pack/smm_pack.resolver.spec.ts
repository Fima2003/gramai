import { Test, TestingModule } from '@nestjs/testing';
import { SmmPackResolver } from './smm_pack.resolver';
import { SmmPackService } from './smm_pack.service';

describe('SmmPackResolver', () => {
  let resolver: SmmPackResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmmPackResolver, SmmPackService],
    }).compile();

    resolver = module.get<SmmPackResolver>(SmmPackResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
