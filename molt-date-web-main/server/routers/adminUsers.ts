import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const adminUsersRouter = router({
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      university: z.string().optional(),
      gender: z.string().optional(),
      status: z.string().optional(),
      verificationStatus: z.string().optional(),
      mbti: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllUsers({
        page: input?.page,
        pageSize: input?.pageSize,
        search: input?.search,
        university: input?.university,
        gender: input?.gender,
        status: input?.status,
      });
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const user = await db.getUserById(input.id);
      if (!user) throw new Error("User not found");

      // Get related data
      const [sessions, profileScores, profileSummary] = await Promise.all([
        db.getAnswerSessionsByUserId(input.id),
        db.getUserProfileScores(input.id),
        db.getUserProfileSummary(input.id),
      ]);

      const latestSession = sessions[0];
      const questionnaireStatus = latestSession
        ? latestSession.status === "completed"
          ? "completed"
          : `${latestSession.answeredCount}/${latestSession.totalQuestions}`
        : "not_started";

      return {
        ...user,
        questionnaireStatus,
        latestSession,
        profileScores,
        profileSummary,
      };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      gender: z.enum(["male", "female", "other"]).optional().nullable(),
      birthDate: z.string().optional().nullable(),
      birthCalendar: z.enum(["solar", "lunar"]).optional().nullable(),
      birthPlace: z.string().optional().nullable(),
      university: z.string().optional().nullable(),
      grade: z.string().optional().nullable(),
      major: z.string().optional().nullable(),
      mbti: z.string().optional().nullable(),
      tags: z.array(z.string()).optional().nullable(),
      bio: z.string().optional().nullable(),
      wechatId: z.string().optional().nullable(),
      role: z.enum(["user", "admin"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateUser(id, data as any);
      return { success: true };
    }),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      accountStatus: z.enum(["active", "suspended", "banned"]),
    }))
    .mutation(async ({ input }) => {
      await db.updateUser(input.id, { accountStatus: input.accountStatus });
      return { success: true };
    }),

  updateVerification: adminProcedure
    .input(z.object({
      id: z.number(),
      verificationStatus: z.enum(["unverified", "pending", "verified", "rejected"]),
    }))
    .mutation(async ({ input }) => {
      const updateData: Record<string, any> = {
        verificationStatus: input.verificationStatus,
      };
      if (input.verificationStatus === "verified") {
        updateData.verifiedAt = new Date();
      }
      await db.updateUser(input.id, updateData);
      return { success: true };
    }),

  batchUpdateStatus: adminProcedure
    .input(z.object({
      ids: z.array(z.number()),
      accountStatus: z.enum(["active", "suspended", "banned"]),
    }))
    .mutation(async ({ input }) => {
      for (const id of input.ids) {
        await db.updateUser(id, { accountStatus: input.accountStatus });
      }
      return { success: true, count: input.ids.length };
    }),

  stats: adminProcedure.query(async () => {
    return db.getAdminStats();
  }),
});
