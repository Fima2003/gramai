import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';

@ObjectType()
@Index('user_smm_pack_relation_pkey', ['smm_pack_id', 'user_id'], {
  unique: true,
})
@Entity('user_smm_pack_relation')
export class UserSmmPackRelation {
  @Field((type) => ID)
  @PrimaryColumn({ type: 'uuid' })
  smm_pack_id: string;

  @Field((type) => ID)
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Field()
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Field()
  @ManyToOne(() => SmmPack, (smmPack) => smmPack.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'smm_pack_id' })
  smm_pack: SmmPack;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
