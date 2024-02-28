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
import { MemberType } from './member_type.js';

export type ProfileBody = Static<typeof profileSchema>;

export const Profile = new GraphQLObjectType<ProfileBody>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: { type: new GraphQLNonNull(MemberType) },
  }),
});
