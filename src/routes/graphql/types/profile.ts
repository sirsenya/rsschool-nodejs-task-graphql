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
import { Context } from './context.js';
import { UUID } from 'crypto';
import { MemberTypeId } from '../../member-types/schemas.js';

//export type ProfileBody = Static<typeof profileSchema>;

export const Profile = new GraphQLObjectType<ProfileInputInteface>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      //   resolve: (source: ProfileInputInteface, args, context: Context, info) =>
      //     context.dataloaders.memberTypeDataloader.load(source.memberTypeId),
    },
  }),
});

interface ProfileInputInteface {
  id: UUID;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeId;
}
