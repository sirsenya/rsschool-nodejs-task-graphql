import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Static } from '@sinclair/typebox';
import { userSchema } from '../../users/schemas.js';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';
import { UUID } from 'crypto';
import { Context } from './context.js';

export type UserBody = Static<typeof userSchema>;

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: { type: Profile },
    posts: { type: new GraphQLList(Post) },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: (source, _: { id: UUID }, ctx: Context) =>
        ctx.prisma.user.findMany({
          where: {
            subscribedToUser: {
              every: {
                subscriberId: _.id,
              },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: (source, _: { id: UUID }, ctx: Context) =>
        ctx.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              every: {
                authorId: _.id,
              },
            },
          },
        }),
    },
  }),
});

// export interface UserInputInterface {
//   userSubscribedTo: {
//     subscriberId: UUID;
//     authorId: UUID;
//   };
//   subscribedToUser: {
//     subscriberId: UUID;
//     authorId: UUID;
//   };
// }
