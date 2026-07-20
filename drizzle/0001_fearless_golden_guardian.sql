CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`category` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`page_url` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `contact_messages_status_created_idx` ON `contact_messages` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `contact_messages_email_created_idx` ON `contact_messages` (`email`,`created_at`);--> statement-breakpoint
CREATE TABLE `question_topics` (
	`question_id` integer NOT NULL,
	`topic_id` integer NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`confidence` integer DEFAULT 100 NOT NULL,
	`assigned_by` text DEFAULT 'editorial' NOT NULL,
	`reviewed_at` text,
	PRIMARY KEY(`question_id`, `topic_id`),
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `question_topics_topic_question_idx` ON `question_topics` (`topic_id`,`question_id`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`area` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_slug_unique` ON `subjects` (`slug`);--> statement-breakpoint
CREATE INDEX `subjects_area_sort_idx` ON `subjects` (`area`,`sort_order`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`subject_id` integer NOT NULL,
	`parent_id` integer,
	`path` text NOT NULL,
	`depth` integer DEFAULT 0 NOT NULL,
	`premium_filter` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_slug_unique` ON `topics` (`slug`);--> statement-breakpoint
CREATE INDEX `topics_subject_parent_idx` ON `topics` (`subject_id`,`parent_id`);--> statement-breakpoint
CREATE INDEX `topics_path_idx` ON `topics` (`path`);--> statement-breakpoint
ALTER TABLE `questions` ADD `exam_day` integer;--> statement-breakpoint
ALTER TABLE `questions` ADD `booklet` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `official_number` integer;--> statement-breakpoint
ALTER TABLE `questions` ADD `language` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `source_url` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `asset_bundle_key` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `review_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `questions` ADD `taxonomy_version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `questions_official_position_idx` ON `questions` (`year`,`exam_day`,`booklet`,`official_number`);