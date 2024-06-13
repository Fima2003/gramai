import { PostStatus } from '../utils/post-status.enum';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field(() => PostStatus, { nullable: true })
  status?: PostStatus;

  @Field({ nullable: true })
  send_at?: Date;

  @Field({ nullable: true })
  text?: string;
}
