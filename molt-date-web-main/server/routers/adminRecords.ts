import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const adminRecordsRouter = router({
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      status: z.string().optional(),
      userId: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllAnswerSessions({
        page: input?.page,
        pageSize: input?.pageSize,
        status: input?.status,
        userId: input?.userId,
      });
    }),

  getById: adminProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      // Get session details and user answers
      const answers = await db.getUserAnswersBySession(input.sessionId);
      const questions = await db.getAllQuestions({ activeOnly: false });

      // Build a map of question details
      const questionMap = new Map(questions.map(q => [q.questionNumber, q]));

      // Merge answers with question details
      const detailedAnswers = answers.map(a => {
        const question = questionMap.get(a.questionNumber);
        return {
          ...a,
          questionText: question?.textZh ?? "",
          questionTextEn: question?.textEn ?? "",
          category: question?.category ?? "",
          categoryZh: question?.categoryZh ?? "",
          options: question?.options ?? [],
        };
      });

      return {
        answers: detailedAnswers,
        totalAnswered: answers.length,
      };
    }),

  getUserRecord: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const sessions = await db.getAnswerSessionsByUserId(input.userId);
      const user = await db.getUserById(input.userId);
      return { sessions, user };
    }),

  stats: adminProcedure.query(async () => {
    const allSessions = await db.getAllAnswerSessions({ pageSize: 10000 });
    const sessions = allSessions.sessions;

    const totalSessions = sessions.length;
    const completed = sessions.filter(s => s.status === "completed").length;
    const inProgress = sessions.filter(s => s.status === "in_progress").length;
    const abandoned = sessions.filter(s => s.status === "abandoned").length;

    const completionRate = totalSessions > 0 ? (completed / totalSessions * 100).toFixed(1) : "0";
    const abandonRate = totalSessions > 0 ? (abandoned / totalSessions * 100).toFixed(1) : "0";

    return {
      totalSessions,
      completed,
      inProgress,
      abandoned,
      completionRate: Number(completionRate),
      abandonRate: Number(abandonRate),
    };
  }),
});
