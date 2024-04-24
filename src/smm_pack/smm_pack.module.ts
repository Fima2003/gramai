import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SmmPackService } from './smm_pack.service';
import { SmmPackResolver } from './smm_pack.resolver';
import { SmmPack } from './entities/smm_pack.entity';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SmmPack]), UserSmmPackRelationModule, UsersModule],
  providers: [SmmPackResolver, SmmPackService],
  exports: [SmmPackService],
})
export class SmmPackModule {}
