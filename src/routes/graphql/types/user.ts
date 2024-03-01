import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';
import { UUID } from 'crypto';
import { Context } from './context.js';
import { Profile as ProfileDb, Post as PostDb } from '@prisma/client';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: Profile,
      resolve: async (source: UserInterface, args, context: Context, info) =>
        context.dataloaders.profileDataloader.load(source.id),
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (source: UserInterface, args, context: Context, info) =>
        context.dataloaders.postsOfUserDataloader.load(source.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (source: UserInterface, args, ctx: Context, info) =>
        source.userSubscribedTo
          ? await ctx.dataloaders.usersDataloader.loadMany(
              source.userSubscribedTo.map(({ authorId }) => authorId),
            )
          : [],
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (source: UserInterface, args, ctx: Context) => {
        const subscribedToUser: string[] | undefined = source.subscribedToUser?.map(
          (user) => user.subscriberId,
        );
        if (subscribedToUser) {
          const users = await ctx.dataloaders.usersDataloader.loadMany(subscribedToUser);
          // console.log(users);
          //console.log(`subscribed to user users ${users.map((user) => user.toString)}`);
          return users;
        }
      },
    },
  }),
});

export interface UserInterface {
  id: UUID;
  name: string;
  balance: number;
  profile: ProfileDb;
  posts: PostDb[];
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
}

export interface Subscription {
  subscriberId: string;
  authorId: string;
}

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
