import { Module } from '@nestjs/common';
import { UserSmmPackRelationService } from './users_smm_pack_relation.service';
import { UserSmmPackRelationResolver } from './users_smm_pack_relation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSmmPackRelation } from './entities/users_smm_pack_relation.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserSmmPackRelation])],
  providers: [UserSmmPackRelationResolver, UserSmmPackRelationService, JwtService],
  exports: [UserSmmPackRelationService],
})
export class UserSmmPackRelationModule {}
