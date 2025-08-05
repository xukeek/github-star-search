CREATE TABLE `repo` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`github_id` integer NOT NULL,
	`name` text NOT NULL,
	`full_name` text NOT NULL,
	`owner` text NOT NULL,
	`description` text,
	`language` text,
	`stargazers_count` integer,
	`topics` text,
	`starred_at` integer NOT NULL,
	`license` text,
	`pushed_at` integer,
	`archived` integer,
	`url` text,
	`readme_content` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `repo_github_id_unique` ON `repo` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `repo_full_name_unique` ON `repo` (`full_name`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `repo` (`user_id`);--> statement-breakpoint
CREATE INDEX `repo_github_id_idx` ON `repo` (`github_id`);--> statement-breakpoint
CREATE INDEX `language_idx` ON `repo` (`language`);--> statement-breakpoint
CREATE INDEX `stargazers_count_idx` ON `repo` (`stargazers_count`);--> statement-breakpoint
CREATE INDEX `starred_at_idx` ON `repo` (`starred_at`);--> statement-breakpoint
DROP TABLE `credit_transaction`;--> statement-breakpoint
DROP TABLE `purchased_item`;--> statement-breakpoint
DROP TABLE `team_invitation`;--> statement-breakpoint
DROP TABLE `team_membership`;--> statement-breakpoint
DROP TABLE `team_role`;--> statement-breakpoint
DROP TABLE `team`;--> statement-breakpoint
DROP INDEX `user_id_idx`;--> statement-breakpoint
CREATE INDEX `passkey_user_id_idx` ON `passkey_credential` (`userId`);--> statement-breakpoint
ALTER TABLE `passkey_credential` DROP COLUMN `updateCounter`;--> statement-breakpoint
DROP INDEX `google_account_id_idx`;--> statement-breakpoint
DROP INDEX `role_idx`;--> statement-breakpoint
ALTER TABLE `user` ADD `name` text(255);--> statement-breakpoint
ALTER TABLE `user` ADD `githubId` text(255);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubId_unique` ON `user` (`githubId`);--> statement-breakpoint
CREATE INDEX `github_id_idx` ON `user` (`githubId`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `updateCounter`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `firstName`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `lastName`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `passwordHash`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `emailVerified`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `signUpIpAddress`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `googleAccountId`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `currentCredits`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `lastCreditRefreshAt`;