import { registerEnumType } from "@nestjs/graphql";

export enum PostStatus{
    WAITING = 'WAITING',
    CREATED = 'CREATED',
    SENT = 'SENT',
    CANCELLED = 'CANCELLED'
}

registerEnumType(PostStatus, {
    name: 'post_status'
})