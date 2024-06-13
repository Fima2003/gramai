import { InputType, Field, ID } from '@nestjs/graphql';
import { PostSettingsInput } from './post-settings';

@InputType()
export class PublishPostInput {

  @Field(() => ID, {nullable: true})
  smm_pack_id?: string;

  @Field()
  text: string;

  @Field(() => PostSettingsInput)
  settings: PostSettingsInput;

  @Field(() => ID, {nullable: true})
  post_id?: string;
}
