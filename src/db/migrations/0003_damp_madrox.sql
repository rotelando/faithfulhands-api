CREATE TYPE "public"."role" AS ENUM('guardian', 'staff', 'admin');--> statement-breakpoint
CREATE TYPE "public"."attendance_session_status" AS ENUM('active', 'picked_up', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."token_status" AS ENUM('active', 'used', 'expired', 'revoked');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_provider_account_unique" UNIQUE("provider_id","account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text,
	"image" text,
	"role" "role" DEFAULT 'staff' NOT NULL,
	"image_cld_pub_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_identifier_value_unique" UNIQUE("identifier","value")
);
--> statement-breakpoint
CREATE TABLE "attendance_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"checked_in_at" timestamp,
	"checked_out_at" timestamp,
	"checked_in_by" integer NOT NULL,
	"checked_out_by" integer NOT NULL,
	"date" date NOT NULL,
	"status" "attendance_session_status" DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "attendance_sessions_child_date_unique" UNIQUE("child_id","date")
);
--> statement-breakpoint
CREATE TABLE "pickup_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attendance_session_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"issued_to_label" text NOT NULL,
	"issued_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"used_by" integer,
	"status" "token_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pickup_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_checked_in_by_staff_id_fk" FOREIGN KEY ("checked_in_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_checked_out_by_staff_id_fk" FOREIGN KEY ("checked_out_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_tokens" ADD CONSTRAINT "pickup_tokens_attendance_session_id_attendance_sessions_id_fk" FOREIGN KEY ("attendance_session_id") REFERENCES "public"."attendance_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_tokens" ADD CONSTRAINT "pickup_tokens_used_by_staff_id_fk" FOREIGN KEY ("used_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "attendance_sessions_child_id_idx" ON "attendance_sessions" USING btree ("child_id");--> statement-breakpoint
CREATE INDEX "attendance_sessions_class_id_idx" ON "attendance_sessions" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "attendance_sessions_service_date_idx" ON "attendance_sessions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "attendance_sessions_status_idx" ON "attendance_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "attendance_sessions_checked_in_at_idx" ON "attendance_sessions" USING btree ("checked_in_at");--> statement-breakpoint
CREATE INDEX "attendance_sessions_checked_out_at_idx" ON "attendance_sessions" USING btree ("checked_out_at");--> statement-breakpoint
CREATE INDEX "pickup_tokens_attendance_session_id_idx" ON "pickup_tokens" USING btree ("attendance_session_id");--> statement-breakpoint
CREATE INDEX "pickup_tokens_token_hash_idx" ON "pickup_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "pickup_tokens_status_idx" ON "pickup_tokens" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pickup_tokens_expires_at_idx" ON "pickup_tokens" USING btree ("expires_at");