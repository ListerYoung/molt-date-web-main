import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const cookies: Record<string, string> = {};
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: (name: string, value: string) => {
        cookies[name] = value;
      },
    } as unknown as TrpcContext["res"],
  };
}

describe("Admin Login API", () => {
  it("rejects login with wrong password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.login({ password: "wrong-password-xyz" });
    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it("accepts login with correct ADMIN_PASSWORD", async () => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.warn("ADMIN_PASSWORD not set, skipping test");
      return;
    }

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.login({ password: adminPassword });
    expect(result.success).toBe(true);
    expect(result.message).toBe("登录成功");
  });

  it("checkSession returns false for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.checkSession();
    expect(result.authenticated).toBe(false);
    expect(result.isAdmin).toBe(false);
  });
});
