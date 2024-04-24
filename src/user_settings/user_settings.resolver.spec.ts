import { Test, TestingModule } from '@nestjs/testing';
import { UserSettingsResolver } from './user_settings.resolver';
import { UserSettingsService } from './user_settings.service';

describe('UserSettingsResolver', () => {
  let resolver: UserSettingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSettingsResolver, UserSettingsService],
    }).compile();

    resolver = module.get<UserSettingsResolver>(UserSettingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
