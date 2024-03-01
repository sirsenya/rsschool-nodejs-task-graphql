import DataLoader from 'dataloader';
import { Context, DataloadersInterface } from './types/context.js';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import { MemberTypeBody } from './types/member_type.js';
import { MemberTypeId } from '../member-types/schemas.js';

export function buildDataloaders(prisma: PrismaClient): DataloadersInterface {
  async function userBatch(ids: readonly string[]) {
    console.log('DSLNJFJNDSJNKDJNSFJDSNFKJDNJSFJN');
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
      include: {
        subscribedToUser: true,
        userSubscribedTo: true,
      },
    });
    console.log(users.length);
    console.log(users[0].name);
    const usersMap = new Map<string, User[]>();
    users.forEach((user) =>
      usersMap[user.id] ? usersMap[user.id].push(user) : (usersMap[user.id] = [user]),
    );
    console.log(usersMap);
    return ids.map((id) => usersMap[id] ?? []);
  }
  async function postBatch(userIds: readonly string[]) {
    const postsOfUser = await prisma.post.findMany({
      where: {
        authorId: {
          in: userIds as string[],
        },
      },
    });
    const postsMap = new Map<string, Post>();
    postsOfUser.forEach((post) =>
      postsMap[post.authorId]
        ? postsMap[post.authorId].push(post)
        : (postsMap[post.authorId] = [post]),
    );

    return userIds.map((id) => postsMap[id] || []);
  }

  // async function memberBatch(memberTypeId: readonly MemberTypeId[]) {
  //   const postsOfUser = await prisma.profile.findMany({
  //     where: {
  //      memberType : {
  //         in: userIds as string[],
  //       },
  //     },
  //   });
  //   const postsMap = new Map<string, Post>();
  //   postsOfUser.forEach((post) =>
  //     postsMap[post.authorId]
  //       ? postsMap[post.authorId].push(post)
  //       : (postsMap[post.authorId] = [post]),
  //   );

  //   return userIds.map((id) => postsMap[id] || []);
  // }

  async function profileBatch(userIds: readonly string[]) {
    const profilesOfUsers = await prisma.profile.findMany({
      where: {
        userId: {
          in: userIds as string[],
        },
      },
    });
    const profilesMap = new Map<string, Post>();
    profilesOfUsers.forEach((profile) =>
      profilesMap[profile.userId]
        ? profilesMap[profile.userId].push(profile)
        : (profilesMap[profile.userId] = [profile]),
    );

    return userIds.map((id) => profilesMap[id] || []);
  }

  return {
    usersDataloader: new DataLoader<string, User>(userBatch),
    postsOfUserDataloader: new DataLoader<string, Post>(postBatch),
    //  memberTypeDataloader: new DataLoader<string, MemberType>(memberTypeBatch),
    profileDataloader: new DataLoader<string, Profile>(profileBatch),
  };
}
