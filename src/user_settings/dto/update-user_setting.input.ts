import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserSettingInput {
  @Field(() => Int, { nullable: true })
  telegram?: number;

  @Field({ nullable: true })
  locale?: string;

  @Field({ nullable: true })
  timezone?: string;

  @Field({ nullable: true })
  verified_email?: boolean;
}
