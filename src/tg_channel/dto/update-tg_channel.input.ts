import { CreateTgChannelInput } from './create-tg_channel.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTgChannelInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  name?: string;
}
