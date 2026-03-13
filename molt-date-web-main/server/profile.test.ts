import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getProfileByUserId: vi.fn(),
  upsertProfile: vi.fn(),
  getAnswersByUserId: vi.fn(),
  upsertAnswers: vi.fn(),
  getLatestMatch: vi.fn(),
  getMatchesForUser: vi.fn(),
  getMatchedUserProfile: vi.fn(),
}));

import { getProfileByUserId, upsertProfile, getAnswersByUserId, upsertAnswers, getLatestMatch } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@zju.edu.cn",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
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
      clearCookie: vi.fn(),
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
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("profile.get", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns profile for authenticated user", async () => {
    const mockProfile = {
      id: 1,
      userId: 1,
      nickname: "TestUser",
      university: "浙江大学",
      verificationStatus: "verified",
    };
    (getProfileByUserId as any).mockResolvedValue(mockProfile);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.profile.get();

    expect(result).toEqual(mockProfile);
    expect(getProfileByUserId).toHaveBeenCalledWith(1);
  });

  it("throws for unauthenticated user", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.get()).rejects.toThrow();
  });
});

describe("profile.update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates profile with valid data", async () => {
    (upsertProfile as any).mockResolvedValue(undefined);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.profile.update({
      nickname: "NewNickname",
      gender: "male",
      birthYear: 2000,
      major: "Computer Science",
      bio: "Hello world",
      wechatId: "test_wechat",
    });

    expect(result).toEqual({ success: true });
    expect(upsertProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        nickname: "NewNickname",
        gender: "male",
      })
    );
  });

  it("rejects invalid birth year", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.profile.update({ birthYear: 1900 })
    ).rejects.toThrow();
  });
});

describe("profile.submitCampusEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies valid ZJU email", async () => {
    (upsertProfile as any).mockResolvedValue(undefined);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.profile.submitCampusEmail({
      campusEmail: "student@zju.edu.cn",
    });

    expect(result).toEqual({ success: true, university: "浙江大学" });
    expect(upsertProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        campusEmail: "student@zju.edu.cn",
        university: "浙江大学",
        verificationStatus: "verified",
      })
    );
  });

  it("verifies valid Tsinghua email", async () => {
    (upsertProfile as any).mockResolvedValue(undefined);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.profile.submitCampusEmail({
      campusEmail: "student@tsinghua.edu.cn",
    });

    expect(result).toEqual({ success: true, university: "清华大学" });
  });

  it("rejects unsupported campus email", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.profile.submitCampusEmail({ campusEmail: "user@random.edu.cn" })
    ).rejects.toThrow("目前仅支持浙大、清华、北大、复旦的校园邮箱认证");
  });
});

describe("questionnaire.saveAnswers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves answers for authenticated user", async () => {
    (upsertAnswers as any).mockResolvedValue(undefined);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const answers: Record<string, string> = {};
    for (let i = 1; i <= 66; i++) {
      answers[String(i)] = "A";
    }

    const result = await caller.questionnaire.saveAnswers({ answers });

    expect(result).toEqual({ success: true, count: 66 });
    expect(upsertAnswers).toHaveBeenCalledWith(1, expect.any(Object));
  });
});

describe("match.getLatest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no match exists", async () => {
    (getLatestMatch as any).mockResolvedValue(null);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.match.getLatest();

    expect(result).toBeNull();
  });
});
