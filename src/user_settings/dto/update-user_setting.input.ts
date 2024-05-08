import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserSettingInput {
  @Field({ nullable: true })
  current_smm_pack_tg?: string;

  @Field({ nullable: true })
  locale?: string;

  @Field({ nullable: true })
  timezone?: string;
}
