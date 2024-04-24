import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';
import { UserSettings } from 'src/user_settings/entities/user_setting.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PostStatus } from '../utils/post-status.enum';

@ObjectType() // GraphQL Type
@Entity('post') // Database Table
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid') // UUID primary key
  id: string;

  @Field(() => PostStatus)
  @Column({
    type: "enum",
    enum: ['CREATED', 'SENT', 'CANCELLED', 'WAITING'],
    default: 'CREATED'
  })
  status: PostStatus;

  @Field({nullable: true})
  @Column({ type: 'timestamp without time zone', nullable: true })
  send_at?: Date;

  @Field()
  @Column({ type: 'text' })
  text: string;

  @Field(() => ID)
  @Column({ type: 'uuid' }) // UUID foreign key to SmmPack
  smm_pack_id: string;

  @Field(() => ID)
  @Column({ type: 'uuid' }) // UUID foreign key to UserSettings
  user_id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }) // Automatically managed created_at timestamp
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }) // Automatically managed updated_at timestamp
  updated_at: Date;

  // Relationships
  @ManyToOne(() => SmmPack, smmPack => smmPack.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'smm_pack_id' })
  smmPack: SmmPack;

  @ManyToOne(() => UserSettings, userSettings => userSettings.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userSettings: UserSettings;
}
