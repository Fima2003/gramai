import { Inject, Injectable } from '@nestjs/common';
import { CreateSmmPackInput } from './dto/create-smm_pack.input';
import { UpdateSmmPackInput } from './dto/update-smm_pack.input';
import { InjectRepository } from '@nestjs/typeorm';
import { SmmPack } from './entities/smm_pack.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { UsersService } from 'src/users/users.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SmmPackService {
  constructor(
    @InjectRepository(SmmPack)
    private readonly smmPackRepository: Repository<SmmPack>,
    @Inject(UserSmmPackRelationService)
    private readonly userPackRelationService: UserSmmPackRelationService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  async create(user_id: string, createSmmPackInput: CreateSmmPackInput) {
    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    const newSmmPack = this.smmPackRepository.create(createSmmPackInput);
    const savedNewSMMPack = await this.smmPackRepository.save(newSmmPack);
    this.userPackRelationService.create({
      user_id,
      smm_pack_id: savedNewSMMPack.id,
    });
    return savedNewSMMPack;
  }

  findAll() {
    return this.smmPackRepository.find();
  }

  findOne(id: string) {
    return this.smmPackRepository.findOneBy({ id });
  }

  update(id: string, updateSmmPackInput: UpdateSmmPackInput) {
    const result = this.smmPackRepository.update(id, updateSmmPackInput);
    return result.then((res) => res.affected);
  }

  remove(id: string) {
    const result = this.smmPackRepository.delete(id);
    return result.then((res) => res.affected);
  }
}
