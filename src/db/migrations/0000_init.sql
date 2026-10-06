CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`equipment` text NOT NULL,
	`primary_muscle` text NOT NULL,
	`secondary_muscles` text DEFAULT '[]' NOT NULL,
	`is_custom` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_slug_unique` ON `exercises` (`slug`);--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`routine_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`position` integer NOT NULL,
	`target_sets` integer DEFAULT 3 NOT NULL,
	`rep_min` integer DEFAULT 8 NOT NULL,
	`rep_max` integer DEFAULT 12 NOT NULL,
	`rest_seconds` integer DEFAULT 120 NOT NULL,
	`progression_rule` text DEFAULT 'double' NOT NULL,
	`increment` real DEFAULT 5 NOT NULL,
	`increment_unit` text DEFAULT 'lb' NOT NULL,
	`warmups_enabled` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `routine_exercises_routine_idx` ON `routine_exercises` (`routine_id`,`position`);--> statement-breakpoint
CREATE TABLE `routines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`program_name` text,
	`position` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`exercise_order` integer NOT NULL,
	`set_order` integer NOT NULL,
	`is_warmup` integer DEFAULT false NOT NULL,
	`weight` real,
	`weight_unit` text DEFAULT 'lb' NOT NULL,
	`reps` integer,
	`rpe` real,
	`completed_at` integer,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `sets_workout_idx` ON `sets` (`workout_id`);--> statement-breakpoint
CREATE INDEX `sets_exercise_completed_idx` ON `sets` (`exercise_id`,`completed_at`);--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`routine_id` integer,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`notes` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE set null
);
