import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTgChannelInput {
  @Field(() => Int, {description: 'The id of the channel', nullable: false})
  id: number;

  @Field({nullable: true})
  username?: string;

  @Field({nullable: false})
  smm_pack_id: string;

  @Field({nullable: false})
  name: string;
}
