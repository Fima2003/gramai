import { Module } from '@nestjs/common';
import { UserSmmPackRelationService } from './users_smm_pack_relation.service';
import { UserSmmPackRelationResolver } from './users_smm_pack_relation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSmmPackRelation } from './entities/users_smm_pack_relation.entity';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSmmPackRelation]), TypeOrmModule.forFeature([SmmPack])],
  providers: [UserSmmPackRelationResolver, UserSmmPackRelationService],
  exports: [UserSmmPackRelationService],
})
export class UserSmmPackRelationModule {}
