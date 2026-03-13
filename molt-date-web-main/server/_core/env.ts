export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT ?? "3000",
  cookieSecret: process.env.JWT_SECRET ?? "default-secret-key-for-development",
  appId: process.env.VITE_APP_ID ?? "molt-date-app",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  ownerName: process.env.OWNER_NAME ?? "",
  oauthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  frontendForgeApiUrl: process.env.VITE_FRONTEND_FORGE_API_URL ?? "",
  frontendForgeApiKey: process.env.VITE_FRONTEND_FORGE_API_KEY ?? "",
};
