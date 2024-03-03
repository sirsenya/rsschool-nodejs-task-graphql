import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { DataloadersInterface } from './dataloaders.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export type Context = {
  prisma: PrismaClient;
  dataloaders: DataloadersInterface;
};
