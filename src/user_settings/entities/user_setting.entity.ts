import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Adjust the import based on your actual User entity path

@ObjectType()
@Entity('user_settings')
export class UserSettings {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  full_name: string;

  @Field({ nullable: true })
  @Column({ type: 'integer', nullable: true, unique: true })
  telegram?: number;

  @Column({ nullable: true, type: 'varchar', length: 20 })
  pswd?: string;

  @Field()
  @Column({ type: 'varchar', length: 20, default: 'en-US' })
  locale: string;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  verified_email: boolean;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  email: string;


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
}
