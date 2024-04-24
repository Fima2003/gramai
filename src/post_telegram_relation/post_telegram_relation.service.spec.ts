import { Test, TestingModule } from '@nestjs/testing';
import { PostTelegramRelationService } from './post_telegram_relation.service';

describe('PostTelegramRelationService', () => {
  let service: PostTelegramRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostTelegramRelationService],
    }).compile();

    service = module.get<PostTelegramRelationService>(PostTelegramRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
