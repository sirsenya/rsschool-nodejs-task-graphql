import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Static } from '@sinclair/typebox';
import { UUIDType } from './uuid.js';
import { profileSchema } from '../../profiles/schemas.js';
import { MemberTypeIdType } from './member_type.js';
import { postSchema } from '../../posts/schemas.js';

export type PostBody = Static<typeof postSchema>;

export const Post = new GraphQLObjectType<PostBody>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});
