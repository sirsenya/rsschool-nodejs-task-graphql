import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { Context, DataloadersInterface } from './types/context.js';
import { Query } from './query.js';
import { buildDataloaders } from './dataloaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { prisma, httpErrors } = fastify;
      const { query: source, variables: variableValues } = req.body;
      const dataloaders: DataloadersInterface = buildDataloaders(prisma);
      const contextValue: Context = {
        prisma,
        dataloaders,
      };

      return graphql({ schema, source, variableValues, contextValue });
    },
  });
};

export const schema = new GraphQLSchema({
  query: Query,
  // mutation: Mutations,
});

export default plugin;
