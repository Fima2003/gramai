import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SmmPack } from 'src/smm_pack/entities/smm_pack.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('tg_channel')
export class TgChannel {
  @Field(type => ID)
  @PrimaryColumn() // Defaults to an integer-based primary key
  id: number;

  @Field({ nullable: true }) // Username can be null
  @Column({ type: 'varchar', length: 40, nullable: true, default: null })
  username?: string | null;

  @Field(type => String)
  @Column({ type: 'uuid' })
  smm_pack_id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field()
  @Column({ type: 'varchar', length: 256 })
  name: string;

  // Relationship to SmmPack entity
  @ManyToOne(() => SmmPack, smmPack => smmPack.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'smm_pack_id' })
  smmPack: SmmPack;
}
