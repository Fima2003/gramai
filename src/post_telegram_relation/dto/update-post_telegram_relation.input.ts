import { CreatePostTelegramRelationInput } from './create-post_telegram_relation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostTelegramRelationInput extends CreatePostTelegramRelationInput{
}
