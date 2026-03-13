import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-test-user",
    email: "admin@test.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    gender: null,
    birthDate: null,
    birthCalendar: "solar",
    birthPlace: null,
    university: null,
    grade: null,
    major: null,
    mbti: null,
    tags: null,
    avatarUrl: null,
    bio: null,
    wechatId: null,
    wechatQrUrl: null,
    campusEmail: null,
    verificationStatus: "unverified",
    verificationMethod: null,
    verifiedAt: null,
    accountStatus: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createRegularUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-test-user",
    email: "user@test.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    gender: null,
    birthDate: null,
    birthCalendar: "solar",
    birthPlace: null,
    university: null,
    grade: null,
    major: null,
    mbti: null,
    tags: null,
    avatarUrl: null,
    bio: null,
    wechatId: null,
    wechatQrUrl: null,
    campusEmail: null,
    verificationStatus: "unverified",
    verificationMethod: null,
    verifiedAt: null,
    accountStatus: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("Admin API - Access Control", () => {
  it("rejects unauthenticated users from admin endpoints", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("rejects regular users from admin endpoints", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("rejects regular users from admin questions endpoint", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.questions.list()).rejects.toThrow();
  });

  it("rejects regular users from admin matching endpoint", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.matching.list()).rejects.toThrow();
  });

  it("rejects regular users from admin personality endpoint", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.personality.dimensions.list()).rejects.toThrow();
  });

  it("rejects regular users from admin records endpoint", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.records.list()).rejects.toThrow();
  });
});

describe("Admin API - Users Module", () => {
  it("allows admin to list users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.users.list();
    expect(result).toHaveProperty("users");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.users)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("supports pagination for user list", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.users.list({ page: 1, pageSize: 5 });
    expect(result.users.length).toBeLessThanOrEqual(5);
  });

  it("allows admin to get stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.users.stats();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("verifiedUsers");
    expect(result).toHaveProperty("completedQuestionnaires");
    expect(result).toHaveProperty("totalMatches");
    expect(typeof result.totalUsers).toBe("number");
  });
});

describe("Admin API - Questions Module", () => {
  it("allows admin to list questions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.questions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns questions as array with expected fields", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.questions.list();
    expect(Array.isArray(result)).toBe(true);
    // If there are questions, check they have expected shape
    if (result.length > 0) {
      const q = result[0];
      expect(q).toHaveProperty("id");
      expect(q).toHaveProperty("questionNumber");
    }
  });
});

describe("Admin API - Records Module", () => {
  it("allows admin to list answer sessions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.records.list();
    expect(result).toHaveProperty("sessions");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.sessions)).toBe(true);
  });

  it("supports pagination for records", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.records.list({ page: 1, pageSize: 5 });
    expect(result.sessions.length).toBeLessThanOrEqual(5);
  });
});

describe("Admin API - Personality Module", () => {
  it("allows admin to list dimensions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.personality.dimensions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows admin to get personality stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.personality.stats();
    expect(result).toHaveProperty("dimensionCount");
    expect(result).toHaveProperty("dimensions");
    expect(typeof result.dimensionCount).toBe("number");
  });

  it("allows admin to list user scores", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.personality.scores.list({ page: 1, pageSize: 10 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Admin API - Matching Module", () => {
  it("allows admin to list matches", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.matching.list();
    expect(result).toHaveProperty("matches");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.matches)).toBe(true);
  });

  it("allows admin to get matching stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.matching.stats();
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("pushed");
    expect(result).toHaveProperty("avgScore");
    expect(result).toHaveProperty("viewRate");
    expect(typeof result.total).toBe("number");
  });

  it("allows admin to get pool stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.matching.poolStats();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("verified");
    expect(result).toHaveProperty("withQuestionnaire");
    expect(result).toHaveProperty("eligible");
    expect(typeof result.totalUsers).toBe("number");
  });

  it("allows admin to list match configs", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.matching.config.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("supports filtering matches by status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.matching.list({ status: "pending" });
    expect(result).toHaveProperty("matches");
    expect(Array.isArray(result.matches)).toBe(true);
  });
});
