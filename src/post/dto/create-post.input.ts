import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {

  @Field()
  text: string;

  @Field(() => ID)
  smm_pack_id: string;

  @Field(() => ID)
  user_id: string;
}
