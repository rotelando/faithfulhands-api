CREATE TABLE "children" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"gender" varchar(255) NOT NULL,
	"date_of_birth" date NOT NULL,
	"allergies" varchar(255),
	"class_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "children_parties" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer,
	"party_id" integer,
	"relationship" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(4) NOT NULL,
	"capacity" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "parties" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"gender" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "parties_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "party_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"party_id" integer,
	"role_id" integer
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
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
CREATE TABLE "care_session_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "care_session_statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "care_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100),
	"class_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"care_session_status_id" integer NOT NULL,
	"date" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "care_sessions_children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"care_session_id" uuid NOT NULL,
	"child_id" integer NOT NULL,
	"checked_in_at" timestamp,
	"checked_in_by" integer NOT NULL,
	"checked_out_at" timestamp,
	"checked_out_by" integer,
	"care_sessions_children_status_id" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "care_sessions_children_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "care_sessions_children_statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "pickup_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"care_session_children_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"issued_to_label" text NOT NULL,
	"issued_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"used_by" integer,
	"status" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pickup_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "token_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "token_statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children_parties" ADD CONSTRAINT "children_parties_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children_parties" ADD CONSTRAINT "children_parties_party_id_parties_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parties" ADD CONSTRAINT "parties_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_roles" ADD CONSTRAINT "party_roles_party_id_parties_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_roles" ADD CONSTRAINT "party_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions" ADD CONSTRAINT "care_sessions_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions" ADD CONSTRAINT "care_sessions_care_session_status_id_care_session_statuses_id_fk" FOREIGN KEY ("care_session_status_id") REFERENCES "public"."care_session_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions_children" ADD CONSTRAINT "care_sessions_children_care_session_id_care_sessions_id_fk" FOREIGN KEY ("care_session_id") REFERENCES "public"."care_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions_children" ADD CONSTRAINT "care_sessions_children_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions_children" ADD CONSTRAINT "care_sessions_children_checked_in_by_parties_id_fk" FOREIGN KEY ("checked_in_by") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions_children" ADD CONSTRAINT "care_sessions_children_checked_out_by_parties_id_fk" FOREIGN KEY ("checked_out_by") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_sessions_children" ADD CONSTRAINT "care_sessions_children_care_sessions_children_status_id_care_sessions_children_statuses_id_fk" FOREIGN KEY ("care_sessions_children_status_id") REFERENCES "public"."care_sessions_children_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_tokens" ADD CONSTRAINT "pickup_tokens_care_session_children_id_care_sessions_children_id_fk" FOREIGN KEY ("care_session_children_id") REFERENCES "public"."care_sessions_children"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_tokens" ADD CONSTRAINT "pickup_tokens_used_by_parties_id_fk" FOREIGN KEY ("used_by") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_tokens" ADD CONSTRAINT "pickup_tokens_status_token_statuses_id_fk" FOREIGN KEY ("status") REFERENCES "public"."token_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "care_session_statuses_name_idx" ON "care_session_statuses" USING btree ("name");--> statement-breakpoint
CREATE INDEX "care_sessions_class_id_idx" ON "care_sessions" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "care_sessions_service_date_idx" ON "care_sessions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "care_sessions_status_idx" ON "care_sessions" USING btree ("care_session_status_id");--> statement-breakpoint
CREATE INDEX "care_sessions_children_care_session_id_idx" ON "care_sessions_children" USING btree ("care_session_id");--> statement-breakpoint
CREATE INDEX "care_sessions_children_child_id_idx" ON "care_sessions_children" USING btree ("child_id");--> statement-breakpoint
CREATE INDEX "care_sessions_children_status_idx" ON "care_sessions_children" USING btree ("care_sessions_children_status_id");--> statement-breakpoint
CREATE INDEX "care_sessions_children_checked_in_at_idx" ON "care_sessions_children" USING btree ("checked_in_at");--> statement-breakpoint
CREATE INDEX "care_sessions_children_checked_out_at_idx" ON "care_sessions_children" USING btree ("checked_out_at");--> statement-breakpoint
CREATE INDEX "care_sessions_children_statuses_name_idx" ON "care_sessions_children_statuses" USING btree ("name");--> statement-breakpoint
CREATE INDEX "pickup_tokens_care_session_children_id_idx" ON "pickup_tokens" USING btree ("care_session_children_id");--> statement-breakpoint
CREATE INDEX "pickup_tokens_token_hash_idx" ON "pickup_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "pickup_tokens_status_idx" ON "pickup_tokens" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pickup_tokens_expires_at_idx" ON "pickup_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "token_statuses_name_idx" ON "token_statuses" USING btree ("name");