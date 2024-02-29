import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from './types/context.js';
import { MemberType, MemberTypeIdType } from './types/member_type.js';
import { User } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { UUID } from 'crypto';
import { Post } from './types/post.js';
import { Profile } from './types/profile.js';

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
      resolve: async (_obj, _args, ctx) => {
        return ctx.prisma.user.findMany({
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
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
      resolve: async (_obj, _args: { id: UUID }, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            id: _args.id,
          },
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: true, //{
            //   include: {
            //     subscriber: {
            //       include: {
            //         subscribedToUser: true,
            //       },
            //     },
            //   },
            // },
            subscribedToUser: true, //{
            //   select: {
            //     subscriber: {
            //       include: {
            //         userSubscribedTo: true,
            //       },
            //     },
            //   },
            // },
          },
        });
      },
    },
  },
});
