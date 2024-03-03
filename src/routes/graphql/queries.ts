import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType } from './types/member_type.js';
import { User } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { UUID } from 'crypto';
import { Post } from './types/post.js';
import { MemberTypeIdType, Profile } from './types/profile.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { Context } from './schemas.js';

export const Queries = new GraphQLObjectType<unknown, Context>({
  name: 'Queries',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (source, args, context, info) => {
        return context.prisma.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: async (source, args, context, info) => {
        return context.prisma.post.findMany();
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: async (source, args, context, info) => {
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

        const users = await context.prisma.user.findMany({
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
        users.forEach((user) => context.dataloaders.usersDataloader.prime(user.id, user));
        //   console.log(ctx.dataloaders.usersDataloader);
        return users;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(Profile)),
      resolve: async (source, args, context, info) => {
        return context.prisma.profile.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdType) },
      },
      resolve: async (source, args, context, info) => {
        return context.prisma.memberType.findUnique({
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
      resolve: async (source, args, context, info) => {
        return context.prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context, info) => {
        return context.prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context, info) => {
        // console.log(args.id);
        const user = await context.prisma.user.findUnique({
          where: {
            id: args.id,
          },
          include: {
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
        return user;
      },
    },
  },
});
