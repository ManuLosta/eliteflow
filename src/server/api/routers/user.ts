import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return user;
    }),
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
          destinationId: input.role === "admin" ? null : input.destination,
        },
      });

      return user;
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string(),
        password: z.string(),
        role: z.enum(["admin", "manager"]),
        destination: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new Error("El usuario no existe");
      }

      const updatedUser = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          username: input.username,
          password: input.password,
          admin: input.role === "admin",
          destinationId: input.role === "admin" ? null : input.destination,
        },
      });

      return updatedUser;
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new Error("El usuario no existe");
      }

      await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      return user;
    }),
});
