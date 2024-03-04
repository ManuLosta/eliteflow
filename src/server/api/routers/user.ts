import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),
  create: adminProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        repeatPassword: z.string(),
        role: z.enum(["admin", "manager"]),
        destination: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const findUser = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (findUser) {
        throw new Error("El usuario ya existe");
      }

      const user = await ctx.db.user.create({
        data: {
          username: input.username,
          password: input.password,
          admin: input.role === "admin",
          destination_id: input.role === "admin" ? null : input.destination,
        },
      });

      return user;
    }),
});
