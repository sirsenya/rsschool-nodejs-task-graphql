import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CreateUserInput, ChangeUserINput, User } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { CreatePostInput, Post, ChangePostInput } from './types/post.js';
import { CreateProfileInput, Profile, ChangeProfileInput } from './types/profile.js';
import { Context } from './schemas.js';

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateUserInput),
        },
      },
      resolve: async (source, args, context: Context, info) =>
        await context.prisma.user.create({ data: args.dto }),
    },
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: ChangeUserINput },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) =>
        await context.prisma.user.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        }),
    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) => {
        await context.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
        return args.id;
      },
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: {
          type: new GraphQLNonNull(CreatePostInput),
        },
      },
      resolve: async (source, args, context: Context, info) =>
        await context.prisma.post.create({ data: args.dto }),
    },
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: { type: ChangePostInput },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) =>
        await context.prisma.post.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        }),
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) => {
        await context.prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return args.id;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateProfileInput),
        },
      },
      resolve: async (source, args, context: Context, info) =>
        await context.prisma.profile.create({ data: args.dto }),
    },
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: ChangeProfileInput },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) => {
        try {
          const profile = await context.prisma.profile.update({
            where: { id: args.id },
            data: args.dto,
          });
          return profile;
        } catch (error) {
          throw Error(`Field \"userId\" is not defined by type \"ChangeProfileInput\"`);
        }
      },
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) => {
        await context.prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
        return args.id;
      },
    },
    subscribeTo: {
      type: User,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) => {
        try {
          const user = context.prisma.user.update({
            where: { id: args.userId },
            data: { userSubscribedTo: { create: { authorId: args.authorId } } },
          });
          return user;
        } catch {
          return null;
        }
      },
    },
    unsubscribeFrom: {
      type: UUIDType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (source, args, context: Context, info) => {
        try {
          await context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              },
            },
          });
        } catch {
          return null;
        }
      },
    },
  },
});
