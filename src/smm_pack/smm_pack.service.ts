import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateSmmPackInput } from './dto/create-smm_pack.input';
import { UpdateSmmPackInput } from './dto/update-smm_pack.input';
import { InjectRepository } from '@nestjs/typeorm';
import { SmmPack } from './entities/smm_pack.entity';
import { Repository } from 'typeorm';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { UsersService } from 'src/users/users.service';
import { NotFoundError } from 'rxjs';
import { PostService } from 'src/post/post.service';
import { UserSmmPackRelation } from 'src/users_smm_pack_relationship/entities/users_smm_pack_relation.entity';

@Injectable()
export class SmmPackService {
  constructor(
    @InjectRepository(SmmPack)
    private readonly smmPackRepository: Repository<SmmPack>,

    @Inject(UserSmmPackRelationService)
    private readonly userPackRelationService: UserSmmPackRelationService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(PostService)
    private readonly postService: PostService,
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

  findOne(user_id: string, pack_id: string) {
    // You can find only packs that are related to the user
    const relation = this.userPackRelationService.findRelations({
      user_id,
      pack_id,
    });
    if (!relation) {
      throw new HttpException('Pack not found', HttpStatus.NOT_FOUND);
    }
    return this.smmPackRepository.findOneBy({ id: pack_id });
  }

  async update(
    pack_id: string,
    updateSmmPackInput: UpdateSmmPackInput,
    user_id: string,
  ) {
    const relation = await this.userPackRelationService.findRelations({
      user_id,
      pack_id,
    });
    if (!relation) {
      throw new HttpException('Pack not found', HttpStatus.NOT_FOUND);
    }
    const result = await this.smmPackRepository.update(
      pack_id,
      updateSmmPackInput,
    );
    return result.affected;
  }

  async addUserToPack(id_to_add: string, pack_id: string, user_id: string) {
    const pack = await this.smmPackRepository.findOne({
      where: { id: pack_id },
    });
    if (!pack) {
      throw new HttpException('Pack not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.usersService.findOne(id_to_add);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const relation = await this.userPackRelationService.findRelations({
      user_id,
      pack_id,
    });
    if(relation !== null){
      return 0;
    }
    await this.userPackRelationService.create({
      user_id: id_to_add,
      smm_pack_id: pack_id,
    });
    return await this.update(
      pack_id,
      { amount_of_users: pack.amount_of_users + 1 },
      user_id,
    );
  }

  async remove(pack_id: string, user_id: string) {
    const relation = await this.userPackRelationService.findRelations({
      user_id,
      pack_id,
    });
    if (!relation) {
      throw new UnauthorizedException('Unauthorized');
    }
    const pack = await this.smmPackRepository.findOne({
      where: { id: pack_id },
    });
    if (!pack) {
      throw new HttpException('Pack not found', HttpStatus.NOT_FOUND);
    }
    await this.postService.onPackRemove(pack);
    const result = await this.smmPackRepository.delete(pack_id);
    return result.affected;
  }

  async deleteSingleSmmPack(user_id: string) {
    const relations = await this.userPackRelationService.findRelations({
      user_id,
    });
    if (!relations) {
      throw new HttpException('No relations found', HttpStatus.NOT_FOUND);
    }
    let relationsToBeChecked = [];
    if (!Array.isArray(relations)) {
      relationsToBeChecked = [relations];
    } else {
      relationsToBeChecked = relations;
    }
    for (const relation of relationsToBeChecked) {
      const relationsWithSamePack =
        (await this.userPackRelationService.findRelations({
          pack_id: relation.smm_pack_id,
        })) as UserSmmPackRelation[];
      if (relationsWithSamePack.length === 1) {
        await this.remove(relation.smm_pack_id, user_id);
      }
    }
  }
}
