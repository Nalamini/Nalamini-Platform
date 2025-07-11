import { pgTable, text, serial, integer, boolean, date, doublePrecision, timestamp, json, varchar, jsonb, primaryKey, numeric, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types: admin, branch_manager, taluk_manager, service_agent, customer, provider
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
  profilePhoto: text("profile_photo"), // Photo URL for approved forum members
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
  profilePhoto: true,
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

// Bus booking related tables
export const busOperators = pgTable("bus_operators", {
  id: serial("id").primaryKey(),
  operatorId: text("operator_id").notNull().unique(), // From API
  operatorName: text("operator_name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const busCities = pgTable("bus_cities", {
  id: serial("id").primaryKey(),
  cityCode: text("city_code").notNull().unique(), // From API
  cityName: text("city_name").notNull(),
  state: text("state").default("Tamil Nadu"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const busRoutes = pgTable("bus_routes", {
  id: serial("id").primaryKey(),
  routeId: text("route_id").notNull().unique(), // From API
  operatorId: integer("operator_id").notNull(),
  sourceCityId: integer("source_city_id").notNull(),
  destinationCityId: integer("destination_city_id").notNull(),
  busType: text("bus_type").notNull(),
  serviceName: text("service_name").notNull(),
  travelName: text("travel_name").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  basePrice: doublePrecision("base_price").notNull(),
  offeredPrice: doublePrecision("offered_price").notNull(),
  agentCommission: doublePrecision("agent_commission").notNull(),
  availableSeats: integer("available_seats").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const busBookings = pgTable("bus_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  routeId: text("route_id").notNull(),
  traceId: text("trace_id").notNull(), // From API
  resultIndex: integer("result_index").notNull(),
  passengerName: text("passenger_name").notNull(),
  passengerAge: integer("passenger_age").notNull(),
  passengerGender: text("passenger_gender").notNull(),
  passengerPhone: text("passenger_phone").notNull(),
  seatNumbers: json("seat_numbers").notNull(), // Array of selected seats
  boardingPoint: json("boarding_point").notNull(), // {index, name, location, time}
  droppingPoint: json("dropping_point").notNull(), // {index, name, location, time}
  totalAmount: doublePrecision("total_amount").notNull(),
  commissionAmount: doublePrecision("commission_amount").notNull(),
  bookingStatus: text("booking_status").notNull().default("pending"), // pending, confirmed, cancelled
  pnr: text("pnr"), // Booking reference from API
  ticketNumber: text("ticket_number"),
  journeyDate: date("journey_date").notNull(),
  bookingDate: timestamp("booking_date").defaultNow(),
  cancellationDate: timestamp("cancellation_date"),
  cancellationCharge: doublePrecision("cancellation_charge").default(0),
  refundAmount: doublePrecision("refund_amount").default(0),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed, refunded
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id")
});

// Flight Booking Tables
export const flightBookings = pgTable("flight_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingReference: text("booking_reference").notNull(),
  pnr: text("pnr"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: date("departure_date").notNull(),
  returnDate: date("return_date"), // For round trip
  tripType: text("trip_type").notNull().default("one_way"), // one_way, round_trip
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  passengers: json("passengers").notNull(), // Array of passenger details
  totalAmount: doublePrecision("total_amount").notNull(),
  commissionAmount: doublePrecision("commission_amount").notNull(),
  bookingStatus: text("booking_status").notNull().default("pending"), // pending, confirmed, cancelled
  seatPreferences: json("seat_preferences"), // Array of seat selections
  mealPreferences: json("meal_preferences"), // Array of meal preferences
  specialRequests: text("special_requests"),
  bookingDate: timestamp("booking_date").defaultNow(),
  cancellationDate: timestamp("cancellation_date"),
  cancellationCharge: doublePrecision("cancellation_charge").default(0),
  refundAmount: doublePrecision("refund_amount").default(0),
  paymentStatus: text("payment_status").notNull().default("pending"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id")
});

// Hotel Booking Tables
export const hotelBookings = pgTable("hotel_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingReference: text("booking_reference").notNull(),
  hotelName: text("hotel_name").notNull(),
  hotelId: text("hotel_id"), // From API
  city: text("city").notNull(),
  state: text("state").notNull(),
  address: text("address").notNull(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  nights: integer("nights").notNull(),
  roomType: text("room_type").notNull(),
  roomsCount: integer("rooms_count").notNull().default(1),
  guestsCount: integer("guests_count").notNull().default(1),
  guestDetails: json("guest_details").notNull(), // Primary guest details
  totalAmount: doublePrecision("total_amount").notNull(),
  commissionAmount: doublePrecision("commission_amount").notNull(),
  bookingStatus: text("booking_status").notNull().default("pending"), // pending, confirmed, cancelled
  amenities: json("amenities"), // Selected amenities
  specialRequests: text("special_requests"),
  bookingDate: timestamp("booking_date").defaultNow(),
  cancellationDate: timestamp("cancellation_date"),
  cancellationCharge: doublePrecision("cancellation_charge").default(0),
  refundAmount: doublePrecision("refund_amount").default(0),
  paymentStatus: text("payment_status").notNull().default("pending"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id")
});

export const busCommissions = pgTable("bus_commissions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  userId: integer("user_id").notNull(), // Who gets the commission
  userType: text("user_type").notNull(), // admin, branch_manager, taluk_manager, service_agent
  commissionAmount: doublePrecision("commission_amount").notNull(),
  commissionPercent: doublePrecision("commission_percent").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at")
});

// Insert schemas for bus tables
export const insertBusOperatorSchema = createInsertSchema(busOperators).pick({
  operatorId: true,
  operatorName: true,
  isActive: true
});

export const insertBusCitySchema = createInsertSchema(busCities).pick({
  cityCode: true,
  cityName: true,
  state: true,
  isActive: true
});

export const insertBusRouteSchema = createInsertSchema(busRoutes).pick({
  routeId: true,
  operatorId: true,
  sourceCityId: true,
  destinationCityId: true,
  busType: true,
  serviceName: true,
  travelName: true,
  departureTime: true,
  arrivalTime: true,
  basePrice: true,
  offeredPrice: true,
  agentCommission: true,
  availableSeats: true,
  isActive: true
});

export const insertBusBookingSchema = createInsertSchema(busBookings).pick({
  userId: true,
  routeId: true,
  traceId: true,
  resultIndex: true,
  passengerName: true,
  passengerAge: true,
  passengerGender: true,
  passengerPhone: true,
  seatNumbers: true,
  boardingPoint: true,
  droppingPoint: true,
  totalAmount: true,
  commissionAmount: true,
  journeyDate: true,
  pnr: true,
  ticketNumber: true,
  razorpayOrderId: true,
  razorpayPaymentId: true
});

export const insertFlightBookingSchema = createInsertSchema(flightBookings).pick({
  userId: true,
  bookingReference: true,
  origin: true,
  destination: true,
  departureDate: true,
  returnDate: true,
  tripType: true,
  airline: true,
  flightNumber: true,
  passengers: true,
  totalAmount: true,
  commissionAmount: true,
  seatPreferences: true,
  mealPreferences: true,
  specialRequests: true,
  razorpayOrderId: true,
  razorpayPaymentId: true
});

export const insertHotelBookingSchema = createInsertSchema(hotelBookings).pick({
  userId: true,
  bookingReference: true,
  hotelName: true,
  hotelId: true,
  city: true,
  state: true,
  address: true,
  checkInDate: true,
  checkOutDate: true,
  nights: true,
  roomType: true,
  roomsCount: true,
  guestsCount: true,
  guestDetails: true,
  totalAmount: true,
  commissionAmount: true,
  amenities: true,
  specialRequests: true,
  razorpayOrderId: true,
  razorpayPaymentId: true
});

export const insertBusCommissionSchema = createInsertSchema(busCommissions).pick({
  bookingId: true,
  userId: true,
  userType: true,
  commissionAmount: true,
  commissionPercent: true,
  status: true
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

// Unified Service Requests - Core table for all service requests
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  srNumber: text("sr_number").notNull().unique(),
  userId: integer("user_id").notNull(),
  serviceType: text("service_type").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull().default("new"),
  paymentStatus: text("payment_status").default("pending"),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpaySignature: text("razorpay_signature"),
  serviceData: jsonb("service_data"),
  assignedTo: integer("assigned_to"),
  processedBy: integer("processed_by"),
  pincodeAgentId: integer("pincode_agent_id"),
  talukManagerId: integer("taluk_manager_id"),
  branchManagerId: integer("branch_manager_id"),
  adminApprovedBy: integer("admin_approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  approvedAt: timestamp("approved_at")
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).pick({
  srNumber: true,
  userId: true,
  serviceType: true,
  amount: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  serviceData: true
}).extend({
  userId: z.number().min(1, "User ID is required"),
  amount: z.number().min(0, "Amount must be positive")
});

// Service Request Status Updates
export const serviceRequestStatusUpdates = pgTable("service_request_status_updates", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").notNull(),
  previousStatus: text("previous_status").notNull(),
  newStatus: text("new_status").notNull(),
  updatedBy: integer("updated_by").notNull(), // User ID who made the update
  reason: text("reason"), // Why status was changed
  notes: text("notes"), // Additional notes about the update
  attachments: jsonb("attachments").default([]), // Photos, documents, etc.
  createdAt: timestamp("created_at").defaultNow()
});

export const insertServiceRequestStatusUpdateSchema = createInsertSchema(serviceRequestStatusUpdates).pick({
  serviceRequestId: true,
  previousStatus: true,
  newStatus: true,
  updatedBy: true,
  reason: true,
  notes: true,
  attachments: true
});

// Service Request Commission Transactions - Track incentive distribution
export const serviceRequestCommissionTransactions = pgTable("service_request_commission_transactions", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").notNull(),
  userId: integer("user_id").notNull(), // Who receives the commission
  userType: text("user_type").notNull(), // admin, branch_manager, taluk_manager, service_agent
  
  // Commission details
  commissionType: text("commission_type").notNull(), // admin, branch_manager, taluk_manager, service_agent, registered_user
  commissionPercentage: doublePrecision("commission_percentage").notNull(),
  commissionAmount: doublePrecision("commission_amount").notNull(),
  baseAmount: doublePrecision("base_amount").notNull(), // Original service amount
  
  // Status
  status: text("status").notNull().default("pending"), // pending, paid, failed
  paidAt: timestamp("paid_at"),
  
  createdAt: timestamp("created_at").defaultNow()
});

export const insertServiceRequestCommissionTransactionSchema = createInsertSchema(serviceRequestCommissionTransactions).pick({
  serviceRequestId: true,
  userId: true,
  userType: true,
  commissionType: true,
  commissionPercentage: true,
  commissionAmount: true,
  baseAmount: true
});

// Service Request Notifications for stakeholders
export const serviceRequestNotifications = pgTable("service_request_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  serviceRequestId: integer("service_request_id"),
  
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  category: text("category").notNull(), // service_request, payment, commission, system
  
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"), // Link to relevant page
  
  createdAt: timestamp("created_at").defaultNow()
});

export const insertServiceRequestNotificationSchema = createInsertSchema(serviceRequestNotifications).pick({
  userId: true,
  serviceRequestId: true,
  title: true,
  message: true,
  type: true,
  category: true,
  actionUrl: true
});

// Type exports for service request system
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;

export type ServiceRequestStatusUpdate = typeof serviceRequestStatusUpdates.$inferSelect;
export type InsertServiceRequestStatusUpdate = z.infer<typeof insertServiceRequestStatusUpdateSchema>;

export type ServiceRequestCommissionTransaction = typeof serviceRequestCommissionTransactions.$inferSelect;
export type InsertServiceRequestCommissionTransaction = z.infer<typeof insertServiceRequestCommissionTransactionSchema>;

export type ServiceRequestNotification = typeof serviceRequestNotifications.$inferSelect;
export type InsertServiceRequestNotification = z.infer<typeof insertServiceRequestNotificationSchema>;

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
  imageUrl: text("image_url"), // Image URL for the category
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertGroceryCategorySchema = createInsertSchema(groceryCategories).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  imageUrl: true,
  isActive: true,
  displayOrder: true
}).extend({
  imageUrl: z.string().optional()
});

// Grocery subcategories for better organization
export const grocerySubCategories = pgTable("grocery_subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentCategoryId: integer("parent_category_id").notNull(),
  imageUrl: text("image_url"), // Image URL for the subcategory
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertGrocerySubCategorySchema = createInsertSchema(grocerySubCategories).pick({
  name: true,
  description: true,
  parentCategoryId: true,
  imageUrl: true,
  isActive: true,
  displayOrder: true
}).extend({
  imageUrl: z.string().optional()
});

export const groceryProducts = pgTable("grocery_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(), // Links to grocery_categories.id
  subcategoryId: integer("subcategory_id"), // Links to grocery_subcategories.id
  providerId: integer("provider_id").notNull(), // Service provider/farmer who owns the product
  price: doublePrecision("price").notNull(),
  discountedPrice: doublePrecision("discounted_price"),
  stock: integer("stock").notNull(),
  unit: text("unit").notNull(), // kg, g, l, ml, pcs
  isOrganic: boolean("is_organic").default(false),
  district: text("district").notNull(), // Source district
  imageUrl: text("image_url"), // URL to product image
  deliveryOption: text("delivery_option").default("both"), // direct, service, both
  availableAreas: text("available_areas"), // JSON string of area codes or names
  adminApproved: boolean("admin_approved").default(false), // Requires admin approval
  status: text("status").default("pending"), // pending, active, inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertGroceryProductSchema = createInsertSchema(groceryProducts).pick({
  name: true,
  description: true,
  categoryId: true,
  subcategoryId: true,
  providerId: true,
  price: true,
  discountedPrice: true,
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
  status: z.enum(["pending", "active", "inactive"]).default("pending"),
  subcategoryId: z.number().optional(),
  discountedPrice: z.number().optional(),
  isOrganic: z.boolean().default(false)
});

// Local Products - Core schema with minimally required fields
export const localProductBase = pgTable("local_product_base", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"), // Subcategory ID
  manufacturerId: integer("manufacturer_id"), // Linked to user.id (if manufacturer)
  adminApproved: boolean("admin_approved").default(false),
  providerId: integer("provider_id"), // Service provider who created this product
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Local Products - Details schema with extended product information
export const localProductDetails = pgTable("local_product_details", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => localProductBase.id, { onDelete: "cascade" }).notNull(),
  subcategoryId: integer("subcategory_id").references(() => localProductSubCategories.id),
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

// Rental Equipment Tables
export const rentalCategories = pgTable("rental_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const rentalSubcategories = pgTable("rental_subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
  isActive: boolean("is_active").default(true),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const rentalEquipment = pgTable("rental_equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  subcategoryId: integer("subcategory_id"),
  providerId: integer("provider_id").notNull(), // Service provider who owns the equipment
  description: text("description"),
  specifications: jsonb("specifications").default({}),
  dailyRate: doublePrecision("daily_rate").notNull(),
  weeklyRate: doublePrecision("weekly_rate"),
  monthlyRate: doublePrecision("monthly_rate"),
  securityDeposit: doublePrecision("security_deposit").notNull(),
  availableQuantity: integer("available_quantity").default(1),
  totalQuantity: integer("total_quantity").default(1),
  condition: text("condition").default("excellent"), // excellent, good, fair
  location: text("location").notNull(),
  district: text("district").notNull(),
  pincode: text("pincode"),
  imageUrl: text("image_url"),
  additionalImages: json("additional_images").default([]),
  deliveryAvailable: boolean("delivery_available").default(false),
  deliveryCharge: doublePrecision("delivery_charge").default(0),
  minimumRentalDays: integer("minimum_rental_days").default(1),
  maximumRentalDays: integer("maximum_rental_days").default(30),
  isActive: boolean("is_active").default(true),
  adminApproved: boolean("admin_approved").default(false),
  status: text("status").default("pending"), // pending, active, inactive, maintenance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const rentalOrders = pgTable("rental_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  providerId: integer("provider_id").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  securityDeposit: doublePrecision("security_deposit").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryPincode: text("delivery_pincode").notNull(),
  deliveryCharge: doublePrecision("delivery_charge").default(0),
  specialInstructions: text("special_instructions"),
  status: text("status").default("pending"), // pending, confirmed, delivered, active, returned, completed, cancelled
  paymentStatus: text("payment_status").default("pending"), // pending, paid, partial, refunded
  agentId: integer("agent_id"), // Service agent handling the rental
  talukManagerId: integer("taluk_manager_id"),
  branchManagerId: integer("branch_manager_id"),
  confirmedAt: timestamp("confirmed_at"),
  deliveredAt: timestamp("delivered_at"),
  returnedAt: timestamp("returned_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const rentalOrderItems = pgTable("rental_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  quantity: integer("quantity").notNull(),
  dailyRate: doublePrecision("daily_rate").notNull(),
  totalDays: integer("total_days").notNull(),
  itemTotal: doublePrecision("item_total").notNull(),
  securityDepositPerItem: doublePrecision("security_deposit_per_item").notNull(),
  equipmentConditionBefore: text("equipment_condition_before"),
  equipmentConditionAfter: text("equipment_condition_after"),
  damageNotes: text("damage_notes"),
  createdAt: timestamp("created_at").defaultNow()
});

export const rentalCart = pgTable("rental_cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  quantity: integer("quantity").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas for rental tables
export const insertRentalCategorySchema = createInsertSchema(rentalCategories).pick({
  name: true,
  description: true,
  imageUrl: true,
  isActive: true,
  displayOrder: true
});

export const insertRentalSubcategorySchema = createInsertSchema(rentalSubcategories).pick({
  name: true,
  description: true,
  categoryId: true,
  imageUrl: true,
  isActive: true,
  displayOrder: true
});

export const insertRentalEquipmentSchema = createInsertSchema(rentalEquipment).pick({
  name: true,
  categoryId: true,
  subcategoryId: true,
  providerId: true,
  description: true,
  specifications: true,
  dailyRate: true,
  weeklyRate: true,
  monthlyRate: true,
  securityDeposit: true,
  availableQuantity: true,
  totalQuantity: true,
  condition: true,
  location: true,
  district: true,
  pincode: true,
  imageUrl: true,
  additionalImages: true,
  deliveryAvailable: true,
  deliveryCharge: true,
  minimumRentalDays: true,
  maximumRentalDays: true,
  isActive: true,
  status: true
});

export const insertRentalOrderSchema = createInsertSchema(rentalOrders).pick({
  customerId: true,
  providerId: true,
  totalAmount: true,
  securityDeposit: true,
  startDate: true,
  endDate: true,
  totalDays: true,
  deliveryAddress: true,
  deliveryPincode: true,
  deliveryCharge: true,
  specialInstructions: true,
  status: true,
  paymentStatus: true
});

export const insertRentalCartSchema = createInsertSchema(rentalCart).pick({
  userId: true,
  equipmentId: true,
  quantity: true,
  startDate: true,
  endDate: true,
  totalDays: true
});

// Types
export type RentalCategory = typeof rentalCategories.$inferSelect;
export type InsertRentalCategory = z.infer<typeof insertRentalCategorySchema>;
export type RentalSubcategory = typeof rentalSubcategories.$inferSelect;
export type InsertRentalSubcategory = z.infer<typeof insertRentalSubcategorySchema>;
export type RentalEquipment = typeof rentalEquipment.$inferSelect;
export type InsertRentalEquipment = z.infer<typeof insertRentalEquipmentSchema>;
export type RentalOrder = typeof rentalOrders.$inferSelect;
export type InsertRentalOrder = z.infer<typeof insertRentalOrderSchema>;
export type RentalOrderItem = typeof rentalOrderItems.$inferSelect;
export type RentalCartItem = typeof rentalCart.$inferSelect;
export type InsertRentalCartItem = z.infer<typeof insertRentalCartSchema>;

// Delivery Management System Tables
export const deliveryCategories = pgTable("delivery_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // two wheeler, three wheeler, four wheeler, trucks
  description: text("description"),
  basePrice: doublePrecision("base_price").notNull(), // base price per delivery
  pricePerKm: doublePrecision("price_per_km").notNull().default(0), // additional price per km
  pricePerKg: doublePrecision("price_per_kg").notNull().default(0), // additional price per kg
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const deliveryAgents = pgTable("delivery_agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // reference to users table
  name: text("name").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  district: text("district").notNull(),
  taluk: text("taluk").notNull(),
  pincode: text("pincode").notNull(),
  categoryId: integer("category_id").notNull(), // reference to delivery_categories
  availableStartTime: text("available_start_time"), // HH:MM format
  availableEndTime: text("available_end_time"), // HH:MM format
  operationAreas: json("operation_areas").default([]), // {districts: [], taluks: [], pincodes: []}
  isOnline: boolean("is_online").default(false),
  isAvailable: boolean("is_available").default(true),
  adminApproved: boolean("admin_approved").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  documents: json("documents").default([]), // array of document URLs
  rating: doublePrecision("rating").default(0),
  totalDeliveries: integer("total_deliveries").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const deliveryOrders = pgTable("delivery_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  agentId: integer("agent_id"),
  categoryId: integer("category_id").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  pickupDistrict: text("pickup_district").notNull(),
  pickupTaluk: text("pickup_taluk").notNull(),
  pickupPincode: text("pickup_pincode").notNull(),
  pickupContactName: text("pickup_contact_name"),
  pickupContactPhone: text("pickup_contact_phone"),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryDistrict: text("delivery_district").notNull(),
  deliveryTaluk: text("delivery_taluk").notNull(),
  deliveryPincode: text("delivery_pincode").notNull(),
  deliveryContactName: text("delivery_contact_name"),
  deliveryContactPhone: text("delivery_contact_phone"),
  packageDetails: text("package_details"),
  packageWeight: doublePrecision("package_weight"),
  packageValue: doublePrecision("package_value"),
  specialInstructions: text("special_instructions"),
  scheduledPickupTime: timestamp("scheduled_pickup_time"),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualPickupTime: timestamp("actual_pickup_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  totalAmount: doublePrecision("total_amount").notNull(),
  paymentMode: text("payment_mode").default("cash"), // cash, online, cod
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  status: text("status").default("pending"), // pending, assigned, picked_up, in_transit, delivered, cancelled
  cancellationReason: text("cancellation_reason"),
  customerRating: integer("customer_rating"),
  customerFeedback: text("customer_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Taxi categories for different vehicle types
export const taxiCategories = pgTable("taxi_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Two wheeler, Three wheeler, 4 seaters, 6 seaters, 12 seaters
  description: text("description").notNull(),
  basePrice: doublePrecision("base_price").notNull(), // Base fare
  pricePerKm: doublePrecision("price_per_km").notNull(), // Rate per kilometer
  waitingChargePerMinute: doublePrecision("waiting_charge_per_minute").notNull(), // Waiting charges
  maxPassengers: integer("max_passengers").notNull(), // Maximum seating capacity
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Taxi Service Tables
export const taxiVehicles = pgTable("taxi_vehicles", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  vehicleNumber: text("vehicle_number").notNull().unique(),
  vehicleType: text("vehicle_type").notNull(), // sedan, suv, hatchback, auto, bike
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  seatingCapacity: integer("seating_capacity").notNull(),
  fuelType: text("fuel_type").notNull(), // petrol, diesel, cng, electric
  acAvailable: boolean("ac_available").default(false),
  gpsEnabled: boolean("gps_enabled").default(false),
  insuranceValid: boolean("insurance_valid").default(true),
  pucValid: boolean("puc_valid").default(true),
  rcNumber: text("rc_number").notNull(),
  insuranceNumber: text("insurance_number").notNull(),
  driverLicenseNumber: text("driver_license_number").notNull(),
  baseFarePerKm: doublePrecision("base_fare_per_km").notNull(),
  baseWaitingCharge: doublePrecision("base_waiting_charge").default(0),
  nightChargeMultiplier: doublePrecision("night_charge_multiplier").default(1.2),
  tollChargesApplicable: boolean("toll_charges_applicable").default(true),
  availableAreas: text("available_areas"), // JSON string of areas/districts
  currentLocation: text("current_location"),
  district: text("district").notNull(),
  pincode: text("pincode"),
  imageUrl: text("image_url"),
  additionalImages: json("additional_images").default([]),
  isActive: boolean("is_active").default(true),
  adminApproved: boolean("admin_approved").default(false),
  status: text("status").default("available"), // available, busy, offline, maintenance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const taxiBookings = pgTable("taxi_bookings", {
  id: serial("id").primaryKey(),
  bookingNumber: text("booking_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  providerId: integer("provider_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  bookingType: text("booking_type").notNull(), // immediate, scheduled
  pickupLocation: text("pickup_location").notNull(),
  pickupPincode: text("pickup_pincode").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  dropoffPincode: text("dropoff_pincode").notNull(),
  scheduledDateTime: timestamp("scheduled_date_time"),
  estimatedDistance: doublePrecision("estimated_distance"), // in km
  estimatedDuration: integer("estimated_duration"), // in minutes
  estimatedFare: doublePrecision("estimated_fare"),
  actualDistance: doublePrecision("actual_distance"),
  actualDuration: integer("actual_duration"),
  baseFare: doublePrecision("base_fare"),
  waitingCharges: doublePrecision("waiting_charges").default(0),
  tollCharges: doublePrecision("toll_charges").default(0),
  nightCharges: doublePrecision("night_charges").default(0),
  totalAmount: doublePrecision("total_amount").notNull(),
  paymentMode: text("payment_mode").default("cash"), // cash, online, wallet
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  specialInstructions: text("special_instructions"),
  passengerCount: integer("passenger_count").default(1),
  status: text("status").default("pending"), // pending, confirmed, started, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const taxiRoutes = pgTable("taxi_routes", {
  id: serial("id").primaryKey(),
  routeName: text("route_name").notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  distance: doublePrecision("distance").notNull(), // in km
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  basePrice: doublePrecision("base_price").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const recyclingRequests = pgTable("recycling_requests", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number").notNull(),
  userId: integer("user_id").notNull(),
  address: text("address").notNull(),
  pincode: text("pincode").notNull(),
  date: date("date").notNull(),
  timeSlot: text("time_slot").notNull(), // morning, afternoon, evening
  materials: text("materials").notNull(), // comma-separated list: plastic, aluminum, copper, brass, steel
  additionalNotes: text("additional_notes"),
  // Status flow: new -> assigned -> collected -> verified -> closed
  status: text("status").default("new").notNull(),
  agentId: integer("agent_id"), // Service agent assigned for collection
  talukManagerId: integer("taluk_manager_id"), // Taluk manager who verifies
  branchManagerId: integer("branch_manager_id"), // Branch manager who distributes commission
  assignedAt: timestamp("assigned_at"), // When service agent was assigned
  collectedAt: timestamp("collected_at"), // When materials were collected
  verifiedAt: timestamp("verified_at"), // When taluk manager verified
  closedAt: timestamp("closed_at"), // When branch manager closed the request
  totalWeight: doublePrecision("total_weight"), // Total weight in kg
  amount: doublePrecision("amount"), // Amount paid to user
  createdAt: timestamp("created_at").defaultNow()
});

// Video Management System
export const videoUploads = pgTable("video_uploads", {
  id: serial("id").primaryKey(),
  uploaderId: integer("uploader_id").notNull(), // User ID of the uploader
  title: text("title").notNull(),
  description: text("description"),
  filePath: text("file_path").notNull(), // Temporary file path before YouTube upload
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // File size in bytes
  duration: integer("duration"), // Duration in seconds
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").default("advertisement"), // advertisement, tutorial, announcement
  targetArea: text("target_area"), // district/taluk/pincode for area-specific content
  // Status flow: pending -> approved -> uploaded -> published -> rejected
  status: text("status").default("pending").notNull(),
  adminApprovalBy: integer("admin_approval_by"), // Admin user ID who approved/rejected
  approvalNotes: text("approval_notes"),
  youtubeVideoId: text("youtube_video_id"), // YouTube video ID after upload
  youtubeUrl: text("youtube_url"), // Full YouTube URL
  uploadedToYoutubeAt: timestamp("uploaded_to_youtube_at"),
  rejectedAt: timestamp("rejected_at"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Video View Analytics
export const videoViewAnalytics = pgTable("video_view_analytics", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(), // YouTube video ID
  viewerId: integer("viewer_id"), // User ID of viewer (null for anonymous)
  sessionId: text("session_id").notNull(), // Unique session identifier
  watchStartTime: timestamp("watch_start_time").defaultNow(),
  watchEndTime: timestamp("watch_end_time"),
  totalWatchTime: integer("total_watch_time").default(0), // Total seconds watched
  videoDuration: integer("video_duration"), // Total video duration in seconds
  completionPercentage: doublePrecision("completion_percentage").default(0), // Percentage of video watched
  pauseCount: integer("pause_count").default(0), // Number of times paused
  seekCount: integer("seek_count").default(0), // Number of times seeked
  volumeChanges: integer("volume_changes").default(0), // Number of volume adjustments
  playbackSpeed: doublePrecision("playback_speed").default(1.0), // Playback speed used
  deviceType: text("device_type"), // mobile, desktop, tablet
  browserType: text("browser_type"), // chrome, firefox, safari, etc
  ipAddress: text("ip_address"), // For location analytics
  location: text("location"), // City/district derived from IP
  referrer: text("referrer"), // How they reached the video
  isCompleted: boolean("is_completed").default(false), // Did they watch till end
  createdAt: timestamp("created_at").defaultNow()
});

// Daily aggregated view statistics
export const dailyVideoStats = pgTable("daily_video_stats", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  date: date("date").notNull(),
  totalViews: integer("total_views").default(0),
  uniqueViewers: integer("unique_viewers").default(0),
  totalWatchTime: integer("total_watch_time").default(0),
  averageWatchTime: doublePrecision("average_watch_time").default(0),
  completionRate: doublePrecision("completion_rate").default(0),
  topLocations: jsonb("top_locations").default([]),
  deviceBreakdown: jsonb("device_breakdown").default({}),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  uniqueVideoDate: unique().on(table.videoId, table.date) // ✅ use unique instead of primaryKey
}));

// Delivery management insert schemas
export const insertDeliveryCategorySchema = createInsertSchema(deliveryCategories).pick({
  name: true,
  description: true,
  basePrice: true,
  pricePerKm: true,
  pricePerKg: true,
  isActive: true
});

export const insertDeliveryAgentSchema = createInsertSchema(deliveryAgents).pick({
  userId: true,
  name: true,
  mobileNumber: true,
  email: true,
  address: true,
  district: true,
  taluk: true,
  pincode: true,
  categoryId: true,
  availableStartTime: true,
  availableEndTime: true,
  operationAreas: true,
  documents: true
});

export const insertDeliveryOrderSchema = createInsertSchema(deliveryOrders).pick({
  customerId: true,
  categoryId: true,
  pickupAddress: true,
  pickupDistrict: true,
  pickupTaluk: true,
  pickupPincode: true,
  pickupContactName: true,
  pickupContactPhone: true,
  deliveryAddress: true,
  deliveryDistrict: true,
  deliveryTaluk: true,
  deliveryPincode: true,
  deliveryContactName: true,
  deliveryContactPhone: true,
  packageDetails: true,
  packageWeight: true,
  packageValue: true,
  specialInstructions: true,
  scheduledPickupTime: true,
  totalAmount: true,
  paymentMode: true
});

// Taxi service insert schemas
export const insertTaxiCategorySchema = createInsertSchema(taxiCategories).pick({
  name: true,
  description: true,
  basePrice: true,
  pricePerKm: true,
  waitingChargePerMinute: true,
  maxPassengers: true,
  isActive: true
});

export const insertTaxiVehicleSchema = createInsertSchema(taxiVehicles).pick({
  providerId: true,
  vehicleNumber: true,
  vehicleType: true,
  brand: true,
  model: true,
  year: true,
  color: true,
  seatingCapacity: true,
  fuelType: true,
  acAvailable: true,
  gpsEnabled: true,
  insuranceValid: true,
  pucValid: true,
  rcNumber: true,
  insuranceNumber: true,
  driverLicenseNumber: true,
  baseFarePerKm: true,
  baseWaitingCharge: true,
  nightChargeMultiplier: true,
  tollChargesApplicable: true,
  availableAreas: true,
  currentLocation: true,
  district: true,
  pincode: true,
  imageUrl: true,
  additionalImages: true,
  isActive: true,
  status: true
});

// Delivery management types  
export type DeliveryCategory = typeof deliveryCategories.$inferSelect;
export type InsertDeliveryCategory = z.infer<typeof insertDeliveryCategorySchema>;
export type DeliveryAgent = typeof deliveryAgents.$inferSelect;
export type InsertDeliveryAgent = z.infer<typeof insertDeliveryAgentSchema>;
export type DeliveryOrder = typeof deliveryOrders.$inferSelect;
export type InsertDeliveryOrder = z.infer<typeof insertDeliveryOrderSchema>;

// Taxi management types
export type TaxiCategory = typeof taxiCategories.$inferSelect;
export type InsertTaxiCategory = z.infer<typeof insertTaxiCategorySchema>;

export const insertTaxiBookingSchema = createInsertSchema(taxiBookings).pick({
  bookingNumber: true,
  customerId: true,
  providerId: true,
  vehicleId: true,
  bookingType: true,
  pickupLocation: true,
  pickupPincode: true,
  dropoffLocation: true,
  dropoffPincode: true,
  scheduledDateTime: true,
  estimatedDistance: true,
  estimatedDuration: true,
  estimatedFare: true,
  totalAmount: true,
  paymentMode: true,
  paymentStatus: true,
  specialInstructions: true,
  passengerCount: true,
  status: true
});

export const insertTaxiRouteSchema = createInsertSchema(taxiRoutes).pick({
  routeName: true,
  fromLocation: true,
  toLocation: true,
  distance: true,
  estimatedDuration: true,
  basePrice: true,
  isActive: true
});

export const insertRecyclingRequestSchema = createInsertSchema(recyclingRequests).pick({
  userId: true,
  requestNumber: true,
  address: true,
  pincode: true,
  date: true,
  timeSlot: true,
  materials: true,
  additionalNotes: true,
  status: true,
  agentId: true,
  talukManagerId: true,
  branchManagerId: true,
  assignedAt: true,
  collectedAt: true,
  verifiedAt: true,
  closedAt: true,
  totalWeight: true,
  amount: true
}).extend({
  requestNumber: z.string().optional(),
  status: z.enum(["new", "assigned", "collected", "verified", "closed", "cancelled"]).default("new"),
  assignedAt: z.date().optional(),
  collectedAt: z.date().optional(),
  verifiedAt: z.date().optional(),
  closedAt: z.date().optional(),
  talukManagerId: z.number().optional(),
  branchManagerId: z.number().optional(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

const insertTransactionSchema = z.object({
  id: z.number().optional(),
  amount: z.number(),
  description: z.string(),
  createdAt: z.date().optional(),
});

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

export type InsertTaxiVehicle = z.infer<typeof insertTaxiVehicleSchema>;
export type TaxiVehicle = typeof taxiVehicles.$inferSelect;

export type InsertTaxiBooking = z.infer<typeof insertTaxiBookingSchema>;
export type TaxiBooking = typeof taxiBookings.$inferSelect;

export type InsertTaxiRoute = z.infer<typeof insertTaxiRouteSchema>;
export type TaxiRoute = typeof taxiRoutes.$inferSelect;

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

// Local Products Categories for better organization
export const localProductCategories = pgTable("local_product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // Emoji or icon code
  color: text("color"), // CSS color class
  imageUrl: text("image_url"), // Image URL for the category
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertLocalProductCategorySchema = createInsertSchema(localProductCategories).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  imageUrl: true,
  isActive: true,
  displayOrder: true
}).extend({
  imageUrl: z.string().optional()
});

// Local Products Subcategories for better organization
export const localProductSubCategories = pgTable("local_product_subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentCategoryId: integer("parent_category_id").notNull(),
  imageUrl: text("image_url"), // Image URL for the subcategory
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertLocalProductSubCategorySchema = createInsertSchema(localProductSubCategories).pick({
  name: true,
  description: true,
  parentCategoryId: true,
  imageUrl: true,
  isActive: true,
  displayOrder: true
}).extend({
  imageUrl: z.string().optional(),
  parentCategoryId: z.number()
});

// Category Requests from Service Providers
export const localProductCategoryRequests = pgTable("local_product_category_requests", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull(), // Service provider ID
  categoryName: text("category_name").notNull(),
  subcategoryName: text("subcategory_name"), // Optional for subcategory requests
  parentCategoryId: integer("parent_category_id"), // For subcategory requests
  description: text("description"),
  justification: text("justification"), // Why this category is needed
  status: text("status").default("pending"), // pending, approved, rejected
  adminResponse: text("admin_response"), // Admin's response/feedback
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by") // Admin who reviewed
});

export const insertLocalProductCategoryRequestSchema = createInsertSchema(localProductCategoryRequests).pick({
  categoryName: true,
  subcategoryName: true,
  parentCategoryId: true,
  description: true,
  justification: true
}).extend({
  requesterId: z.number().optional(), // Will be set by server
  subcategoryName: z.string().optional(),
  parentCategoryId: z.number().optional(),
  description: z.string().optional(),
  justification: z.string().optional()
});

// Define localProducts table for backward compatibility
export const localProducts = localProductBase;

// Schema for backward compatibility
export const insertLocalProductSchema = insertLocalProductBaseSchema;

// Types for backward compatibility
export type InsertLocalProduct = InsertLocalProductBase;
export type LocalProduct = LocalProductView;

export type InsertLocalProductCategory = z.infer<typeof insertLocalProductCategorySchema>;
export type LocalProductCategory = typeof localProductCategories.$inferSelect;

export type InsertLocalProductSubCategory = z.infer<typeof insertLocalProductSubCategorySchema>;
export type LocalProductSubCategory = typeof localProductSubCategories.$inferSelect;

// Nominations table for opportunity forum nominations
export const nominations = pgTable("nominations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  otpVerified: boolean("otp_verified").default(false),
  roleAppliedFor: text("role_applied_for").notNull(), // branch_manager, taluk_manager, service_agent, service_provider
  district: text("district").notNull(),
  taluk: text("taluk").notNull(),
  pincode: text("pincode").notNull(),
  servicesProvided: text("services_provided"), // What services they can provide
  status: text("status").default("pending"), // pending, approved, rejected
  adminResponse: text("admin_response"), // Admin feedback
  profilePhoto: text("profile_photo"), // Photo URL after registration and approval
  userId: integer("user_id"), // Link to user after registration
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by") // Admin who reviewed
});

export const insertNominationSchema = createInsertSchema(nominations).pick({
  name: true,
  phoneNumber: true,
  roleAppliedFor: true,
  district: true,
  taluk: true,
  pincode: true,
  servicesProvided: true
}).extend({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  roleAppliedFor: z.string().min(1, "Role is required"),
  district: z.string().min(1, "District is required"),
  taluk: z.string().min(1, "Taluk is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  servicesProvided: z.string().min(10, "Service description must be at least 10 characters")
});

// OTP verification table
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  otp: text("otp").notNull(),
  purpose: text("purpose").notNull(), // nomination, login, etc.
  verified: boolean("verified").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertOtpVerificationSchema = createInsertSchema(otpVerifications).pick({
  phoneNumber: true,
  otp: true,
  purpose: true,
  expiresAt: true
});

// Public messages for opportunity forum
export const publicMessages = pgTable("public_messages", {
  id: serial("id").primaryKey(),
  nominationId: integer("nomination_id").notNull(), // Reference to nomination
  senderId: integer("sender_id"), // User ID of sender (null for anonymous)
  senderName: text("sender_name").notNull(), // Display name
  message: text("message").notNull(),
  messageType: text("message_type").default("public"), // public, inquiry, support
  isAdminMessage: boolean("is_admin_message").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertPublicMessageSchema = createInsertSchema(publicMessages).pick({
  nominationId: true,
  senderName: true,
  message: true,
  messageType: true
}).extend({
  nominationId: z.number(),
  senderName: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  messageType: z.enum(["public", "inquiry", "support"]).optional()
});

export type InsertNomination = z.infer<typeof insertNominationSchema>;
export type Nomination = typeof nominations.$inferSelect;

export type InsertOtpVerification = z.infer<typeof insertOtpVerificationSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;

export type InsertPublicMessage = z.infer<typeof insertPublicMessageSchema>;
export type PublicMessage = typeof publicMessages.$inferSelect;

// Applications table for opportunities forum
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicantName: text("applicant_name").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  district: text("district").notNull(),
  taluk: text("taluk"),
  pincode: text("pincode"),
  degree: text("degree"),
  experience: text("experience"),
  roleType: text("role_type").notNull(), // branch_manager, taluk_manager, service_agent, service_provider
  specificRole: text("specific_role"), // farmer, manufacturer, booking_agent, etc. for service providers
  additionalInfo: text("additional_info"),
  status: text("status").default("pending"), // pending, approved, rejected, under_review
  appliedAt: timestamp("applied_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by"), // Admin who reviewed
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  applicantName: true,
  mobileNumber: true,
  email: true,
  address: true,
  district: true,
  taluk: true,
  pincode: true,
  degree: true,
  experience: true,
  roleType: true,
  specificRole: true,
  additionalInfo: true
}).extend({
  email: z.string().email().optional(),
  taluk: z.string().optional(),
  pincode: z.string().optional(),
  degree: z.string().optional(),
  experience: z.string().optional(),
  specificRole: z.string().optional(),
  additionalInfo: z.string().optional()
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertLocalProductCategoryRequest = z.infer<typeof insertLocalProductCategoryRequestSchema>;
export type LocalProductCategoryRequest = typeof localProductCategoryRequests.$inferSelect;

// Farmer Product Listings - Links farmers to admin-created grocery products
export const farmerProductListings = pgTable("farmer_product_listings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").notNull(), // Links to user.id with userType='provider'
  groceryProductId: integer("grocery_product_id").notNull(), // Links to admin-created product
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(), // kg, g, l, ml, pcs
  imageUrl: text("image_url"), // Custom image URL
  transportAgentRequired: boolean("transport_agent_required").default(true),
  selfDelivery: boolean("self_delivery").default(false),
  isOrganic: boolean("is_organic").default(false),
  status: text("status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertFarmerProductListingSchema = createInsertSchema(farmerProductListings).pick({
  groceryProductId: true,
  quantity: true,
  price: true,
  unit: true,
  imageUrl: true,
  transportAgentRequired: true,
  selfDelivery: true,
  isOrganic: true,
  status: true
}).extend({
  farmerId: z.number().optional(), // Making this optional so server can determine it
  imageUrl: z.string().optional(),
  transportAgentRequired: z.boolean().default(true),
  selfDelivery: z.boolean().default(false),
  isOrganic: z.boolean().default(false),
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

// Local Products Cart System
export const localProductCart = pgTable("local_product_cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Customer ID
  productId: integer("product_id").notNull(), // Links to local_product_base.id
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertLocalProductCartSchema = createInsertSchema(localProductCart).pick({
  userId: true,
  productId: true,
  quantity: true
});

// Local Products Orders
export const localProductOrders = pgTable("local_product_orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  district: text("district").notNull(),
  taluk: text("taluk"),
  pincode: text("pincode").notNull(),
  status: text("status").default("pending"), // pending, confirmed, shipped, delivered, cancelled
  paymentMethod: text("payment_method").default("cash"), // cash, wallet, online
  paymentStatus: text("payment_status").default("pending"), // pending, completed
  notes: text("notes"),
  deliveryFee: doublePrecision("delivery_fee").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at")
});

export const insertLocalProductOrderSchema = createInsertSchema(localProductOrders).pick({
  customerId: true,
  totalAmount: true,
  shippingAddress: true,
  district: true,
  taluk: true,
  pincode: true,
  status: true,
  paymentMethod: true,
  paymentStatus: true,
  notes: true,
  deliveryFee: true,
  completedAt: true
}).extend({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending"),
  paymentMethod: z.enum(["cash", "wallet", "online"]).default("cash"),
  paymentStatus: z.enum(["pending", "completed"]).default("pending"),
  notes: z.string().optional(),
  taluk: z.string().optional(),
  completedAt: z.date().optional()
});

// Local Products Order Items
export const localProductOrderItems = pgTable("local_product_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(), // Links to local_product_orders.id
  productId: integer("product_id").notNull(), // Links to local_product_base.id
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  productName: text("product_name").notNull(), // Stored for history
  manufacturerId: integer("manufacturer_id").notNull(), // Links to manufacturer
  createdAt: timestamp("created_at").defaultNow()
});

export const insertLocalProductOrderItemSchema = createInsertSchema(localProductOrderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  unitPrice: true,
  subtotal: true,
  productName: true,
  manufacturerId: true
});

// Type exports for local products cart system
export type InsertLocalProductCart = z.infer<typeof insertLocalProductCartSchema>;
export type LocalProductCart = typeof localProductCart.$inferSelect;

export type InsertLocalProductOrder = z.infer<typeof insertLocalProductOrderSchema>;
export type LocalProductOrder = typeof localProductOrders.$inferSelect;

export type InsertLocalProductOrderItem = z.infer<typeof insertLocalProductOrderItemSchema>;
export type LocalProductOrderItem = typeof localProductOrderItems.$inferSelect;

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

// Video Management Schemas
export const insertVideoUploadSchema = createInsertSchema(videoUploads).pick({
  uploaderId: true,
  title: true,
  description: true,
  filePath: true,
  fileName: true,
  fileSize: true,
  duration: true,
  thumbnailUrl: true,
  category: true,
  targetArea: true,
  status: true
}).extend({
  category: z.enum(["advertisement", "tutorial", "announcement"]).default("advertisement"),
  status: z.enum(["pending", "approved", "uploaded", "published", "rejected"]).default("pending"),
  description: z.string().optional(),
  duration: z.number().optional(),
  thumbnailUrl: z.string().optional(),
  targetArea: z.string().optional()
});

export const insertVideoViewAnalyticsSchema = createInsertSchema(videoViewAnalytics).pick({
  videoId: true,
  viewerId: true,
  sessionId: true,
  totalWatchTime: true,
  videoDuration: true,
  completionPercentage: true,
  pauseCount: true,
  seekCount: true,
  volumeChanges: true,
  playbackSpeed: true,
  deviceType: true,
  browserType: true,
  ipAddress: true,
  location: true,
  referrer: true,
  isCompleted: true
}).extend({
  viewerId: z.number().optional(),
  videoDuration: z.number().optional(),
  deviceType: z.string().optional(),
  browserType: z.string().optional(),
  ipAddress: z.string().optional(),
  location: z.string().optional(),
  referrer: z.string().optional()
});

// Video Management Types
export type VideoUpload = typeof videoUploads.$inferSelect;
export type InsertVideoUpload = z.infer<typeof insertVideoUploadSchema>;
export type VideoViewAnalytics = typeof videoViewAnalytics.$inferSelect;
export type InsertVideoViewAnalytics = z.infer<typeof insertVideoViewAnalyticsSchema>;
export type DailyVideoStats = typeof dailyVideoStats.$inferSelect;

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
  businessName: text("business_name"), // Using the actual column name from the database
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
    businessName: true,
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
    businessName: z.string().optional(),
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
export const recyclingMaterialRates = pgTable("recycling_material_rates", {
  id: serial("id").primaryKey(),
  materialType: text("material_type").notNull().unique(), // plastic, aluminum, copper, brass, steel, etc.
  ratePerKg: doublePrecision("rate_per_kg").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by"), // Admin ID who updated rate
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertRecyclingMaterialRateSchema = createInsertSchema(recyclingMaterialRates).pick({
  materialType: true,
  ratePerKg: true,
  description: true,
  isActive: true,
  updatedBy: true
});

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

export type InsertRecyclingMaterialRate = z.infer<typeof insertRecyclingMaterialRateSchema>;
export type RecyclingMaterialRate = typeof recyclingMaterialRates.$inferSelect;

export type InsertRecyclingAgentDetail = z.infer<typeof insertRecyclingAgentDetailSchema>;
export type RecyclingAgentDetail = typeof recyclingAgentDetails.$inferSelect;

export type InsertManagerApplication = z.infer<typeof insertManagerApplicationSchema>;
export type ManagerApplication = typeof managerApplications.$inferSelect;

// Provider Product Categories Schema - defines what each provider type can sell
export const providerProductCategories = pgTable("provider_product_categories", {
  id: serial("id").primaryKey(),
  providerType: text("provider_type").notNull(),
  categoryName: text("category_name").notNull(),
  subcategories: text("subcategories").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service Provider Products Schema - products offered by each provider
export const providerProducts = pgTable("provider_products", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
  categoryName: text("category_name").notNull(),
  subcategoryName: text("subcategory_name"),
  productName: text("product_name").notNull(),
  description: text("description").notNull(),
  specifications: text("specifications"),
  price: doublePrecision("price").notNull(),
  discountedPrice: doublePrecision("discounted_price"),
  unit: text("unit").notNull(), // kg, piece, liter, etc.
  stockQuantity: integer("stock_quantity").default(0),
  availableAreas: text("available_areas").array(),
  imageUrl: text("image_url"),
  isOrganic: boolean("is_organic").default(false),
  seasonality: text("seasonality"), // For farmers: season availability
  minimumOrder: integer("minimum_order").default(1),
  deliveryTime: text("delivery_time"), // Expected delivery timeframe
  status: text("status").default("active"), // active, inactive, out_of_stock
  adminApproved: boolean("admin_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new provider systems
export const insertProviderProductCategorySchema = createInsertSchema(providerProductCategories).omit({ 
  id: true, 
  createdAt: true 
});

export const insertProviderProductSchema = createInsertSchema(providerProducts).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Type exports for new provider systems
export type InsertProviderProductCategory = z.infer<typeof insertProviderProductCategorySchema>;
export type ProviderProductCategory = typeof providerProductCategories.$inferSelect;

export type InsertProviderProduct = z.infer<typeof insertProviderProductSchema>;
export type ProviderProduct = typeof providerProducts.$inferSelect;

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

// Chat related schemas
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isGroup: boolean("is_group").default(false),
  name: text("name"), // For group conversations
});

export const chatConversationMembers = pgTable("chat_conversation_members", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id),
  userId: integer("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  role: text("role").default("member").notNull(),
}, (table) => ({
  uniqueConversationUser: unique("unique_conversation_user").on(table.conversationId, table.userId)
}));

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  readBy: jsonb("read_by").default([]).notNull(), // Array of user IDs who have read the message
  status: text("status").default("sent").notNull(), // sent, delivered, read
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).pick({
  isGroup: true,
  name: true,
});

export const insertChatConversationMemberSchema = createInsertSchema(chatConversationMembers).pick({
  conversationId: true,
  userId: true,
  role: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  conversationId: true,
  senderId: true,
  content: true,
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;

export type ChatConversationMember = typeof chatConversationMembers.$inferSelect;
export type InsertChatConversationMember = z.infer<typeof insertChatConversationMemberSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// ======= REAL-TIME NOTIFICATION SYSTEM SCHEMA =======

// Database table for storing notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // The user that receives the notification
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // transaction, service_update, admin_alert, system_announcement, message
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"), // Optional URL to navigate when notification is clicked
  relatedEntityType: text("related_entity_type"), // e.g., recharge, booking, recycling, etc.
  relatedEntityId: integer("related_entity_id"), // Foreign key to the related entity
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration timestamp
});

export const userDevices = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  deviceToken: text("device_token").notNull().unique(),
  deviceType: text("device_type").notNull(), // android, ios, web
  lastSeen: timestamp("last_seen").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ======= ANALYTICS AND REPORTING SCHEMA =======

// Store aggregated daily metrics for quick dashboard retrieval
export const analyticsDaily = pgTable("analytics_daily", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  metric: text("metric").notNull(), // e.g., total_recharges, active_users, etc.
  category: text("category").notNull(), // service type or data category
  district: text("district"), // Optional district filter
  taluk: text("taluk"), // Optional taluk filter
  value: doublePrecision("value").notNull(), // The numerical value
  createdAt: timestamp("created_at").defaultNow(),
});

// Store custom reports configuration
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: integer("created_by").notNull(), // User ID who created the report
  isPublic: boolean("is_public").default(false),
  config: json("config").notNull(), // JSON configuration for the report
  schedule: text("schedule"), // Cron expression for scheduled reports
  lastRun: timestamp("last_run"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics events for detailed tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Can be null for anonymous events
  eventType: text("event_type").notNull(), // e.g., page_view, button_click, etc.
  eventSource: text("event_source").notNull(), // e.g., web, mobile, etc.
  properties: json("properties"), // JSON data with event details
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas for each model
export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  content: true,
  type: true,
  actionUrl: true,
  relatedEntityType: true,
  relatedEntityId: true,
  expiresAt: true,
});
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export const insertUserDeviceSchema = createInsertSchema(userDevices).pick({
  userId: true,
  deviceToken: true,
  deviceType: true,
});
export type InsertUserDevice = z.infer<typeof insertUserDeviceSchema>;

export const insertAnalyticsDailySchema = createInsertSchema(analyticsDaily).pick({
  date: true,
  metric: true,
  category: true,
  district: true,
  taluk: true,
  value: true,
});
export type InsertAnalyticsDaily = z.infer<typeof insertAnalyticsDailySchema>;

export const insertReportSchema = createInsertSchema(reports).pick({
  name: true,
  description: true,
  createdBy: true,
  isPublic: true,
  config: true,
  schedule: true,
});
export type InsertReport = z.infer<typeof insertReportSchema>;

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).pick({
  userId: true,
  eventType: true,
  eventSource: true,
  properties: true,
});
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

// Export types for all tables
export type Notification = typeof notifications.$inferSelect;
export type UserDevice = typeof userDevices.$inferSelect;
export type AnalyticsDaily = typeof analyticsDaily.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// Video Upload Management for Managerial Associates and Admin
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // in bytes
  duration: integer("duration"), // in seconds
  thumbnailUrl: text("thumbnail_url"),
  uploadedBy: integer("uploaded_by").notNull(), // User ID who uploaded
  category: text("category").default("general"), // general, training, announcement, promotional
  isPublic: boolean("is_public").default(false), // Public or private video
  tags: text("tags").array(), // Array of tags for categorization
  viewCount: integer("view_count").default(0),
  status: text("status").default("active"), // active, inactive, processing, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const videoViews = pgTable("video_views", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  watchDuration: integer("watch_time").default(0), // in seconds
  completionPercentage: integer("completion_percentage").default(0),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  description: true,
  fileName: true,
  fileUrl: true,
  fileSize: true,
  duration: true,
  thumbnailUrl: true,
  uploadedBy: true,
  category: true,
  isPublic: true,
  tags: true,
  status: true
});

export const insertVideoViewSchema = createInsertSchema(videoViews).pick({
  videoId: true,
  userId: true,
  ipAddress: true,
  watchDuration: true,
  completionPercentage: true,
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type VideoView = typeof videoViews.$inferSelect;
export type InsertVideoView = z.infer<typeof insertVideoViewSchema>;




