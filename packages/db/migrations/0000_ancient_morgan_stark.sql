CREATE TYPE "public"."adjustment_type" AS ENUM('initial', 'owner_joined', 'owner_departed', 'weight_change', 'manual');--> statement-breakpoint
CREATE TYPE "public"."budget_cycle_status" AS ENUM('locked', 'unlocked');--> statement-breakpoint
CREATE TYPE "public"."obligation_status" AS ENUM('active', 'departed', 'waived', 'completed');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'bank_transfer', 'cheque', 'mobile_payment', 'other');--> statement-breakpoint
CREATE TYPE "public"."schedule_status" AS ENUM('pending', 'partial', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."syndic_event" AS ENUM('assigned', 'resigned', 'transferred');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('residential', 'commercial', 'storage', 'other');--> statement-breakpoint
CREATE TABLE "annual_target_budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_budget" numeric(12, 2) NOT NULL,
	"status" "budget_cycle_status" DEFAULT 'unlocked' NOT NULL,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
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
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"phone" text,
	"locale" text DEFAULT 'en',
	"is_active" boolean DEFAULT true,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "co_owners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"user_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cycle_adjustments" (
	"id" serial PRIMARY KEY NOT NULL,
	"annual_target_budget_id" integer NOT NULL,
	"type" "adjustment_type" NOT NULL,
	"delta_amount" numeric(12, 2) NOT NULL,
	"reason" text NOT NULL,
	"related_ownership_id" integer,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cycle_obligations" (
	"id" serial PRIMARY KEY NOT NULL,
	"annual_target_budget_id" integer NOT NULL,
	"ownership_id" integer NOT NULL,
	"share_amount" numeric(12, 2) NOT NULL,
	"snapshot_contribution_weight" numeric(5, 2) NOT NULL,
	"base_monthly_rate" numeric(12, 2) NOT NULL,
	"payment_interval_months" smallint DEFAULT 1 NOT NULL,
	"credit_balance" numeric(12, 2) DEFAULT 0 NOT NULL,
	"status" "obligation_status" DEFAULT 'active' NOT NULL,
	"departed_at" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "cycle_obligations_unique_per_budget_ownership" UNIQUE("annual_target_budget_id","ownership_id")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"address" text,
	"city" varchar(100) NOT NULL,
	"postal_code" varchar(20),
	"country_code" char(2),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"unit_number" varchar(30) NOT NULL,
	"floor" varchar(30),
	"type" "unit_type" DEFAULT 'residential' NOT NULL,
	"weight_coefficient" numeric(5, 2) DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "units_unique_label_per_property" UNIQUE("property_id","unit_number")
);
--> statement-breakpoint
CREATE TABLE "unit_co_owners" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"co_owner_id" integer NOT NULL,
	"ownership_percentage" numeric(5, 2),
	"is_designated_syndic" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "uq_unit_co_owners_unit_co_owner" UNIQUE("unit_id","co_owner_id")
);
--> statement-breakpoint
CREATE TABLE "syndic_designations" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"event" "syndic_event" DEFAULT 'assigned' NOT NULL,
	"transferred_from_user_id" text,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resigned_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle_obligation_id" integer NOT NULL,
	"installment_number" smallint NOT NULL,
	"due_date" date NOT NULL,
	"amount_due" numeric(12, 2) NOT NULL,
	"is_final_installment" boolean DEFAULT false NOT NULL,
	"status" "schedule_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_schedules_unique_installment" UNIQUE("cycle_obligation_id","installment_number")
);
--> statement-breakpoint
CREATE TABLE "payment_co_payers" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_schedule_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"expected_share" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "payment_co_payers_unique_user_per_schedule" UNIQUE("payment_schedule_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle_obligation_id" integer NOT NULL,
	"payment_schedule_id" integer,
	"paid_by_user_id" text NOT NULL,
	"recorded_by_user_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"paid_at" timestamp with time zone DEFAULT now() NOT NULL,
	"method" "payment_method" DEFAULT 'cash' NOT NULL,
	"reference" varchar(100),
	"notes" text,
	"voided_at" timestamp with time zone,
	"voided_by_user_id" text,
	"void_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"invited_by_user_id" text NOT NULL,
	"user_id" text,
	"email" varchar(255) NOT NULL,
	"token" varchar(64) NOT NULL,
	"accepted_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "unit_ownerships" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"started_at" date NOT NULL,
	"ended_at" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "annual_target_budgets" ADD CONSTRAINT "annual_target_budgets_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annual_target_budgets" ADD CONSTRAINT "annual_target_budgets_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "co_owners" ADD CONSTRAINT "co_owners_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_adjustments" ADD CONSTRAINT "cycle_adjustments_annual_target_budget_id_annual_target_budgets_id_fk" FOREIGN KEY ("annual_target_budget_id") REFERENCES "public"."annual_target_budgets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_adjustments" ADD CONSTRAINT "cycle_adjustments_related_ownership_id_unit_ownerships_id_fk" FOREIGN KEY ("related_ownership_id") REFERENCES "public"."unit_ownerships"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_adjustments" ADD CONSTRAINT "cycle_adjustments_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_obligations" ADD CONSTRAINT "cycle_obligations_annual_target_budget_id_annual_target_budgets_id_fk" FOREIGN KEY ("annual_target_budget_id") REFERENCES "public"."annual_target_budgets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_obligations" ADD CONSTRAINT "cycle_obligations_ownership_id_unit_co_owners_id_fk" FOREIGN KEY ("ownership_id") REFERENCES "public"."unit_co_owners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_co_owners" ADD CONSTRAINT "unit_co_owners_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_co_owners" ADD CONSTRAINT "unit_co_owners_co_owner_id_co_owners_id_fk" FOREIGN KEY ("co_owner_id") REFERENCES "public"."co_owners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syndic_designations" ADD CONSTRAINT "syndic_designations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syndic_designations" ADD CONSTRAINT "syndic_designations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syndic_designations" ADD CONSTRAINT "syndic_designations_transferred_from_user_id_user_id_fk" FOREIGN KEY ("transferred_from_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_cycle_obligation_id_cycle_obligations_id_fk" FOREIGN KEY ("cycle_obligation_id") REFERENCES "public"."cycle_obligations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_co_payers" ADD CONSTRAINT "payment_co_payers_payment_schedule_id_payment_schedules_id_fk" FOREIGN KEY ("payment_schedule_id") REFERENCES "public"."payment_schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_co_payers" ADD CONSTRAINT "payment_co_payers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_cycle_obligation_id_cycle_obligations_id_fk" FOREIGN KEY ("cycle_obligation_id") REFERENCES "public"."cycle_obligations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_schedule_id_payment_schedules_id_fk" FOREIGN KEY ("payment_schedule_id") REFERENCES "public"."payment_schedules"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_paid_by_user_id_user_id_fk" FOREIGN KEY ("paid_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_user_id_user_id_fk" FOREIGN KEY ("recorded_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_voided_by_user_id_user_id_fk" FOREIGN KEY ("voided_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_user_id_user_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_ownerships" ADD CONSTRAINT "unit_ownerships_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_ownerships" ADD CONSTRAINT "unit_ownerships_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_annual_target_budgets_property_id" ON "annual_target_budgets" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_annual_target_budgets_status" ON "annual_target_budgets" USING btree ("property_id","status");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "idx_cycle_adjustments_budget_id" ON "cycle_adjustments" USING btree ("annual_target_budget_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_obligations_budget_id" ON "cycle_obligations" USING btree ("annual_target_budget_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_obligations_ownership_id" ON "cycle_obligations" USING btree ("ownership_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_obligations_status" ON "cycle_obligations" USING btree ("annual_target_budget_id","status");--> statement-breakpoint
CREATE INDEX "idx_units_property_id" ON "units" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_units_type" ON "units" USING btree ("property_id","type");--> statement-breakpoint
CREATE INDEX "idx_syndic_designations_property_id" ON "syndic_designations" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_syndic_designations_user_id" ON "syndic_designations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_schedules_obligation_id" ON "payment_schedules" USING btree ("cycle_obligation_id");--> statement-breakpoint
CREATE INDEX "idx_payment_schedules_due_date" ON "payment_schedules" USING btree ("due_date","status");--> statement-breakpoint
CREATE INDEX "idx_payment_schedules_status" ON "payment_schedules" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payment_co_payers_schedule_id" ON "payment_co_payers" USING btree ("payment_schedule_id");--> statement-breakpoint
CREATE INDEX "idx_payment_co_payers_user_id" ON "payment_co_payers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payments_obligation_id" ON "payments" USING btree ("cycle_obligation_id");--> statement-breakpoint
CREATE INDEX "idx_payments_schedule_id" ON "payments" USING btree ("payment_schedule_id");--> statement-breakpoint
CREATE INDEX "idx_payments_paid_by" ON "payments" USING btree ("paid_by_user_id");--> statement-breakpoint
CREATE INDEX "idx_payments_paid_at" ON "payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "idx_invitations_email" ON "invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_invitations_token" ON "invitations" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_unit_ownerships_unit_id" ON "unit_ownerships" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "idx_unit_ownerships_user_id" ON "unit_ownerships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_unit_ownerships_active" ON "unit_ownerships" USING btree ("unit_id","started_at");