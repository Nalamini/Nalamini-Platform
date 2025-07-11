import { pgTable, text, serial, integer, boolean, date, doublePrecision, timestamp, json, varchar, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types: admin, branch_manager, taluk_manager, service_agent, customer
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(),
  parentId: integer("parent_id"), // For hierarchy: branch_manager -> admin, taluk_manager -> branch_manager, etc.
  district: text("district"), // For branch managers
  taluk: text("taluk"), // For taluk managers
  pincode: text("pincode"), // For service agents
  walletBalance: doublePrecision("wallet_balance").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  userType: true,
  parentId: true,
  district: true,
  taluk: true,
  pincode: true,
  walletBalance: true
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  type: text("type").notNull(), // credit, debit
  description: text("description").notNull(),
  serviceType: text("service_type"), // recharge, booking, rental, etc.
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  amount: true,
  type: true,
  description: true,
  serviceType: true
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  serviceType: text("service_type").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  userId: true,
  serviceType: true,
  rating: true,
  comment: true
});

// Commission configurations
export const commissionConfigs = pgTable("commission_configs", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(), // recharge, booking, taxi, etc.
  provider: text("provider"), // For recharge: Airtel, Jio, etc., For booking: IRCTC, MakeMyTrip, etc.
  adminCommission: doublePrecision("admin_commission").notNull().default(0.5), // percentage
  branchManagerCommission: doublePrecision("branch_manager_commission").notNull().default(0.5), // percentage
  talukManagerCommission: doublePrecision("taluk_manager_commission").notNull().default(1.0), // percentage
  serviceAgentCommission: doublePrecision("service_agent_commission").notNull().default(3.0), // percentage
  registeredUserCommission: doublePrecision("registered_user_commission").notNull().default(1.0), // percentage
  totalCommission: doublePrecision("total_commission").notNull().default(6.0), // total percentage
  
  // Enhanced fields for seasonal/peak pricing
  startDate: date("start_date"), // When this commission config becomes active
  endDate: date("end_date"), // When this commission config expires
  isPeakRate: boolean("is_peak_rate").default(false), // Indicates if this is a special rate for peak season
  seasonName: text("season_name"), // Name of the season or promotional period (e.g., "Diwali 2023", "Summer Peak")
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertCommissionConfigSchema = createInsertSchema(commissionConfigs).pick({
  serviceType: true,
  provider: true,
  adminCommission: true,
  branchManagerCommission: true,
  talukManagerCommission: true,
  serviceAgentCommission: true,
  registeredUserCommission: true,
  totalCommission: true,
  startDate: true,
  endDate: true,
  isPeakRate: true,
  seasonName: true,
  isActive: true
});

// Track individual commissions
export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").notNull(), // Reference to the transaction
  userId: integer("user_id").notNull(), // User who earned commission
  userType: text("user_type").notNull(), // admin, branch_manager, taluk_manager, service_agent, registered_user
  serviceType: text("service_type").notNull(), // recharge, booking, taxi, etc.
  serviceId: integer("service_id").notNull(), // ID of the service (recharge ID, booking ID, etc.)
  originalAmount: doublePrecision("original_amount").notNull(), // Original transaction amount
  commissionPercentage: doublePrecision("commission_percentage").notNull(), // Percentage of commission
  commissionAmount: doublePrecision("commission_amount").notNull(), // Actual amount earned
  status: text("status").notNull().default("pending"), // pending, paid
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCommissionSchema = createInsertSchema(commissions).pick({
  transactionId: true,
  userId: true,
  userType: true,
  serviceType: true,
  serviceId: true,
  originalAmount: true,
  commissionPercentage: true,
  commissionAmount: true,
  status: true
});

export const recharges = pgTable("recharges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  amount: doublePrecision("amount").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull(), // pending, completed, failed
  serviceType: text("service_type").default("mobile"), // mobile, dth, electricity, etc.
  
  // Track who processed the recharge
  processedBy: integer("processed_by"), // Service agent ID who processed it
  
  // Commission tracking
  totalCommissionPercent: doublePrecision("total_commission_percent"), // Total commission percentage
  totalCommissionAmount: doublePrecision("total_commission_amount"), // Total commission amount
  commissionConfigId: integer("commission_config_id"), // Reference to commission config used
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at") // When the recharge was completed
});

export const insertRechargeSchema = createInsertSchema(recharges).pick({
  userId: true,
  mobileNumber: true,
  amount: true,
  provider: true,
  status: true,
  serviceType: true,
  processedBy: true,
  totalCommissionPercent: true,
  totalCommissionAmount: true,
  commissionConfigId: true
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingType: text("booking_type").notNull(), // bus, flight, hotel
  provider: text("provider"), // API provider (MakeMyTrip, Cleartrip, etc.)
  origin: text("origin"),
  destination: text("destination"),
  checkIn: date("check_in"),
  checkOut: date("check_out"),
  passengers: integer("passengers"),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull(), // pending, confirmed, cancelled
  
  // Commission tracking
  processedBy: integer("processed_by"), // Service agent ID who processed it
  totalCommissionPercent: doublePrecision("total_commission_percent"), // Total commission percentage 
  totalCommissionAmount: doublePrecision("total_commission_amount"), // Total commission amount
  commissionConfigId: integer("commission_config_id"), // Reference to commission config used
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at") // When the booking was completed
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  bookingType: true,
  provider: true,
  origin: true,
  destination: true,
  checkIn: true,
  checkOut: true,
  passengers: true,
  amount: true,
  status: true,
  processedBy: true,
  totalCommissionPercent: true,
  totalCommissionAmount: true,
  commissionConfigId: true,
  completedAt: true
});

export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // power_tools, construction, cleaning, medical, ornament
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull(), // pending, active, returned, cancelled
  createdAt: timestamp("created_at").defaultNow()
});

export const insertRentalSchema = createInsertSchema(rentals).pick({
  userId: true,
  itemName: true,
  category: true,
  startDate: true,
  endDate: true,
  amount: true,
  status: true
});

export const taxiRides = pgTable("taxi_rides", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pickup: text("pickup").notNull(),
  dropoff: text("dropoff").notNull(),
  distance: doublePrecision("distance").notNull(),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull(), // pending, active, completed, cancelled
  vehicleType: text("vehicle_type").default("taxi"), // taxi, auto, two_wheeler, intercity
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTaxiRideSchema = createInsertSchema(taxiRides).pick({
  userId: true,
  pickup: true,
  dropoff: true,
  distance: true,
  amount: true,
  status: true,
  vehicleType: true
});

export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  packageDetails: text("package_details").notNull(),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull(), // pending, picked_up, in_transit, delivered, cancelled
  createdAt: timestamp("created_at").defaultNow()
});

export const insertDeliverySchema = createInsertSchema(deliveries).pick({
  userId: true,
  pickupAddress: true,
  deliveryAddress: true,
  packageDetails: true,
  amount: true,
  status: true
});

// Grocery categories for better organization
export const groceryCategories = pgTable("grocery_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // Emoji or icon code
  color: text("color"), // CSS color class
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertGroceryCategorySchema = createInsertSchema(groceryCategories).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  isActive: true,
  displayOrder: true
});

// Grocery subcategories for better organization
export const grocerySubCategories = pgTable("grocery_subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentCategoryId: integer("parent_category_id").notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertGrocerySubCategorySchema = createInsertSchema(grocerySubCategories).pick({
  name: true,
  description: true,
  parentCategoryId: true,
  isActive: true,
  displayOrder: true
});

export const groceryProducts = pgTable("grocery_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  discountedPrice: doublePrecision("discounted_price"),
  farmerId: integer("farmer_id"), // Linked to user.id (if farmer)
  stock: integer("stock").notNull(),
  unit: text("unit").notNull(), // kg, g, l, ml, pcs
  isOrganic: boolean("is_organic").default(false),
  district: text("district").notNull(), // Source district
  imageUrl: text("image_url"), // URL to product image
  deliveryOption: text("delivery_option").default("both"), // direct, service, both
  availableAreas: text("available_areas"), // JSON string of area codes or names
  status: text("status").default("active"), // active, inactive, pending
  createdAt: timestamp("created_at").defaultNow()
});

export const insertGroceryProductSchema = createInsertSchema(groceryProducts).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  discountedPrice: true,
  farmerId: true,
  stock: true,
  unit: true,
  isOrganic: true,
  district: true,
  imageUrl: true,
  deliveryOption: true,
  availableAreas: true,
  status: true
}).extend({
  imageUrl: z.string().optional(),
  deliveryOption: z.enum(["direct", "service", "both"]).default("both"),
  availableAreas: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active")
});

// Local Products - Core schema with minimally required fields
export const localProductBase = pgTable("local_product_base", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  manufacturerId: integer("manufacturer_id"), // Linked to user.id (if manufacturer)
  adminApproved: boolean("admin_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Local Products - Details schema with extended product information
export const localProductDetails = pgTable("local_product_details", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => localProductBase.id, { onDelete: "cascade" }).notNull(),
  description: text("description").notNull(),
  specifications: jsonb("specifications").default({}).notNull(), // Structured product specifications
  price: doublePrecision("price").notNull(),
  discountedPrice: doublePrecision("discounted_price"),
  stock: integer("stock").notNull(),
  district: text("district").notNull(), // Source district
  imageUrl: text("image_url"), // URL to product image
  deliveryOption: text("delivery_option").default("both"), // direct, service, both
  availableAreas: text("available_areas"), // JSON string of area codes or names
  isDraft: boolean("is_draft").default(true), // Is this a draft or published product
  status: text("status").default("pending"), // active, inactive, pending
  updatedAt: timestamp("updated_at").defaultNow()
});

// Schema for creating a base product (first step)
export const insertLocalProductBaseSchema = createInsertSchema(localProductBase).pick({
  name: true,
  category: true,
  manufacturerId: true
}).extend({
  // Add any additional validation rules here
});

// Type for inserting a base product
export type InsertLocalProductBase = z.infer<typeof insertLocalProductBaseSchema>;

// Schema for creating or updating product details (second step)
export const upsertLocalProductDetailsSchema = createInsertSchema(localProductDetails).pick({
  productId: true,
  description: true,
  price: true,
  discountedPrice: true,
  stock: true,
  district: true,
  imageUrl: true,
  deliveryOption: true,
  availableAreas: true,
  isDraft: true,
  status: true
}).extend({
  specifications: z.record(z.string(), z.any()).default({}),
  imageUrl: z.string().optional(),
  deliveryOption: z.enum(["direct", "service", "both"]).default("both"),
  availableAreas: z.string().optional(),
  isDraft: z.boolean().default(true),
  status: z.enum(["active", "inactive", "pending"]).default("pending"),
  // Make productId optional for update operations
  productId: z.number().optional()
});

// Type for inserting or updating product details
export type UpsertLocalProductDetails = z.infer<typeof upsertLocalProductDetailsSchema>;

// Schema for comprehensive product data (combined base + details)
export const localProductViewSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  manufacturerId: z.number().optional(),
  description: z.string(),
  specifications: z.record(z.string(), z.any()).default({}),
  price: z.number(),
  discountedPrice: z.number().optional(),
  stock: z.number(),
  district: z.string(),
  imageUrl: z.string().optional(),
  deliveryOption: z.string(),
  availableAreas: z.string().optional(),
  isDraft: z.boolean(),
  adminApproved: z.boolean(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Type for complete product view
export type LocalProductView = z.infer<typeof localProductViewSchema>;

export const recyclingRequests = pgTable("recycling_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  address: text("address").notNull(),
  pincode: text("pincode").notNull(),
  date: date("date").notNull(),
  timeSlot: text("time_slot").notNull(), // morning, afternoon, evening
  materials: text("materials").notNull(), // comma-separated list: plastic, aluminum, copper, brass, steel
  additionalNotes: text("additional_notes"),
  status: text("status").notNull(), // pending, confirmed, collected, cancelled
  agentId: integer("agent_id"), // Service agent assigned for collection
  totalWeight: doublePrecision("total_weight"), // Total weight in kg
  amount: doublePrecision("amount"), // Amount paid to user
  createdAt: timestamp("created_at").defaultNow()
});

export const insertRecyclingRequestSchema = createInsertSchema(recyclingRequests).pick({
  userId: true,
  address: true,
  pincode: true,
  date: true,
  timeSlot: true,
  materials: true,
  additionalNotes: true,
  status: true,
  agentId: true,
  totalWeight: true,
  amount: true
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

export type InsertCommissionConfig = z.infer<typeof insertCommissionConfigSchema>;
export type CommissionConfig = typeof commissionConfigs.$inferSelect;

export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Commission = typeof commissions.$inferSelect;

export type InsertRecharge = z.infer<typeof insertRechargeSchema>;
export type Recharge = typeof recharges.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertRental = z.infer<typeof insertRentalSchema>;
export type Rental = typeof rentals.$inferSelect;

export type InsertTaxiRide = z.infer<typeof insertTaxiRideSchema>;
export type TaxiRide = typeof taxiRides.$inferSelect;

export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveries.$inferSelect;

export type InsertGroceryCategory = z.infer<typeof insertGroceryCategorySchema>;
export type GroceryCategory = typeof groceryCategories.$inferSelect;

export type InsertGrocerySubCategory = z.infer<typeof insertGrocerySubCategorySchema>;
export type GrocerySubCategory = typeof grocerySubCategories.$inferSelect;

export type InsertGroceryProduct = z.infer<typeof insertGroceryProductSchema>;
export type GroceryProduct = typeof groceryProducts.$inferSelect;

// Define localProducts table for backward compatibility
export const localProducts = localProductBase;

// Schema for backward compatibility
export const insertLocalProductSchema = insertLocalProductBaseSchema;

// Types for backward compatibility
export type InsertLocalProduct = InsertLocalProductBase;
export type LocalProduct = LocalProductView;

export type InsertRecyclingRequest = z.infer<typeof insertRecyclingRequestSchema>;
export type RecyclingRequest = typeof recyclingRequests.$inferSelect;

// Farmer Product Listings - Links farmers to admin-created grocery products
export const farmerProductListings = pgTable("farmer_product_listings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").notNull(), // Links to user.id with userType='provider'
  groceryProductId: integer("grocery_product_id").notNull(), // Links to admin-created product
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(), // kg, g, l, ml, pcs
  description: text("description"), // Custom description
  sourceDistrict: text("source_district"), // Source district
  imageUrl: text("image_url"), // Custom image URL
  transportAgentRequired: boolean("transport_agent_required").default(true),
  selfDelivery: boolean("self_delivery").default(false),
  isOrganic: boolean("is_organic").default(false),
  status: text("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"), // Notes from admin on rejection
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertFarmerProductListingSchema = createInsertSchema(farmerProductListings).pick({
  groceryProductId: true,
  quantity: true,
  price: true,
  unit: true,
  description: true,
  sourceDistrict: true,
  imageUrl: true,
  transportAgentRequired: true,
  selfDelivery: true,
  isOrganic: true,
  status: true,
  adminNotes: true
}).extend({
  farmerId: z.number().optional(), // Making this optional so server can determine it
  description: z.string().optional(),
  sourceDistrict: z.string().optional(),
  imageUrl: z.string().optional(),
  transportAgentRequired: z.boolean().default(true),
  selfDelivery: z.boolean().default(false),
  isOrganic: z.boolean().default(false),
  adminNotes: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending")
});

// Delivery Areas for farmer product listings
export const deliveryAreas = pgTable("delivery_areas", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(), // Links to farmer_product_listings.id
  district: text("district").notNull(),
  taluk: text("taluk").notNull(),
  pincode: text("pincode").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertDeliveryAreaSchema = createInsertSchema(deliveryAreas).pick({
  listingId: true,
  district: true,
  taluk: true,
  pincode: true,
  isActive: true
});

// For farmers to request admin to add new products
export const productRequests = pgTable("product_requests", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").notNull(), // Links to user.id with userType='provider'
  requestedProductName: text("requested_product_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(), // kg, g, l, ml, pcs
  imageUrl: text("image_url"),
  status: text("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertProductRequestSchema = createInsertSchema(productRequests).pick({
  farmerId: true,
  requestedProductName: true,
  description: true,
  category: true,
  unit: true,
  imageUrl: true,
  status: true,
  adminNotes: true
}).extend({
  imageUrl: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  adminNotes: z.string().optional()
});

// Grocery Orders table
export const groceryOrders = pgTable("grocery_orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(), // Links to user.id with userType='customer'
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  district: text("district").notNull(),
  taluk: text("taluk").notNull(),
  pincode: text("pincode").notNull(),
  status: text("status").default("pending"), // pending, pincode_agent_approved, in_progress, delivered, cancelled
  pincodeAgentId: integer("pincode_agent_id"), // Service agent who approved
  transportAgentId: integer("transport_agent_id"), // Transport agent if used
  deliveryFee: doublePrecision("delivery_fee").default(0),
  paymentMethod: text("payment_method").default("cash"), // cash, wallet, online
  paymentStatus: text("payment_status").default("pending"), // pending, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at")
});

export const insertGroceryOrderSchema = createInsertSchema(groceryOrders).pick({
  customerId: true,
  totalAmount: true,
  shippingAddress: true,
  district: true,
  taluk: true,
  pincode: true,
  status: true,
  pincodeAgentId: true,
  transportAgentId: true,
  deliveryFee: true,
  paymentMethod: true,
  paymentStatus: true,
  notes: true,
  completedAt: true
}).extend({
  status: z.enum(["pending", "pincode_agent_approved", "in_progress", "delivered", "cancelled"]).default("pending"),
  paymentMethod: z.enum(["cash", "wallet", "online"]).default("cash"),
  paymentStatus: z.enum(["pending", "completed"]).default("pending"),
  notes: z.string().optional(),
  transportAgentId: z.number().optional(),
  pincodeAgentId: z.number().optional(),
  completedAt: z.date().optional()
});

// Order Items linking orders with farmer product listings
export const groceryOrderItems = pgTable("grocery_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(), // Links to grocery_orders.id
  farmerProductListingId: integer("farmer_product_listing_id").notNull(), // Links to farmer_product_listings.id
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  status: text("status").default("pending"), // pending, confirmed, shipped, delivered, cancelled
  farmerId: integer("farmer_id").notNull(), // Stored for easier queries
  productName: text("product_name").notNull(), // Stored for history
  createdAt: timestamp("created_at").defaultNow()
});

export const insertGroceryOrderItemSchema = createInsertSchema(groceryOrderItems).pick({
  orderId: true,
  farmerProductListingId: true,
  quantity: true,
  unitPrice: true,
  subtotal: true,
  status: true,
  farmerId: true,
  productName: true
}).extend({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending")
});

// Type exports
export type InsertFarmerProductListing = z.infer<typeof insertFarmerProductListingSchema>;
export type FarmerProductListing = typeof farmerProductListings.$inferSelect;

export type InsertDeliveryArea = z.infer<typeof insertDeliveryAreaSchema>;
export type DeliveryArea = typeof deliveryAreas.$inferSelect;

export type InsertProductRequest = z.infer<typeof insertProductRequestSchema>;
export type ProductRequest = typeof productRequests.$inferSelect;

export type InsertGroceryOrder = z.infer<typeof insertGroceryOrderSchema>;
export type GroceryOrder = typeof groceryOrders.$inferSelect;

export type InsertGroceryOrderItem = z.infer<typeof insertGroceryOrderItemSchema>;
export type GroceryOrderItem = typeof groceryOrderItems.$inferSelect;

// Manager Application models
export const managerApplications = pgTable("manager_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  username: text("username").notNull(),
  password: text("password").notNull(),
  managerType: text("manager_type").notNull(), // branch_manager, taluk_manager, service_agent
  district: text("district"),
  taluk: text("taluk"),
  pincode: text("pincode"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  notes: text("notes"),
  approvedBy: integer("approved_by"), // Admin ID who approved/rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertManagerApplicationSchema = createInsertSchema(managerApplications).pick({
  fullName: true,
  email: true,
  phone: true,
  username: true,
  password: true,
  managerType: true,
  district: true,
  taluk: true,
  pincode: true
});

// Service Provider models

// Common table for all types of service providers
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(), // Link to user table
  providerType: text("provider_type").notNull(), // farmer, manufacturer, booking_agent, taxi_provider, transportation_agent, rental_provider, recycling_agent
  name: text("name"), // Changed from businessName to name for all providers
  address: text("address").notNull(),
  district: text("district").notNull(),
  taluk: text("taluk").notNull(),
  pincode: text("pincode").notNull(),
  operatingAreas: jsonb("operating_areas"), // Array of areas: [{district, taluk, pincode}]
  phone: text("phone").notNull(),
  email: text("email"),
  website: text("website"),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, rejected
  verifiedBy: integer("verified_by"), // Admin/Manager who verified
  documents: jsonb("documents"), // List of document URLs/IDs for verification
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Create the base schema for service provider
export const insertServiceProviderSchema = createInsertSchema(serviceProviders)
  .pick({
    userId: true,
    providerType: true,
    name: true,
    address: true,
    district: true,
    taluk: true,
    pincode: true,
    operatingAreas: true,
    phone: true,
    email: true,
    website: true,
    description: true,
    status: true,
    verificationStatus: true,
    verifiedBy: true,
    documents: true
  })
  // Make some fields optional with defaults
  .extend({
    name: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
    operatingAreas: z.any().optional(),
    taluk: z.string().optional().default(""), // Make taluk optional
    verifiedBy: z.number().optional().nullable(),
    documents: z.any().optional(),
    status: z.string().default("pending"),
    verificationStatus: z.string().default("pending")
  });

// Farmer specific details
export const farmerDetails = pgTable("farmer_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  farmSize: text("farm_size"), // In acres (stored as text in database)
  farmType: text("farm_type"), // organic, conventional, mixed
  primaryProducts: text("primary_products").notNull(), // Array of product categories stored as text
  cultivationSeason: text("cultivation_season"), // year-round, seasonal  
  operatingHours: text("operating_hours"), // Operating hours for pickup/delivery
  supportsDelivery: boolean("supports_delivery"),
  bankDetails: jsonb("bank_details"), // For payments
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});

export const insertFarmerDetailSchema = createInsertSchema(farmerDetails)
  .pick({
    serviceProviderId: true,
    farmSize: true,
    farmType: true,
    primaryProducts: true,
    cultivationSeason: true,
    operatingHours: true,
    supportsDelivery: true,
    bankDetails: true
  })
  .extend({
    farmSize: z.string().optional(),
    farmType: z.string().optional(),
    primaryProducts: z.string().or(z.array(z.string())).transform(val => 
      typeof val === 'string' ? val : JSON.stringify(val)
    ),
    cultivationSeason: z.string().optional(),
    operatingHours: z.string().optional(),
    supportsDelivery: z.boolean().default(false),
    bankDetails: z.any().optional()
  });

// Manufacturer specific details
export const manufacturerDetails = pgTable("manufacturer_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  businessType: text("business_type"), // small, medium, large
  productCategories: text("product_categories"), // Categories as JSON string
  establishmentYear: text("establishment_year"), // Changed from integer to text as per DB
  operatingHours: text("operating_hours"),
  supportsDelivery: boolean("supports_delivery"),
  bankDetails: jsonb("bank_details"), // For payments
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});

export const insertManufacturerDetailSchema = createInsertSchema(manufacturerDetails)
  .pick({
    serviceProviderId: true,
    businessType: true,
    productCategories: true,
    establishmentYear: true,
    supportsDelivery: true,
    operatingHours: true,
    bankDetails: true
  })
  .extend({
    businessType: z.string().optional(),
    productCategories: z.string().optional(), // Changed to string to match DB
    establishmentYear: z.string().optional(), // Changed to string to match DB
    operatingHours: z.string().optional(),
    supportsDelivery: z.boolean().default(false),
    bankDetails: z.any().optional()
  });

// Booking Agent specific details
export const bookingAgentDetails = pgTable("booking_agent_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  serviceTypes: jsonb("service_types"), // Array of service types (bus, flight, hotel, train, recharge)
  operatingHours: text("operating_hours"),
  yearsOfExperience: integer("years_of_experience"),
  preferredProviders: jsonb("preferred_providers"), // List of preferred service providers
  commissionRates: jsonb("commission_rates"), // Custom commission rates
  bankDetails: jsonb("bank_details"), // For payments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertBookingAgentDetailSchema = createInsertSchema(bookingAgentDetails)
  .pick({
    serviceProviderId: true,
    serviceTypes: true,
    operatingHours: true,
    yearsOfExperience: true,
    preferredProviders: true,
    commissionRates: true,
    bankDetails: true
  })
  .extend({
    serviceTypes: z.any().optional(),
    operatingHours: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    preferredProviders: z.any().optional(),
    commissionRates: z.any().optional(),
    bankDetails: z.any().optional()
  });

// Taxi Provider specific details
export const taxiProviderDetails = pgTable("taxi_provider_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  vehicleTypes: text("vehicle_types"), // Vehicle types as text string
  operatingHours: text("operating_hours"),
  bankDetails: jsonb("bank_details"), // For payments
  licenseNumber: text("license_number"), // Driver's license number
  dateOfBirth: text("date_of_birth"), // Driver's date of birth
  photoUrl: text("photo_url"), // Driver's photo URL
  aadharVerified: boolean("aadhar_verified").default(false), // Aadhar verification status
  panCardNumber: text("pan_card_number"), // PAN card number
  vehicleRegistrationNumber: text("vehicle_registration_number"), // Vehicle registration number
  vehicleInsuranceDetails: text("vehicle_insurance_details"), // Vehicle insurance details
  vehiclePermitDetails: text("vehicle_permit_details"), // Vehicle permit details
  documents: jsonb("documents"), // For storing document URLs
  approvalStatus: text("approval_status").default("pending"), // pending, approved_by_agent, approved_by_taluk, approved_by_branch, approved_by_admin, rejected
  approvalNotes: text("approval_notes"), // Notes for approval/rejection
  approvedBy: integer("approved_by"), // User ID who approved the provider
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});

export const insertTaxiProviderDetailSchema = createInsertSchema(taxiProviderDetails)
  .pick({
    serviceProviderId: true,
    vehicleTypes: true,
    operatingHours: true,
    bankDetails: true,
    licenseNumber: true,
    dateOfBirth: true,
    photoUrl: true,
    aadharVerified: true,
    panCardNumber: true,
    vehicleRegistrationNumber: true,
    vehicleInsuranceDetails: true,
    vehiclePermitDetails: true,
    documents: true,
    approvalStatus: true,
    approvalNotes: true,
    approvedBy: true
  })
  .extend({
    vehicleTypes: z.string().optional(), // Changed to string to match DB
    operatingHours: z.string().optional(),
    bankDetails: z.any().optional(),
    licenseNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    photoUrl: z.string().optional(),
    aadharVerified: z.boolean().default(false),
    panCardNumber: z.string().optional(),
    vehicleRegistrationNumber: z.string().optional(),
    vehicleInsuranceDetails: z.string().optional(),
    vehiclePermitDetails: z.string().optional(),
    documents: z.any().optional(),
    approvalStatus: z.string().default("pending"),
    approvalNotes: z.string().optional(),
    approvedBy: z.number().optional().nullable()
  });

// Transportation Agent specific details
export const transportationAgentDetails = pgTable("transportation_agent_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  vehicleTypes: jsonb("vehicle_types"), // Array of vehicle types
  vehicleCount: integer("vehicle_count"),
  operatingHours: text("operating_hours"),
  serviceAreas: jsonb("service_areas"), // Areas they can deliver to
  maxDistance: integer("max_distance"), // Maximum distance in km
  maxWeight: doublePrecision("max_weight"), // Maximum weight in kg
  pricePerKg: doublePrecision("price_per_kg"),
  pricePerKm: doublePrecision("price_per_km"),
  bankDetails: jsonb("bank_details"), // For payments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertTransportationAgentDetailSchema = createInsertSchema(transportationAgentDetails)
  .pick({
    serviceProviderId: true,
    vehicleTypes: true,
    vehicleCount: true,
    operatingHours: true,
    serviceAreas: true,
    maxDistance: true,
    maxWeight: true,
    pricePerKg: true,
    pricePerKm: true,
    bankDetails: true
  })
  .extend({
    vehicleTypes: z.any().optional(),
    vehicleCount: z.number().optional(),
    operatingHours: z.string().optional(),
    serviceAreas: z.any().optional(),
    maxDistance: z.number().optional(),
    maxWeight: z.number().optional(),
    pricePerKg: z.number().optional(),
    pricePerKm: z.number().optional(),
    bankDetails: z.any().optional()
  });

// Rental Provider specific details
export const rentalProviderDetails = pgTable("rental_provider_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  itemCategories: jsonb("item_categories"), // Array of item categories
  itemDetails: jsonb("item_details"), // Array of items with details
  depositRequired: boolean("deposit_required").default(true),
  operatingHours: text("operating_hours"),
  deliveryAvailable: boolean("delivery_available").default(false),
  deliveryCharge: doublePrecision("delivery_charge"),
  bankDetails: jsonb("bank_details"), // For payments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertRentalProviderDetailSchema = createInsertSchema(rentalProviderDetails)
  .pick({
    serviceProviderId: true,
    itemCategories: true,
    itemDetails: true,
    depositRequired: true,
    operatingHours: true,
    deliveryAvailable: true,
    deliveryCharge: true,
    bankDetails: true
  })
  .extend({
    itemCategories: z.any().optional(),
    itemDetails: z.any().optional(),
    depositRequired: z.boolean().default(true),
    operatingHours: z.string().optional(),
    deliveryAvailable: z.boolean().default(false),
    deliveryCharge: z.number().optional(),
    bankDetails: z.any().optional()
  });

// Recycling Agent specific details
export const recyclingAgentDetails = pgTable("recycling_agent_details", {
  id: serial("id").primaryKey(),
  serviceProviderId: integer("service_provider_id").notNull().unique(), // Link to service_providers
  materialTypes: jsonb("material_types"), // Array of materials (aluminum, copper, brass, plastic)
  pricePerKg: jsonb("price_per_kg"), // Object with price per kg for each material
  minQuantity: doublePrecision("min_quantity"), // Minimum quantity in kg
  providesPickup: boolean("provides_pickup").default(true),
  operatingHours: text("operating_hours"),
  purchaseProcess: text("purchase_process"), // Description of how purchasing works
  bankDetails: jsonb("bank_details"), // For payments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertRecyclingAgentDetailSchema = createInsertSchema(recyclingAgentDetails)
  .pick({
    serviceProviderId: true,
    materialTypes: true,
    pricePerKg: true,
    minQuantity: true,
    providesPickup: true,
    operatingHours: true,
    purchaseProcess: true,
    bankDetails: true
  })
  .extend({
    materialTypes: z.any().optional(),
    pricePerKg: z.any().optional(),
    minQuantity: z.number().optional(),
    providesPickup: z.boolean().default(true),
    operatingHours: z.string().optional(),
    purchaseProcess: z.string().optional(),
    bankDetails: z.any().optional()
  });

// Type exports for service providers
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;
export type ServiceProvider = typeof serviceProviders.$inferSelect;

export type InsertFarmerDetail = z.infer<typeof insertFarmerDetailSchema>;
export type FarmerDetail = typeof farmerDetails.$inferSelect;

export type InsertManufacturerDetail = z.infer<typeof insertManufacturerDetailSchema>;
export type ManufacturerDetail = typeof manufacturerDetails.$inferSelect;

export type InsertBookingAgentDetail = z.infer<typeof insertBookingAgentDetailSchema>;
export type BookingAgentDetail = typeof bookingAgentDetails.$inferSelect;

export type InsertTaxiProviderDetail = z.infer<typeof insertTaxiProviderDetailSchema>;
export type TaxiProviderDetail = typeof taxiProviderDetails.$inferSelect;

export type InsertTransportationAgentDetail = z.infer<typeof insertTransportationAgentDetailSchema>;
export type TransportationAgentDetail = typeof transportationAgentDetails.$inferSelect;

export type InsertRentalProviderDetail = z.infer<typeof insertRentalProviderDetailSchema>;
export type RentalProviderDetail = typeof rentalProviderDetails.$inferSelect;

export type InsertRecyclingAgentDetail = z.infer<typeof insertRecyclingAgentDetailSchema>;
export type RecyclingAgentDetail = typeof recyclingAgentDetails.$inferSelect;

export type InsertManagerApplication = z.infer<typeof insertManagerApplicationSchema>;
export type ManagerApplication = typeof managerApplications.$inferSelect;

// Commission Transaction Model to track commission disbursements
export const commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // User receiving the commission
  amount: doublePrecision("amount").notNull(), // Commission amount
  commissionAmount: doublePrecision("commission_amount").notNull(), // Actual commission amount
  commissionRate: doublePrecision("commission_rate").notNull(), // Commission rate percentage
  transactionAmount: doublePrecision("transaction_amount").notNull(), // Original transaction amount
  serviceType: text("service_type").notNull(), // recharge, booking, etc.
  transactionId: integer("transaction_id").notNull(), // ID of the original transaction
  provider: text("provider"), // Service provider (e.g., Airtel, Jio)
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertCommissionTransactionSchema = createInsertSchema(commissionTransactions).pick({
  userId: true,
  amount: true,
  commissionAmount: true,
  commissionRate: true,
  transactionAmount: true,
  serviceType: true,
  transactionId: true,
  provider: true,
  description: true,
  status: true
});

export type CommissionTransaction = typeof commissionTransactions.$inferSelect;
export type InsertCommissionTransaction = z.infer<typeof insertCommissionTransactionSchema>;
