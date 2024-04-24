import { Test, TestingModule } from '@nestjs/testing';
import { TgChannelsService } from './tg_channels.service';

describe('TgChannelsService', () => {
  let service: TgChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgChannelsService],
    }).compile();

    service = module.get<TgChannelsService>(TgChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
