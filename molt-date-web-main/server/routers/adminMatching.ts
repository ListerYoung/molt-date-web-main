import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";

export const adminMatchingRouter = router({
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      week: z.string().optional(),
      status: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllMatches({
        page: input?.page,
        pageSize: input?.pageSize,
        week: input?.week,
        status: input?.status,
      });
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { matches } = await db.getAllMatches({ pageSize: 10000 });
      const match = matches.find(m => m.id === input.id);
      if (!match) throw new Error("Match not found");

      // Get both users' info
      const [userA, userB, scoresA, scoresB] = await Promise.all([
        db.getUserById(match.userAId),
        db.getUserById(match.userBId),
        db.getUserProfileScores(match.userAId),
        db.getUserProfileScores(match.userBId),
      ]);

      return {
        ...match,
        userA: userA ? {
          id: userA.id,
          name: userA.name,
          university: userA.university,
          avatarUrl: userA.avatarUrl,
          gender: userA.gender,
          major: userA.major,
          grade: userA.grade,
        } : null,
        userB: userB ? {
          id: userB.id,
          name: userB.name,
          university: userB.university,
          avatarUrl: userB.avatarUrl,
          gender: userB.gender,
          major: userB.major,
          grade: userB.grade,
        } : null,
        scoresA,
        scoresB,
      };
    }),

  cancel: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateMatchRecord(input.id, { status: "expired" });
      return { success: true };
    }),

  pushAll: adminProcedure
    .input(z.object({ week: z.string() }))
    .mutation(async ({ input }) => {
      const { matches } = await db.getAllMatches({ week: input.week, status: "pending", pageSize: 10000 });
      let count = 0;
      for (const match of matches) {
        await db.updateMatchRecord(match.id, {
          status: "pushed",
          pushedAt: new Date(),
        });
        count++;
      }
      return { success: true, count };
    }),

  regenerateSummary: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { matches } = await db.getAllMatches({ pageSize: 10000 });
      const match = matches.find(m => m.id === input.id);
      if (!match) throw new Error("Match not found");

      const [userA, userB] = await Promise.all([
        db.getUserById(match.userAId),
        db.getUserById(match.userBId),
      ]);

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一个AI匹配分析师。根据两位用户的信息，生成一段温暖、有洞察力的匹配摘要（2-3句话），说明他们为什么可能是好的匹配。",
            },
            {
              role: "user",
              content: `用户A：${userA?.name ?? "未知"}，${userA?.university ?? ""}，${userA?.major ?? ""}，兼容性分数：${match.compatibilityScore}\n用户B：${userB?.name ?? "未知"}，${userB?.university ?? ""}，${userB?.major ?? ""}`,
            },
          ],
        });

        const content = response.choices?.[0]?.message?.content;
        if (content && typeof content === 'string') {
          await db.updateMatchRecord(input.id, { aiSummary: content });
          return { success: true, summary: content };
        }
        return { success: false, error: "No response from LLM" };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }),

  // Execute matching algorithm
  runMatch: adminProcedure.mutation(async () => {
    // Get current week identifier
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const matchWeek = `${now.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;

    // Check if matching already ran this week
    const existingMatches = await db.getAllMatches({ week: matchWeek, pageSize: 1 });
    if (existingMatches.matches.length > 0) {
      return { success: false, error: `本周(${matchWeek})已经执行过匹配，如需重新匹配请先取消现有匹配记录` };
    }

    // Get all eligible users (active, verified, completed questionnaire)
    const { users: allUsers } = await db.getAllUsers({ pageSize: 10000 });
    const eligibleUsers = [];

    for (const user of allUsers) {
      if (user.accountStatus !== "active") continue;
      if (user.verificationStatus !== "verified") continue;
      if (!user.wechatId) continue;

      // Check if user has completed questionnaire
      const sessions = await db.getAnswerSessionsByUserId(user.id);
      const completed = sessions.find(s => s.status === "completed");
      if (!completed) continue;

      // Check if user has profile scores
      const scores = await db.getUserProfileScores(user.id);
      if (scores.length === 0) continue;

      eligibleUsers.push({ user, scores });
    }

    if (eligibleUsers.length < 2) {
      return { success: false, error: `匹配池用户不足（当前${eligibleUsers.length}人），需要至少2人` };
    }

    // Group by gender for heterosexual matching
    const males = eligibleUsers.filter(u => u.user.gender === "male");
    const females = eligibleUsers.filter(u => u.user.gender === "female");

    const matchPairs: Array<{
      userAId: number;
      userBId: number;
      score: number;
      dimensionScores: Record<string, number>;
    }> = [];

    // Calculate compatibility for all cross-gender pairs
    const smallerGroup = males.length <= females.length ? males : females;
    const largerGroup = males.length <= females.length ? females : males;

    for (const a of smallerGroup) {
      let bestMatch: { userId: number; score: number; dimScores: Record<string, number> } | null = null;

      for (const b of largerGroup) {
        // Skip if already matched
        if (matchPairs.some(p => p.userBId === b.user.id || p.userAId === b.user.id)) continue;

        // Calculate compatibility score
        const dimScores: Record<string, number> = {};
        let totalScore = 0;
        let dimCount = 0;

        for (const scoreA of a.scores) {
          const scoreB = b.scores.find(s => s.dimensionKey === scoreA.dimensionKey);
          if (!scoreB) continue;

          const diff = Math.abs((scoreA.normalizedScore ?? 0) - (scoreB.normalizedScore ?? 0));
          const similarity = 100 - diff;
          dimScores[scoreA.dimensionKey] = Math.round(similarity * 100) / 100;
          totalScore += similarity;
          dimCount++;
        }

        const avgScore = dimCount > 0 ? totalScore / dimCount : 50;

        if (!bestMatch || avgScore > bestMatch.score) {
          bestMatch = { userId: b.user.id, score: avgScore, dimScores };
        }
      }

      if (bestMatch) {
        matchPairs.push({
          userAId: a.user.id,
          userBId: bestMatch.userId,
          score: Math.round(bestMatch.score * 100) / 100,
          dimensionScores: bestMatch.dimScores,
        });
      }
    }

    // Create match records
    let createdCount = 0;
    for (const pair of matchPairs) {
      // Generate common traits
      const commonTraits: string[] = [];
      const userA = allUsers.find(u => u.id === pair.userAId);
      const userB = allUsers.find(u => u.id === pair.userBId);

      if (userA?.university === userB?.university) commonTraits.push("同校");
      if (userA?.mbti && userB?.mbti) {
        if (userA.mbti === userB.mbti) commonTraits.push(`同为${userA.mbti}`);
      }

      // Try to generate AI summary
      let aiSummary = "";
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一个AI匹配分析师。根据两位用户的信息和兼容性分数，用2句话生成一段温暖的匹配摘要。",
            },
            {
              role: "user",
              content: `用户A：${userA?.name ?? ""}，${userA?.university ?? ""}，兼容性${pair.score}分。用户B：${userB?.name ?? ""}，${userB?.university ?? ""}`,
            },
          ],
        });
        const content = response.choices?.[0]?.message?.content;
        if (content && typeof content === 'string') {
          aiSummary = content;
        }
      } catch {
        // AI summary is optional
      }

      await db.createMatchRecord({
        userAId: pair.userAId,
        userBId: pair.userBId,
        compatibilityScore: pair.score,
        scoreAtoB: pair.score,
        scoreBtoA: pair.score,
        matchWeek,
        matchType: "precise",
        dimensionScores: pair.dimensionScores,
        commonTraits,
        aiSummary: aiSummary || null,
        status: "pending",
      });
      createdCount++;
    }

    return {
      success: true,
      matchWeek,
      eligibleCount: eligibleUsers.length,
      matchedPairs: createdCount,
    };
  }),

  poolStats: adminProcedure.query(async () => {
    const { users: allUsers } = await db.getAllUsers({ pageSize: 10000 });
    let eligible = 0;
    let verified = 0;
    let withQuestionnaire = 0;
    let withScores = 0;

    for (const user of allUsers) {
      if (user.accountStatus !== "active") continue;
      if (user.verificationStatus === "verified") verified++;

      const sessions = await db.getAnswerSessionsByUserId(user.id);
      const completed = sessions.find(s => s.status === "completed");
      if (completed) withQuestionnaire++;

      const scores = await db.getUserProfileScores(user.id);
      if (scores.length > 0) withScores++;

      if (
        user.verificationStatus === "verified" &&
        completed &&
        scores.length > 0 &&
        user.wechatId
      ) {
        eligible++;
      }
    }

    return {
      totalUsers: allUsers.length,
      verified,
      withQuestionnaire,
      withScores,
      eligible,
    };
  }),

  stats: adminProcedure
    .input(z.object({ week: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const { matches } = await db.getAllMatches({
        week: input?.week,
        pageSize: 10000,
      });

      const total = matches.length;
      const pending = matches.filter(m => m.status === "pending").length;
      const pushed = matches.filter(m => m.status === "pushed").length;
      const bothViewed = matches.filter(m => m.status === "both_viewed").length;
      const contacted = matches.filter(m => m.status === "contacted").length;
      const expired = matches.filter(m => m.status === "expired").length;

      const avgScore = total > 0
        ? Math.round(matches.reduce((sum, m) => sum + (m.compatibilityScore ?? 0), 0) / total * 100) / 100
        : 0;

      const positiveFeedback = matches.filter(
        m => m.feedbackA === "like" || m.feedbackB === "like"
      ).length;

      return {
        total,
        pending,
        pushed,
        bothViewed,
        contacted,
        expired,
        avgScore,
        positiveFeedback,
        viewRate: pushed > 0 ? Math.round((bothViewed + contacted) / pushed * 100) : 0,
        contactRate: (bothViewed + contacted) > 0 ? Math.round(contacted / (bothViewed + contacted) * 100) : 0,
      };
    }),

  // Match config management
  config: router({
    list: adminProcedure.query(async () => {
      return db.getMatchConfigs();
    }),

    update: adminProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertMatchConfig(input.key, input.value, input.description);
        return { success: true };
      }),
  }),
});
