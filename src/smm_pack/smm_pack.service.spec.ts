import { Test, TestingModule } from '@nestjs/testing';
import { SmmPackService } from './smm_pack.service';

describe('SmmPackService', () => {
  let service: SmmPackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmmPackService],
    }).compile();

    service = module.get<SmmPackService>(SmmPackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
