import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SmmPackService } from './smm_pack.service';
import { SmmPackResolver } from './smm_pack.resolver';
import { SmmPack } from './entities/smm_pack.entity';
import { UserSmmPackRelationModule } from 'src/users_smm_pack_relationship/users_smm_pack_relation.module';
import { UsersModule } from 'src/users/users.module';
import { PostModule } from 'src/post/post.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([SmmPack]), UserSmmPackRelationModule, forwardRef(() => UsersModule), PostModule],
  providers: [SmmPackResolver, SmmPackService, JwtService],
  exports: [SmmPackService],
})
export class SmmPackModule {}
