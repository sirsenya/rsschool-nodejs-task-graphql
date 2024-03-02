import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Context, createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import { Queries } from './queries.js';
import { DataloadersInterface, buildDataloaders } from './dataloaders.js';
import depthLimit from 'graphql-depth-limit';
import { Mutations } from './mutations.js';

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

      const schema = new GraphQLSchema({
        query: Queries,
        mutation: Mutations,
      });

      const errors = validate(schema, parse(source), [depthLimit(5)]);

      if (errors.length > 0) {
        return { errors };
      }

      const dataloaders: DataloadersInterface = buildDataloaders(prisma);
      const contextValue: Context = {
        prisma,
        dataloaders,
      };

      return graphql({ schema, source, variableValues, contextValue });
    },
  });
};

export default plugin;
