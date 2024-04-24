import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { TgChannel } from 'src/tg_channel/entities/tg_channel.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Index('post_telegram_relation_pkey', ['tg_channel_id', 'post_id'], {
  unique: true,
})
@Entity('post_telegram_relation')
export class PostTelegramRelation {
  @Field(() => Int)
  @PrimaryColumn({ type: 'number' })
  tg_channel_id: number;

  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid' })
  post_id: string;

  @Field(() => Int, { nullable: true })
  @Column()
  tg_message_id?: number;

  @ManyToOne(() => TgChannel, (tgChannel) => tgChannel.id, {})
  @JoinColumn({ name: 'tg_channel_id' })
  tg_channel: TgChannel;

  @ManyToOne(() => Post, (post) => post.id, {})
  @JoinColumn({ name: 'tg_channel_id' })
  psot: Post;
}
