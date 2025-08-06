CREATE TABLE `repo` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`githubId` integer NOT NULL,
	`name` text NOT NULL,
	`fullName` text NOT NULL,
	`owner` text NOT NULL,
	`description` text,
	`language` text,
	`stargazersCount` integer DEFAULT 0,
	`topics` text,
	`starredAt` integer NOT NULL,
	`license` text,
	`pushedAt` integer,
	`archived` integer DEFAULT false,
	`url` text,
	`readmeContent` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `repo_user_id_idx` ON `repo` (`userId`);--> statement-breakpoint
CREATE INDEX `repo_github_id_idx` ON `repo` (`githubId`);--> statement-breakpoint
CREATE INDEX `repo_user_repo_idx` ON `repo` (`userId`,`githubId`);--> statement-breakpoint
CREATE INDEX `repo_language_idx` ON `repo` (`language`);--> statement-breakpoint
CREATE INDEX `repo_stars_idx` ON `repo` (`stargazersCount`);--> statement-breakpoint
CREATE INDEX `repo_starred_at_idx` ON `repo` (`starredAt`);--> statement-breakpoint
CREATE INDEX `repo_owner_idx` ON `repo` (`owner`);--> statement-breakpoint
CREATE INDEX `repo_pushed_at_idx` ON `repo` (`pushedAt`);--> statement-breakpoint
CREATE TABLE `user` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`githubId` text NOT NULL,
	`login` text NOT NULL,
	`name` text,
	`email` text,
	`avatar` text,
	`accessToken` text,
	`lastSyncAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubId_unique` ON `user` (`githubId`);--> statement-breakpoint
CREATE INDEX `user_github_id_idx` ON `user` (`githubId`);--> statement-breakpoint
CREATE INDEX `user_login_idx` ON `user` (`login`);