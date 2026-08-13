CREATE TYPE "public"."adjustment_type" AS ENUM('initial', 'owner_joined', 'owner_departed', 'weight_change', 'manual');--> statement-breakpoint
CREATE TYPE "public"."budget_cycle_status" AS ENUM('draft', 'active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."obligation_status" AS ENUM('active', 'departed', 'waived', 'completed');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'bank_transfer', 'cheque', 'mobile_payment', 'other');--> statement-breakpoint
CREATE TYPE "public"."schedule_status" AS ENUM('pending', 'partial', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."syndic_event" AS ENUM('assigned', 'resigned', 'transferred');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('residential', 'commercial', 'storage', 'parking', 'other');--> statement-breakpoint
CREATE TABLE "budget_cycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"label" varchar(50) NOT NULL,
	"start_month" date NOT NULL,
	"end_month" date NOT NULL,
	"total_budget" numeric(12, 2) NOT NULL,
	"status" "budget_cycle_status" DEFAULT 'draft' NOT NULL,
	"snapshot_date" date,
	"activated_by_user_id" integer,
	"activated_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "budget_cycles_unique_label_per_property" UNIQUE("property_id","label")
);
--> statement-breakpoint
CREATE TABLE "cycle_adjustments" (
	"id" serial PRIMARY KEY NOT NULL,
	"budget_cycle_id" integer NOT NULL,
	"type" "adjustment_type" NOT NULL,
	"delta_amount" numeric(12, 2) NOT NULL,
	"reason" text NOT NULL,
	"related_ownership_id" integer,
	"created_by_user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cycle_obligations" (
	"id" serial PRIMARY KEY NOT NULL,
	"budget_cycle_id" integer NOT NULL,
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
	CONSTRAINT "cycle_obligations_unique_per_cycle_ownership" UNIQUE("budget_cycle_id","ownership_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp with time zone,
	"phone" varchar(30),
	"password_hash" varchar(255) NOT NULL,
	"remember_token" varchar(100),
	"locale" varchar(10) DEFAULT 'en' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"postal_code" varchar(20),
	"country_code" char(2) DEFAULT 'MA' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"unit_number" varchar(30) NOT NULL,
	"floor" smallint,
	"type" "unit_type" DEFAULT 'residential' NOT NULL,
	"contribution_weight" numeric(5, 2) DEFAULT 1 NOT NULL,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "units_unique_number_per_property" UNIQUE("property_id","unit_number")
);
--> statement-breakpoint
CREATE TABLE "ownerships" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"started_at" date NOT NULL,
	"ended_at" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_syndics" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"event" "syndic_event" DEFAULT 'assigned' NOT NULL,
	"transferred_from_user_id" integer,
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
	"user_id" integer NOT NULL,
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
	"paid_by_user_id" integer NOT NULL,
	"recorded_by_user_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"paid_at" timestamp with time zone DEFAULT now() NOT NULL,
	"method" "payment_method" DEFAULT 'cash' NOT NULL,
	"reference" varchar(100),
	"notes" text,
	"voided_at" timestamp with time zone,
	"voided_by_user_id" integer,
	"void_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"invited_by_user_id" integer NOT NULL,
	"user_id" integer,
	"email" varchar(255) NOT NULL,
	"token" varchar(64) NOT NULL,
	"accepted_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "budget_cycles" ADD CONSTRAINT "budget_cycles_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_cycles" ADD CONSTRAINT "budget_cycles_activated_by_user_id_users_id_fk" FOREIGN KEY ("activated_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_adjustments" ADD CONSTRAINT "cycle_adjustments_budget_cycle_id_budget_cycles_id_fk" FOREIGN KEY ("budget_cycle_id") REFERENCES "public"."budget_cycles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_adjustments" ADD CONSTRAINT "cycle_adjustments_related_ownership_id_ownerships_id_fk" FOREIGN KEY ("related_ownership_id") REFERENCES "public"."ownerships"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_adjustments" ADD CONSTRAINT "cycle_adjustments_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_obligations" ADD CONSTRAINT "cycle_obligations_budget_cycle_id_budget_cycles_id_fk" FOREIGN KEY ("budget_cycle_id") REFERENCES "public"."budget_cycles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_obligations" ADD CONSTRAINT "cycle_obligations_ownership_id_ownerships_id_fk" FOREIGN KEY ("ownership_id") REFERENCES "public"."ownerships"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownerships" ADD CONSTRAINT "ownerships_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownerships" ADD CONSTRAINT "ownerships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_syndics" ADD CONSTRAINT "property_syndics_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_syndics" ADD CONSTRAINT "property_syndics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_syndics" ADD CONSTRAINT "property_syndics_transferred_from_user_id_users_id_fk" FOREIGN KEY ("transferred_from_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_cycle_obligation_id_cycle_obligations_id_fk" FOREIGN KEY ("cycle_obligation_id") REFERENCES "public"."cycle_obligations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_co_payers" ADD CONSTRAINT "payment_co_payers_payment_schedule_id_payment_schedules_id_fk" FOREIGN KEY ("payment_schedule_id") REFERENCES "public"."payment_schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_co_payers" ADD CONSTRAINT "payment_co_payers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_cycle_obligation_id_cycle_obligations_id_fk" FOREIGN KEY ("cycle_obligation_id") REFERENCES "public"."cycle_obligations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_schedule_id_payment_schedules_id_fk" FOREIGN KEY ("payment_schedule_id") REFERENCES "public"."payment_schedules"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_paid_by_user_id_users_id_fk" FOREIGN KEY ("paid_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_user_id_users_id_fk" FOREIGN KEY ("recorded_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_voided_by_user_id_users_id_fk" FOREIGN KEY ("voided_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_budget_cycles_property_id" ON "budget_cycles" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_budget_cycles_status" ON "budget_cycles" USING btree ("property_id","status");--> statement-breakpoint
CREATE INDEX "idx_cycle_adjustments_cycle_id" ON "cycle_adjustments" USING btree ("budget_cycle_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_obligations_cycle_id" ON "cycle_obligations" USING btree ("budget_cycle_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_obligations_ownership_id" ON "cycle_obligations" USING btree ("ownership_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_obligations_status" ON "cycle_obligations" USING btree ("budget_cycle_id","status");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_is_active" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_units_property_id" ON "units" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_units_type" ON "units" USING btree ("property_id","type");--> statement-breakpoint
CREATE INDEX "idx_ownerships_unit_id" ON "ownerships" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "idx_ownerships_user_id" ON "ownerships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ownerships_active" ON "ownerships" USING btree ("unit_id","started_at");--> statement-breakpoint
CREATE INDEX "idx_property_syndics_property_id" ON "property_syndics" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_property_syndics_user_id" ON "property_syndics" USING btree ("user_id");--> statement-breakpoint
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
CREATE INDEX "idx_invitations_token" ON "invitations" USING btree ("token");