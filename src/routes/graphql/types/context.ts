import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import { UUID } from 'crypto';
import DataLoader from 'dataloader';
import { MemberTypeId } from '../../member-types/schemas.js';

export type Context = {
  prisma: PrismaClient;
  dataloaders: DataloadersInterface;
};

export interface DataloadersInterface {
  usersDataloader: DataLoader<string, User>;
  profileDataloader: DataLoader<string, Profile>;
  postsOfUserDataloader: DataLoader<string, Post>;
  memberTypeDataloader: DataLoader<MemberTypeId, MemberType>;
}

// interface UserInterface {
//   id: UUID,
//   name: string,
//   balance: number,
//   posts: Post[],
//   profile: Profile,
//   userSubscriberdTo?: UserInterface[],
//   subscribedToUser?: UserInterface[],
// }
