import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { memberTypeSchema } from '../../member-types/schemas.js';
import { Static } from '@sinclair/typebox';
import { MemberTypeIdType, Profile } from './profile.js';

export type MemberTypeBody = Static<typeof memberTypeSchema>;

export const MemberType = new GraphQLObjectType<MemberTypeBody>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    profiles: {
      type: new GraphQLList(Profile),
    },
  }),
});
