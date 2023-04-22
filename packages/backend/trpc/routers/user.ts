import { prisma } from "@rallly/database";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const user = router({
  getPolls: publicProcedure.query(async ({ ctx }) => {
    const userPolls = await prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        polls: {
          where: {
            deleted: false,
          },
          select: {
            title: true,
            closed: true,
            createdAt: true,
            adminUrlId: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return userPolls;
  }),
  changeName: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          name: input.name,
        },
      });
    }),
});