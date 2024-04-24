import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateUsersSmmPackRelationshipInput {
  @Field( () => ID, { description: 'SMM Pack ID' })
  smm_pack_id: string;

  @Field( () => ID, { description: 'User ID' })
  user_id: string;
}
