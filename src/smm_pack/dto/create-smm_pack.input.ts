import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSmmPackInput {
  @Field({ description: 'Name of the SMM Pack', nullable: true })
  name?: string;

  @Field({ description: 'System for chat gpt', nullable: true })
  system?: string;

  @Field({
    description: 'Language at which the generations will occur',
    nullable: true,
  })
  language?: string;
}
