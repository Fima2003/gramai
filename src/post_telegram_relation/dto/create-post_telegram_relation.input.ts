import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePostTelegramRelationInput {
  @Field(() => Int)
  tg_channel_id: number;

  @Field(() => ID)
  post_id: string;

  @Field({ nullable: true })
  tg_message_id?: number;
}
