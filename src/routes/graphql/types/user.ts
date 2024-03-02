import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';
import { UUID } from 'crypto';
import { Profile as ProfileDb, Post as PostDb } from '@prisma/client';
import { Context } from '../schemas.js';

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
      resolve: async (source: UserInterface, args, ctx: Context, info) => {
        const userSubscribedTo: string[] | undefined = source.userSubscribedTo?.map(
          (user) => user.authorId,
        );
        if (userSubscribedTo) {
          const users = await ctx.dataloaders.usersDataloader.loadMany(userSubscribedTo);
          // console.log(users);
          return users;
        }
      },
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
  userSubscribedTo?: Subs[];
  subscribedToUser?: Subs[];
}

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserINput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export interface Subs {
  subscriberId: string;
  authorId: string;
}
