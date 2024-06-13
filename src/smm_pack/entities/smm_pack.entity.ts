import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('smm_packs')
export class SmmPack {
  @Field(() => ID, { description: 'UUID of smm pack' })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field(() => Int, { description: 'Amount of Users' })
  @Column({
    type: 'int',
    nullable: false,
    default: 1,
  })
  amount_of_users: number;

  @Field()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    default: 'SMM Pack',
  })
  name: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  system?: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'en',
  })
  language: string;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
