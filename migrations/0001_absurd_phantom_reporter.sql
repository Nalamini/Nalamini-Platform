CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"applicant_name" text NOT NULL,
	"mobile_number" text NOT NULL,
	"email" text,
	"address" text NOT NULL,
	"district" text NOT NULL,
	"taluk" text,
	"pincode" text,
	"degree" text,
	"experience" text,
	"role_type" text NOT NULL,
	"specific_role" text,
	"additional_info" text,
	"status" text DEFAULT 'pending',
	"applied_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" integer,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bus_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"route_id" text NOT NULL,
	"trace_id" text NOT NULL,
	"result_index" integer NOT NULL,
	"passenger_name" text NOT NULL,
	"passenger_age" integer NOT NULL,
	"passenger_gender" text NOT NULL,
	"passenger_phone" text NOT NULL,
	"seat_numbers" json NOT NULL,
	"boarding_point" json NOT NULL,
	"dropping_point" json NOT NULL,
	"total_amount" double precision NOT NULL,
	"commission_amount" double precision NOT NULL,
	"booking_status" text DEFAULT 'pending' NOT NULL,
	"pnr" text,
	"ticket_number" text,
	"journey_date" date NOT NULL,
	"booking_date" timestamp DEFAULT now(),
	"cancellation_date" timestamp,
	"cancellation_charge" double precision DEFAULT 0,
	"refund_amount" double precision DEFAULT 0,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text
);
--> statement-breakpoint
CREATE TABLE "bus_cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_code" text NOT NULL,
	"city_name" text NOT NULL,
	"state" text DEFAULT 'Tamil Nadu',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "bus_cities_city_code_unique" UNIQUE("city_code")
);
--> statement-breakpoint
CREATE TABLE "bus_commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"user_type" text NOT NULL,
	"commission_amount" double precision NOT NULL,
	"commission_percent" double precision NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"paid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bus_operators" (
	"id" serial PRIMARY KEY NOT NULL,
	"operator_id" text NOT NULL,
	"operator_name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "bus_operators_operator_id_unique" UNIQUE("operator_id")
);
--> statement-breakpoint
CREATE TABLE "bus_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" text NOT NULL,
	"operator_id" integer NOT NULL,
	"source_city_id" integer NOT NULL,
	"destination_city_id" integer NOT NULL,
	"bus_type" text NOT NULL,
	"service_name" text NOT NULL,
	"travel_name" text NOT NULL,
	"departure_time" text NOT NULL,
	"arrival_time" text NOT NULL,
	"base_price" double precision NOT NULL,
	"offered_price" double precision NOT NULL,
	"agent_commission" double precision NOT NULL,
	"available_seats" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "bus_routes_route_id_unique" UNIQUE("route_id")
);
--> statement-breakpoint
CREATE TABLE "daily_video_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" text NOT NULL,
	"date" date NOT NULL,
	"total_views" integer DEFAULT 0,
	"unique_viewers" integer DEFAULT 0,
	"total_watch_time" integer DEFAULT 0,
	"average_watch_time" double precision DEFAULT 0,
	"completion_rate" double precision DEFAULT 0,
	"top_locations" jsonb DEFAULT '[]'::jsonb,
	"device_breakdown" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "daily_video_stats_video_id_date_pk" PRIMARY KEY("video_id","date")
);
--> statement-breakpoint
CREATE TABLE "delivery_agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"mobile_number" text NOT NULL,
	"email" text,
	"address" text NOT NULL,
	"district" text NOT NULL,
	"taluk" text NOT NULL,
	"pincode" text NOT NULL,
	"category_id" integer NOT NULL,
	"available_start_time" text,
	"available_end_time" text,
	"operation_areas" json DEFAULT '[]'::json,
	"is_online" boolean DEFAULT false,
	"is_available" boolean DEFAULT true,
	"admin_approved" boolean DEFAULT false,
	"verification_status" text DEFAULT 'pending',
	"documents" json DEFAULT '[]'::json,
	"rating" double precision DEFAULT 0,
	"total_deliveries" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"base_price" double precision NOT NULL,
	"price_per_km" double precision DEFAULT 0 NOT NULL,
	"price_per_kg" double precision DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "delivery_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"customer_id" integer NOT NULL,
	"agent_id" integer,
	"category_id" integer NOT NULL,
	"pickup_address" text NOT NULL,
	"pickup_district" text NOT NULL,
	"pickup_taluk" text NOT NULL,
	"pickup_pincode" text NOT NULL,
	"pickup_contact_name" text,
	"pickup_contact_phone" text,
	"delivery_address" text NOT NULL,
	"delivery_district" text NOT NULL,
	"delivery_taluk" text NOT NULL,
	"delivery_pincode" text NOT NULL,
	"delivery_contact_name" text,
	"delivery_contact_phone" text,
	"package_details" text,
	"package_weight" double precision,
	"package_value" double precision,
	"special_instructions" text,
	"scheduled_pickup_time" timestamp,
	"estimated_delivery_time" timestamp,
	"actual_pickup_time" timestamp,
	"actual_delivery_time" timestamp,
	"total_amount" double precision NOT NULL,
	"payment_mode" text DEFAULT 'cash',
	"payment_status" text DEFAULT 'pending',
	"status" text DEFAULT 'pending',
	"cancellation_reason" text,
	"customer_rating" integer,
	"customer_feedback" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "flight_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"booking_reference" text NOT NULL,
	"pnr" text,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"departure_date" date NOT NULL,
	"return_date" date,
	"trip_type" text DEFAULT 'one_way' NOT NULL,
	"airline" text NOT NULL,
	"flight_number" text NOT NULL,
	"passengers" json NOT NULL,
	"total_amount" double precision NOT NULL,
	"commission_amount" double precision NOT NULL,
	"booking_status" text DEFAULT 'pending' NOT NULL,
	"seat_preferences" json,
	"meal_preferences" json,
	"special_requests" text,
	"booking_date" timestamp DEFAULT now(),
	"cancellation_date" timestamp,
	"cancellation_charge" double precision DEFAULT 0,
	"refund_amount" double precision DEFAULT 0,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text
);
--> statement-breakpoint
CREATE TABLE "hotel_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"booking_reference" text NOT NULL,
	"hotel_name" text NOT NULL,
	"hotel_id" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"address" text NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"nights" integer NOT NULL,
	"room_type" text NOT NULL,
	"rooms_count" integer DEFAULT 1 NOT NULL,
	"guests_count" integer DEFAULT 1 NOT NULL,
	"guest_details" json NOT NULL,
	"total_amount" double precision NOT NULL,
	"commission_amount" double precision NOT NULL,
	"booking_status" text DEFAULT 'pending' NOT NULL,
	"amenities" json,
	"special_requests" text,
	"booking_date" timestamp DEFAULT now(),
	"cancellation_date" timestamp,
	"cancellation_charge" double precision DEFAULT 0,
	"refund_amount" double precision DEFAULT 0,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text
);
--> statement-breakpoint
CREATE TABLE "local_product_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "local_product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"image_url" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "local_product_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "local_product_category_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"requester_id" integer NOT NULL,
	"category_name" text NOT NULL,
	"subcategory_name" text,
	"parent_category_id" integer,
	"description" text,
	"justification" text,
	"status" text DEFAULT 'pending',
	"admin_response" text,
	"created_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" integer
);
--> statement-breakpoint
CREATE TABLE "local_product_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" double precision NOT NULL,
	"subtotal" double precision NOT NULL,
	"product_name" text NOT NULL,
	"manufacturer_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "local_product_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"total_amount" double precision NOT NULL,
	"shipping_address" text NOT NULL,
	"district" text NOT NULL,
	"taluk" text,
	"pincode" text NOT NULL,
	"status" text DEFAULT 'pending',
	"payment_method" text DEFAULT 'cash',
	"payment_status" text DEFAULT 'pending',
	"notes" text,
	"delivery_fee" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "local_product_subcategories" (
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
CREATE TABLE "nominations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"otp_verified" boolean DEFAULT false,
	"role_applied_for" text NOT NULL,
	"district" text NOT NULL,
	"taluk" text NOT NULL,
	"pincode" text NOT NULL,
	"services_provided" text,
	"status" text DEFAULT 'pending',
	"admin_response" text,
	"profile_photo" text,
	"user_id" integer,
	"submitted_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" integer
);
--> statement-breakpoint
CREATE TABLE "otp_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_number" text NOT NULL,
	"otp" text NOT NULL,
	"purpose" text NOT NULL,
	"verified" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_product_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_type" text NOT NULL,
	"category_name" text NOT NULL,
	"subcategories" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "provider_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"category_name" text NOT NULL,
	"subcategory_name" text,
	"product_name" text NOT NULL,
	"description" text NOT NULL,
	"specifications" text,
	"price" double precision NOT NULL,
	"discounted_price" double precision,
	"unit" text NOT NULL,
	"stock_quantity" integer DEFAULT 0,
	"available_areas" text[],
	"image_url" text,
	"is_organic" boolean DEFAULT false,
	"seasonality" text,
	"minimum_order" integer DEFAULT 1,
	"delivery_time" text,
	"status" text DEFAULT 'active',
	"admin_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "public_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"nomination_id" integer NOT NULL,
	"sender_id" integer,
	"sender_name" text NOT NULL,
	"message" text NOT NULL,
	"message_type" text DEFAULT 'public',
	"is_admin_message" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_days" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category_id" integer NOT NULL,
	"subcategory_id" integer,
	"provider_id" integer NOT NULL,
	"description" text,
	"specifications" jsonb DEFAULT '{}'::jsonb,
	"daily_rate" double precision NOT NULL,
	"weekly_rate" double precision,
	"monthly_rate" double precision,
	"security_deposit" double precision NOT NULL,
	"available_quantity" integer DEFAULT 1,
	"total_quantity" integer DEFAULT 1,
	"condition" text DEFAULT 'excellent',
	"location" text NOT NULL,
	"district" text NOT NULL,
	"pincode" text,
	"image_url" text,
	"additional_images" json DEFAULT '[]'::json,
	"delivery_available" boolean DEFAULT false,
	"delivery_charge" double precision DEFAULT 0,
	"minimum_rental_days" integer DEFAULT 1,
	"maximum_rental_days" integer DEFAULT 30,
	"is_active" boolean DEFAULT true,
	"admin_approved" boolean DEFAULT false,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"daily_rate" double precision NOT NULL,
	"total_days" integer NOT NULL,
	"item_total" double precision NOT NULL,
	"security_deposit_per_item" double precision NOT NULL,
	"equipment_condition_before" text,
	"equipment_condition_after" text,
	"damage_notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"customer_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"total_amount" double precision NOT NULL,
	"security_deposit" double precision NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_days" integer NOT NULL,
	"delivery_address" text NOT NULL,
	"delivery_pincode" text NOT NULL,
	"delivery_charge" double precision DEFAULT 0,
	"special_instructions" text,
	"status" text DEFAULT 'pending',
	"payment_status" text DEFAULT 'pending',
	"agent_id" integer,
	"taluk_manager_id" integer,
	"branch_manager_id" integer,
	"confirmed_at" timestamp,
	"delivered_at" timestamp,
	"returned_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rental_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "rental_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"image_url" text,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_request_commission_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_request_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"user_type" text NOT NULL,
	"commission_type" text NOT NULL,
	"commission_percentage" double precision NOT NULL,
	"commission_amount" double precision NOT NULL,
	"base_amount" double precision NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_request_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"service_request_id" integer,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"action_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_request_status_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_request_id" integer NOT NULL,
	"previous_status" text NOT NULL,
	"new_status" text NOT NULL,
	"updated_by" integer NOT NULL,
	"reason" text,
	"notes" text,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sr_number" text NOT NULL,
	"user_id" integer NOT NULL,
	"service_type" text NOT NULL,
	"amount" numeric NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"payment_status" text DEFAULT 'pending',
	"payment_method" text,
	"payment_id" text,
	"razorpay_payment_id" text,
	"razorpay_order_id" text,
	"razorpay_signature" text,
	"service_data" jsonb,
	"assigned_to" integer,
	"processed_by" integer,
	"pincode_agent_id" integer,
	"taluk_manager_id" integer,
	"branch_manager_id" integer,
	"admin_approved_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"approved_at" timestamp,
	CONSTRAINT "service_requests_sr_number_unique" UNIQUE("sr_number")
);
--> statement-breakpoint
CREATE TABLE "taxi_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_number" text NOT NULL,
	"customer_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"vehicle_id" integer NOT NULL,
	"booking_type" text NOT NULL,
	"pickup_location" text NOT NULL,
	"pickup_pincode" text NOT NULL,
	"dropoff_location" text NOT NULL,
	"dropoff_pincode" text NOT NULL,
	"scheduled_date_time" timestamp,
	"estimated_distance" double precision,
	"estimated_duration" integer,
	"estimated_fare" double precision,
	"actual_distance" double precision,
	"actual_duration" integer,
	"base_fare" double precision,
	"waiting_charges" double precision DEFAULT 0,
	"toll_charges" double precision DEFAULT 0,
	"night_charges" double precision DEFAULT 0,
	"total_amount" double precision NOT NULL,
	"payment_mode" text DEFAULT 'cash',
	"payment_status" text DEFAULT 'pending',
	"special_instructions" text,
	"passenger_count" integer DEFAULT 1,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "taxi_bookings_booking_number_unique" UNIQUE("booking_number")
);
--> statement-breakpoint
CREATE TABLE "taxi_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"base_price" double precision NOT NULL,
	"price_per_km" double precision NOT NULL,
	"waiting_charge_per_minute" double precision NOT NULL,
	"max_passengers" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "taxi_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "taxi_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_name" text NOT NULL,
	"from_location" text NOT NULL,
	"to_location" text NOT NULL,
	"distance" double precision NOT NULL,
	"estimated_duration" integer NOT NULL,
	"base_price" double precision NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "taxi_vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"vehicle_number" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"color" text NOT NULL,
	"seating_capacity" integer NOT NULL,
	"fuel_type" text NOT NULL,
	"ac_available" boolean DEFAULT false,
	"gps_enabled" boolean DEFAULT false,
	"insurance_valid" boolean DEFAULT true,
	"puc_valid" boolean DEFAULT true,
	"rc_number" text NOT NULL,
	"insurance_number" text NOT NULL,
	"driver_license_number" text NOT NULL,
	"base_fare_per_km" double precision NOT NULL,
	"base_waiting_charge" double precision DEFAULT 0,
	"night_charge_multiplier" double precision DEFAULT 1.2,
	"toll_charges_applicable" boolean DEFAULT true,
	"available_areas" text,
	"current_location" text,
	"district" text NOT NULL,
	"pincode" text,
	"image_url" text,
	"additional_images" json DEFAULT '[]'::json,
	"is_active" boolean DEFAULT true,
	"admin_approved" boolean DEFAULT false,
	"status" text DEFAULT 'available',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "taxi_vehicles_vehicle_number_unique" UNIQUE("vehicle_number")
);
--> statement-breakpoint
CREATE TABLE "video_uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"uploader_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_path" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"duration" integer,
	"thumbnail_url" text,
	"category" text DEFAULT 'advertisement',
	"target_area" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_approval_by" integer,
	"approval_notes" text,
	"youtube_video_id" text,
	"youtube_url" text,
	"uploaded_to_youtube_at" timestamp,
	"rejected_at" timestamp,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "video_view_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" text NOT NULL,
	"viewer_id" integer,
	"session_id" text NOT NULL,
	"watch_start_time" timestamp DEFAULT now(),
	"watch_end_time" timestamp,
	"total_watch_time" integer DEFAULT 0,
	"video_duration" integer,
	"completion_percentage" double precision DEFAULT 0,
	"pause_count" integer DEFAULT 0,
	"seek_count" integer DEFAULT 0,
	"volume_changes" integer DEFAULT 0,
	"playback_speed" double precision DEFAULT 1,
	"device_type" text,
	"browser_type" text,
	"ip_address" text,
	"location" text,
	"referrer" text,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "video_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" integer NOT NULL,
	"user_id" integer,
	"ip_address" text,
	"watch_time" integer DEFAULT 0,
	"completion_percentage" integer DEFAULT 0,
	"viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"duration" integer,
	"thumbnail_url" text,
	"uploaded_by" integer NOT NULL,
	"category" text DEFAULT 'general',
	"is_public" boolean DEFAULT false,
	"tags" text[],
	"view_count" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "grocery_products" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "grocery_products" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "grocery_products" ADD COLUMN "subcategory_id" integer;--> statement-breakpoint
ALTER TABLE "grocery_products" ADD COLUMN "provider_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "grocery_products" ADD COLUMN "admin_approved" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "grocery_products" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "local_product_base" ADD COLUMN "subcategory" text;--> statement-breakpoint
ALTER TABLE "local_product_base" ADD COLUMN "provider_id" integer;--> statement-breakpoint
ALTER TABLE "local_product_details" ADD COLUMN "subcategory_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_photo" text;--> statement-breakpoint
ALTER TABLE "provider_products" ADD CONSTRAINT "provider_products_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_product_details" ADD CONSTRAINT "local_product_details_subcategory_id_local_product_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."local_product_subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery_products" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "grocery_products" DROP COLUMN "farmer_id";