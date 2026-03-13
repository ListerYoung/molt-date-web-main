CREATE TABLE `answer_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`totalQuestions` int NOT NULL DEFAULT 66,
	`answeredCount` int NOT NULL DEFAULT 0,
	`cachedAnswers` json,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`lastActivityAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `answer_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `match_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`configKey` varchar(50) NOT NULL,
	`configValue` varchar(200) NOT NULL,
	`description` varchar(500),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `match_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `match_config_configKey_unique` UNIQUE(`configKey`)
);
--> statement-breakpoint
CREATE TABLE `match_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userAId` int NOT NULL,
	`userBId` int NOT NULL,
	`compatibilityScore` float,
	`scoreAtoB` float,
	`scoreBtoA` float,
	`matchWeek` varchar(20) NOT NULL,
	`matchType` enum('precise','explore','random') DEFAULT 'precise',
	`dimensionScores` json,
	`commonTraits` json,
	`aiSummary` text,
	`status` enum('pending','pushed','viewed_a','viewed_b','both_viewed','contacted','expired') NOT NULL DEFAULT 'pending',
	`pushedAt` timestamp,
	`viewedByAAt` timestamp,
	`viewedByBAt` timestamp,
	`feedbackA` enum('like','neutral','dislike'),
	`feedbackB` enum('like','neutral','dislike'),
	`feedbackAText` text,
	`feedbackBText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `match_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile_dimensions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`domainKey` varchar(50) NOT NULL,
	`domainNameZh` varchar(100) NOT NULL,
	`domainNameEn` varchar(100) NOT NULL,
	`dimensionKey` varchar(50) NOT NULL,
	`nameZh` varchar(100) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`descriptionZh` text,
	`descriptionEn` text,
	`mbseCategory` enum('A','B','C','D') DEFAULT 'C',
	`matchStrategy` enum('similar','complementary','threshold','expectation') DEFAULT 'similar',
	`matchWeight` float DEFAULT 0.08,
	`relatedQuestions` json,
	`minScore` float NOT NULL DEFAULT 0,
	`maxScore` float NOT NULL DEFAULT 100,
	`color` varchar(20),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profile_dimensions_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_dimensions_dimensionKey_unique` UNIQUE(`dimensionKey`)
);
--> statement-breakpoint
CREATE TABLE `questionnaire_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`answers` json NOT NULL,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questionnaire_answers_id` PRIMARY KEY(`id`),
	CONSTRAINT `questionnaire_answers_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionNumber` int NOT NULL,
	`module` int NOT NULL DEFAULT 1,
	`category` varchar(50) NOT NULL,
	`categoryZh` varchar(100) NOT NULL,
	`categoryEn` varchar(100) NOT NULL,
	`textZh` text NOT NULL,
	`textEn` text NOT NULL,
	`options` json NOT NULL,
	`mbseCategory` enum('A','B','C','D') DEFAULT 'C',
	`isRedLine` boolean DEFAULT false,
	`redLineThreshold` float,
	`dimensionWeights` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`aiVectorized` boolean DEFAULT false,
	`aiEmbedding` text,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionId` int NOT NULL,
	`questionId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`selectedOption` varchar(10) NOT NULL,
	`answeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profile_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dimensionId` int NOT NULL,
	`dimensionKey` varchar(50) NOT NULL,
	`domainKey` varchar(50) NOT NULL,
	`rawScore` float DEFAULT 0,
	`normalizedScore` float DEFAULT 0,
	`percentile` float,
	`computedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profile_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nickname` varchar(100),
	`avatarUrl` text,
	`gender` enum('male','female','other'),
	`birthYear` int,
	`university` varchar(200),
	`major` varchar(200),
	`graduationYear` int,
	`bio` text,
	`wechatId` varchar(100),
	`wechatQrUrl` text,
	`campusEmail` varchar(320),
	`verificationStatus` enum('unverified','pending','verified','rejected') NOT NULL DEFAULT 'unverified',
	`verificationMethod` enum('campus_email','xuexin'),
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles_summary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`featureVector` json,
	`vectorA` json,
	`vectorB` json,
	`vectorC` json,
	`vectorD` json,
	`domainScores` json,
	`consistencyScore` float,
	`consistencyFlags` json,
	`aiPortrait` text,
	`aiPortraitUpdatedAt` timestamp,
	`profileType` varchar(50),
	`profileTypeEn` varchar(50),
	`computedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_summary_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_summary_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`gender` enum('male','female','other'),
	`birthDate` varchar(20),
	`birthCalendar` enum('solar','lunar') DEFAULT 'solar',
	`birthPlace` varchar(200),
	`university` varchar(200),
	`grade` varchar(50),
	`major` varchar(200),
	`mbti` varchar(10),
	`tags` json,
	`avatarUrl` text,
	`bio` text,
	`wechatId` varchar(100),
	`wechatQrUrl` text,
	`campusEmail` varchar(320),
	`verificationStatus` enum('unverified','pending','verified','rejected') DEFAULT 'unverified',
	`verificationMethod` enum('campus_email','xuexin'),
	`verifiedAt` timestamp,
	`accountStatus` enum('active','suspended','banned') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
