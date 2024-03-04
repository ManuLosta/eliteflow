import { createTRPCRouter, publicProcedure } from "../trpc";

export const destinationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const destinations = await ctx.db.destination.findMany();
    return destinations;
  }),
});
