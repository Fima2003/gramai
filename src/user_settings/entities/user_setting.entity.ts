import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Adjust the import based on your actual User entity path
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';

@ObjectType()
@Entity('user_settings')
export class UserSettings {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  full_name: string;

  @Column({ nullable: true, type: 'varchar', length: 20 })
  pswd?: string;

  @Field()
  @Column({ type: 'varchar', length: 20, default: 'en-US' })
  locale: string;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @Field((type) => ID, { nullable: true })
  @Column({type: 'uuid', nullable: true})
  current_smm_pack_tg: string;

  
  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.userSettings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => SmmPack)
  @ManyToOne(() => SmmPack, (smmPack) => smmPack.id)
  @JoinColumn({name: 'current_smm_pack_tg'})
  current_smm_pack: SmmPack;
}
