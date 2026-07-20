CREATE TABLE `attempt_answers` (
	`attempt_id` text NOT NULL,
	`question_id` integer NOT NULL,
	`option_id` integer,
	`is_flagged` integer DEFAULT false NOT NULL,
	`answered_at` text,
	PRIMARY KEY(`attempt_id`, `question_id`),
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`option_id`) REFERENCES `question_options`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`exam_id` integer NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`correct_count` integer,
	`score_percent` integer,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`submitted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `attempts_user_started_idx` ON `attempts` (`user_id`,`started_at`);--> statement-breakpoint
CREATE INDEX `attempts_exam_status_idx` ON `attempts` (`exam_id`,`status`);--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`institution` text NOT NULL,
	`category` text,
	`workload_hours` integer,
	`issued_at` text,
	`validation_url` text,
	`summary` text,
	`skills_json` text DEFAULT '[]' NOT NULL,
	`file_key` text,
	`file_name` text,
	`file_type` text,
	`file_size_bytes` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `certificates_user_created_idx` ON `certificates` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `certificates_user_category_idx` ON `certificates` (`user_id`,`category`);--> statement-breakpoint
CREATE TABLE `exam_questions` (
	`exam_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`exam_id`, `question_id`),
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exam_questions_position_idx` ON `exam_questions` (`exam_id`,`position`);--> statement-breakpoint
CREATE TABLE `exams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`year` integer,
	`duration_minutes` integer NOT NULL,
	`question_count` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exams_slug_unique` ON `exams` (`slug`);--> statement-breakpoint
CREATE INDEX `exams_status_year_idx` ON `exams` (`status`,`year`);--> statement-breakpoint
CREATE TABLE `question_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`label` text NOT NULL,
	`content` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `question_options_question_label_idx` ON `question_options` (`question_id`,`label`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`year` integer,
	`area` text NOT NULL,
	`topic` text NOT NULL,
	`statement` text NOT NULL,
	`support_text` text,
	`source_label` text,
	`image_key` text,
	`difficulty` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questions_external_id_idx` ON `questions` (`external_id`);--> statement-breakpoint
CREATE INDEX `questions_area_topic_idx` ON `questions` (`area`,`topic`);--> statement-breakpoint
CREATE INDEX `questions_year_status_idx` ON `questions` (`year`,`status`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text DEFAULT 'mercado_pago' NOT NULL,
	`provider_payment_id` text,
	`period_days` integer NOT NULL,
	`price_cents` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_provider_payment_idx` ON `subscriptions` (`provider_payment_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_user_created_idx` ON `subscriptions` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`plus_days_accumulated` integer DEFAULT 0 NOT NULL,
	`storage_limit_bytes` integer DEFAULT 52428800 NOT NULL,
	`storage_used_bytes` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);