// import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
// import { config } from 'process';

// export const Mutations = new GraphQLObjectType({
//   name: 'Mutations',
//   fields: {
//     createUser: {
//       type: new GraphQLNonNull(UserType),
//       args: {
//         dto: {
//           type: new GraphQLNonNull(CreateUserInput),
//         },
//       },
//       async resolve(_, args, ctx: Context) {
//         return ctx.prisma.user.create({ data: args.dto });
//       },
//     },
//   },
// });
