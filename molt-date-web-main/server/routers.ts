import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { ENV } from "./_core/env";

// Admin sub-routers
import { adminUsersRouter } from "./routers/adminUsers";
import { adminQuestionsRouter } from "./routers/adminQuestions";
import { adminRecordsRouter } from "./routers/adminRecords";
import { adminPersonalityRouter } from "./routers/adminPersonality";
import { adminMatchingRouter } from "./routers/adminMatching";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    // 邮箱登录/注册相关端点
    sendCode: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { sendVerificationEmail } = await import('./_core/email');
          const { verificationService } = await import('./_core/verification');
          
          const { code, expiresAt } = await sendVerificationEmail(input.email);
          verificationService.storeCode(input.email, code, expiresAt);
          
          return { success: true, message: '验证码已发送' };
        } catch (error) {
          console.error('Failed to send verification code:', error);
          return { success: false, message: '验证码发送失败' };
        }
      }),
    verifyCode: publicProcedure
      .input(z.object({
        email: z.string().email(),
        code: z.string().length(6),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const { verificationService } = await import('./_core/verification');
          const sdk = (await import('./_core/sdk')).sdk;
          
          const isValid = verificationService.verifyCode(input.email, input.code);
          if (!isValid) {
            return { success: false, message: '验证码无效或已过期' };
          }
          
          let user = await db.getUserByEmail(input.email);
          if (!user) {
            const openId = `email_${input.email}`;
            await db.upsertUser({
              openId,
              email: input.email,
              name: input.email.split('@')[0],
              loginMethod: 'email',
              lastSignedIn: new Date(),
            });
            user = await db.getUserByEmail(input.email);
          }
          
          if (!user) {
            return { success: false, message: '用户创建失败' };
          }
          
          const sessionToken = await sdk.createSessionToken(user.openId, {
            name: user.name || '',
            expiresInMs: ONE_YEAR_MS,
          });
          
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
          
          return { success: true, message: '登录成功' };
        } catch (error) {
          console.error('Failed to verify code:', error);
          return { success: false, message: '验证失败' };
        }
      }),
  }),

  // User Profile (user-facing)
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getProfileByUserId(ctx.user.id);
    }),

    update: protectedProcedure
      .input(z.object({
        nickname: z.string().max(100).optional(),
        avatarUrl: z.string().url().optional().nullable(),
        gender: z.enum(["male", "female", "other"]).optional(),
        birthYear: z.number().min(1950).max(2010).optional(),
        university: z.string().max(200).optional(),
        major: z.string().max(200).optional(),
        graduationYear: z.number().min(2020).max(2035).optional(),
        bio: z.string().max(500).optional(),
        wechatId: z.string().max(100).optional(),
        wechatQrUrl: z.string().url().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertProfile({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    submitCampusEmail: protectedProcedure
      .input(z.object({
        campusEmail: z.string().email(),
      }))
      .mutation(async ({ ctx, input }) => {
        const campusDomains: Record<string, string> = {
          "zju.edu.cn": "浙江大学",
          "tsinghua.edu.cn": "清华大学",
          "pku.edu.cn": "北京大学",
          "fudan.edu.cn": "复旦大学",
        };
        const domain = input.campusEmail.split("@")[1];
        const university = Object.entries(campusDomains).find(([d]) => domain?.endsWith(d));

        if (!university) {
          throw new Error("目前仅支持浙大、清华、北大、复旦的校园邮箱认证");
        }

        await db.upsertProfile({
          userId: ctx.user.id,
          campusEmail: input.campusEmail,
          university: university[1],
          verificationStatus: "verified",
          verificationMethod: "campus_email",
          verifiedAt: new Date(),
        });

        return { success: true, university: university[1] };
      }),
  }),

  // Questionnaire (user-facing)
  questionnaire: router({
    getAnswers: protectedProcedure.query(async ({ ctx }) => {
      return db.getAnswersByUserId(ctx.user.id);
    }),

    saveAnswers: protectedProcedure
      .input(z.object({
        answers: z.record(z.string(), z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        const numericAnswers: Record<number, string> = {};
        for (const [key, value] of Object.entries(input.answers)) {
          numericAnswers[Number(key)] = value;
        }
        await db.upsertAnswers(ctx.user.id, numericAnswers);
        return { success: true, count: Object.keys(numericAnswers).length };
      }),
  }),

  // Match (user-facing)
  match: router({
    getLatest: protectedProcedure.query(async ({ ctx }) => {
      const match = await db.getLatestMatch(ctx.user.id);
      if (!match) return null;

      const matchedUserId = match.userAId === ctx.user.id ? match.userBId : match.userAId;
      const matchedProfile = await db.getMatchedUserProfile(matchedUserId);
      return {
        ...match,
        matchedUserId,
        matchedProfile,
      };
    }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return db.getMatchesForUser(ctx.user.id);
    }),
  }),

  // ===== Admin Routes =====
  admin: router({
    // Independent admin login - password-based, no OAuth needed
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
          return { success: false, message: '管理密码未配置' };
        }
        if (input.password !== adminPassword) {
          return { success: false, message: '密码错误' };
        }
        // Create session for the owner (admin)
        const ownerOpenId = ENV.ownerOpenId;
        if (!ownerOpenId) {
          return { success: false, message: '管理员未配置' };
        }
        // Ensure admin user exists
        let adminUser = await db.getUserByOpenId(ownerOpenId);
        if (!adminUser) {
          await db.upsertUser({
            openId: ownerOpenId,
            name: ENV.ownerName || 'Admin',
            role: 'admin',
            lastSignedIn: new Date(),
          });
          adminUser = await db.getUserByOpenId(ownerOpenId);
        } else if (adminUser.role !== 'admin') {
          await db.upsertUser({ openId: ownerOpenId, role: 'admin' });
        }
        // Create session token
        const { sdk: sdkInstance } = await import('./_core/sdk');
        const sessionToken = await sdkInstance.createSessionToken(ownerOpenId, {
          name: ENV.ownerName || 'Admin',
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true, message: '登录成功' };
      }),
    // Check admin session without requiring auth
    checkSession: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return { authenticated: false, isAdmin: false };
      return { authenticated: true, isAdmin: ctx.user.role === 'admin' };
    }),
    users: adminUsersRouter,
    questions: adminQuestionsRouter,
    records: adminRecordsRouter,
    personality: adminPersonalityRouter,
    matching: adminMatchingRouter,
  }),
});

export type AppRouter = typeof appRouter;
