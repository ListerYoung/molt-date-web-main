-- PostgreSQL 数据库表结构创建脚本
-- 注意：执行此脚本前，请确保已经创建了molt_date数据库
-- 创建数据库的命令：CREATE DATABASE molt_date;

-- 连接到数据库的命令：psql -U android -d molt_date

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建用户表
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "openId" VARCHAR(64) NOT NULL UNIQUE,
    "name" TEXT,
    "email" VARCHAR(320),
    "loginMethod" VARCHAR(64),
    "role" VARCHAR(10) DEFAULT 'user' NOT NULL CHECK ("role" IN ('user', 'admin')),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastSignedIn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 创建用户资料表
CREATE TABLE IF NOT EXISTS "user_profiles" (
    "id" SERIAL PRIMARY KEY,
    "userId" INT NOT NULL UNIQUE,
    "nickname" VARCHAR(100),
    "avatarUrl" TEXT,
    "gender" VARCHAR(10) CHECK ("gender" IN ('male', 'female', 'other')),
    "birthYear" INT,
    "university" VARCHAR(200),
    "major" VARCHAR(200),
    "graduationYear" INT,
    "bio" TEXT,
    "wechatId" VARCHAR(100),
    "wechatQrUrl" TEXT,
    "campusEmail" VARCHAR(320),
    "verificationStatus" VARCHAR(20) DEFAULT 'unverified' NOT NULL CHECK ("verificationStatus" IN ('unverified', 'pending', 'verified', 'rejected')),
    "verificationMethod" VARCHAR(20) CHECK ("verificationMethod" IN ('campus_email', 'xuexin')),
    "verifiedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON "user_profiles"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 创建问卷答案表
CREATE TABLE IF NOT EXISTS "questionnaire_answers" (
    "id" SERIAL PRIMARY KEY,
    "userId" INT NOT NULL UNIQUE,
    "answers" JSONB NOT NULL,
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_questionnaire_answers_updated_at
BEFORE UPDATE ON "questionnaire_answers"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 创建匹配记录表
CREATE TABLE IF NOT EXISTS "match_records" (
    "id" SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "matchedUserId" INT NOT NULL,
    "compatibilityScore" INT,
    "matchWeek" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK ("status" IN ('pending', 'revealed', 'expired')),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("matchedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 创建索引
CREATE INDEX idx_users_email ON "users"("email");
CREATE INDEX idx_users_openId ON "users"("openId");
CREATE INDEX idx_user_profiles_userId ON "user_profiles"("userId");
CREATE INDEX idx_questionnaire_answers_userId ON "questionnaire_answers"("userId");
CREATE INDEX idx_match_records_userId ON "match_records"("userId");
CREATE INDEX idx_match_records_matchedUserId ON "match_records"("matchedUserId");
CREATE INDEX idx_match_records_matchWeek ON "match_records"("matchWeek");

-- 执行步骤：
-- 1. 登录PostgreSQL命令行：psql -U android
-- 2. 创建数据库：CREATE DATABASE molt_date;
-- 3. 连接到数据库：\c molt_date
-- 4. 执行此脚本：\i /Users/android/work/nodeServer/molt-date-web/database.sql
