import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";

export const adminPersonalityRouter = router({
  // ===== Dimension Management =====
  dimensions: router({
    list: adminProcedure.query(async () => {
      return db.getAllDimensions();
    }),

    update: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        domainKey: z.string(),
        domainNameZh: z.string(),
        domainNameEn: z.string(),
        dimensionKey: z.string(),
        nameZh: z.string(),
        nameEn: z.string(),
        descriptionZh: z.string().optional(),
        descriptionEn: z.string().optional(),
        mbseCategory: z.enum(["A", "B", "C", "D"]).optional(),
        matchStrategy: z.enum(["similar", "complementary", "threshold", "expectation"]).optional(),
        matchWeight: z.number().optional(),
        relatedQuestions: z.array(z.number()).optional(),
        color: z.string().optional(),
        sortOrder: z.number().default(0),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        await db.upsertDimension(input as any);
        return { success: true };
      }),
  }),

  // ===== User Scores =====
  scores: router({
    list: adminProcedure
      .input(z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
      }).optional())
      .query(async ({ input }) => {
        // Get all users who have completed questionnaires
        const { users } = await db.getAllUsers({
          page: input?.page ?? 1,
          pageSize: input?.pageSize ?? 20,
        });

        const usersWithScores = await Promise.all(
          users.map(async (user) => {
            const scores = await db.getUserProfileScores(user.id);
            const summary = await db.getUserProfileSummary(user.id);
            return {
              id: user.id,
              name: user.name,
              university: user.university,
              avatarUrl: user.avatarUrl,
              scores,
              profileType: summary?.profileType,
              computedAt: summary?.computedAt,
            };
          })
        );

        return usersWithScores;
      }),

    getByUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const [user, scores, summary, dimensions] = await Promise.all([
          db.getUserById(input.userId),
          db.getUserProfileScores(input.userId),
          db.getUserProfileSummary(input.userId),
          db.getAllDimensions(),
        ]);

        if (!user) throw new Error("User not found");

        return {
          user: {
            id: user.id,
            name: user.name,
            university: user.university,
            avatarUrl: user.avatarUrl,
          },
          scores,
          summary,
          dimensions,
        };
      }),

    recompute: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        return computeUserProfile(input.userId);
      }),

    recomputeAll: adminProcedure.mutation(async () => {
      // Get all users with completed questionnaires
      const allSessions = await db.getAllAnswerSessions({ pageSize: 10000, status: "completed" });
      const userIds = Array.from(new Set(allSessions.sessions.map(s => s.userId)));

      let successCount = 0;
      let failCount = 0;

      for (const userId of userIds) {
        try {
          await computeUserProfile(userId);
          successCount++;
        } catch {
          failCount++;
        }
      }

      return { success: true, successCount, failCount, total: userIds.length };
    }),
  }),

  stats: adminProcedure.query(async () => {
    // Get all dimensions and aggregate stats
    const dimensions = await db.getAllDimensions();
    return {
      dimensionCount: dimensions.length,
      dimensions: dimensions.map(d => ({
        key: d.dimensionKey,
        nameZh: d.nameZh,
        nameEn: d.nameEn,
        color: d.color,
      })),
    };
  }),
});

/**
 * Compute user profile scores based on questionnaire answers
 */
async function computeUserProfile(userId: number) {
  const answers = await db.getUserAnswersByUserId(userId);
  if (answers.length === 0) {
    return { success: false, error: "No answers found for user" };
  }

  const questions = await db.getAllQuestions({ activeOnly: true });
  const dimensions = await db.getAllDimensions();

  if (dimensions.length === 0) {
    return { success: false, error: "No dimensions configured" };
  }

  // Build answer map: questionNumber -> selectedOption
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.selectedOption]));

  // Calculate raw scores per dimension
  const rawScores: Record<string, number> = {};
  const maxScores: Record<string, number> = {};
  const minScores: Record<string, number> = {};

  for (const dim of dimensions) {
    rawScores[dim.dimensionKey] = 0;
    maxScores[dim.dimensionKey] = 0;
    minScores[dim.dimensionKey] = 0;
  }

  for (const question of questions) {
    const userAnswer = answerMap.get(question.questionNumber);
    if (!userAnswer) continue;

    const weights = question.dimensionWeights as Record<string, Record<string, number>> | null;
    if (!weights) continue;

    for (const [dimKey, optionWeights] of Object.entries(weights)) {
      if (!rawScores.hasOwnProperty(dimKey)) continue;

      const score = optionWeights[userAnswer] ?? 0;
      rawScores[dimKey] += score;

      // Calculate theoretical min/max for normalization
      const allValues = Object.values(optionWeights);
      if (allValues.length > 0) {
        maxScores[dimKey] += Math.max(...allValues);
        minScores[dimKey] += Math.min(...allValues);
      }
    }
  }

  // Normalize and save scores
  for (const dim of dimensions) {
    const raw = rawScores[dim.dimensionKey] ?? 0;
    const max = maxScores[dim.dimensionKey] ?? 100;
    const min = minScores[dim.dimensionKey] ?? 0;
    const range = max - min;
    const normalized = range > 0 ? ((raw - min) / range) * 100 : 50;

    await db.upsertUserProfileScore({
      userId,
      dimensionId: dim.id,
      dimensionKey: dim.dimensionKey,
      domainKey: dim.domainKey,
      rawScore: raw,
      normalizedScore: Math.round(normalized * 100) / 100,
    });
  }

  // Build feature vector from answers
  const featureVector = Array.from({ length: 66 }, (_, i) => {
    const answer = answerMap.get(i + 1);
    if (!answer) return 0;
    // Convert A=1, B=2, C=3, D=4, E=5
    return answer.charCodeAt(0) - 64;
  });

  // Build domain scores
  const domainScores: Record<string, number> = {};
  for (const dim of dimensions) {
    const raw = rawScores[dim.dimensionKey] ?? 0;
    const max = maxScores[dim.dimensionKey] ?? 100;
    const min = minScores[dim.dimensionKey] ?? 0;
    const range = max - min;
    const normalized = range > 0 ? ((raw - min) / range) * 100 : 50;

    if (!domainScores[dim.domainKey]) {
      domainScores[dim.domainKey] = 0;
    }
    domainScores[dim.domainKey] += normalized;
  }

  // Average domain scores
  const domainCounts: Record<string, number> = {};
  for (const dim of dimensions) {
    domainCounts[dim.domainKey] = (domainCounts[dim.domainKey] ?? 0) + 1;
  }
  for (const key of Object.keys(domainScores)) {
    domainScores[key] = Math.round((domainScores[key] / (domainCounts[key] ?? 1)) * 100) / 100;
  }

  // Try to generate AI portrait
  let aiPortrait = "";
  try {
    const scoresText = dimensions.map(d => {
      const raw = rawScores[d.dimensionKey] ?? 0;
      const max = maxScores[d.dimensionKey] ?? 100;
      const min = minScores[d.dimensionKey] ?? 0;
      const range = max - min;
      const normalized = range > 0 ? ((raw - min) / range) * 100 : 50;
      return `${d.nameZh}: ${normalized.toFixed(0)}分`;
    }).join(", ");

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "你是一个性格分析专家。根据用户的性格维度得分，用2-3句话生成一段简洁的个人画像描述。语言要温暖、积极、有洞察力。",
        },
        {
          role: "user",
          content: `用户性格维度得分：${scoresText}`,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    if (content && typeof content === 'string') {
      aiPortrait = content;
    }
  } catch (error) {
    console.error("AI portrait generation failed:", error);
  }

  // Save profile summary
  await db.upsertUserProfileSummary({
    userId,
    featureVector,
    domainScores,
    aiPortrait: aiPortrait || null,
    aiPortraitUpdatedAt: aiPortrait ? new Date() : null,
  });

  return { success: true };
}
