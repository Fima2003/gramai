import { CreateSmmPackInput } from './create-smm_pack.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSmmPackInput extends PartialType(CreateSmmPackInput) {
  @Field(() => Int, {nullable: true})
  amount_of_users?: number;
}
