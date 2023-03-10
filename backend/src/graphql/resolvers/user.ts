import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUserNameResponse, GraphQLContext } from "../../utils/types";

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<User[]> => {
      const { username: searchedUsername } = args;
      const { prisma, session } = context;

      console.log(session);

      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });
        console.log(users);
        return users;
      } catch (error: any) {
        console.log("SearchUsers error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUserNameResponse> => {
      console.log("start function");
      console.log("fall 1");
      const { username } = args;
      console.log("fall 2");
      const { session, prisma } = context;
      console.log("fall 3");
      console.log(session);
      console.log("fall 4");
      if (!session?.user) {
        return {
          error: "Not Authorized",
        };
      }
      const { id } = session.user;
      try {
        const existinguser = await prisma.user.findUnique({
          where: { username },
        });
        if (existinguser) {
          return {
            error: "Username already exists",
          };
        }
        await prisma.user.update({
          where: { id },
          data: { username },
        });
        return { sucess: true };
      } catch (error) {
        console.log(error);
        return { error: error as string };
      }
    },
  },
  // Subscription: {},
};
export default resolvers;
