import { Injectable } from '@nestjs/common';
import { CreateUsersSmmPackRelationshipInput } from './dto/create-users_smm_pack_relationship.input';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSmmPackRelation } from './entities/users_smm_pack_relation.entity';
import { Repository } from 'typeorm';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';

@Injectable()
export class UserSmmPackRelationService {
  constructor(
    @InjectRepository(UserSmmPackRelation)
    private readonly userSmmPackRelationRepository: Repository<UserSmmPackRelation>,
  ) {}

  async create(
    createUsersSmmPackRelationshipInput: CreateUsersSmmPackRelationshipInput,
  ) {
    const { user_id, smm_pack_id } = createUsersSmmPackRelationshipInput;
    const exists = await this.findRelations({ user_id, pack_id: smm_pack_id });
    if (exists) {
      return exists;
    }
    const newReltaion = this.userSmmPackRelationRepository.create(
      createUsersSmmPackRelationshipInput,
    );
    const newRelationSaved =
      await this.userSmmPackRelationRepository.save(newReltaion);
    return newRelationSaved;
  }

  findAll() {
    return this.userSmmPackRelationRepository.find();
  }

  findRelations({
    user_id,
    pack_id,
  }: {
    user_id?: string;
    pack_id?: string;
  }): Promise<UserSmmPackRelation[] | UserSmmPackRelation> {
    if (!user_id && !pack_id) {
      return this.userSmmPackRelationRepository.find();
    }
    if (user_id && !pack_id) {
      return this.userSmmPackRelationRepository.find({
        where: { user_id },
      });
    }
    if (!user_id && pack_id) {
      return this.userSmmPackRelationRepository.find({
        where: { smm_pack_id: pack_id },
      });
    }
    return this.userSmmPackRelationRepository.findOne({
      where: { user_id, smm_pack_id: pack_id },
      relations: ['smm_pack'],
    });
  }
}
