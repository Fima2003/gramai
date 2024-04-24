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
    @InjectRepository(SmmPack)
    private readonly smmPackRepository: Repository<SmmPack>,
  ) {}

  async create(
    createUsersSmmPackRelationshipInput: CreateUsersSmmPackRelationshipInput,
  ) {
    const exists = await this.findRelations(
      createUsersSmmPackRelationshipInput.user_id,
      createUsersSmmPackRelationshipInput.smm_pack_id,
    );
    if (exists) {
      return exists;
    }
    const newReltaion = this.userSmmPackRelationRepository.create(
      createUsersSmmPackRelationshipInput,
    );
    const newRelationSaved = await this.userSmmPackRelationRepository.save(newReltaion);
    return newRelationSaved;
  }

  findAll() {
    return this.userSmmPackRelationRepository.find();
  }

  findRelations(user_id?: string, pack_id?: string) {
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

  async deleteSingleSmmPackRelation(user_id: string) {
    // given user_id, find all relations with that user_id. Those relations will have a smm_pack_id, which is the id of the pack that the user has. If the pack has only one user, then delete the relation. Create a method that will delete the relation if the pack has only one user. Use this method in the UsersService class to delete a user.
    const relations = await this.userSmmPackRelationRepository.find({
      where: { user_id },
    });
    const promises = relations.map(async (relation) => {
      const relationsWithSamePack =
        await this.userSmmPackRelationRepository.find({
          where: { smm_pack_id: relation.smm_pack_id },
        });
      if (relationsWithSamePack.length === 1) {
        await this.smmPackRepository.delete(relation.smm_pack_id);
      }
    });
  }
}
