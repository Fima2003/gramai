import { InputType, Field, } from '@nestjs/graphql';

@InputType()
export class UpdateTgChannelInput {
  // Make it look online on its own to see if there is now a username of telegram channel
  // @Field({ nullable: true })
  // username?: string;

  @Field({ nullable: true })
  name?: string;
}
