import { Test, TestingModule } from '@nestjs/testing';
import { PostTelegramRelationResolver } from './post_telegram_relation.resolver';
import { PostTelegramRelationService } from './post_telegram_relation.service';

describe('PostTelegramRelationResolver', () => {
  let resolver: PostTelegramRelationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostTelegramRelationResolver, PostTelegramRelationService],
    }).compile();

    resolver = module.get<PostTelegramRelationResolver>(PostTelegramRelationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
