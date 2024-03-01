import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from './types/context.js';
import { MemberType, MemberTypeIdType } from './types/member_type.js';
import { User } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { UUID } from 'crypto';
import { Post } from './types/post.js';
import { Profile } from './types/profile.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const Query = new GraphQLObjectType<unknown, Context>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_obj, _args, ctx) => {
        return ctx.prisma.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: async (_obj, _args, ctx) => {
        return ctx.prisma.post.findMany();
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: async (_obj, _args, ctx, info) => {
        const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfoFragment,
          new GraphQLList(User),
        );
        const userSubscribedTo: boolean =
          Object.keys(fields).includes('userSubscribedTo');
        const subscribedToUser: boolean =
          Object.keys(fields).includes('subscribedToUser');

        //  console.log(`${userSubscribedTo}, ${subscribedToUser}`);

        const users = await ctx.prisma.user.findMany({
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: userSubscribedTo,
            subscribedToUser: subscribedToUser,
          },
        });
        //  console.log(ctx.dataloaders.usersDataloader);
        users.forEach((user) => ctx.dataloaders.usersDataloader.prime(user.id, user));
        //   console.log(ctx.dataloaders.usersDataloader);
        return users;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(Profile)),
      resolve: async (_obj, _args, ctx) => {
        return ctx.prisma.profile.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdType) },
      },
      resolve: async (_obj, args: { id: string }, ctx) => {
        return ctx.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, _args: { id: UUID }, ctx) => {
        return ctx.prisma.post.findUnique({
          where: {
            id: _args.id,
          },
        });
      },
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, _args: { id: UUID }, ctx) => {
        return ctx.prisma.profile.findUnique({
          where: {
            id: _args.id,
          },
        });
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: UUID }, ctx) => {
        // console.log(args.id);
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: args.id,
          },
          include: {
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
        return user;
        // console.log(ctx.dataloaders.usersDataloader);

        // //ctx.dataloaders.usersDataloader.prime(user.id, user)
        // return user;
        // console.log('BBBBBBBBBBB');
        // const user = await ctx.dataloaders.usersDataloader.load(args.id);
        // console.log(user[0].subscribedToUser);
        // return user[0];
      },
    },
  },
});
