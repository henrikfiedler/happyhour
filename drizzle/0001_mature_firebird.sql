ALTER TABLE "target_entry" DROP CONSTRAINT "target_entry_target_id_target_id_fk";
--> statement-breakpoint
ALTER TABLE "target_entry" ADD CONSTRAINT "target_entry_target_id_target_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."target"("id") ON DELETE cascade ON UPDATE no action;