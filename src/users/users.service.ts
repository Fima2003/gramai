import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(UserSmmPackRelationService)
    private readonly userPackRelationService: UserSmmPackRelationService,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({where: {id}});
  }

  async remove(id: string) {
    await this.userPackRelationService.deleteSingleSmmPackRelation(id);
    const result = await this.userRepository.delete(id);
    return result.affected;
  }
}
