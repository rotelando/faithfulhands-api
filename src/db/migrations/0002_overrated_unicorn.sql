ALTER TABLE "children_parents" RENAME TO "children_guardians";--> statement-breakpoint
ALTER TABLE "parents" RENAME TO "guardians";--> statement-breakpoint
ALTER TABLE "children_guardians" RENAME COLUMN "parent_id" TO "guardian_id";--> statement-breakpoint
ALTER TABLE "guardians" DROP CONSTRAINT "parents_email_unique";--> statement-breakpoint
ALTER TABLE "children_guardians" DROP CONSTRAINT "children_parents_child_id_children_id_fk";
--> statement-breakpoint
ALTER TABLE "children_guardians" DROP CONSTRAINT "children_parents_parent_id_parents_id_fk";
--> statement-breakpoint
ALTER TABLE "children_guardians" ADD CONSTRAINT "children_guardians_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children_guardians" ADD CONSTRAINT "children_guardians_guardian_id_guardians_id_fk" FOREIGN KEY ("guardian_id") REFERENCES "public"."guardians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_email_unique" UNIQUE("email");