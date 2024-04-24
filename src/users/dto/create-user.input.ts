import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString, IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(google|pswd)$/i)
  access: string;
}
