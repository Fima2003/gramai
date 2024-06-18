import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserSettings } from '../../user_settings/entities/user_setting.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  access: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true, unique: true })
  telegram?: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  verified_email: boolean;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Field()
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user, {
    cascade: true,
  })
  userSettings: UserSettings;
}
