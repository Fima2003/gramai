import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class IPostTo {
  @Field()
  sm: 'telegram';

  @Field()
  id: string;
}

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class PostSettings {
  @Field()
  system: string;

  @Field(() => [String])
  positive_keys: string[];

  @Field(() => [String])
  negative_keys: string[];

  @Field()
  language: string | null;

  @Field(() => [IPostTo])
  post_to: IPostTo[];

  @Field(() => [String])
  sources: string[];
}

@InputType()
export class PostSettingsInput extends PostSettings {}

@ObjectType()
export class PostSettingsObject extends PostSettings {}
