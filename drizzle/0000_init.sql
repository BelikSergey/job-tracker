CREATE TYPE "public"."employment_type" AS ENUM('employee', 'fop', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."reservation" AS ENUM('yes', 'no', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."salary_currency" AS ENUM('USD', 'EUR', 'UAH');--> statement-breakpoint
CREATE TYPE "public"."vacancy_source" AS ENUM('linkedin', 'dou', 'djinni', 'work_ua', 'referral', 'other');--> statement-breakpoint
CREATE TYPE "public"."vacancy_status" AS ENUM('interested', 'applied', 'contacted_recruiter', 'screening', 'technical', 'test_task', 'final', 'offer', 'rejected', 'no_response', 'closed', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."work_format" AS ENUM('remote', 'hybrid', 'office');--> statement-breakpoint
CREATE TABLE "status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vacancy_id" uuid NOT NULL,
	"from_status" "vacancy_status",
	"to_status" "vacancy_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vacancies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" text NOT NULL,
	"title" text NOT NULL,
	"company_url" text,
	"url" text,
	"source" "vacancy_source" DEFAULT 'other' NOT NULL,
	"raw_text" text,
	"salary_text" text,
	"salary_min" integer,
	"salary_max" integer,
	"salary_currency" "salary_currency",
	"work_format" "work_format",
	"english_level" text,
	"employment_type" "employment_type" DEFAULT 'unknown' NOT NULL,
	"reservation" "reservation" DEFAULT 'unknown' NOT NULL,
	"contact" text,
	"status" "vacancy_status" DEFAULT 'interested' NOT NULL,
	"next_step" text,
	"next_step_at" date,
	"notes" text,
	"applied_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "status_events" ADD CONSTRAINT "status_events_vacancy_id_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "status_events_vacancy_id_idx" ON "status_events" USING btree ("vacancy_id");--> statement-breakpoint
CREATE INDEX "vacancies_status_idx" ON "vacancies" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vacancies_next_step_at_idx" ON "vacancies" USING btree ("next_step_at");