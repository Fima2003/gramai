import { Test, TestingModule } from '@nestjs/testing';
import { TgChannelsResolver } from './tg_channels.resolver';
import { TgChannelsService } from './tg_channels.service';

describe('TgChannelsResolver', () => {
  let resolver: TgChannelsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgChannelsResolver, TgChannelsService],
    }).compile();

    resolver = module.get<TgChannelsResolver>(TgChannelsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
