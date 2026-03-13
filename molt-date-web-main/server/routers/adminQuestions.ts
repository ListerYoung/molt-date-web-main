import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { invokeLLM } from "../_core/llm";

const optionSchema = z.object({
  id: z.string(),
  zh: z.string(),
  en: z.string(),
});

const questionInputSchema = z.object({
  questionNumber: z.number().min(1),
  module: z.number().min(1).max(5).default(1),
  category: z.string(),
  categoryZh: z.string(),
  categoryEn: z.string(),
  textZh: z.string(),
  textEn: z.string(),
  options: z.array(optionSchema),
  mbseCategory: z.enum(["A", "B", "C", "D"]).optional(),
  isRedLine: z.boolean().optional(),
  redLineThreshold: z.number().optional(),
  dimensionWeights: z.record(z.string(), z.record(z.string(), z.number())).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const adminQuestionsRouter = router({
  list: adminProcedure
    .input(z.object({
      activeOnly: z.boolean().optional(),
      category: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const allQuestions = await db.getAllQuestions({
        activeOnly: input?.activeOnly,
      });
      if (input?.category) {
        return allQuestions.filter(q => q.category === input.category);
      }
      return allQuestions;
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const question = await db.getQuestionById(input.id);
      if (!question) throw new Error("Question not found");
      return question;
    }),

  create: adminProcedure
    .input(questionInputSchema)
    .mutation(async ({ input }) => {
      await db.createQuestion(input as any);
      return { success: true };
    }),

  update: adminProcedure
    .input(z.object({ id: z.number() }).merge(questionInputSchema.partial()))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateQuestion(id, data as any);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteQuestion(input.id);
      return { success: true };
    }),

  reorder: adminProcedure
    .input(z.object({
      items: z.array(z.object({
        id: z.number(),
        sortOrder: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      await db.batchUpdateQuestionOrder(input.items);
      return { success: true };
    }),

  vectorize: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const question = await db.getQuestionById(input.id);
      if (!question) throw new Error("Question not found");

      const options = question.options as Array<{ id: string; zh: string; en: string }>;
      const optionsText = options.map(o => `${o.id}: ${o.zh}`).join("\n");

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一个问卷语义分析助手。请将以下问卷题目及其选项分析为一个JSON格式的语义向量表示。返回一个包含64个浮点数的数组，每个值在-1到1之间，代表不同语义维度的权重。",
            },
            {
              role: "user",
              content: `题目：${question.textZh}\n选项：\n${optionsText}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "embedding",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  vector: {
                    type: "array",
                    items: { type: "number" },
                    description: "64-dimensional semantic vector",
                  },
                },
                required: ["vector"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices?.[0]?.message?.content;
        if (content && typeof content === 'string') {
          const parsed = JSON.parse(content);
          await db.updateQuestion(input.id, {
            aiVectorized: true,
            aiEmbedding: JSON.stringify(parsed.vector),
          });
          return { success: true };
        }
        return { success: false, error: "No response from LLM" };
      } catch (error) {
        console.error("Vectorization failed:", error);
        return { success: false, error: String(error) };
      }
    }),

  batchVectorize: adminProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      let successCount = 0;
      let failCount = 0;

      for (const id of input.ids) {
        try {
          const question = await db.getQuestionById(id);
          if (!question) { failCount++; continue; }

          const options = question.options as Array<{ id: string; zh: string; en: string }>;
          const optionsText = options.map(o => `${o.id}: ${o.zh}`).join("\n");

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "你是一个问卷语义分析助手。请将以下问卷题目及其选项分析为一个JSON格式的语义向量表示。返回一个包含64个浮点数的数组，每个值在-1到1之间。",
              },
              {
                role: "user",
                content: `题目：${question.textZh}\n选项：\n${optionsText}`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "embedding",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    vector: {
                      type: "array",
                      items: { type: "number" },
                    },
                  },
                  required: ["vector"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices?.[0]?.message?.content;
          if (content && typeof content === 'string') {
            const parsed = JSON.parse(content);
            await db.updateQuestion(id, {
              aiVectorized: true,
              aiEmbedding: JSON.stringify(parsed.vector),
            });
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }

      return { success: true, successCount, failCount };
    }),

  seed: adminProcedure.mutation(async () => {
    // Import seed data from the questionnaire data
    // This will be called once to populate the questions table
    const existingQuestions = await db.getAllQuestions();
    if (existingQuestions.length > 0) {
      return { success: false, message: "Questions already exist. Delete existing questions first." };
    }

    // The seed data will be provided via the frontend or a separate script
    return { success: true, message: "Seed endpoint ready. Use the import function to add questions." };
  }),

  importBatch: adminProcedure
    .input(z.object({
      questions: z.array(questionInputSchema),
    }))
    .mutation(async ({ input }) => {
      let count = 0;
      for (const q of input.questions) {
        await db.createQuestion(q as any);
        count++;
      }
      return { success: true, count };
    }),

  exportAll: adminProcedure.query(async () => {
    const allQuestions = await db.getAllQuestions();
    return allQuestions;
  }),
});
