import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { PostService } from 'src/post/post.service';
import { SmmPackService } from 'src/smm_pack/smm_pack.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @Inject(PostService)
    private readonly postService: PostService,

    @Inject(forwardRef(() => SmmPackService))
    private readonly smmPackService: SmmPackService,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findOneBy(obj: any, relations: boolean = false){
    return this.userRepository.findOne({where: obj, relations: relations ? ['userSettings'] : []});
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if(!user) return 0;
    await this.postService.onUserRemove(user);
    await this.smmPackService.deleteSingleSmmPack(id);
    const result = await this.userRepository.delete(id);
    return result.affected;
  }
}
