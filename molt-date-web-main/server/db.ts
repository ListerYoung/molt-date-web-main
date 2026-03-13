import { eq, and, desc, asc, sql, like, or, count, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  userProfiles, questionnaireAnswers,
  questions, answerSessions, userAnswers,
  profileDimensions, userProfileScores, userProfilesSummary,
  matchRecords, matchConfig,
  type InsertUserProfile, type UserProfile,
  type InsertQuestion, type Question,
  type InsertAnswerSession, type AnswerSession,
  type InsertUserAnswer,
  type InsertProfileDimension,
  type InsertUserProfileScore,
  type InsertUserProfileSummary,
  type InsertMatchRecord, type MatchRecord,
  type InsertMatchConfig,
  type User,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function testDbConnection() {
  try {
    const db = await getDb();
    if (!db) return false;
    await db.select().from(users).limit(1);
    console.log("[Database] Connection test successful");
    return true;
  } catch (error) {
    console.error("[Database] Connection test failed:", error);
    return false;
  }
}

// ============ Users ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    for (const field of textFields) {
      const value = user[field];
      if (value !== undefined) {
        values[field] = value ?? null;
        updateSet[field] = value ?? null;
      }
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] ?? undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] ?? undefined;
}

export async function getAllUsers(opts: { page?: number; pageSize?: number; search?: string; university?: string; gender?: string; status?: string } = {}) {
  const db = await getDb();
  if (!db) return { users: [], total: 0 };
  const { page = 1, pageSize = 20, search, university, gender, status } = opts;

  let where = sql`1=1`;
  if (search) where = sql`${where} AND (${users.name} LIKE ${`%${search}%`} OR ${users.email} LIKE ${`%${search}%`})`;
  if (university) where = sql`${where} AND ${users.university} = ${university}`;
  if (gender) where = sql`${where} AND ${users.gender} = ${gender}`;
  if (status) where = sql`${where} AND ${users.accountStatus} = ${status}`;

  const [rows, totalResult] = await Promise.all([
    db.select().from(users).where(where).orderBy(desc(users.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ count: count() }).from(users).where(where),
  ]);

  return { users: rows, total: totalResult[0]?.count ?? 0 };
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, id));
}

// ============ User Profile (legacy) ============

export async function getProfileByUserId(userId: number): Promise<UserProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result[0] ?? undefined;
}

export async function upsertProfile(data: InsertUserProfile): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, data.userId)).limit(1);
  if (existing.length > 0) {
    const updateSet: Record<string, unknown> = {};
    const fields = ["nickname", "avatarUrl", "gender", "birthYear", "university", "major", "graduationYear", "bio", "wechatId", "wechatQrUrl", "campusEmail", "verificationStatus", "verificationMethod", "verifiedAt"] as const;
    for (const field of fields) {
      if (data[field] !== undefined) updateSet[field] = data[field];
    }
    if (Object.keys(updateSet).length > 0) {
      await db.update(userProfiles).set(updateSet).where(eq(userProfiles.userId, data.userId));
    }
  } else {
    await db.insert(userProfiles).values(data);
  }
}

// ============ Questions (Admin CRUD) ============

export async function getAllQuestions(opts: { activeOnly?: boolean } = {}) {
  const db = await getDb();
  if (!db) return [];
  let where = sql`1=1`;
  if (opts.activeOnly) where = sql`${where} AND ${questions.isActive} = true`;
  return db.select().from(questions).where(where).orderBy(asc(questions.sortOrder), asc(questions.questionNumber));
}

export async function getQuestionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return result[0] ?? undefined;
}

export async function createQuestion(data: InsertQuestion) {
  const db = await getDb();
  if (!db) return;
  await db.insert(questions).values(data);
}

export async function updateQuestion(id: number, data: Partial<InsertQuestion>) {
  const db = await getDb();
  if (!db) return;
  await db.update(questions).set(data).where(eq(questions.id, id));
}

export async function deleteQuestion(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(questions).set({ isActive: false }).where(eq(questions.id, id));
}

export async function batchUpdateQuestionOrder(items: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) return;
  for (const item of items) {
    await db.update(questions).set({ sortOrder: item.sortOrder }).where(eq(questions.id, item.id));
  }
}

// ============ Answer Sessions ============

export async function getAnswerSessionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(answerSessions).where(eq(answerSessions.userId, userId)).orderBy(desc(answerSessions.startedAt));
}

export async function getActiveSession(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(answerSessions)
    .where(and(eq(answerSessions.userId, userId), eq(answerSessions.status, "in_progress")))
    .orderBy(desc(answerSessions.startedAt)).limit(1);
  return result[0] ?? undefined;
}

export async function createAnswerSession(data: InsertAnswerSession) {
  const db = await getDb();
  if (!db) return;
  await db.insert(answerSessions).values(data);
}

export async function updateAnswerSession(id: number, data: Partial<InsertAnswerSession>) {
  const db = await getDb();
  if (!db) return;
  await db.update(answerSessions).set(data).where(eq(answerSessions.id, id));
}

// ============ User Answers ============

export async function getUserAnswersBySession(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userAnswers).where(eq(userAnswers.sessionId, sessionId)).orderBy(asc(userAnswers.questionNumber));
}

export async function getUserAnswersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userAnswers).where(eq(userAnswers.userId, userId)).orderBy(asc(userAnswers.questionNumber));
}

export async function upsertUserAnswer(data: InsertUserAnswer) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(userAnswers)
    .where(and(eq(userAnswers.userId, data.userId), eq(userAnswers.questionNumber, data.questionNumber)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(userAnswers).set({ selectedOption: data.selectedOption, sessionId: data.sessionId, answeredAt: new Date() })
      .where(eq(userAnswers.id, existing[0].id));
  } else {
    await db.insert(userAnswers).values(data);
  }
}

// ============ Questionnaire Answers (legacy) ============

export async function getAnswersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(questionnaireAnswers).where(eq(questionnaireAnswers.userId, userId)).limit(1);
  return result[0] ?? undefined;
}

export async function upsertAnswers(userId: number, answers: Record<number, string>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(questionnaireAnswers).where(eq(questionnaireAnswers.userId, userId)).limit(1);
  if (existing.length > 0) {
    await db.update(questionnaireAnswers).set({
      answers,
      completedAt: Object.keys(answers).length >= 66 ? new Date() : null,
    }).where(eq(questionnaireAnswers.userId, userId));
  } else {
    await db.insert(questionnaireAnswers).values({ userId, answers, completedAt: Object.keys(answers).length >= 66 ? new Date() : null });
  }
}

// ============ All Answer Sessions (Admin) ============

export async function getAllAnswerSessions(opts: { page?: number; pageSize?: number; status?: string; userId?: number } = {}) {
  const db = await getDb();
  if (!db) return { sessions: [], total: 0 };
  const { page = 1, pageSize = 20, status, userId } = opts;

  let where = sql`1=1`;
  if (status) where = sql`${where} AND ${answerSessions.status} = ${status}`;
  if (userId) where = sql`${where} AND ${answerSessions.userId} = ${userId}`;

  const [rows, totalResult] = await Promise.all([
    db.select().from(answerSessions).where(where).orderBy(desc(answerSessions.lastActivityAt)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ count: count() }).from(answerSessions).where(where),
  ]);

  return { sessions: rows, total: totalResult[0]?.count ?? 0 };
}

// ============ Profile Dimensions ============

export async function getAllDimensions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(profileDimensions).where(eq(profileDimensions.isActive, true)).orderBy(asc(profileDimensions.sortOrder));
}

export async function upsertDimension(data: InsertProfileDimension) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(profileDimensions).set(data).where(eq(profileDimensions.id, data.id));
  } else {
    await db.insert(profileDimensions).values(data);
  }
}

// ============ User Profile Scores ============

export async function getUserProfileScores(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userProfileScores).where(eq(userProfileScores.userId, userId));
}

export async function upsertUserProfileScore(data: InsertUserProfileScore) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(userProfileScores)
    .where(and(eq(userProfileScores.userId, data.userId), eq(userProfileScores.dimensionKey, data.dimensionKey)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(userProfileScores).set(data).where(eq(userProfileScores.id, existing[0].id));
  } else {
    await db.insert(userProfileScores).values(data);
  }
}

// ============ User Profile Summary ============

export async function getUserProfileSummary(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProfilesSummary).where(eq(userProfilesSummary.userId, userId)).limit(1);
  return result[0] ?? undefined;
}

export async function upsertUserProfileSummary(data: InsertUserProfileSummary) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(userProfilesSummary).where(eq(userProfilesSummary.userId, data.userId)).limit(1);
  if (existing.length > 0) {
    await db.update(userProfilesSummary).set(data).where(eq(userProfilesSummary.userId, data.userId));
  } else {
    await db.insert(userProfilesSummary).values(data);
  }
}

// ============ Match Records ============

export async function getLatestMatch(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(matchRecords)
    .where(or(eq(matchRecords.userAId, userId), eq(matchRecords.userBId, userId)))
    .orderBy(desc(matchRecords.createdAt)).limit(1);
  return result[0] ?? undefined;
}

export async function getMatchesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(matchRecords)
    .where(or(eq(matchRecords.userAId, userId), eq(matchRecords.userBId, userId)))
    .orderBy(desc(matchRecords.createdAt));
}

export async function getMatchedUserProfile(matchedUserId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select({
    nickname: userProfiles.nickname,
    avatarUrl: userProfiles.avatarUrl,
    gender: userProfiles.gender,
    university: userProfiles.university,
    major: userProfiles.major,
    bio: userProfiles.bio,
    wechatId: userProfiles.wechatId,
    wechatQrUrl: userProfiles.wechatQrUrl,
  }).from(userProfiles).where(eq(userProfiles.userId, matchedUserId)).limit(1);
  return result[0] ?? undefined;
}

export async function getAllMatches(opts: { page?: number; pageSize?: number; week?: string; status?: string } = {}) {
  const db = await getDb();
  if (!db) return { matches: [], total: 0 };
  const { page = 1, pageSize = 20, week, status } = opts;

  let where = sql`1=1`;
  if (week) where = sql`${where} AND ${matchRecords.matchWeek} = ${week}`;
  if (status) where = sql`${where} AND ${matchRecords.status} = ${status}`;

  const [rows, totalResult] = await Promise.all([
    db.select().from(matchRecords).where(where).orderBy(desc(matchRecords.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ count: count() }).from(matchRecords).where(where),
  ]);

  return { matches: rows, total: totalResult[0]?.count ?? 0 };
}

export async function createMatchRecord(data: InsertMatchRecord) {
  const db = await getDb();
  if (!db) return;
  await db.insert(matchRecords).values(data);
}

export async function updateMatchRecord(id: number, data: Partial<InsertMatchRecord>) {
  const db = await getDb();
  if (!db) return;
  await db.update(matchRecords).set(data).where(eq(matchRecords.id, id));
}

// ============ Match Config ============

export async function getMatchConfigs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(matchConfig);
}

export async function upsertMatchConfig(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(matchConfig).where(eq(matchConfig.configKey, key)).limit(1);
  if (existing.length > 0) {
    await db.update(matchConfig).set({ configValue: value, description }).where(eq(matchConfig.configKey, key));
  } else {
    await db.insert(matchConfig).values({ configKey: key, configValue: value, description });
  }
}

// ============ Stats (Admin Dashboard) ============

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, verifiedUsers: 0, completedQuestionnaires: 0, totalMatches: 0, activeUsers: 0 };

  const [totalUsersR, verifiedUsersR, completedQR, totalMatchesR] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(users).where(eq(users.verificationStatus, "verified")),
    db.select({ count: count() }).from(answerSessions).where(eq(answerSessions.status, "completed")),
    db.select({ count: count() }).from(matchRecords),
  ]);

  return {
    totalUsers: totalUsersR[0]?.count ?? 0,
    verifiedUsers: verifiedUsersR[0]?.count ?? 0,
    completedQuestionnaires: completedQR[0]?.count ?? 0,
    totalMatches: totalMatchesR[0]?.count ?? 0,
  };
}
