import { CreateTgChannelInput } from './create-tg_channel.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTgChannelInput {
  // Make it look online on its own to see if there is now a username of telegram channel
  // @Field({ nullable: true })
  // username?: string;

  @Field({ nullable: true })
  name?: string;
}
