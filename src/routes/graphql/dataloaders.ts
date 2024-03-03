import DataLoader from 'dataloader';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';

export function buildDataloaders(prisma: PrismaClient): DataloadersInterface {
  async function userBatch(ids: readonly string[]) {
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
    // console.log(users.length);
    // console.log(users[0].name);
    const usersMap = new Map<string, User[]>();
    users.forEach((user) => (usersMap[user.id] = user));
    // console.log(usersMap);
    // console.log(ids.map((id) => usersMap[id] ?? []));
    return ids.map((id) => usersMap[id]);
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

  async function memberTypeBatch(memberTypeId: readonly MemberTypeId[]) {
    //console.log('In member type batch');
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {
          in: memberTypeId as string[],
        },
      },
    });
    // console.log(memberTypes);
    const memberTypeMap = new Map<string, Post>();
    memberTypes.forEach((memberType) => (memberTypeMap[memberType.id] = memberType));

    return memberTypeId.map((id) => memberTypeMap[id]);
  }

  async function profileBatch(userIds: readonly string[]) {
    // console.log(userIds);
    const profilesOfUsers = await prisma.profile.findMany({
      where: {
        userId: {
          in: userIds as string[],
        },
      },
    });
    //console.log(profilesOfUsers);
    const profilesMap = new Map<string, Post>();
    profilesOfUsers.forEach((profile) => (profilesMap[profile.userId] = profile));

    return userIds.map((id) => profilesMap[id]);
  }

  return {
    usersDataloader: new DataLoader<string, User>(userBatch),
    postsOfUserDataloader: new DataLoader<string, Post>(postBatch),
    memberTypeDataloader: new DataLoader<MemberTypeId, MemberType>(memberTypeBatch),
    profileDataloader: new DataLoader<string, Profile>(profileBatch),
  };
}
export interface DataloadersInterface {
  usersDataloader: DataLoader<string, User>;
  profileDataloader: DataLoader<string, Profile>;
  postsOfUserDataloader: DataLoader<string, Post>;
  memberTypeDataloader: DataLoader<MemberTypeId, MemberType>;
}
