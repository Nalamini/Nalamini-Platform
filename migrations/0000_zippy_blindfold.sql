CREATE TABLE "analytics_daily" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"metric" text NOT NULL,
	"category" text NOT NULL,
	"district" text,
	"taluk" text,
	"value" double precision NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_type" text NOT NULL,
	"event_source" text NOT NULL,
	"properties" json,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_agent_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"service_types" jsonb,
	"operating_hours" text,
	"years_of_experience" integer,
	"preferred_providers" jsonb,
	"commission_rates" jsonb,
	"bank_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "booking_agent_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"booking_type" text NOT NULL,
	"provider" text,
	"origin" text,
	"destination" text,
	"check_in" date,
	"check_out" date,
	"passengers" integer,
	"amount" double precision NOT NULL,
	"status" text NOT NULL,
	"processed_by" integer,
	"total_commission_percent" double precision,
	"total_commission_amount" double precision,
	"commission_config_id" integer,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chat_conversation_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"left_at" timestamp,
	"role" text DEFAULT 'member' NOT NULL,
	CONSTRAINT "chat_conversation_members_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "chat_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_group" boolean DEFAULT false,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"read_by" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'sent' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_type" text NOT NULL,
	"provider" text,
	"admin_commission" double precision DEFAULT 0.5 NOT NULL,
	"branch_manager_commission" double precision DEFAULT 0.5 NOT NULL,
	"taluk_manager_commission" double precision DEFAULT 1 NOT NULL,
	"service_agent_commission" double precision DEFAULT 3 NOT NULL,
	"registered_user_commission" double precision DEFAULT 1 NOT NULL,
	"total_commission" double precision DEFAULT 6 NOT NULL,
	"start_date" date,
	"end_date" date,
	"is_peak_rate" boolean DEFAULT false,
	"season_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "commission_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"commission_amount" double precision NOT NULL,
	"commission_rate" double precision NOT NULL,
	"transaction_amount" double precision NOT NULL,
	"service_type" text NOT NULL,
	"transaction_id" integer NOT NULL,
	"provider" text,
	"description" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"user_type" text NOT NULL,
	"service_type" text NOT NULL,
	"service_id" integer NOT NULL,
	"original_amount" double precision NOT NULL,
	"commission_percentage" double precision NOT NULL,
	"commission_amount" double precision NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pickup_address" text NOT NULL,
	"delivery_address" text NOT NULL,
	"package_details" text NOT NULL,
	"amount" double precision NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" integer NOT NULL,
	"district" text NOT NULL,
	"taluk" text NOT NULL,
	"pincode" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farmer_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"farm_size" text,
	"farm_type" text,
	"primary_products" text NOT NULL,
	"cultivation_season" text,
	"operating_hours" text,
	"supports_delivery" boolean,
	"bank_details" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "farmer_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "farmer_product_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmer_id" integer NOT NULL,
	"grocery_product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" double precision NOT NULL,
	"unit" text NOT NULL,
	"image_url" text,
	"transport_agent_required" boolean DEFAULT true,
	"self_delivery" boolean DEFAULT false,
	"is_organic" boolean DEFAULT false,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"service_type" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "grocery_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"image_url" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "grocery_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "grocery_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"farmer_product_listing_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" double precision NOT NULL,
	"subtotal" double precision NOT NULL,
	"status" text DEFAULT 'pending',
	"farmer_id" integer NOT NULL,
	"product_name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "grocery_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"total_amount" double precision NOT NULL,
	"shipping_address" text NOT NULL,
	"district" text NOT NULL,
	"taluk" text NOT NULL,
	"pincode" text NOT NULL,
	"status" text DEFAULT 'pending',
	"pincode_agent_id" integer,
	"transport_agent_id" integer,
	"delivery_fee" double precision DEFAULT 0,
	"payment_method" text DEFAULT 'cash',
	"payment_status" text DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "grocery_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"price" double precision NOT NULL,
	"discounted_price" double precision,
	"farmer_id" integer,
	"stock" integer NOT NULL,
	"unit" text NOT NULL,
	"is_organic" boolean DEFAULT false,
	"district" text NOT NULL,
	"image_url" text,
	"delivery_option" text DEFAULT 'both',
	"available_areas" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "grocery_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"parent_category_id" integer NOT NULL,
	"image_url" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "local_product_base" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"manufacturer_id" integer,
	"admin_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "local_product_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"description" text NOT NULL,
	"specifications" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"price" double precision NOT NULL,
	"discounted_price" double precision,
	"stock" integer NOT NULL,
	"district" text NOT NULL,
	"image_url" text,
	"delivery_option" text DEFAULT 'both',
	"available_areas" text,
	"is_draft" boolean DEFAULT true,
	"status" text DEFAULT 'pending',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manager_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"manager_type" text NOT NULL,
	"district" text,
	"taluk" text,
	"pincode" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"approved_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manufacturer_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"business_type" text,
	"product_categories" text,
	"establishment_year" text,
	"operating_hours" text,
	"supports_delivery" boolean,
	"bank_details" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "manufacturer_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"action_url" text,
	"related_entity_type" text,
	"related_entity_id" integer,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "product_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmer_id" integer NOT NULL,
	"requested_product_name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"image_url" text,
	"status" text DEFAULT 'pending',
	"admin_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recharges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mobile_number" text NOT NULL,
	"amount" double precision NOT NULL,
	"provider" text NOT NULL,
	"status" text NOT NULL,
	"service_type" text DEFAULT 'mobile',
	"processed_by" integer,
	"total_commission_percent" double precision,
	"total_commission_amount" double precision,
	"commission_config_id" integer,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "recycling_agent_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"material_types" jsonb,
	"price_per_kg" jsonb,
	"min_quantity" double precision,
	"provides_pickup" boolean DEFAULT true,
	"operating_hours" text,
	"purchase_process" text,
	"bank_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "recycling_agent_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "recycling_material_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"material_type" text NOT NULL,
	"rate_per_kg" double precision NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "recycling_material_rates_material_type_unique" UNIQUE("material_type")
);
--> statement-breakpoint
CREATE TABLE "recycling_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_number" text NOT NULL,
	"user_id" integer NOT NULL,
	"address" text NOT NULL,
	"pincode" text NOT NULL,
	"date" date NOT NULL,
	"time_slot" text NOT NULL,
	"materials" text NOT NULL,
	"additional_notes" text,
	"status" text DEFAULT 'new' NOT NULL,
	"agent_id" integer,
	"taluk_manager_id" integer,
	"branch_manager_id" integer,
	"assigned_at" timestamp,
	"collected_at" timestamp,
	"verified_at" timestamp,
	"closed_at" timestamp,
	"total_weight" double precision,
	"amount" double precision,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_provider_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"item_categories" jsonb,
	"item_details" jsonb,
	"deposit_required" boolean DEFAULT true,
	"operating_hours" text,
	"delivery_available" boolean DEFAULT false,
	"delivery_charge" double precision,
	"bank_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rental_provider_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "rentals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"item_name" text NOT NULL,
	"category" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"amount" double precision NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_by" integer NOT NULL,
	"is_public" boolean DEFAULT false,
	"config" json NOT NULL,
	"schedule" text,
	"last_run" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider_type" text NOT NULL,
	"business_name" text,
	"address" text NOT NULL,
	"district" text NOT NULL,
	"taluk" text NOT NULL,
	"pincode" text NOT NULL,
	"operating_areas" jsonb,
	"phone" text NOT NULL,
	"email" text,
	"website" text,
	"description" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"verification_status" text DEFAULT 'pending' NOT NULL,
	"verified_by" integer,
	"documents" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "service_providers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "taxi_provider_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"vehicle_types" text,
	"operating_hours" text,
	"bank_details" jsonb,
	"license_number" text,
	"date_of_birth" text,
	"photo_url" text,
	"aadhar_verified" boolean DEFAULT false,
	"pan_card_number" text,
	"vehicle_registration_number" text,
	"vehicle_insurance_details" text,
	"vehicle_permit_details" text,
	"documents" jsonb,
	"approval_status" text DEFAULT 'pending',
	"approval_notes" text,
	"approved_by" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "taxi_provider_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "taxi_rides" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pickup" text NOT NULL,
	"dropoff" text NOT NULL,
	"distance" double precision NOT NULL,
	"amount" double precision NOT NULL,
	"status" text NOT NULL,
	"vehicle_type" text DEFAULT 'taxi',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"service_type" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transportation_agent_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_provider_id" integer NOT NULL,
	"vehicle_types" jsonb,
	"vehicle_count" integer,
	"operating_hours" text,
	"service_areas" jsonb,
	"max_distance" integer,
	"max_weight" double precision,
	"price_per_kg" double precision,
	"price_per_km" double precision,
	"bank_details" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "transportation_agent_details_service_provider_id_unique" UNIQUE("service_provider_id")
);
--> statement-breakpoint
CREATE TABLE "user_devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"device_token" text NOT NULL,
	"device_type" text NOT NULL,
	"last_seen" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_devices_device_token_unique" UNIQUE("device_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"user_type" text NOT NULL,
	"parent_id" integer,
	"district" text,
	"taluk" text,
	"pincode" text,
	"wallet_balance" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "chat_conversation_members" ADD CONSTRAINT "chat_conversation_members_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_conversation_members" ADD CONSTRAINT "chat_conversation_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_product_details" ADD CONSTRAINT "local_product_details_product_id_local_product_base_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."local_product_base"("id") ON DELETE cascade ON UPDATE no action;