import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { PostSettingsInput } from './post-settings';

@InputType()
export class GeneratePostInput {
  @Field()
  prompt: string;

  @Field()
  type: 'generate' | 'regenerate';

  @Field(() => PostSettingsInput)
  settings: PostSettingsInput;

  @Field(() => ID, { nullable: true })
  smm_pack_id?: string;

  @Field(() => ID, { nullable: true })
  post_id?: string;
}
