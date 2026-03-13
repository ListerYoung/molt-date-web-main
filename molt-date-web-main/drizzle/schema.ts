import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, float } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with personal profile fields for admin management.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Extended personal fields
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  birthDate: varchar("birthDate", { length: 20 }), // YYYY-MM-DD
  birthCalendar: mysqlEnum("birthCalendar", ["solar", "lunar"]).default("solar"),
  birthPlace: varchar("birthPlace", { length: 200 }), // 籍贯
  university: varchar("university", { length: 200 }),
  grade: varchar("grade", { length: 50 }), // 年级: 大一/大二/.../研一/研二/博一...
  major: varchar("major", { length: 200 }),
  mbti: varchar("mbti", { length: 10 }),
  tags: json("tags"), // string[] - 个人标签
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  wechatId: varchar("wechatId", { length: 100 }),
  wechatQrUrl: text("wechatQrUrl"),
  // Verification
  campusEmail: varchar("campusEmail", { length: 320 }),
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "pending", "verified", "rejected"]).default("unverified"),
  verificationMethod: mysqlEnum("verificationMethod", ["campus_email", "xuexin"]),
  verifiedAt: timestamp("verifiedAt"),
  // Status
  accountStatus: mysqlEnum("accountStatus", ["active", "suspended", "banned"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Questions table — stores the 66 questionnaire questions (admin-editable)
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  questionNumber: int("questionNumber").notNull(),
  module: int("module").default(1).notNull(), // 1-5 (DeepSeek五模块)
  category: varchar("category", { length: 50 }).notNull(),
  categoryZh: varchar("categoryZh", { length: 100 }).notNull(),
  categoryEn: varchar("categoryEn", { length: 100 }).notNull(),
  textZh: text("textZh").notNull(),
  textEn: text("textEn").notNull(),
  options: json("options").notNull(), // Array<{id, zh, en}>
  mbseCategory: mysqlEnum("mbseCategory", ["A", "B", "C", "D"]).default("C"),
  isRedLine: boolean("isRedLine").default(false),
  redLineThreshold: float("redLineThreshold"),
  dimensionWeights: json("dimensionWeights"), // Record<dimensionKey, Record<optionId, number>>
  isActive: boolean("isActive").default(true).notNull(),
  aiVectorized: boolean("aiVectorized").default(false),
  aiEmbedding: text("aiEmbedding"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Answer sessions — tracks questionnaire completion progress
 */
export const answerSessions = mysqlTable("answer_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  totalQuestions: int("totalQuestions").default(66).notNull(),
  answeredCount: int("answeredCount").default(0).notNull(),
  cachedAnswers: json("cachedAnswers"), // Record<number, string>
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  lastActivityAt: timestamp("lastActivityAt").defaultNow().onUpdateNow().notNull(),
});

export type AnswerSession = typeof answerSessions.$inferSelect;
export type InsertAnswerSession = typeof answerSessions.$inferInsert;

/**
 * User answers — individual answer records per question
 */
export const userAnswers = mysqlTable("user_answers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: int("sessionId").notNull(),
  questionId: int("questionId").notNull(),
  questionNumber: int("questionNumber").notNull(),
  selectedOption: varchar("selectedOption", { length: 10 }).notNull(),
  answeredAt: timestamp("answeredAt").defaultNow().notNull(),
});

export type UserAnswer = typeof userAnswers.$inferSelect;
export type InsertUserAnswer = typeof userAnswers.$inferInsert;

/**
 * Profile dimensions — defines the 12 analysis dimensions across 5 domains
 */
export const profileDimensions = mysqlTable("profile_dimensions", {
  id: int("id").autoincrement().primaryKey(),
  domainKey: varchar("domainKey", { length: 50 }).notNull(), // life, values, emotion, plan, preference
  domainNameZh: varchar("domainNameZh", { length: 100 }).notNull(),
  domainNameEn: varchar("domainNameEn", { length: 100 }).notNull(),
  dimensionKey: varchar("dimensionKey", { length: 50 }).notNull().unique(),
  nameZh: varchar("nameZh", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  descriptionZh: text("descriptionZh"),
  descriptionEn: text("descriptionEn"),
  mbseCategory: mysqlEnum("mbseCategory", ["A", "B", "C", "D"]).default("C"),
  matchStrategy: mysqlEnum("matchStrategy", ["similar", "complementary", "threshold", "expectation"]).default("similar"),
  matchWeight: float("matchWeight").default(0.08),
  relatedQuestions: json("relatedQuestions"), // number[]
  minScore: float("minScore").default(0).notNull(),
  maxScore: float("maxScore").default(100).notNull(),
  color: varchar("color", { length: 20 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProfileDimension = typeof profileDimensions.$inferSelect;
export type InsertProfileDimension = typeof profileDimensions.$inferInsert;

/**
 * User profile scores — computed scores per dimension per user
 */
export const userProfileScores = mysqlTable("user_profile_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dimensionId: int("dimensionId").notNull(),
  dimensionKey: varchar("dimensionKey", { length: 50 }).notNull(),
  domainKey: varchar("domainKey", { length: 50 }).notNull(),
  rawScore: float("rawScore").default(0),
  normalizedScore: float("normalizedScore").default(0),
  percentile: float("percentile"),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfileScore = typeof userProfileScores.$inferSelect;
export type InsertUserProfileScore = typeof userProfileScores.$inferInsert;

/**
 * User profiles summary — aggregated profile with MBSE vectors and AI portrait
 */
export const userProfilesSummary = mysqlTable("user_profiles_summary", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  featureVector: json("featureVector"), // number[66]
  vectorA: json("vectorA"), // A类硬性红线向量
  vectorB: json("vectorB"), // B类核心三观向量
  vectorC: json("vectorC"), // C类性格习惯向量
  vectorD: json("vectorD"), // D类亲密关系向量
  domainScores: json("domainScores"), // {life, values, emotion, plan, preference}
  consistencyScore: float("consistencyScore"),
  consistencyFlags: json("consistencyFlags"), // [{q1, q2, conflict}]
  aiPortrait: text("aiPortrait"),
  aiPortraitUpdatedAt: timestamp("aiPortraitUpdatedAt"),
  profileType: varchar("profileType", { length: 50 }),
  profileTypeEn: varchar("profileTypeEn", { length: 50 }),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfileSummary = typeof userProfilesSummary.$inferSelect;
export type InsertUserProfileSummary = typeof userProfilesSummary.$inferInsert;

/**
 * Match records — AI matching results pushed weekly (Saturday)
 */
export const matchRecords = mysqlTable("match_records", {
  id: int("id").autoincrement().primaryKey(),
  userAId: int("userAId").notNull(),
  userBId: int("userBId").notNull(),
  compatibilityScore: float("compatibilityScore"),
  scoreAtoB: float("scoreAtoB"), // A对B的单向得分
  scoreBtoA: float("scoreBtoA"), // B对A的单向得分
  matchWeek: varchar("matchWeek", { length: 20 }).notNull(), // "2026-W10"
  matchType: mysqlEnum("matchType", ["precise", "explore", "random"]).default("precise"),
  dimensionScores: json("dimensionScores"), // Record<dimensionKey, number>
  commonTraits: json("commonTraits"), // string[]
  aiSummary: text("aiSummary"),
  // Status tracking
  status: mysqlEnum("status", ["pending", "pushed", "viewed_a", "viewed_b", "both_viewed", "contacted", "expired"])
    .default("pending").notNull(),
  pushedAt: timestamp("pushedAt"),
  viewedByAAt: timestamp("viewedByAAt"),
  viewedByBAt: timestamp("viewedByBAt"),
  // Feedback
  feedbackA: mysqlEnum("feedbackA", ["like", "neutral", "dislike"]),
  feedbackB: mysqlEnum("feedbackB", ["like", "neutral", "dislike"]),
  feedbackAText: text("feedbackAText"),
  feedbackBText: text("feedbackBText"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MatchRecord = typeof matchRecords.$inferSelect;
export type InsertMatchRecord = typeof matchRecords.$inferInsert;

/**
 * Match config — algorithm configuration parameters
 */
export const matchConfig = mysqlTable("match_config", {
  id: int("id").autoincrement().primaryKey(),
  configKey: varchar("configKey", { length: 50 }).notNull().unique(),
  configValue: varchar("configValue", { length: 200 }).notNull(),
  description: varchar("description", { length: 500 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchConfig = typeof matchConfig.$inferSelect;
export type InsertMatchConfig = typeof matchConfig.$inferInsert;

// Legacy tables — keep for backward compatibility
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  nickname: varchar("nickname", { length: 100 }),
  avatarUrl: text("avatarUrl"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  birthYear: int("birthYear"),
  university: varchar("university", { length: 200 }),
  major: varchar("major", { length: 200 }),
  graduationYear: int("graduationYear"),
  bio: text("bio"),
  wechatId: varchar("wechatId", { length: 100 }),
  wechatQrUrl: text("wechatQrUrl"),
  campusEmail: varchar("campusEmail", { length: 320 }),
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "pending", "verified", "rejected"]).default("unverified").notNull(),
  verificationMethod: mysqlEnum("verificationMethod", ["campus_email", "xuexin"]),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export const questionnaireAnswers = mysqlTable("questionnaire_answers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  answers: json("answers").notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuestionnaireAnswer = typeof questionnaireAnswers.$inferSelect;
export type InsertQuestionnaireAnswer = typeof questionnaireAnswers.$inferInsert;
