var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analyticsDaily: () => analyticsDaily,
  analyticsEvents: () => analyticsEvents,
  applications: () => applications,
  bookingAgentDetails: () => bookingAgentDetails,
  bookings: () => bookings,
  busBookings: () => busBookings,
  busCities: () => busCities,
  busCommissions: () => busCommissions,
  busOperators: () => busOperators,
  busRoutes: () => busRoutes,
  chatConversationMembers: () => chatConversationMembers,
  chatConversations: () => chatConversations,
  chatMessages: () => chatMessages,
  commissionConfigs: () => commissionConfigs,
  commissionTransactions: () => commissionTransactions,
  commissions: () => commissions,
  dailyVideoStats: () => dailyVideoStats,
  deliveries: () => deliveries,
  deliveryAgents: () => deliveryAgents,
  deliveryAreas: () => deliveryAreas,
  deliveryCategories: () => deliveryCategories,
  deliveryOrders: () => deliveryOrders,
  farmerDetails: () => farmerDetails,
  farmerProductListings: () => farmerProductListings,
  feedback: () => feedback,
  flightBookings: () => flightBookings2,
  groceryCategories: () => groceryCategories,
  groceryOrderItems: () => groceryOrderItems,
  groceryOrders: () => groceryOrders,
  groceryProducts: () => groceryProducts,
  grocerySubCategories: () => grocerySubCategories,
  hotelBookings: () => hotelBookings2,
  insertAnalyticsDailySchema: () => insertAnalyticsDailySchema,
  insertAnalyticsEventSchema: () => insertAnalyticsEventSchema,
  insertApplicationSchema: () => insertApplicationSchema,
  insertBookingAgentDetailSchema: () => insertBookingAgentDetailSchema,
  insertBookingSchema: () => insertBookingSchema,
  insertBusBookingSchema: () => insertBusBookingSchema,
  insertBusCitySchema: () => insertBusCitySchema,
  insertBusCommissionSchema: () => insertBusCommissionSchema,
  insertBusOperatorSchema: () => insertBusOperatorSchema,
  insertBusRouteSchema: () => insertBusRouteSchema,
  insertChatConversationMemberSchema: () => insertChatConversationMemberSchema,
  insertChatConversationSchema: () => insertChatConversationSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertCommissionConfigSchema: () => insertCommissionConfigSchema,
  insertCommissionSchema: () => insertCommissionSchema,
  insertCommissionTransactionSchema: () => insertCommissionTransactionSchema,
  insertDeliveryAgentSchema: () => insertDeliveryAgentSchema,
  insertDeliveryAreaSchema: () => insertDeliveryAreaSchema,
  insertDeliveryCategorySchema: () => insertDeliveryCategorySchema,
  insertDeliveryOrderSchema: () => insertDeliveryOrderSchema,
  insertDeliverySchema: () => insertDeliverySchema,
  insertFarmerDetailSchema: () => insertFarmerDetailSchema,
  insertFarmerProductListingSchema: () => insertFarmerProductListingSchema,
  insertFeedbackSchema: () => insertFeedbackSchema,
  insertFlightBookingSchema: () => insertFlightBookingSchema,
  insertGroceryCategorySchema: () => insertGroceryCategorySchema,
  insertGroceryOrderItemSchema: () => insertGroceryOrderItemSchema,
  insertGroceryOrderSchema: () => insertGroceryOrderSchema,
  insertGroceryProductSchema: () => insertGroceryProductSchema,
  insertGrocerySubCategorySchema: () => insertGrocerySubCategorySchema,
  insertHotelBookingSchema: () => insertHotelBookingSchema,
  insertLocalProductBaseSchema: () => insertLocalProductBaseSchema,
  insertLocalProductCartSchema: () => insertLocalProductCartSchema,
  insertLocalProductCategoryRequestSchema: () => insertLocalProductCategoryRequestSchema,
  insertLocalProductCategorySchema: () => insertLocalProductCategorySchema,
  insertLocalProductOrderItemSchema: () => insertLocalProductOrderItemSchema,
  insertLocalProductOrderSchema: () => insertLocalProductOrderSchema,
  insertLocalProductSchema: () => insertLocalProductSchema,
  insertLocalProductSubCategorySchema: () => insertLocalProductSubCategorySchema,
  insertManagerApplicationSchema: () => insertManagerApplicationSchema,
  insertManufacturerDetailSchema: () => insertManufacturerDetailSchema,
  insertNominationSchema: () => insertNominationSchema2,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOtpVerificationSchema: () => insertOtpVerificationSchema,
  insertProductRequestSchema: () => insertProductRequestSchema,
  insertProviderProductCategorySchema: () => insertProviderProductCategorySchema,
  insertProviderProductSchema: () => insertProviderProductSchema,
  insertPublicMessageSchema: () => insertPublicMessageSchema2,
  insertRechargeSchema: () => insertRechargeSchema,
  insertRecyclingAgentDetailSchema: () => insertRecyclingAgentDetailSchema,
  insertRecyclingMaterialRateSchema: () => insertRecyclingMaterialRateSchema2,
  insertRecyclingRequestSchema: () => insertRecyclingRequestSchema,
  insertRentalCartSchema: () => insertRentalCartSchema,
  insertRentalCategorySchema: () => insertRentalCategorySchema,
  insertRentalEquipmentSchema: () => insertRentalEquipmentSchema,
  insertRentalOrderSchema: () => insertRentalOrderSchema,
  insertRentalProviderDetailSchema: () => insertRentalProviderDetailSchema,
  insertRentalSchema: () => insertRentalSchema,
  insertRentalSubcategorySchema: () => insertRentalSubcategorySchema,
  insertReportSchema: () => insertReportSchema,
  insertServiceProviderSchema: () => insertServiceProviderSchema,
  insertServiceRequestCommissionTransactionSchema: () => insertServiceRequestCommissionTransactionSchema,
  insertServiceRequestNotificationSchema: () => insertServiceRequestNotificationSchema,
  insertServiceRequestSchema: () => insertServiceRequestSchema,
  insertServiceRequestStatusUpdateSchema: () => insertServiceRequestStatusUpdateSchema,
  insertTaxiBookingSchema: () => insertTaxiBookingSchema,
  insertTaxiCategorySchema: () => insertTaxiCategorySchema,
  insertTaxiProviderDetailSchema: () => insertTaxiProviderDetailSchema,
  insertTaxiRideSchema: () => insertTaxiRideSchema,
  insertTaxiRouteSchema: () => insertTaxiRouteSchema,
  insertTaxiVehicleSchema: () => insertTaxiVehicleSchema,
  insertTransportationAgentDetailSchema: () => insertTransportationAgentDetailSchema,
  insertUserDeviceSchema: () => insertUserDeviceSchema,
  insertUserSchema: () => insertUserSchema,
  insertVideoSchema: () => insertVideoSchema,
  insertVideoUploadSchema: () => insertVideoUploadSchema,
  insertVideoViewAnalyticsSchema: () => insertVideoViewAnalyticsSchema,
  insertVideoViewSchema: () => insertVideoViewSchema,
  localProductBase: () => localProductBase,
  localProductCart: () => localProductCart2,
  localProductCategories: () => localProductCategories,
  localProductCategoryRequests: () => localProductCategoryRequests,
  localProductDetails: () => localProductDetails,
  localProductOrderItems: () => localProductOrderItems2,
  localProductOrders: () => localProductOrders2,
  localProductSubCategories: () => localProductSubCategories,
  localProductViewSchema: () => localProductViewSchema,
  localProducts: () => localProducts,
  managerApplications: () => managerApplications,
  manufacturerDetails: () => manufacturerDetails,
  nominations: () => nominations,
  notifications: () => notifications,
  otpVerifications: () => otpVerifications,
  productRequests: () => productRequests,
  providerProductCategories: () => providerProductCategories,
  providerProducts: () => providerProducts,
  publicMessages: () => publicMessages,
  recharges: () => recharges,
  recyclingAgentDetails: () => recyclingAgentDetails,
  recyclingMaterialRates: () => recyclingMaterialRates,
  recyclingRequests: () => recyclingRequests,
  rentalCart: () => rentalCart,
  rentalCategories: () => rentalCategories,
  rentalEquipment: () => rentalEquipment,
  rentalOrderItems: () => rentalOrderItems,
  rentalOrders: () => rentalOrders,
  rentalProviderDetails: () => rentalProviderDetails,
  rentalSubcategories: () => rentalSubcategories,
  rentals: () => rentals,
  reports: () => reports,
  serviceProviders: () => serviceProviders,
  serviceRequestCommissionTransactions: () => serviceRequestCommissionTransactions,
  serviceRequestNotifications: () => serviceRequestNotifications,
  serviceRequestStatusUpdates: () => serviceRequestStatusUpdates,
  serviceRequests: () => serviceRequests,
  taxiBookings: () => taxiBookings,
  taxiCategories: () => taxiCategories,
  taxiProviderDetails: () => taxiProviderDetails,
  taxiRides: () => taxiRides,
  taxiRoutes: () => taxiRoutes,
  taxiVehicles: () => taxiVehicles,
  transactions: () => transactions,
  transportationAgentDetails: () => transportationAgentDetails,
  upsertLocalProductDetailsSchema: () => upsertLocalProductDetailsSchema,
  userDevices: () => userDevices,
  users: () => users,
  videoUploads: () => videoUploads,
  videoViewAnalytics: () => videoViewAnalytics,
  videoViews: () => videoViews,
  videos: () => videos
});
import { pgTable, text, serial, integer, boolean, date, doublePrecision, timestamp, json, jsonb, numeric, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users, insertUserSchema, transactions, busOperators, busCities, busRoutes, busBookings, flightBookings2, hotelBookings2, busCommissions, insertBusOperatorSchema, insertBusCitySchema, insertBusRouteSchema, insertBusBookingSchema, insertFlightBookingSchema, insertHotelBookingSchema, insertBusCommissionSchema, feedback, insertFeedbackSchema, serviceRequests, insertServiceRequestSchema, serviceRequestStatusUpdates, insertServiceRequestStatusUpdateSchema, serviceRequestCommissionTransactions, insertServiceRequestCommissionTransactionSchema, serviceRequestNotifications, insertServiceRequestNotificationSchema, commissionConfigs, insertCommissionConfigSchema, commissions, insertCommissionSchema, recharges, insertRechargeSchema, bookings, insertBookingSchema, rentals, insertRentalSchema, taxiRides, insertTaxiRideSchema, deliveries, insertDeliverySchema, groceryCategories, insertGroceryCategorySchema, grocerySubCategories, insertGrocerySubCategorySchema, groceryProducts, insertGroceryProductSchema, localProductBase, localProductDetails, insertLocalProductBaseSchema, upsertLocalProductDetailsSchema, localProductViewSchema, rentalCategories, rentalSubcategories, rentalEquipment, rentalOrders, rentalOrderItems, rentalCart, insertRentalCategorySchema, insertRentalSubcategorySchema, insertRentalEquipmentSchema, insertRentalOrderSchema, insertRentalCartSchema, deliveryCategories, deliveryAgents, deliveryOrders, taxiCategories, taxiVehicles, taxiBookings, taxiRoutes, recyclingRequests, videoUploads, videoViewAnalytics, dailyVideoStats, insertDeliveryCategorySchema, insertDeliveryAgentSchema, insertDeliveryOrderSchema, insertTaxiCategorySchema, insertTaxiVehicleSchema, insertTaxiBookingSchema, insertTaxiRouteSchema, insertRecyclingRequestSchema, insertTransactionSchema, localProductCategories, insertLocalProductCategorySchema, localProductSubCategories, insertLocalProductSubCategorySchema, localProductCategoryRequests, insertLocalProductCategoryRequestSchema, localProducts, insertLocalProductSchema, nominations, insertNominationSchema2, otpVerifications, insertOtpVerificationSchema, publicMessages, insertPublicMessageSchema2, applications, insertApplicationSchema, farmerProductListings, insertFarmerProductListingSchema, deliveryAreas, insertDeliveryAreaSchema, productRequests, insertProductRequestSchema, groceryOrders, insertGroceryOrderSchema, groceryOrderItems, insertGroceryOrderItemSchema, localProductCart2, insertLocalProductCartSchema, localProductOrders2, insertLocalProductOrderSchema, localProductOrderItems2, insertLocalProductOrderItemSchema, insertVideoUploadSchema, insertVideoViewAnalyticsSchema, managerApplications, insertManagerApplicationSchema, serviceProviders, insertServiceProviderSchema, farmerDetails, insertFarmerDetailSchema, manufacturerDetails, insertManufacturerDetailSchema, bookingAgentDetails, insertBookingAgentDetailSchema, taxiProviderDetails, insertTaxiProviderDetailSchema, transportationAgentDetails, insertTransportationAgentDetailSchema, rentalProviderDetails, insertRentalProviderDetailSchema, recyclingMaterialRates, insertRecyclingMaterialRateSchema2, recyclingAgentDetails, insertRecyclingAgentDetailSchema, providerProductCategories, providerProducts, insertProviderProductCategorySchema, insertProviderProductSchema, commissionTransactions, insertCommissionTransactionSchema, chatConversations, chatConversationMembers, chatMessages, insertChatConversationSchema, insertChatConversationMemberSchema, insertChatMessageSchema, notifications, userDevices, analyticsDaily, reports, analyticsEvents, insertNotificationSchema, insertUserDeviceSchema, insertAnalyticsDailySchema, insertReportSchema, insertAnalyticsEventSchema, videos, videoViews, insertVideoSchema, insertVideoViewSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      password: text("password").notNull(),
      fullName: text("full_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      userType: text("user_type").notNull(),
      parentId: integer("parent_id"),
      // For hierarchy: branch_manager -> admin, taluk_manager -> branch_manager, etc.
      district: text("district"),
      // For branch managers
      taluk: text("taluk"),
      // For taluk managers
      pincode: text("pincode"),
      // For service agents
      profilePhoto: text("profile_photo"),
      // Photo URL for approved forum members
      walletBalance: doublePrecision("wallet_balance").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertUserSchema = createInsertSchema(users).pick({
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
    transactions = pgTable("transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      amount: doublePrecision("amount").notNull(),
      type: text("type").notNull(),
      // credit, debit
      description: text("description").notNull(),
      serviceType: text("service_type"),
      // recharge, booking, rental, etc.
      createdAt: timestamp("created_at").defaultNow()
    });
    busOperators = pgTable("bus_operators", {
      id: serial("id").primaryKey(),
      operatorId: text("operator_id").notNull().unique(),
      // From API
      operatorName: text("operator_name").notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    busCities = pgTable("bus_cities", {
      id: serial("id").primaryKey(),
      cityCode: text("city_code").notNull().unique(),
      // From API
      cityName: text("city_name").notNull(),
      state: text("state").default("Tamil Nadu"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    busRoutes = pgTable("bus_routes", {
      id: serial("id").primaryKey(),
      routeId: text("route_id").notNull().unique(),
      // From API
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
    busBookings = pgTable("bus_bookings", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      routeId: text("route_id").notNull(),
      traceId: text("trace_id").notNull(),
      // From API
      resultIndex: integer("result_index").notNull(),
      passengerName: text("passenger_name").notNull(),
      passengerAge: integer("passenger_age").notNull(),
      passengerGender: text("passenger_gender").notNull(),
      passengerPhone: text("passenger_phone").notNull(),
      seatNumbers: json("seat_numbers").notNull(),
      // Array of selected seats
      boardingPoint: json("boarding_point").notNull(),
      // {index, name, location, time}
      droppingPoint: json("dropping_point").notNull(),
      // {index, name, location, time}
      totalAmount: doublePrecision("total_amount").notNull(),
      commissionAmount: doublePrecision("commission_amount").notNull(),
      bookingStatus: text("booking_status").notNull().default("pending"),
      // pending, confirmed, cancelled
      pnr: text("pnr"),
      // Booking reference from API
      ticketNumber: text("ticket_number"),
      journeyDate: date("journey_date").notNull(),
      bookingDate: timestamp("booking_date").defaultNow(),
      cancellationDate: timestamp("cancellation_date"),
      cancellationCharge: doublePrecision("cancellation_charge").default(0),
      refundAmount: doublePrecision("refund_amount").default(0),
      paymentStatus: text("payment_status").notNull().default("pending"),
      // pending, completed, failed, refunded
      razorpayOrderId: text("razorpay_order_id"),
      razorpayPaymentId: text("razorpay_payment_id")
    });
    flightBookings2 = pgTable("flight_bookings", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      bookingReference: text("booking_reference").notNull(),
      pnr: text("pnr"),
      origin: text("origin").notNull(),
      destination: text("destination").notNull(),
      departureDate: date("departure_date").notNull(),
      returnDate: date("return_date"),
      // For round trip
      tripType: text("trip_type").notNull().default("one_way"),
      // one_way, round_trip
      airline: text("airline").notNull(),
      flightNumber: text("flight_number").notNull(),
      passengers: json("passengers").notNull(),
      // Array of passenger details
      totalAmount: doublePrecision("total_amount").notNull(),
      commissionAmount: doublePrecision("commission_amount").notNull(),
      bookingStatus: text("booking_status").notNull().default("pending"),
      // pending, confirmed, cancelled
      seatPreferences: json("seat_preferences"),
      // Array of seat selections
      mealPreferences: json("meal_preferences"),
      // Array of meal preferences
      specialRequests: text("special_requests"),
      bookingDate: timestamp("booking_date").defaultNow(),
      cancellationDate: timestamp("cancellation_date"),
      cancellationCharge: doublePrecision("cancellation_charge").default(0),
      refundAmount: doublePrecision("refund_amount").default(0),
      paymentStatus: text("payment_status").notNull().default("pending"),
      razorpayOrderId: text("razorpay_order_id"),
      razorpayPaymentId: text("razorpay_payment_id")
    });
    hotelBookings2 = pgTable("hotel_bookings", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      bookingReference: text("booking_reference").notNull(),
      hotelName: text("hotel_name").notNull(),
      hotelId: text("hotel_id"),
      // From API
      city: text("city").notNull(),
      state: text("state").notNull(),
      address: text("address").notNull(),
      checkInDate: date("check_in_date").notNull(),
      checkOutDate: date("check_out_date").notNull(),
      nights: integer("nights").notNull(),
      roomType: text("room_type").notNull(),
      roomsCount: integer("rooms_count").notNull().default(1),
      guestsCount: integer("guests_count").notNull().default(1),
      guestDetails: json("guest_details").notNull(),
      // Primary guest details
      totalAmount: doublePrecision("total_amount").notNull(),
      commissionAmount: doublePrecision("commission_amount").notNull(),
      bookingStatus: text("booking_status").notNull().default("pending"),
      // pending, confirmed, cancelled
      amenities: json("amenities"),
      // Selected amenities
      specialRequests: text("special_requests"),
      bookingDate: timestamp("booking_date").defaultNow(),
      cancellationDate: timestamp("cancellation_date"),
      cancellationCharge: doublePrecision("cancellation_charge").default(0),
      refundAmount: doublePrecision("refund_amount").default(0),
      paymentStatus: text("payment_status").notNull().default("pending"),
      razorpayOrderId: text("razorpay_order_id"),
      razorpayPaymentId: text("razorpay_payment_id")
    });
    busCommissions = pgTable("bus_commissions", {
      id: serial("id").primaryKey(),
      bookingId: integer("booking_id").notNull(),
      userId: integer("user_id").notNull(),
      // Who gets the commission
      userType: text("user_type").notNull(),
      // admin, branch_manager, taluk_manager, service_agent
      commissionAmount: doublePrecision("commission_amount").notNull(),
      commissionPercent: doublePrecision("commission_percent").notNull(),
      status: text("status").notNull().default("pending"),
      // pending, paid
      createdAt: timestamp("created_at").defaultNow(),
      paidAt: timestamp("paid_at")
    });
    insertBusOperatorSchema = createInsertSchema(busOperators).pick({
      operatorId: true,
      operatorName: true,
      isActive: true
    });
    insertBusCitySchema = createInsertSchema(busCities).pick({
      cityCode: true,
      cityName: true,
      state: true,
      isActive: true
    });
    insertBusRouteSchema = createInsertSchema(busRoutes).pick({
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
    insertBusBookingSchema = createInsertSchema(busBookings).pick({
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
    insertFlightBookingSchema = createInsertSchema(flightBookings2).pick({
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
    insertHotelBookingSchema = createInsertSchema(hotelBookings2).pick({
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
    insertBusCommissionSchema = createInsertSchema(busCommissions).pick({
      bookingId: true,
      userId: true,
      userType: true,
      commissionAmount: true,
      commissionPercent: true,
      status: true
    });
    feedback = pgTable("feedback", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      serviceType: text("service_type").notNull(),
      rating: integer("rating").notNull(),
      comment: text("comment"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertFeedbackSchema = createInsertSchema(feedback).pick({
      userId: true,
      serviceType: true,
      rating: true,
      comment: true
    });
    serviceRequests = pgTable("service_requests", {
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
    insertServiceRequestSchema = createInsertSchema(serviceRequests).pick({
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
    serviceRequestStatusUpdates = pgTable("service_request_status_updates", {
      id: serial("id").primaryKey(),
      serviceRequestId: integer("service_request_id").notNull(),
      previousStatus: text("previous_status").notNull(),
      newStatus: text("new_status").notNull(),
      updatedBy: integer("updated_by").notNull(),
      // User ID who made the update
      reason: text("reason"),
      // Why status was changed
      notes: text("notes"),
      // Additional notes about the update
      attachments: jsonb("attachments").default([]),
      // Photos, documents, etc.
      createdAt: timestamp("created_at").defaultNow()
    });
    insertServiceRequestStatusUpdateSchema = createInsertSchema(serviceRequestStatusUpdates).pick({
      serviceRequestId: true,
      previousStatus: true,
      newStatus: true,
      updatedBy: true,
      reason: true,
      notes: true,
      attachments: true
    });
    serviceRequestCommissionTransactions = pgTable("service_request_commission_transactions", {
      id: serial("id").primaryKey(),
      serviceRequestId: integer("service_request_id").notNull(),
      userId: integer("user_id").notNull(),
      // Who receives the commission
      userType: text("user_type").notNull(),
      // admin, branch_manager, taluk_manager, service_agent
      // Commission details
      commissionType: text("commission_type").notNull(),
      // admin, branch_manager, taluk_manager, service_agent, registered_user
      commissionPercentage: doublePrecision("commission_percentage").notNull(),
      commissionAmount: doublePrecision("commission_amount").notNull(),
      baseAmount: doublePrecision("base_amount").notNull(),
      // Original service amount
      // Status
      status: text("status").notNull().default("pending"),
      // pending, paid, failed
      paidAt: timestamp("paid_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertServiceRequestCommissionTransactionSchema = createInsertSchema(serviceRequestCommissionTransactions).pick({
      serviceRequestId: true,
      userId: true,
      userType: true,
      commissionType: true,
      commissionPercentage: true,
      commissionAmount: true,
      baseAmount: true
    });
    serviceRequestNotifications = pgTable("service_request_notifications", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      serviceRequestId: integer("service_request_id"),
      title: text("title").notNull(),
      message: text("message").notNull(),
      type: text("type").notNull(),
      // info, success, warning, error
      category: text("category").notNull(),
      // service_request, payment, commission, system
      isRead: boolean("is_read").default(false),
      actionUrl: text("action_url"),
      // Link to relevant page
      createdAt: timestamp("created_at").defaultNow()
    });
    insertServiceRequestNotificationSchema = createInsertSchema(serviceRequestNotifications).pick({
      userId: true,
      serviceRequestId: true,
      title: true,
      message: true,
      type: true,
      category: true,
      actionUrl: true
    });
    commissionConfigs = pgTable("commission_configs", {
      id: serial("id").primaryKey(),
      serviceType: text("service_type").notNull(),
      // recharge, booking, taxi, etc.
      provider: text("provider"),
      // For recharge: Airtel, Jio, etc., For booking: IRCTC, MakeMyTrip, etc.
      adminCommission: doublePrecision("admin_commission").notNull().default(0.5),
      // percentage
      branchManagerCommission: doublePrecision("branch_manager_commission").notNull().default(0.5),
      // percentage
      talukManagerCommission: doublePrecision("taluk_manager_commission").notNull().default(1),
      // percentage
      serviceAgentCommission: doublePrecision("service_agent_commission").notNull().default(3),
      // percentage
      registeredUserCommission: doublePrecision("registered_user_commission").notNull().default(1),
      // percentage
      totalCommission: doublePrecision("total_commission").notNull().default(6),
      // total percentage
      // Enhanced fields for seasonal/peak pricing
      startDate: date("start_date"),
      // When this commission config becomes active
      endDate: date("end_date"),
      // When this commission config expires
      isPeakRate: boolean("is_peak_rate").default(false),
      // Indicates if this is a special rate for peak season
      seasonName: text("season_name"),
      // Name of the season or promotional period (e.g., "Diwali 2023", "Summer Peak")
      isActive: boolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertCommissionConfigSchema = createInsertSchema(commissionConfigs).pick({
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
    commissions = pgTable("commissions", {
      id: serial("id").primaryKey(),
      transactionId: integer("transaction_id").notNull(),
      // Reference to the transaction
      userId: integer("user_id").notNull(),
      // User who earned commission
      userType: text("user_type").notNull(),
      // admin, branch_manager, taluk_manager, service_agent, registered_user
      serviceType: text("service_type").notNull(),
      // recharge, booking, taxi, etc.
      serviceId: integer("service_id").notNull(),
      // ID of the service (recharge ID, booking ID, etc.)
      originalAmount: doublePrecision("original_amount").notNull(),
      // Original transaction amount
      commissionPercentage: doublePrecision("commission_percentage").notNull(),
      // Percentage of commission
      commissionAmount: doublePrecision("commission_amount").notNull(),
      // Actual amount earned
      status: text("status").notNull().default("pending"),
      // pending, paid
      createdAt: timestamp("created_at").defaultNow()
    });
    insertCommissionSchema = createInsertSchema(commissions).pick({
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
    recharges = pgTable("recharges", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      mobileNumber: text("mobile_number").notNull(),
      amount: doublePrecision("amount").notNull(),
      provider: text("provider").notNull(),
      status: text("status").notNull(),
      // pending, completed, failed
      serviceType: text("service_type").default("mobile"),
      // mobile, dth, electricity, etc.
      // Track who processed the recharge
      processedBy: integer("processed_by"),
      // Service agent ID who processed it
      // Commission tracking
      totalCommissionPercent: doublePrecision("total_commission_percent"),
      // Total commission percentage
      totalCommissionAmount: doublePrecision("total_commission_amount"),
      // Total commission amount
      commissionConfigId: integer("commission_config_id"),
      // Reference to commission config used
      // Timestamps
      createdAt: timestamp("created_at").defaultNow(),
      completedAt: timestamp("completed_at")
      // When the recharge was completed
    });
    insertRechargeSchema = createInsertSchema(recharges).pick({
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
    bookings = pgTable("bookings", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      bookingType: text("booking_type").notNull(),
      // bus, flight, hotel
      provider: text("provider"),
      // API provider (MakeMyTrip, Cleartrip, etc.)
      origin: text("origin"),
      destination: text("destination"),
      checkIn: date("check_in"),
      checkOut: date("check_out"),
      passengers: integer("passengers"),
      amount: doublePrecision("amount").notNull(),
      status: text("status").notNull(),
      // pending, confirmed, cancelled
      // Commission tracking
      processedBy: integer("processed_by"),
      // Service agent ID who processed it
      totalCommissionPercent: doublePrecision("total_commission_percent"),
      // Total commission percentage 
      totalCommissionAmount: doublePrecision("total_commission_amount"),
      // Total commission amount
      commissionConfigId: integer("commission_config_id"),
      // Reference to commission config used
      createdAt: timestamp("created_at").defaultNow(),
      completedAt: timestamp("completed_at")
      // When the booking was completed
    });
    insertBookingSchema = createInsertSchema(bookings).pick({
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
    rentals = pgTable("rentals", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      itemName: text("item_name").notNull(),
      category: text("category").notNull(),
      // power_tools, construction, cleaning, medical, ornament
      startDate: date("start_date").notNull(),
      endDate: date("end_date").notNull(),
      amount: doublePrecision("amount").notNull(),
      status: text("status").notNull(),
      // pending, active, returned, cancelled
      createdAt: timestamp("created_at").defaultNow()
    });
    insertRentalSchema = createInsertSchema(rentals).pick({
      userId: true,
      itemName: true,
      category: true,
      startDate: true,
      endDate: true,
      amount: true,
      status: true
    });
    taxiRides = pgTable("taxi_rides", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      pickup: text("pickup").notNull(),
      dropoff: text("dropoff").notNull(),
      distance: doublePrecision("distance").notNull(),
      amount: doublePrecision("amount").notNull(),
      status: text("status").notNull(),
      // pending, active, completed, cancelled
      vehicleType: text("vehicle_type").default("taxi"),
      // taxi, auto, two_wheeler, intercity
      createdAt: timestamp("created_at").defaultNow()
    });
    insertTaxiRideSchema = createInsertSchema(taxiRides).pick({
      userId: true,
      pickup: true,
      dropoff: true,
      distance: true,
      amount: true,
      status: true,
      vehicleType: true
    });
    deliveries = pgTable("deliveries", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      pickupAddress: text("pickup_address").notNull(),
      deliveryAddress: text("delivery_address").notNull(),
      packageDetails: text("package_details").notNull(),
      amount: doublePrecision("amount").notNull(),
      status: text("status").notNull(),
      // pending, picked_up, in_transit, delivered, cancelled
      createdAt: timestamp("created_at").defaultNow()
    });
    insertDeliverySchema = createInsertSchema(deliveries).pick({
      userId: true,
      pickupAddress: true,
      deliveryAddress: true,
      packageDetails: true,
      amount: true,
      status: true
    });
    groceryCategories = pgTable("grocery_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      icon: text("icon"),
      // Emoji or icon code
      color: text("color"),
      // CSS color class
      imageUrl: text("image_url"),
      // Image URL for the category
      isActive: boolean("is_active").default(true),
      displayOrder: integer("display_order"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertGroceryCategorySchema = createInsertSchema(groceryCategories).pick({
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
    grocerySubCategories = pgTable("grocery_subcategories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      parentCategoryId: integer("parent_category_id").notNull(),
      imageUrl: text("image_url"),
      // Image URL for the subcategory
      isActive: boolean("is_active").default(true),
      displayOrder: integer("display_order"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertGrocerySubCategorySchema = createInsertSchema(grocerySubCategories).pick({
      name: true,
      description: true,
      parentCategoryId: true,
      imageUrl: true,
      isActive: true,
      displayOrder: true
    }).extend({
      imageUrl: z.string().optional()
    });
    groceryProducts = pgTable("grocery_products", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description").notNull(),
      categoryId: integer("category_id").notNull(),
      // Links to grocery_categories.id
      subcategoryId: integer("subcategory_id"),
      // Links to grocery_subcategories.id
      providerId: integer("provider_id").notNull(),
      // Service provider/farmer who owns the product
      price: doublePrecision("price").notNull(),
      discountedPrice: doublePrecision("discounted_price"),
      stock: integer("stock").notNull(),
      unit: text("unit").notNull(),
      // kg, g, l, ml, pcs
      isOrganic: boolean("is_organic").default(false),
      district: text("district").notNull(),
      // Source district
      imageUrl: text("image_url"),
      // URL to product image
      deliveryOption: text("delivery_option").default("both"),
      // direct, service, both
      availableAreas: text("available_areas"),
      // JSON string of area codes or names
      adminApproved: boolean("admin_approved").default(false),
      // Requires admin approval
      status: text("status").default("pending"),
      // pending, active, inactive
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertGroceryProductSchema = createInsertSchema(groceryProducts).pick({
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
    localProductBase = pgTable("local_product_base", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      category: text("category").notNull(),
      subcategory: text("subcategory"),
      // Subcategory ID
      manufacturerId: integer("manufacturer_id"),
      // Linked to user.id (if manufacturer)
      adminApproved: boolean("admin_approved").default(false),
      providerId: integer("provider_id"),
      // Service provider who created this product
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    localProductDetails = pgTable("local_product_details", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => localProductBase.id, { onDelete: "cascade" }).notNull(),
      subcategoryId: integer("subcategory_id").references(() => localProductSubCategories.id),
      description: text("description").notNull(),
      specifications: jsonb("specifications").default({}).notNull(),
      // Structured product specifications
      price: doublePrecision("price").notNull(),
      discountedPrice: doublePrecision("discounted_price"),
      stock: integer("stock").notNull(),
      district: text("district").notNull(),
      // Source district
      imageUrl: text("image_url"),
      // URL to product image
      deliveryOption: text("delivery_option").default("both"),
      // direct, service, both
      availableAreas: text("available_areas"),
      // JSON string of area codes or names
      isDraft: boolean("is_draft").default(true),
      // Is this a draft or published product
      status: text("status").default("pending"),
      // active, inactive, pending
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertLocalProductBaseSchema = createInsertSchema(localProductBase).pick({
      name: true,
      category: true,
      manufacturerId: true
    }).extend({
      // Add any additional validation rules here
    });
    upsertLocalProductDetailsSchema = createInsertSchema(localProductDetails).pick({
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
    localProductViewSchema = z.object({
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
    rentalCategories = pgTable("rental_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      imageUrl: text("image_url"),
      isActive: boolean("is_active").default(true),
      displayOrder: integer("display_order").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    rentalSubcategories = pgTable("rental_subcategories", {
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
    rentalEquipment = pgTable("rental_equipment", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      categoryId: integer("category_id").notNull(),
      subcategoryId: integer("subcategory_id"),
      providerId: integer("provider_id").notNull(),
      // Service provider who owns the equipment
      description: text("description"),
      specifications: jsonb("specifications").default({}),
      dailyRate: doublePrecision("daily_rate").notNull(),
      weeklyRate: doublePrecision("weekly_rate"),
      monthlyRate: doublePrecision("monthly_rate"),
      securityDeposit: doublePrecision("security_deposit").notNull(),
      availableQuantity: integer("available_quantity").default(1),
      totalQuantity: integer("total_quantity").default(1),
      condition: text("condition").default("excellent"),
      // excellent, good, fair
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
      status: text("status").default("pending"),
      // pending, active, inactive, maintenance
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    rentalOrders = pgTable("rental_orders", {
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
      status: text("status").default("pending"),
      // pending, confirmed, delivered, active, returned, completed, cancelled
      paymentStatus: text("payment_status").default("pending"),
      // pending, paid, partial, refunded
      agentId: integer("agent_id"),
      // Service agent handling the rental
      talukManagerId: integer("taluk_manager_id"),
      branchManagerId: integer("branch_manager_id"),
      confirmedAt: timestamp("confirmed_at"),
      deliveredAt: timestamp("delivered_at"),
      returnedAt: timestamp("returned_at"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    rentalOrderItems = pgTable("rental_order_items", {
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
    rentalCart = pgTable("rental_cart", {
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
    insertRentalCategorySchema = createInsertSchema(rentalCategories).pick({
      name: true,
      description: true,
      imageUrl: true,
      isActive: true,
      displayOrder: true
    });
    insertRentalSubcategorySchema = createInsertSchema(rentalSubcategories).pick({
      name: true,
      description: true,
      categoryId: true,
      imageUrl: true,
      isActive: true,
      displayOrder: true
    });
    insertRentalEquipmentSchema = createInsertSchema(rentalEquipment).pick({
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
    insertRentalOrderSchema = createInsertSchema(rentalOrders).pick({
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
    insertRentalCartSchema = createInsertSchema(rentalCart).pick({
      userId: true,
      equipmentId: true,
      quantity: true,
      startDate: true,
      endDate: true,
      totalDays: true
    });
    deliveryCategories = pgTable("delivery_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      // two wheeler, three wheeler, four wheeler, trucks
      description: text("description"),
      basePrice: doublePrecision("base_price").notNull(),
      // base price per delivery
      pricePerKm: doublePrecision("price_per_km").notNull().default(0),
      // additional price per km
      pricePerKg: doublePrecision("price_per_kg").notNull().default(0),
      // additional price per kg
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    deliveryAgents = pgTable("delivery_agents", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      // reference to users table
      name: text("name").notNull(),
      mobileNumber: text("mobile_number").notNull(),
      email: text("email"),
      address: text("address").notNull(),
      district: text("district").notNull(),
      taluk: text("taluk").notNull(),
      pincode: text("pincode").notNull(),
      categoryId: integer("category_id").notNull(),
      // reference to delivery_categories
      availableStartTime: text("available_start_time"),
      // HH:MM format
      availableEndTime: text("available_end_time"),
      // HH:MM format
      operationAreas: json("operation_areas").default([]),
      // {districts: [], taluks: [], pincodes: []}
      isOnline: boolean("is_online").default(false),
      isAvailable: boolean("is_available").default(true),
      adminApproved: boolean("admin_approved").default(false),
      verificationStatus: text("verification_status").default("pending"),
      // pending, verified, rejected
      documents: json("documents").default([]),
      // array of document URLs
      rating: doublePrecision("rating").default(0),
      totalDeliveries: integer("total_deliveries").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    deliveryOrders = pgTable("delivery_orders", {
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
      paymentMode: text("payment_mode").default("cash"),
      // cash, online, cod
      paymentStatus: text("payment_status").default("pending"),
      // pending, paid, failed
      status: text("status").default("pending"),
      // pending, assigned, picked_up, in_transit, delivered, cancelled
      cancellationReason: text("cancellation_reason"),
      customerRating: integer("customer_rating"),
      customerFeedback: text("customer_feedback"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    taxiCategories = pgTable("taxi_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      // Two wheeler, Three wheeler, 4 seaters, 6 seaters, 12 seaters
      description: text("description").notNull(),
      basePrice: doublePrecision("base_price").notNull(),
      // Base fare
      pricePerKm: doublePrecision("price_per_km").notNull(),
      // Rate per kilometer
      waitingChargePerMinute: doublePrecision("waiting_charge_per_minute").notNull(),
      // Waiting charges
      maxPassengers: integer("max_passengers").notNull(),
      // Maximum seating capacity
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    taxiVehicles = pgTable("taxi_vehicles", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").notNull(),
      vehicleNumber: text("vehicle_number").notNull().unique(),
      vehicleType: text("vehicle_type").notNull(),
      // sedan, suv, hatchback, auto, bike
      brand: text("brand").notNull(),
      model: text("model").notNull(),
      year: integer("year").notNull(),
      color: text("color").notNull(),
      seatingCapacity: integer("seating_capacity").notNull(),
      fuelType: text("fuel_type").notNull(),
      // petrol, diesel, cng, electric
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
      availableAreas: text("available_areas"),
      // JSON string of areas/districts
      currentLocation: text("current_location"),
      district: text("district").notNull(),
      pincode: text("pincode"),
      imageUrl: text("image_url"),
      additionalImages: json("additional_images").default([]),
      isActive: boolean("is_active").default(true),
      adminApproved: boolean("admin_approved").default(false),
      status: text("status").default("available"),
      // available, busy, offline, maintenance
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    taxiBookings = pgTable("taxi_bookings", {
      id: serial("id").primaryKey(),
      bookingNumber: text("booking_number").notNull().unique(),
      customerId: integer("customer_id").notNull(),
      providerId: integer("provider_id").notNull(),
      vehicleId: integer("vehicle_id").notNull(),
      bookingType: text("booking_type").notNull(),
      // immediate, scheduled
      pickupLocation: text("pickup_location").notNull(),
      pickupPincode: text("pickup_pincode").notNull(),
      dropoffLocation: text("dropoff_location").notNull(),
      dropoffPincode: text("dropoff_pincode").notNull(),
      scheduledDateTime: timestamp("scheduled_date_time"),
      estimatedDistance: doublePrecision("estimated_distance"),
      // in km
      estimatedDuration: integer("estimated_duration"),
      // in minutes
      estimatedFare: doublePrecision("estimated_fare"),
      actualDistance: doublePrecision("actual_distance"),
      actualDuration: integer("actual_duration"),
      baseFare: doublePrecision("base_fare"),
      waitingCharges: doublePrecision("waiting_charges").default(0),
      tollCharges: doublePrecision("toll_charges").default(0),
      nightCharges: doublePrecision("night_charges").default(0),
      totalAmount: doublePrecision("total_amount").notNull(),
      paymentMode: text("payment_mode").default("cash"),
      // cash, online, wallet
      paymentStatus: text("payment_status").default("pending"),
      // pending, paid, failed, refunded
      specialInstructions: text("special_instructions"),
      passengerCount: integer("passenger_count").default(1),
      status: text("status").default("pending"),
      // pending, confirmed, started, completed, cancelled
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    taxiRoutes = pgTable("taxi_routes", {
      id: serial("id").primaryKey(),
      routeName: text("route_name").notNull(),
      fromLocation: text("from_location").notNull(),
      toLocation: text("to_location").notNull(),
      distance: doublePrecision("distance").notNull(),
      // in km
      estimatedDuration: integer("estimated_duration").notNull(),
      // in minutes
      basePrice: doublePrecision("base_price").notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    recyclingRequests = pgTable("recycling_requests", {
      id: serial("id").primaryKey(),
      requestNumber: text("request_number").notNull(),
      userId: integer("user_id").notNull(),
      address: text("address").notNull(),
      pincode: text("pincode").notNull(),
      date: date("date").notNull(),
      timeSlot: text("time_slot").notNull(),
      // morning, afternoon, evening
      materials: text("materials").notNull(),
      // comma-separated list: plastic, aluminum, copper, brass, steel
      additionalNotes: text("additional_notes"),
      // Status flow: new -> assigned -> collected -> verified -> closed
      status: text("status").default("new").notNull(),
      agentId: integer("agent_id"),
      // Service agent assigned for collection
      talukManagerId: integer("taluk_manager_id"),
      // Taluk manager who verifies
      branchManagerId: integer("branch_manager_id"),
      // Branch manager who distributes commission
      assignedAt: timestamp("assigned_at"),
      // When service agent was assigned
      collectedAt: timestamp("collected_at"),
      // When materials were collected
      verifiedAt: timestamp("verified_at"),
      // When taluk manager verified
      closedAt: timestamp("closed_at"),
      // When branch manager closed the request
      totalWeight: doublePrecision("total_weight"),
      // Total weight in kg
      amount: doublePrecision("amount"),
      // Amount paid to user
      createdAt: timestamp("created_at").defaultNow()
    });
    videoUploads = pgTable("video_uploads", {
      id: serial("id").primaryKey(),
      uploaderId: integer("uploader_id").notNull(),
      // User ID of the uploader
      title: text("title").notNull(),
      description: text("description"),
      filePath: text("file_path").notNull(),
      // Temporary file path before YouTube upload
      fileName: text("file_name").notNull(),
      fileSize: integer("file_size").notNull(),
      // File size in bytes
      duration: integer("duration"),
      // Duration in seconds
      thumbnailUrl: text("thumbnail_url"),
      category: text("category").default("advertisement"),
      // advertisement, tutorial, announcement
      targetArea: text("target_area"),
      // district/taluk/pincode for area-specific content
      // Status flow: pending -> approved -> uploaded -> published -> rejected
      status: text("status").default("pending").notNull(),
      adminApprovalBy: integer("admin_approval_by"),
      // Admin user ID who approved/rejected
      approvalNotes: text("approval_notes"),
      youtubeVideoId: text("youtube_video_id"),
      // YouTube video ID after upload
      youtubeUrl: text("youtube_url"),
      // Full YouTube URL
      uploadedToYoutubeAt: timestamp("uploaded_to_youtube_at"),
      rejectedAt: timestamp("rejected_at"),
      approvedAt: timestamp("approved_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    videoViewAnalytics = pgTable("video_view_analytics", {
      id: serial("id").primaryKey(),
      videoId: text("video_id").notNull(),
      // YouTube video ID
      viewerId: integer("viewer_id"),
      // User ID of viewer (null for anonymous)
      sessionId: text("session_id").notNull(),
      // Unique session identifier
      watchStartTime: timestamp("watch_start_time").defaultNow(),
      watchEndTime: timestamp("watch_end_time"),
      totalWatchTime: integer("total_watch_time").default(0),
      // Total seconds watched
      videoDuration: integer("video_duration"),
      // Total video duration in seconds
      completionPercentage: doublePrecision("completion_percentage").default(0),
      // Percentage of video watched
      pauseCount: integer("pause_count").default(0),
      // Number of times paused
      seekCount: integer("seek_count").default(0),
      // Number of times seeked
      volumeChanges: integer("volume_changes").default(0),
      // Number of volume adjustments
      playbackSpeed: doublePrecision("playback_speed").default(1),
      // Playback speed used
      deviceType: text("device_type"),
      // mobile, desktop, tablet
      browserType: text("browser_type"),
      // chrome, firefox, safari, etc
      ipAddress: text("ip_address"),
      // For location analytics
      location: text("location"),
      // City/district derived from IP
      referrer: text("referrer"),
      // How they reached the video
      isCompleted: boolean("is_completed").default(false),
      // Did they watch till end
      createdAt: timestamp("created_at").defaultNow()
    });
    dailyVideoStats = pgTable("daily_video_stats", {
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
      uniqueVideoDate: unique().on(table.videoId, table.date)
      // ✅ use unique instead of primaryKey
    }));
    insertDeliveryCategorySchema = createInsertSchema(deliveryCategories).pick({
      name: true,
      description: true,
      basePrice: true,
      pricePerKm: true,
      pricePerKg: true,
      isActive: true
    });
    insertDeliveryAgentSchema = createInsertSchema(deliveryAgents).pick({
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
    insertDeliveryOrderSchema = createInsertSchema(deliveryOrders).pick({
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
    insertTaxiCategorySchema = createInsertSchema(taxiCategories).pick({
      name: true,
      description: true,
      basePrice: true,
      pricePerKm: true,
      waitingChargePerMinute: true,
      maxPassengers: true,
      isActive: true
    });
    insertTaxiVehicleSchema = createInsertSchema(taxiVehicles).pick({
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
    insertTaxiBookingSchema = createInsertSchema(taxiBookings).pick({
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
    insertTaxiRouteSchema = createInsertSchema(taxiRoutes).pick({
      routeName: true,
      fromLocation: true,
      toLocation: true,
      distance: true,
      estimatedDuration: true,
      basePrice: true,
      isActive: true
    });
    insertRecyclingRequestSchema = createInsertSchema(recyclingRequests).pick({
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
      branchManagerId: z.number().optional()
    });
    insertTransactionSchema = z.object({
      id: z.number().optional(),
      amount: z.number(),
      description: z.string(),
      createdAt: z.date().optional()
    });
    localProductCategories = pgTable("local_product_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      icon: text("icon"),
      // Emoji or icon code
      color: text("color"),
      // CSS color class
      imageUrl: text("image_url"),
      // Image URL for the category
      isActive: boolean("is_active").default(true),
      displayOrder: integer("display_order"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertLocalProductCategorySchema = createInsertSchema(localProductCategories).pick({
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
    localProductSubCategories = pgTable("local_product_subcategories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      parentCategoryId: integer("parent_category_id").notNull(),
      imageUrl: text("image_url"),
      // Image URL for the subcategory
      isActive: boolean("is_active").default(true),
      displayOrder: integer("display_order"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertLocalProductSubCategorySchema = createInsertSchema(localProductSubCategories).pick({
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
    localProductCategoryRequests = pgTable("local_product_category_requests", {
      id: serial("id").primaryKey(),
      requesterId: integer("requester_id").notNull(),
      // Service provider ID
      categoryName: text("category_name").notNull(),
      subcategoryName: text("subcategory_name"),
      // Optional for subcategory requests
      parentCategoryId: integer("parent_category_id"),
      // For subcategory requests
      description: text("description"),
      justification: text("justification"),
      // Why this category is needed
      status: text("status").default("pending"),
      // pending, approved, rejected
      adminResponse: text("admin_response"),
      // Admin's response/feedback
      createdAt: timestamp("created_at").defaultNow(),
      reviewedAt: timestamp("reviewed_at"),
      reviewedBy: integer("reviewed_by")
      // Admin who reviewed
    });
    insertLocalProductCategoryRequestSchema = createInsertSchema(localProductCategoryRequests).pick({
      categoryName: true,
      subcategoryName: true,
      parentCategoryId: true,
      description: true,
      justification: true
    }).extend({
      requesterId: z.number().optional(),
      // Will be set by server
      subcategoryName: z.string().optional(),
      parentCategoryId: z.number().optional(),
      description: z.string().optional(),
      justification: z.string().optional()
    });
    localProducts = localProductBase;
    insertLocalProductSchema = insertLocalProductBaseSchema;
    nominations = pgTable("nominations", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      phoneNumber: text("phone_number").notNull(),
      otpVerified: boolean("otp_verified").default(false),
      roleAppliedFor: text("role_applied_for").notNull(),
      // branch_manager, taluk_manager, service_agent, service_provider
      district: text("district").notNull(),
      taluk: text("taluk").notNull(),
      pincode: text("pincode").notNull(),
      servicesProvided: text("services_provided"),
      // What services they can provide
      status: text("status").default("pending"),
      // pending, approved, rejected
      adminResponse: text("admin_response"),
      // Admin feedback
      profilePhoto: text("profile_photo"),
      // Photo URL after registration and approval
      userId: integer("user_id"),
      // Link to user after registration
      submittedAt: timestamp("submitted_at").defaultNow(),
      reviewedAt: timestamp("reviewed_at"),
      reviewedBy: integer("reviewed_by")
      // Admin who reviewed
    });
    insertNominationSchema2 = createInsertSchema(nominations).pick({
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
    otpVerifications = pgTable("otp_verifications", {
      id: serial("id").primaryKey(),
      phoneNumber: text("phone_number").notNull(),
      otp: text("otp").notNull(),
      purpose: text("purpose").notNull(),
      // nomination, login, etc.
      verified: boolean("verified").default(false),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertOtpVerificationSchema = createInsertSchema(otpVerifications).pick({
      phoneNumber: true,
      otp: true,
      purpose: true,
      expiresAt: true
    });
    publicMessages = pgTable("public_messages", {
      id: serial("id").primaryKey(),
      nominationId: integer("nomination_id").notNull(),
      // Reference to nomination
      senderId: integer("sender_id"),
      // User ID of sender (null for anonymous)
      senderName: text("sender_name").notNull(),
      // Display name
      message: text("message").notNull(),
      messageType: text("message_type").default("public"),
      // public, inquiry, support
      isAdminMessage: boolean("is_admin_message").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertPublicMessageSchema2 = createInsertSchema(publicMessages).pick({
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
    applications = pgTable("applications", {
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
      roleType: text("role_type").notNull(),
      // branch_manager, taluk_manager, service_agent, service_provider
      specificRole: text("specific_role"),
      // farmer, manufacturer, booking_agent, etc. for service providers
      additionalInfo: text("additional_info"),
      status: text("status").default("pending"),
      // pending, approved, rejected, under_review
      appliedAt: timestamp("applied_at").defaultNow(),
      reviewedAt: timestamp("reviewed_at"),
      reviewedBy: integer("reviewed_by"),
      // Admin who reviewed
      adminNotes: text("admin_notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertApplicationSchema = createInsertSchema(applications).pick({
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
    farmerProductListings = pgTable("farmer_product_listings", {
      id: serial("id").primaryKey(),
      farmerId: integer("farmer_id").notNull(),
      // Links to user.id with userType='provider'
      groceryProductId: integer("grocery_product_id").notNull(),
      // Links to admin-created product
      quantity: integer("quantity").notNull(),
      price: doublePrecision("price").notNull(),
      unit: text("unit").notNull(),
      // kg, g, l, ml, pcs
      imageUrl: text("image_url"),
      // Custom image URL
      transportAgentRequired: boolean("transport_agent_required").default(true),
      selfDelivery: boolean("self_delivery").default(false),
      isOrganic: boolean("is_organic").default(false),
      status: text("status").default("pending"),
      // pending, approved, rejected
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertFarmerProductListingSchema = createInsertSchema(farmerProductListings).pick({
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
      farmerId: z.number().optional(),
      // Making this optional so server can determine it
      imageUrl: z.string().optional(),
      transportAgentRequired: z.boolean().default(true),
      selfDelivery: z.boolean().default(false),
      isOrganic: z.boolean().default(false),
      status: z.enum(["pending", "approved", "rejected"]).default("pending")
    });
    deliveryAreas = pgTable("delivery_areas", {
      id: serial("id").primaryKey(),
      listingId: integer("listing_id").notNull(),
      // Links to farmer_product_listings.id
      district: text("district").notNull(),
      taluk: text("taluk").notNull(),
      pincode: text("pincode").notNull(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertDeliveryAreaSchema = createInsertSchema(deliveryAreas).pick({
      listingId: true,
      district: true,
      taluk: true,
      pincode: true,
      isActive: true
    });
    productRequests = pgTable("product_requests", {
      id: serial("id").primaryKey(),
      farmerId: integer("farmer_id").notNull(),
      // Links to user.id with userType='provider'
      requestedProductName: text("requested_product_name").notNull(),
      description: text("description").notNull(),
      category: text("category").notNull(),
      unit: text("unit").notNull(),
      // kg, g, l, ml, pcs
      imageUrl: text("image_url"),
      status: text("status").default("pending"),
      // pending, approved, rejected
      adminNotes: text("admin_notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertProductRequestSchema = createInsertSchema(productRequests).pick({
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
    groceryOrders = pgTable("grocery_orders", {
      id: serial("id").primaryKey(),
      customerId: integer("customer_id").notNull(),
      // Links to user.id with userType='customer'
      totalAmount: doublePrecision("total_amount").notNull(),
      shippingAddress: text("shipping_address").notNull(),
      district: text("district").notNull(),
      taluk: text("taluk").notNull(),
      pincode: text("pincode").notNull(),
      status: text("status").default("pending"),
      // pending, pincode_agent_approved, in_progress, delivered, cancelled
      pincodeAgentId: integer("pincode_agent_id"),
      // Service agent who approved
      transportAgentId: integer("transport_agent_id"),
      // Transport agent if used
      deliveryFee: doublePrecision("delivery_fee").default(0),
      paymentMethod: text("payment_method").default("cash"),
      // cash, wallet, online
      paymentStatus: text("payment_status").default("pending"),
      // pending, completed
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      completedAt: timestamp("completed_at")
    });
    insertGroceryOrderSchema = createInsertSchema(groceryOrders).pick({
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
    groceryOrderItems = pgTable("grocery_order_items", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").notNull(),
      // Links to grocery_orders.id
      farmerProductListingId: integer("farmer_product_listing_id").notNull(),
      // Links to farmer_product_listings.id
      quantity: integer("quantity").notNull(),
      unitPrice: doublePrecision("unit_price").notNull(),
      subtotal: doublePrecision("subtotal").notNull(),
      status: text("status").default("pending"),
      // pending, confirmed, shipped, delivered, cancelled
      farmerId: integer("farmer_id").notNull(),
      // Stored for easier queries
      productName: text("product_name").notNull(),
      // Stored for history
      createdAt: timestamp("created_at").defaultNow()
    });
    insertGroceryOrderItemSchema = createInsertSchema(groceryOrderItems).pick({
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
    localProductCart2 = pgTable("local_product_cart", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      // Customer ID
      productId: integer("product_id").notNull(),
      // Links to local_product_base.id
      quantity: integer("quantity").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertLocalProductCartSchema = createInsertSchema(localProductCart2).pick({
      userId: true,
      productId: true,
      quantity: true
    });
    localProductOrders2 = pgTable("local_product_orders", {
      id: serial("id").primaryKey(),
      customerId: integer("customer_id").notNull(),
      totalAmount: doublePrecision("total_amount").notNull(),
      shippingAddress: text("shipping_address").notNull(),
      district: text("district").notNull(),
      taluk: text("taluk"),
      pincode: text("pincode").notNull(),
      status: text("status").default("pending"),
      // pending, confirmed, shipped, delivered, cancelled
      paymentMethod: text("payment_method").default("cash"),
      // cash, wallet, online
      paymentStatus: text("payment_status").default("pending"),
      // pending, completed
      notes: text("notes"),
      deliveryFee: doublePrecision("delivery_fee").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      completedAt: timestamp("completed_at")
    });
    insertLocalProductOrderSchema = createInsertSchema(localProductOrders2).pick({
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
    localProductOrderItems2 = pgTable("local_product_order_items", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").notNull(),
      // Links to local_product_orders.id
      productId: integer("product_id").notNull(),
      // Links to local_product_base.id
      quantity: integer("quantity").notNull(),
      unitPrice: doublePrecision("unit_price").notNull(),
      subtotal: doublePrecision("subtotal").notNull(),
      productName: text("product_name").notNull(),
      // Stored for history
      manufacturerId: integer("manufacturer_id").notNull(),
      // Links to manufacturer
      createdAt: timestamp("created_at").defaultNow()
    });
    insertLocalProductOrderItemSchema = createInsertSchema(localProductOrderItems2).pick({
      orderId: true,
      productId: true,
      quantity: true,
      unitPrice: true,
      subtotal: true,
      productName: true,
      manufacturerId: true
    });
    insertVideoUploadSchema = createInsertSchema(videoUploads).pick({
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
    insertVideoViewAnalyticsSchema = createInsertSchema(videoViewAnalytics).pick({
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
    managerApplications = pgTable("manager_applications", {
      id: serial("id").primaryKey(),
      fullName: text("full_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      username: text("username").notNull(),
      password: text("password").notNull(),
      managerType: text("manager_type").notNull(),
      // branch_manager, taluk_manager, service_agent
      district: text("district"),
      taluk: text("taluk"),
      pincode: text("pincode"),
      status: text("status").notNull().default("pending"),
      // pending, approved, rejected
      notes: text("notes"),
      approvedBy: integer("approved_by"),
      // Admin ID who approved/rejected
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertManagerApplicationSchema = createInsertSchema(managerApplications).pick({
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
    serviceProviders = pgTable("service_providers", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().unique(),
      // Link to user table
      providerType: text("provider_type").notNull(),
      // farmer, manufacturer, booking_agent, taxi_provider, transportation_agent, rental_provider, recycling_agent
      businessName: text("business_name"),
      // Using the actual column name from the database
      address: text("address").notNull(),
      district: text("district").notNull(),
      taluk: text("taluk").notNull(),
      pincode: text("pincode").notNull(),
      operatingAreas: jsonb("operating_areas"),
      // Array of areas: [{district, taluk, pincode}]
      phone: text("phone").notNull(),
      email: text("email"),
      website: text("website"),
      description: text("description"),
      status: text("status").notNull().default("pending"),
      // pending, approved, rejected
      verificationStatus: text("verification_status").notNull().default("pending"),
      // pending, verified, rejected
      verifiedBy: integer("verified_by"),
      // Admin/Manager who verified
      documents: jsonb("documents"),
      // List of document URLs/IDs for verification
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertServiceProviderSchema = createInsertSchema(serviceProviders).pick({
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
    }).extend({
      businessName: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      description: z.string().optional(),
      operatingAreas: z.any().optional(),
      taluk: z.string().optional().default(""),
      // Make taluk optional
      verifiedBy: z.number().optional().nullable(),
      documents: z.any().optional(),
      status: z.string().default("pending"),
      verificationStatus: z.string().default("pending")
    });
    farmerDetails = pgTable("farmer_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      farmSize: text("farm_size"),
      // In acres (stored as text in database)
      farmType: text("farm_type"),
      // organic, conventional, mixed
      primaryProducts: text("primary_products").notNull(),
      // Array of product categories stored as text
      cultivationSeason: text("cultivation_season"),
      // year-round, seasonal  
      operatingHours: text("operating_hours"),
      // Operating hours for pickup/delivery
      supportsDelivery: boolean("supports_delivery"),
      bankDetails: jsonb("bank_details"),
      // For payments
      createdAt: timestamp("created_at"),
      updatedAt: timestamp("updated_at")
    });
    insertFarmerDetailSchema = createInsertSchema(farmerDetails).pick({
      serviceProviderId: true,
      farmSize: true,
      farmType: true,
      primaryProducts: true,
      cultivationSeason: true,
      operatingHours: true,
      supportsDelivery: true,
      bankDetails: true
    }).extend({
      farmSize: z.string().optional(),
      farmType: z.string().optional(),
      primaryProducts: z.string().or(z.array(z.string())).transform(
        (val) => typeof val === "string" ? val : JSON.stringify(val)
      ),
      cultivationSeason: z.string().optional(),
      operatingHours: z.string().optional(),
      supportsDelivery: z.boolean().default(false),
      bankDetails: z.any().optional()
    });
    manufacturerDetails = pgTable("manufacturer_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      businessType: text("business_type"),
      // small, medium, large
      productCategories: text("product_categories"),
      // Categories as JSON string
      establishmentYear: text("establishment_year"),
      // Changed from integer to text as per DB
      operatingHours: text("operating_hours"),
      supportsDelivery: boolean("supports_delivery"),
      bankDetails: jsonb("bank_details"),
      // For payments
      createdAt: timestamp("created_at"),
      updatedAt: timestamp("updated_at")
    });
    insertManufacturerDetailSchema = createInsertSchema(manufacturerDetails).pick({
      serviceProviderId: true,
      businessType: true,
      productCategories: true,
      establishmentYear: true,
      supportsDelivery: true,
      operatingHours: true,
      bankDetails: true
    }).extend({
      businessType: z.string().optional(),
      productCategories: z.string().optional(),
      // Changed to string to match DB
      establishmentYear: z.string().optional(),
      // Changed to string to match DB
      operatingHours: z.string().optional(),
      supportsDelivery: z.boolean().default(false),
      bankDetails: z.any().optional()
    });
    bookingAgentDetails = pgTable("booking_agent_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      serviceTypes: jsonb("service_types"),
      // Array of service types (bus, flight, hotel, train, recharge)
      operatingHours: text("operating_hours"),
      yearsOfExperience: integer("years_of_experience"),
      preferredProviders: jsonb("preferred_providers"),
      // List of preferred service providers
      commissionRates: jsonb("commission_rates"),
      // Custom commission rates
      bankDetails: jsonb("bank_details"),
      // For payments
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertBookingAgentDetailSchema = createInsertSchema(bookingAgentDetails).pick({
      serviceProviderId: true,
      serviceTypes: true,
      operatingHours: true,
      yearsOfExperience: true,
      preferredProviders: true,
      commissionRates: true,
      bankDetails: true
    }).extend({
      serviceTypes: z.any().optional(),
      operatingHours: z.string().optional(),
      yearsOfExperience: z.number().optional(),
      preferredProviders: z.any().optional(),
      commissionRates: z.any().optional(),
      bankDetails: z.any().optional()
    });
    taxiProviderDetails = pgTable("taxi_provider_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      vehicleTypes: text("vehicle_types"),
      // Vehicle types as text string
      operatingHours: text("operating_hours"),
      bankDetails: jsonb("bank_details"),
      // For payments
      licenseNumber: text("license_number"),
      // Driver's license number
      dateOfBirth: text("date_of_birth"),
      // Driver's date of birth
      photoUrl: text("photo_url"),
      // Driver's photo URL
      aadharVerified: boolean("aadhar_verified").default(false),
      // Aadhar verification status
      panCardNumber: text("pan_card_number"),
      // PAN card number
      vehicleRegistrationNumber: text("vehicle_registration_number"),
      // Vehicle registration number
      vehicleInsuranceDetails: text("vehicle_insurance_details"),
      // Vehicle insurance details
      vehiclePermitDetails: text("vehicle_permit_details"),
      // Vehicle permit details
      documents: jsonb("documents"),
      // For storing document URLs
      approvalStatus: text("approval_status").default("pending"),
      // pending, approved_by_agent, approved_by_taluk, approved_by_branch, approved_by_admin, rejected
      approvalNotes: text("approval_notes"),
      // Notes for approval/rejection
      approvedBy: integer("approved_by"),
      // User ID who approved the provider
      createdAt: timestamp("created_at"),
      updatedAt: timestamp("updated_at")
    });
    insertTaxiProviderDetailSchema = createInsertSchema(taxiProviderDetails).pick({
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
    }).extend({
      vehicleTypes: z.string().optional(),
      // Changed to string to match DB
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
    transportationAgentDetails = pgTable("transportation_agent_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      vehicleTypes: jsonb("vehicle_types"),
      // Array of vehicle types
      vehicleCount: integer("vehicle_count"),
      operatingHours: text("operating_hours"),
      serviceAreas: jsonb("service_areas"),
      // Areas they can deliver to
      maxDistance: integer("max_distance"),
      // Maximum distance in km
      maxWeight: doublePrecision("max_weight"),
      // Maximum weight in kg
      pricePerKg: doublePrecision("price_per_kg"),
      pricePerKm: doublePrecision("price_per_km"),
      bankDetails: jsonb("bank_details"),
      // For payments
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertTransportationAgentDetailSchema = createInsertSchema(transportationAgentDetails).pick({
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
    }).extend({
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
    rentalProviderDetails = pgTable("rental_provider_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      itemCategories: jsonb("item_categories"),
      // Array of item categories
      itemDetails: jsonb("item_details"),
      // Array of items with details
      depositRequired: boolean("deposit_required").default(true),
      operatingHours: text("operating_hours"),
      deliveryAvailable: boolean("delivery_available").default(false),
      deliveryCharge: doublePrecision("delivery_charge"),
      bankDetails: jsonb("bank_details"),
      // For payments
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertRentalProviderDetailSchema = createInsertSchema(rentalProviderDetails).pick({
      serviceProviderId: true,
      itemCategories: true,
      itemDetails: true,
      depositRequired: true,
      operatingHours: true,
      deliveryAvailable: true,
      deliveryCharge: true,
      bankDetails: true
    }).extend({
      itemCategories: z.any().optional(),
      itemDetails: z.any().optional(),
      depositRequired: z.boolean().default(true),
      operatingHours: z.string().optional(),
      deliveryAvailable: z.boolean().default(false),
      deliveryCharge: z.number().optional(),
      bankDetails: z.any().optional()
    });
    recyclingMaterialRates = pgTable("recycling_material_rates", {
      id: serial("id").primaryKey(),
      materialType: text("material_type").notNull().unique(),
      // plastic, aluminum, copper, brass, steel, etc.
      ratePerKg: doublePrecision("rate_per_kg").notNull(),
      description: text("description"),
      isActive: boolean("is_active").default(true),
      updatedBy: integer("updated_by"),
      // Admin ID who updated rate
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertRecyclingMaterialRateSchema2 = createInsertSchema(recyclingMaterialRates).pick({
      materialType: true,
      ratePerKg: true,
      description: true,
      isActive: true,
      updatedBy: true
    });
    recyclingAgentDetails = pgTable("recycling_agent_details", {
      id: serial("id").primaryKey(),
      serviceProviderId: integer("service_provider_id").notNull().unique(),
      // Link to service_providers
      materialTypes: jsonb("material_types"),
      // Array of materials (aluminum, copper, brass, plastic)
      pricePerKg: jsonb("price_per_kg"),
      // Object with price per kg for each material
      minQuantity: doublePrecision("min_quantity"),
      // Minimum quantity in kg
      providesPickup: boolean("provides_pickup").default(true),
      operatingHours: text("operating_hours"),
      purchaseProcess: text("purchase_process"),
      // Description of how purchasing works
      bankDetails: jsonb("bank_details"),
      // For payments
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertRecyclingAgentDetailSchema = createInsertSchema(recyclingAgentDetails).pick({
      serviceProviderId: true,
      materialTypes: true,
      pricePerKg: true,
      minQuantity: true,
      providesPickup: true,
      operatingHours: true,
      purchaseProcess: true,
      bankDetails: true
    }).extend({
      materialTypes: z.any().optional(),
      pricePerKg: z.any().optional(),
      minQuantity: z.number().optional(),
      providesPickup: z.boolean().default(true),
      operatingHours: z.string().optional(),
      purchaseProcess: z.string().optional(),
      bankDetails: z.any().optional()
    });
    providerProductCategories = pgTable("provider_product_categories", {
      id: serial("id").primaryKey(),
      providerType: text("provider_type").notNull(),
      categoryName: text("category_name").notNull(),
      subcategories: text("subcategories").array(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    providerProducts = pgTable("provider_products", {
      id: serial("id").primaryKey(),
      providerId: integer("provider_id").references(() => serviceProviders.id).notNull(),
      categoryName: text("category_name").notNull(),
      subcategoryName: text("subcategory_name"),
      productName: text("product_name").notNull(),
      description: text("description").notNull(),
      specifications: text("specifications"),
      price: doublePrecision("price").notNull(),
      discountedPrice: doublePrecision("discounted_price"),
      unit: text("unit").notNull(),
      // kg, piece, liter, etc.
      stockQuantity: integer("stock_quantity").default(0),
      availableAreas: text("available_areas").array(),
      imageUrl: text("image_url"),
      isOrganic: boolean("is_organic").default(false),
      seasonality: text("seasonality"),
      // For farmers: season availability
      minimumOrder: integer("minimum_order").default(1),
      deliveryTime: text("delivery_time"),
      // Expected delivery timeframe
      status: text("status").default("active"),
      // active, inactive, out_of_stock
      adminApproved: boolean("admin_approved").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertProviderProductCategorySchema = createInsertSchema(providerProductCategories).omit({
      id: true,
      createdAt: true
    });
    insertProviderProductSchema = createInsertSchema(providerProducts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    commissionTransactions = pgTable("commission_transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      // User receiving the commission
      amount: doublePrecision("amount").notNull(),
      // Commission amount
      commissionAmount: doublePrecision("commission_amount").notNull(),
      // Actual commission amount
      commissionRate: doublePrecision("commission_rate").notNull(),
      // Commission rate percentage
      transactionAmount: doublePrecision("transaction_amount").notNull(),
      // Original transaction amount
      serviceType: text("service_type").notNull(),
      // recharge, booking, etc.
      transactionId: integer("transaction_id").notNull(),
      // ID of the original transaction
      provider: text("provider"),
      // Service provider (e.g., Airtel, Jio)
      description: text("description"),
      status: text("status").notNull().default("pending"),
      // pending, completed, failed
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertCommissionTransactionSchema = createInsertSchema(commissionTransactions).pick({
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
    chatConversations = pgTable("chat_conversations", {
      id: serial("id").primaryKey(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      isGroup: boolean("is_group").default(false),
      name: text("name")
      // For group conversations
    });
    chatConversationMembers = pgTable("chat_conversation_members", {
      id: serial("id").primaryKey(),
      conversationId: integer("conversation_id").notNull().references(() => chatConversations.id),
      userId: integer("user_id").notNull().references(() => users.id),
      joinedAt: timestamp("joined_at").defaultNow(),
      leftAt: timestamp("left_at"),
      role: text("role").default("member").notNull()
    }, (table) => ({
      uniqueConversationUser: unique("unique_conversation_user").on(table.conversationId, table.userId)
    }));
    chatMessages = pgTable("chat_messages", {
      id: serial("id").primaryKey(),
      conversationId: integer("conversation_id").notNull().references(() => chatConversations.id),
      senderId: integer("sender_id").notNull().references(() => users.id),
      content: text("content").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      readBy: jsonb("read_by").default([]).notNull(),
      // Array of user IDs who have read the message
      status: text("status").default("sent").notNull()
      // sent, delivered, read
    });
    insertChatConversationSchema = createInsertSchema(chatConversations).pick({
      isGroup: true,
      name: true
    });
    insertChatConversationMemberSchema = createInsertSchema(chatConversationMembers).pick({
      conversationId: true,
      userId: true,
      role: true
    });
    insertChatMessageSchema = createInsertSchema(chatMessages).pick({
      conversationId: true,
      senderId: true,
      content: true
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      // The user that receives the notification
      title: text("title").notNull(),
      content: text("content").notNull(),
      type: text("type").notNull(),
      // transaction, service_update, admin_alert, system_announcement, message
      isRead: boolean("is_read").default(false),
      actionUrl: text("action_url"),
      // Optional URL to navigate when notification is clicked
      relatedEntityType: text("related_entity_type"),
      // e.g., recharge, booking, recycling, etc.
      relatedEntityId: integer("related_entity_id"),
      // Foreign key to the related entity
      createdAt: timestamp("created_at").defaultNow(),
      expiresAt: timestamp("expires_at")
      // Optional expiration timestamp
    });
    userDevices = pgTable("user_devices", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      deviceToken: text("device_token").notNull().unique(),
      deviceType: text("device_type").notNull(),
      // android, ios, web
      lastSeen: timestamp("last_seen").defaultNow(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    analyticsDaily = pgTable("analytics_daily", {
      id: serial("id").primaryKey(),
      date: date("date").notNull(),
      metric: text("metric").notNull(),
      // e.g., total_recharges, active_users, etc.
      category: text("category").notNull(),
      // service type or data category
      district: text("district"),
      // Optional district filter
      taluk: text("taluk"),
      // Optional taluk filter
      value: doublePrecision("value").notNull(),
      // The numerical value
      createdAt: timestamp("created_at").defaultNow()
    });
    reports = pgTable("reports", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      createdBy: integer("created_by").notNull(),
      // User ID who created the report
      isPublic: boolean("is_public").default(false),
      config: json("config").notNull(),
      // JSON configuration for the report
      schedule: text("schedule"),
      // Cron expression for scheduled reports
      lastRun: timestamp("last_run"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    analyticsEvents = pgTable("analytics_events", {
      id: serial("id").primaryKey(),
      userId: integer("user_id"),
      // Can be null for anonymous events
      eventType: text("event_type").notNull(),
      // e.g., page_view, button_click, etc.
      eventSource: text("event_source").notNull(),
      // e.g., web, mobile, etc.
      properties: json("properties"),
      // JSON data with event details
      timestamp: timestamp("timestamp").defaultNow()
    });
    insertNotificationSchema = createInsertSchema(notifications).pick({
      userId: true,
      title: true,
      content: true,
      type: true,
      actionUrl: true,
      relatedEntityType: true,
      relatedEntityId: true,
      expiresAt: true
    });
    insertUserDeviceSchema = createInsertSchema(userDevices).pick({
      userId: true,
      deviceToken: true,
      deviceType: true
    });
    insertAnalyticsDailySchema = createInsertSchema(analyticsDaily).pick({
      date: true,
      metric: true,
      category: true,
      district: true,
      taluk: true,
      value: true
    });
    insertReportSchema = createInsertSchema(reports).pick({
      name: true,
      description: true,
      createdBy: true,
      isPublic: true,
      config: true,
      schedule: true
    });
    insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).pick({
      userId: true,
      eventType: true,
      eventSource: true,
      properties: true
    });
    videos = pgTable("videos", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description"),
      fileName: text("file_name").notNull(),
      fileUrl: text("file_url").notNull(),
      fileSize: integer("file_size"),
      // in bytes
      duration: integer("duration"),
      // in seconds
      thumbnailUrl: text("thumbnail_url"),
      uploadedBy: integer("uploaded_by").notNull(),
      // User ID who uploaded
      category: text("category").default("general"),
      // general, training, announcement, promotional
      isPublic: boolean("is_public").default(false),
      // Public or private video
      tags: text("tags").array(),
      // Array of tags for categorization
      viewCount: integer("view_count").default(0),
      status: text("status").default("active"),
      // active, inactive, processing, failed
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    videoViews = pgTable("video_views", {
      id: serial("id").primaryKey(),
      videoId: integer("video_id").notNull().references(() => videos.id),
      userId: integer("user_id").references(() => users.id),
      ipAddress: text("ip_address"),
      watchDuration: integer("watch_time").default(0),
      // in seconds
      completionPercentage: integer("completion_percentage").default(0),
      viewedAt: timestamp("viewed_at").defaultNow()
    });
    insertVideoSchema = createInsertSchema(videos).pick({
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
    insertVideoViewSchema = createInsertSchema(videoViews).pick({
      videoId: true,
      userId: true,
      ipAddress: true,
      watchDuration: true,
      completionPercentage: true
    });
  }
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    dotenv.config();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false
      // Optional: Set false for local dev
    });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { eq, asc, desc, sql, and, inArray, lt, isNull, isNotNull } from "drizzle-orm";
var MemoryStore, PostgresSessionStore, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_db();
    MemoryStore = createMemoryStore(session);
    PostgresSessionStore = connectPg(session);
    DatabaseStorage = class {
      sessionStore;
      constructor() {
        this.sessionStore = new PostgresSessionStore({
          pool,
          createTableIfMissing: true
        });
      }
      // Notification and Real-time Messaging methods
      async createNotification(notification) {
        const [newNotification] = await db.insert(notifications).values(notification).returning();
        return newNotification;
      }
      async getNotificationsByUserId(userId, limit = 50, offset = 0) {
        return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit).offset(offset);
      }
      async getUnreadNotificationCount(userId) {
        const result = await db.select({ count: sql`count(*)` }).from(notifications).where(and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        ));
        return result[0]?.count || 0;
      }
      async markNotificationAsRead(id) {
        const [updatedNotification] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
        return updatedNotification;
      }
      async markAllNotificationsAsRead(userId) {
        await db.update(notifications).set({ isRead: true }).where(and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        ));
      }
      async deleteNotification(id) {
        await db.delete(notifications).where(eq(notifications.id, id));
      }
      // User devices operations (for push notifications)
      async registerUserDevice(device) {
        const existingDevice = await db.select().from(userDevices).where(eq(userDevices.deviceToken, device.deviceToken));
        if (existingDevice.length > 0) {
          const [updatedDevice] = await db.update(userDevices).set({
            lastSeen: /* @__PURE__ */ new Date(),
            isActive: true,
            userId: device.userId
            // In case the device is now used by a different user
          }).where(eq(userDevices.deviceToken, device.deviceToken)).returning();
          return updatedDevice;
        }
        const [newDevice] = await db.insert(userDevices).values(device).returning();
        return newDevice;
      }
      async getUserDevices(userId) {
        return await db.select().from(userDevices).where(and(
          eq(userDevices.userId, userId),
          eq(userDevices.isActive, true)
        ));
      }
      async updateUserDeviceLastSeen(deviceToken) {
        await db.update(userDevices).set({ lastSeen: /* @__PURE__ */ new Date() }).where(eq(userDevices.deviceToken, deviceToken));
      }
      async deactivateUserDevice(deviceToken) {
        await db.update(userDevices).set({ isActive: false }).where(eq(userDevices.deviceToken, deviceToken));
      }
      // Analytics operations
      async recordAnalyticsEvent(event) {
        const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
        return newEvent;
      }
      async updateDailyMetric(metric) {
        const whereConditions = [
          eq(analyticsDaily.date, metric.date),
          eq(analyticsDaily.metric, metric.metric),
          eq(analyticsDaily.category, metric.category)
        ];
        if (metric.district) {
          whereConditions.push(eq(analyticsDaily.district, metric.district));
        } else {
          whereConditions.push(isNull(analyticsDaily.district));
        }
        if (metric.taluk) {
          whereConditions.push(eq(analyticsDaily.taluk, metric.taluk));
        } else {
          whereConditions.push(isNull(analyticsDaily.taluk));
        }
        const existingMetrics = await db.select().from(analyticsDaily).where(and(...whereConditions));
        if (existingMetrics.length > 0) {
          const [updatedMetric] = await db.update(analyticsDaily).set({ value: metric.value }).where(eq(analyticsDaily.id, existingMetrics[0].id)).returning();
          return updatedMetric;
        }
        const [newMetric] = await db.insert(analyticsDaily).values(metric).returning();
        return newMetric;
      }
      async getDailyMetrics(params) {
        let query = db.select().from(analyticsDaily).where(and(
          sql`${analyticsDaily.date} >= ${params.startDate}`,
          sql`${analyticsDaily.date} <= ${params.endDate}`
        ));
        if (params.metrics && params.metrics.length > 0) {
          query = query.where(inArray(analyticsDaily.metric, params.metrics));
        }
        if (params.categories && params.categories.length > 0) {
          query = query.where(inArray(analyticsDaily.category, params.categories));
        }
        if (params.district) {
          query = query.where(eq(analyticsDaily.district, params.district));
        }
        if (params.taluk) {
          query = query.where(eq(analyticsDaily.taluk, params.taluk));
        }
        return await query.orderBy(asc(analyticsDaily.date), asc(analyticsDaily.metric));
      }
      // Reports operations
      async createReport(report) {
        const [newReport] = await db.insert(reports).values({
          ...report,
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newReport;
      }
      async getReportById(id) {
        const [report] = await db.select().from(reports).where(eq(reports.id, id));
        return report;
      }
      async getReportsByUser(userId) {
        return await db.select().from(reports).where(and(
          eq(reports.createdBy, userId),
          eq(reports.isPublic, false)
        )).orderBy(desc(reports.updatedAt));
      }
      async getPublicReports() {
        return await db.select().from(reports).where(eq(reports.isPublic, true)).orderBy(desc(reports.updatedAt));
      }
      async updateReport(id, updates) {
        const [updatedReport] = await db.update(reports).set({
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(reports.id, id)).returning();
        return updatedReport;
      }
      async deleteReport(id) {
        await db.delete(reports).where(eq(reports.id, id));
      }
      // Farmer Product Listing operations
      async createFarmerProductListing(listing) {
        console.log("Storage: Creating farmer product listing with data:", listing);
        try {
          const [insertedListing] = await db.insert(farmerProductListings).values({
            farmerId: listing.farmerId,
            groceryProductId: listing.groceryProductId,
            quantity: listing.quantity,
            price: listing.price,
            unit: listing.unit,
            // Skip the description field as it's not in the actual database
            // description: listing.description || null,
            imageUrl: listing.imageUrl || null,
            transportAgentRequired: listing.transportAgentRequired !== false,
            // default to true
            selfDelivery: listing.selfDelivery === true,
            // default to false
            isOrganic: listing.isOrganic === true,
            // default to false
            status: listing.status || "pending"
          }).returning();
          console.log("Storage: Successfully created listing:", insertedListing);
          return insertedListing;
        } catch (error) {
          console.error("Storage: Error creating listing:", error);
          throw error;
        }
      }
      async getFarmerProductListings(filter) {
        try {
          const query = db.select({
            id: farmerProductListings.id,
            farmerId: farmerProductListings.farmerId,
            groceryProductId: farmerProductListings.groceryProductId,
            quantity: farmerProductListings.quantity,
            price: farmerProductListings.price,
            unit: farmerProductListings.unit,
            imageUrl: farmerProductListings.imageUrl,
            transportAgentRequired: farmerProductListings.transportAgentRequired,
            selfDelivery: farmerProductListings.selfDelivery,
            isOrganic: farmerProductListings.isOrganic,
            status: farmerProductListings.status,
            // Skip adminNotes as it doesn't exist in the actual database
            createdAt: farmerProductListings.createdAt,
            updatedAt: farmerProductListings.updatedAt
          }).from(farmerProductListings);
          let filteredQuery = query;
          if (filter?.farmerId) {
            filteredQuery = filteredQuery.where(eq(farmerProductListings.farmerId, filter.farmerId));
          }
          if (filter?.groceryProductId) {
            filteredQuery = filteredQuery.where(eq(farmerProductListings.groceryProductId, filter.groceryProductId));
          }
          if (filter?.status) {
            filteredQuery = filteredQuery.where(eq(farmerProductListings.status, filter.status));
          }
          return await filteredQuery;
        } catch (error) {
          console.error("Error in getFarmerProductListings:", error);
          throw error;
        }
      }
      async getFarmerProductListing(id) {
        try {
          const [listing] = await db.select({
            id: farmerProductListings.id,
            farmerId: farmerProductListings.farmerId,
            groceryProductId: farmerProductListings.groceryProductId,
            quantity: farmerProductListings.quantity,
            price: farmerProductListings.price,
            unit: farmerProductListings.unit,
            imageUrl: farmerProductListings.imageUrl,
            transportAgentRequired: farmerProductListings.transportAgentRequired,
            selfDelivery: farmerProductListings.selfDelivery,
            isOrganic: farmerProductListings.isOrganic,
            status: farmerProductListings.status,
            // Skip adminNotes as it doesn't exist in the actual database
            createdAt: farmerProductListings.createdAt,
            updatedAt: farmerProductListings.updatedAt
          }).from(farmerProductListings).where(eq(farmerProductListings.id, id));
          return listing;
        } catch (error) {
          console.error("Error in getFarmerProductListing:", error);
          throw error;
        }
      }
      async updateFarmerProductListing(id, listing) {
        try {
          const updateData = { updatedAt: /* @__PURE__ */ new Date() };
          if (listing.farmerId !== void 0) updateData.farmerId = listing.farmerId;
          if (listing.groceryProductId !== void 0) updateData.groceryProductId = listing.groceryProductId;
          if (listing.quantity !== void 0) updateData.quantity = listing.quantity;
          if (listing.price !== void 0) updateData.price = listing.price;
          if (listing.unit !== void 0) updateData.unit = listing.unit;
          if (listing.imageUrl !== void 0) updateData.imageUrl = listing.imageUrl;
          if (listing.transportAgentRequired !== void 0) updateData.transportAgentRequired = listing.transportAgentRequired;
          if (listing.selfDelivery !== void 0) updateData.selfDelivery = listing.selfDelivery;
          if (listing.isOrganic !== void 0) updateData.isOrganic = listing.isOrganic;
          if (listing.status !== void 0) updateData.status = listing.status;
          const [updatedListing] = await db.update(farmerProductListings).set(updateData).where(eq(farmerProductListings.id, id)).returning();
          return updatedListing;
        } catch (error) {
          console.error("Error in updateFarmerProductListing:", error);
          throw error;
        }
      }
      async deleteFarmerProductListing(id) {
        await db.delete(farmerProductListings).where(eq(farmerProductListings.id, id));
      }
      // Delivery Area operations
      async createDeliveryArea(area) {
        const [insertedArea] = await db.insert(deliveryAreas).values({
          listingId: area.listingId,
          district: area.district,
          taluk: area.taluk,
          pincode: area.pincode,
          isActive: area.isActive || true
        }).returning();
        return insertedArea;
      }
      async getDeliveryAreas(listingId) {
        return await db.select().from(deliveryAreas).where(eq(deliveryAreas.listingId, listingId));
      }
      async getDeliveryArea(id) {
        const [area] = await db.select().from(deliveryAreas).where(eq(deliveryAreas.id, id));
        return area;
      }
      async deleteDeliveryArea(id) {
        await db.delete(deliveryAreas).where(eq(deliveryAreas.id, id));
      }
      // Product Request operations
      async createProductRequest(request) {
        const [insertedRequest] = await db.insert(productRequests).values({
          farmerId: request.farmerId,
          requestedProductName: request.requestedProductName,
          description: request.description,
          category: request.category,
          unit: request.unit,
          imageUrl: request.imageUrl,
          status: request.status || "pending",
          adminNotes: request.adminNotes
        }).returning();
        return insertedRequest;
      }
      async getProductRequests(filter) {
        let query = db.select().from(productRequests);
        if (filter?.farmerId) {
          query = query.where(eq(productRequests.farmerId, filter.farmerId));
        }
        if (filter?.status) {
          query = query.where(eq(productRequests.status, filter.status));
        }
        return await query;
      }
      async getProductRequest(id) {
        const [request] = await db.select().from(productRequests).where(eq(productRequests.id, id));
        return request;
      }
      async updateProductRequest(id, request) {
        const [updatedRequest] = await db.update(productRequests).set({
          ...request,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(productRequests.id, id)).returning();
        return updatedRequest;
      }
      // Grocery Order operations
      async createGroceryOrder(order) {
        const [insertedOrder] = await db.insert(groceryOrders).values({
          customerId: order.customerId,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          district: order.district,
          taluk: order.taluk,
          pincode: order.pincode,
          status: order.status || "pending",
          pincodeAgentId: order.pincodeAgentId,
          transportAgentId: order.transportAgentId,
          deliveryFee: order.deliveryFee || 0,
          paymentMethod: order.paymentMethod || "cash",
          paymentStatus: order.paymentStatus || "pending",
          notes: order.notes
        }).returning();
        return insertedOrder;
      }
      async getGroceryOrders(filter) {
        let query = db.select().from(groceryOrders);
        if (filter?.customerId) {
          query = query.where(eq(groceryOrders.customerId, filter.customerId));
        }
        if (filter?.status) {
          query = query.where(eq(groceryOrders.status, filter.status));
        }
        if (filter?.district) {
          query = query.where(eq(groceryOrders.district, filter.district));
        }
        if (filter?.taluk) {
          query = query.where(eq(groceryOrders.taluk, filter.taluk));
        }
        if (filter?.pincode) {
          query = query.where(eq(groceryOrders.pincode, filter.pincode));
        }
        return await query.orderBy(desc(groceryOrders.createdAt));
      }
      async getGroceryOrder(id) {
        const [order] = await db.select().from(groceryOrders).where(eq(groceryOrders.id, id));
        return order;
      }
      async updateGroceryOrder(id, order) {
        const [updatedOrder] = await db.update(groceryOrders).set(order).where(eq(groceryOrders.id, id)).returning();
        return updatedOrder;
      }
      // Grocery Order Item operations
      async createGroceryOrderItem(item) {
        const [insertedItem] = await db.insert(groceryOrderItems).values({
          orderId: item.orderId,
          farmerProductListingId: item.farmerProductListingId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          status: item.status || "pending",
          farmerId: item.farmerId,
          productName: item.productName
        }).returning();
        return insertedItem;
      }
      async getGroceryOrderItems(orderId) {
        return await db.select().from(groceryOrderItems).where(eq(groceryOrderItems.orderId, orderId));
      }
      async getFarmerOrderItems(farmerId, status) {
        let query = db.select().from(groceryOrderItems).where(eq(groceryOrderItems.farmerId, farmerId));
        if (status) {
          query = query.where(eq(groceryOrderItems.status, status));
        }
        return await query.orderBy(desc(groceryOrderItems.createdAt));
      }
      async updateGroceryOrderItem(id, item) {
        const [updatedItem] = await db.update(groceryOrderItems).set(item).where(eq(groceryOrderItems.id, id)).returning();
        return updatedItem;
      }
      // Grocery Category operations
      async getGroceryCategories() {
        const categories = await db.select().from(groceryCategories).orderBy(asc(groceryCategories.displayOrder));
        return categories;
      }
      async getGroceryCategory(id) {
        const [category] = await db.select().from(groceryCategories).where(eq(groceryCategories.id, id));
        return category;
      }
      async createGroceryCategory(category) {
        const [newCategory] = await db.insert(groceryCategories).values({
          ...category,
          createdAt: /* @__PURE__ */ new Date(),
          isActive: category.isActive === void 0 ? true : category.isActive
        }).returning();
        return newCategory;
      }
      async updateGroceryCategory(id, categoryData) {
        const [updatedCategory] = await db.update(groceryCategories).set(categoryData).where(eq(groceryCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteGroceryCategory(id) {
        await db.delete(grocerySubCategories).where(eq(grocerySubCategories.parentCategoryId, id));
        await db.delete(groceryCategories).where(eq(groceryCategories.id, id));
      }
      // Grocery SubCategory operations
      async getGrocerySubCategories(filter) {
        let query = db.select().from(grocerySubCategories);
        if (filter?.parentCategoryId !== void 0) {
          query = query.where(eq(grocerySubCategories.parentCategoryId, filter.parentCategoryId));
        }
        if (filter?.isActive !== void 0) {
          query = query.where(eq(grocerySubCategories.isActive, filter.isActive));
        }
        const subCategories = await query.orderBy(asc(grocerySubCategories.displayOrder));
        return subCategories;
      }
      async getGrocerySubCategory(id) {
        const [subCategory] = await db.select().from(grocerySubCategories).where(eq(grocerySubCategories.id, id));
        return subCategory;
      }
      async createGrocerySubCategory(subCategory) {
        const [newSubCategory] = await db.insert(grocerySubCategories).values({
          ...subCategory,
          createdAt: /* @__PURE__ */ new Date(),
          isActive: subCategory.isActive === void 0 ? true : subCategory.isActive
        }).returning();
        return newSubCategory;
      }
      async updateGrocerySubCategory(id, subCategoryData) {
        const [updatedSubCategory] = await db.update(grocerySubCategories).set(subCategoryData).where(eq(grocerySubCategories.id, id)).returning();
        return updatedSubCategory;
      }
      async deleteGrocerySubCategory(id) {
        await db.delete(grocerySubCategories).where(eq(grocerySubCategories.id, id));
      }
      // User operations
      async deductUserWalletBalance(userId, amount) {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) {
          throw new Error("User not found");
        }
        const currentBalance = user.walletBalance || 0;
        if (currentBalance < amount) {
          throw new Error("Insufficient wallet balance");
        }
        const newBalance = currentBalance - amount;
        await db.update(users).set({ walletBalance: newBalance }).where(eq(users.id, userId));
        return newBalance;
      }
      async updateWalletBalance(userId, newBalance) {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) {
          throw new Error("User not found");
        }
        await db.update(users).set({ walletBalance: newBalance }).where(eq(users.id, userId));
      }
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user;
      }
      async getUserByUsernameStartingWith(prefix) {
        const [user] = await db.select().from(users).where(sql`${users.username} LIKE ${prefix + "%"}`);
        return user;
      }
      async createUser(user) {
        const [newUser] = await db.insert(users).values({
          ...user,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newUser;
      }
      async updateUser(id, userData) {
        const [updatedUser] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
        return updatedUser;
      }
      async listUsers(filter) {
        let query = db.select().from(users);
        if (filter?.userType) {
          query = query.where(eq(users.userType, filter.userType));
        }
        if (filter?.parentId !== void 0) {
          query = query.where(eq(users.parentId, filter.parentId));
        }
        return await query;
      }
      // Transaction operations
      async createTransaction(transaction) {
        const [newTransaction] = await db.insert(transactions).values({
          ...transaction,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newTransaction;
      }
      async getTransactionsByUserId(userId) {
        return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
      }
      // Feedback operations
      async createFeedback(feedbackData) {
        const [newFeedback] = await db.insert(feedback).values({
          ...feedbackData,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newFeedback;
      }
      async listFeedback(filter) {
        let query = db.select().from(feedback);
        if (filter?.userId !== void 0) {
          query = query.where(eq(feedback.userId, filter.userId));
        }
        if (filter?.serviceType) {
          query = query.where(eq(feedback.serviceType, filter.serviceType));
        }
        return await query.orderBy(desc(feedback.createdAt));
      }
      // Recharge operations
      async createRecharge(recharge) {
        const [newRecharge] = await db.insert(recharges).values({
          ...recharge,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newRecharge;
      }
      async getRecharge(id) {
        const [recharge] = await db.select().from(recharges).where(eq(recharges.id, id));
        return recharge;
      }
      async getRechargesByUserId(userId) {
        return await db.select().from(recharges).where(eq(recharges.userId, userId)).orderBy(desc(recharges.createdAt));
      }
      async listRecharges() {
        return await db.select().from(recharges).orderBy(desc(recharges.createdAt));
      }
      async updateRecharge(id, rechargeData) {
        const [updatedRecharge] = await db.update(recharges).set(rechargeData).where(eq(recharges.id, id)).returning();
        return updatedRecharge;
      }
      // Booking operations
      async createBooking(booking) {
        const [newBooking] = await db.insert(bookings).values({
          ...booking,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newBooking;
      }
      async getBookingsByUserId(userId) {
        return await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
      }
      async getBooking(id) {
        const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
        return booking;
      }
      async updateBooking(id, bookingData) {
        const [updatedBooking] = await db.update(bookings).set(bookingData).where(eq(bookings.id, id)).returning();
        return updatedBooking;
      }
      // Rental operations
      async createRental(rental) {
        const [newRental] = await db.insert(rentals).values({
          ...rental,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newRental;
      }
      async getRentalsByUserId(userId) {
        return await db.select().from(rentals).where(eq(rentals.userId, userId)).orderBy(desc(rentals.createdAt));
      }
      async updateRental(id, rentalData) {
        const [updatedRental] = await db.update(rentals).set(rentalData).where(eq(rentals.id, id)).returning();
        return updatedRental;
      }
      // Taxi operations
      async createTaxiRide(taxiRide) {
        const [newTaxiRide] = await db.insert(taxiRides).values({
          ...taxiRide,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newTaxiRide;
      }
      async getTaxiRidesByUserId(userId) {
        return await db.select().from(taxiRides).where(eq(taxiRides.userId, userId)).orderBy(desc(taxiRides.createdAt));
      }
      async updateTaxiRide(id, taxiRideData) {
        const [updatedTaxiRide] = await db.update(taxiRides).set(taxiRideData).where(eq(taxiRides.id, id)).returning();
        return updatedTaxiRide;
      }
      // Delivery operations
      async createDelivery(delivery) {
        const [newDelivery] = await db.insert(deliveries).values({
          ...delivery,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDelivery;
      }
      async getDeliveriesByUserId(userId) {
        return await db.select().from(deliveries).where(eq(deliveries.userId, userId)).orderBy(desc(deliveries.createdAt));
      }
      async updateDelivery(id, deliveryData) {
        const [updatedDelivery] = await db.update(deliveries).set(deliveryData).where(eq(deliveries.id, id)).returning();
        return updatedDelivery;
      }
      // Grocery operations
      async createGroceryProduct(product) {
        const [newProduct] = await db.insert(groceryProducts).values({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          discountedPrice: product.discountedPrice || null,
          farmerId: product.farmerId || null,
          stock: product.stock,
          unit: product.unit,
          isOrganic: product.isOrganic || false,
          district: product.district,
          imageUrl: product.imageUrl || null,
          deliveryOption: product.deliveryOption || "both",
          availableAreas: product.availableAreas || null,
          status: product.status || "active",
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newProduct;
      }
      async getGroceryProducts(filter) {
        try {
          console.log("Filter applied for grocery products:", filter || {});
          let query = db.select().from(groceryProducts);
          const whereConditions = [];
          if (filter?.categoryId) {
            whereConditions.push(eq(groceryProducts.categoryId, filter.categoryId));
          }
          if (filter?.subcategoryId) {
            whereConditions.push(eq(groceryProducts.subcategoryId, filter.subcategoryId));
          }
          if (filter?.district) {
            whereConditions.push(eq(groceryProducts.district, filter.district));
          }
          if (filter?.isOrganic !== void 0) {
            whereConditions.push(eq(groceryProducts.isOrganic, filter.isOrganic));
          }
          if (filter?.providerId !== void 0) {
            whereConditions.push(eq(groceryProducts.providerId, filter.providerId));
          }
          if (filter?.adminApproved !== void 0) {
            whereConditions.push(eq(groceryProducts.adminApproved, filter.adminApproved));
          } else {
            whereConditions.push(eq(groceryProducts.adminApproved, true));
          }
          if (filter?.status) {
            whereConditions.push(eq(groceryProducts.status, filter.status));
          } else {
            whereConditions.push(eq(groceryProducts.status, "active"));
          }
          if (filter?.availableAreas) {
            whereConditions.push(sql`${groceryProducts.availableAreas} LIKE ${"%" + filter.availableAreas + "%"}`);
          }
          if (filter?.deliveryOption) {
            whereConditions.push(eq(groceryProducts.deliveryOption, filter.deliveryOption));
          }
          if (whereConditions.length > 0) {
            query = query.where(and(...whereConditions));
          }
          const products = await query;
          console.log(`Successfully retrieved ${products.length} grocery products`);
          return products;
        } catch (error) {
          console.error("Error in getGroceryProducts:", error);
          throw error;
        }
      }
      async getGroceryProductById(id) {
        try {
          const [product] = await db.select().from(groceryProducts).where(eq(groceryProducts.id, id));
          return product;
        } catch (error) {
          console.error(`Error fetching grocery product with ID ${id}:`, error);
          throw error;
        }
      }
      async getGroceryProductsByProvider(providerId) {
        try {
          return await db.select().from(groceryProducts).where(eq(groceryProducts.providerId, providerId)).orderBy(desc(groceryProducts.createdAt));
        } catch (error) {
          console.error(`Error fetching grocery products for provider ${providerId}:`, error);
          throw error;
        }
      }
      async getGroceryProductsByProviderId(providerId) {
        try {
          return await db.select().from(groceryProducts).where(eq(groceryProducts.providerId, providerId)).orderBy(desc(groceryProducts.createdAt));
        } catch (error) {
          console.error(`Error fetching grocery products for provider ${providerId}:`, error);
          throw error;
        }
      }
      async updateGroceryProduct(id, productData) {
        try {
          const validData = {};
          if ("name" in productData) validData.name = productData.name;
          if ("description" in productData) validData.description = productData.description;
          if ("category" in productData) validData.category = productData.category;
          if ("price" in productData) validData.price = productData.price;
          if ("discountedPrice" in productData) validData.discountedPrice = productData.discountedPrice;
          if ("farmerId" in productData) validData.farmerId = productData.farmerId;
          if ("stock" in productData) validData.stock = productData.stock;
          if ("unit" in productData) validData.unit = productData.unit;
          if ("isOrganic" in productData) validData.isOrganic = productData.isOrganic;
          if ("district" in productData) validData.district = productData.district;
          if ("imageUrl" in productData) validData.imageUrl = productData.imageUrl;
          if ("deliveryOption" in productData) validData.deliveryOption = productData.deliveryOption;
          if ("availableAreas" in productData) validData.availableAreas = productData.availableAreas;
          if ("status" in productData) validData.status = productData.status;
          if ("adminApproved" in productData) validData.adminApproved = productData.adminApproved;
          const [updatedProduct] = await db.update(groceryProducts).set(validData).where(eq(groceryProducts.id, id)).returning();
          return updatedProduct;
        } catch (error) {
          console.error(`Error updating grocery product with ID ${id}:`, error);
          throw error;
        }
      }
      async deleteAllGroceryProducts() {
        try {
          await db.delete(groceryProducts);
          console.log("All grocery products have been removed from the database");
        } catch (error) {
          console.error("Error deleting all grocery products:", error);
          throw error;
        }
      }
      async clearGroceryProductsFromMemory() {
        await this.deleteAllGroceryProducts();
      }
      async clearMemoryGroceryProducts() {
        await this.deleteAllGroceryProducts();
      }
      async deleteGroceryProduct(id) {
        try {
          await db.delete(groceryProducts).where(eq(groceryProducts.id, id));
        } catch (error) {
          console.error(`Error deleting grocery product ${id}:`, error);
          throw error;
        }
      }
      async getGroceryProductsForAdmin(filter) {
        try {
          let query = db.select().from(groceryProducts);
          if (filter?.adminApproved !== void 0) {
            query = query.where(eq(groceryProducts.adminApproved, filter.adminApproved));
          }
          const products = await query.orderBy(desc(groceryProducts.createdAt));
          return products;
        } catch (error) {
          console.error("Error fetching grocery products for admin:", error);
          throw error;
        }
      }
      // Local products operations - new architecture implementation
      // Base product operations
      async createLocalProductBase(product) {
        const [newProduct] = await db.insert(localProductBase).values({
          ...product,
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newProduct;
      }
      async getLocalProductBaseById(id) {
        const [product] = await db.select().from(localProductBase).where(eq(localProductBase.id, id));
        return product;
      }
      async listLocalProductBases(filter) {
        let query = db.select().from(localProductBase);
        if (filter?.manufacturerId !== void 0) {
          query = query.where(eq(localProductBase.manufacturerId, filter.manufacturerId));
        }
        if (filter?.adminApproved !== void 0) {
          query = query.where(eq(localProductBase.adminApproved, filter.adminApproved));
        }
        if (filter?.category) {
          query = query.where(eq(localProductBase.category, filter.category));
        }
        return await query.orderBy(desc(localProductBase.updatedAt));
      }
      async updateLocalProductBase(id, data) {
        const [updatedProduct] = await db.update(localProductBase).set({
          ...data,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(localProductBase.id, id)).returning();
        return updatedProduct;
      }
      // Product details operations
      async createLocalProductDetails(details) {
        const [newDetails] = await db.insert(localProductDetails).values({
          ...details,
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetails;
      }
      async getLocalProductDetailsById(id) {
        const [details] = await db.select().from(localProductDetails).where(eq(localProductDetails.id, id));
        return details;
      }
      async getLocalProductDetailsByProductId(productId) {
        const [details] = await db.select().from(localProductDetails).where(eq(localProductDetails.productId, productId));
        return details;
      }
      async updateLocalProductDetails(id, details) {
        const [updatedDetails] = await db.update(localProductDetails).set({
          ...details,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(localProductDetails.id, id)).returning();
        return updatedDetails;
      }
      // Composite product view operations
      async getLocalProductView(id) {
        const baseProduct = await this.getLocalProductBaseById(id);
        if (!baseProduct) return void 0;
        const details = await this.getLocalProductDetailsByProductId(baseProduct.id);
        if (!details) return void 0;
        return {
          id: baseProduct.id,
          name: baseProduct.name,
          category: baseProduct.category,
          manufacturerId: baseProduct.manufacturerId,
          adminApproved: baseProduct.adminApproved,
          description: details.description,
          specifications: details.specifications,
          price: details.price,
          discountedPrice: details.discountedPrice,
          stock: details.stock,
          district: details.district,
          imageUrl: details.imageUrl,
          deliveryOption: details.deliveryOption,
          availableAreas: details.availableAreas,
          isDraft: details.isDraft,
          status: details.status,
          createdAt: baseProduct.createdAt.toISOString(),
          updatedAt: details.updatedAt.toISOString()
        };
      }
      async listLocalProductViews(filter) {
        try {
          console.log("listLocalProductViews called with filter:", filter);
          const categories = await db.select().from(localProductCategories);
          const subcategories = await db.select().from(localProductSubCategories);
          const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
          const subcategoryMap = new Map(subcategories.map((s) => [s.id, s.name]));
          let whereConditions = [];
          if (filter?.adminApproved !== void 0) {
            whereConditions.push(eq(localProductBase.adminApproved, filter.adminApproved));
          }
          let query = db.select().from(localProductBase);
          if (whereConditions.length > 0) {
            query = query.where(and(...whereConditions));
          }
          const results = await query;
          console.log(`Found ${results.length} products matching filter`);
          return results.map((row) => {
            const categoryId = parseInt(row.category);
            const categoryName = categoryMap.get(categoryId) || `Category ${row.category}`;
            const subcategoryId = row.subcategory ? parseInt(row.subcategory) : null;
            const subcategoryName = subcategoryId ? subcategoryMap.get(subcategoryId) || "" : "";
            console.log(`Product ${row.name}: categoryId=${row.category} (parsed: ${categoryId}), subcategoryId=${row.subcategory} (parsed: ${subcategoryId}), mapped to: ${categoryName}/${subcategoryName}, adminApproved: ${row.adminApproved}`);
            return {
              id: row.id,
              name: row.name,
              category: categoryName,
              subcategory: subcategoryName,
              description: `Product in ${categoryName}`,
              price: 100,
              discountedPrice: null,
              district: "Tamil Nadu",
              imageUrl: null,
              deliveryOption: "both",
              availableAreas: "",
              status: row.adminApproved ? "active" : "pending",
              // Set status based on admin approval
              isDraft: false,
              adminApproved: row.adminApproved,
              manufacturerId: row.manufacturerId,
              createdAt: row.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: row.updatedAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString(),
              specifications: {},
              stock: 10
            };
          });
        } catch (error) {
          console.error("Error in listLocalProductViews:", error);
          return [];
        }
      }
      // Backward compatibility methods
      async createLocalProduct(product) {
        const baseProduct = await this.createLocalProductBase({
          name: product.name,
          category: product.category,
          manufacturerId: product.manufacturerId
        });
        const details = await this.createLocalProductDetails({
          productId: baseProduct.id,
          description: product.description || "",
          price: product.price || 0,
          discountedPrice: product.discountedPrice,
          stock: product.stock || 0,
          district: product.district || "",
          imageUrl: product.imageUrl,
          deliveryOption: product.deliveryOption,
          availableAreas: product.availableAreas,
          status: product.status,
          isDraft: false
        });
        return {
          id: baseProduct.id,
          name: baseProduct.name,
          category: baseProduct.category,
          manufacturerId: baseProduct.manufacturerId,
          adminApproved: baseProduct.adminApproved,
          description: details.description,
          specifications: details.specifications,
          price: details.price,
          discountedPrice: details.discountedPrice,
          stock: details.stock,
          district: details.district,
          imageUrl: details.imageUrl,
          deliveryOption: details.deliveryOption,
          availableAreas: details.availableAreas,
          isDraft: details.isDraft,
          status: details.status,
          createdAt: baseProduct.createdAt.toISOString(),
          updatedAt: details.updatedAt.toISOString()
        };
      }
      async getLocalProducts(filter) {
        return this.listLocalProductViews({
          category: filter?.category,
          district: filter?.district,
          availableAreas: filter?.availableAreas,
          deliveryOption: filter?.deliveryOption,
          status: filter?.status || "active",
          // By default only show active products for backward compatibility
          isDraft: false,
          // Don't show drafts in the old API
          adminApproved: true
          // Only approved products for general-purpose API
        });
      }
      async getLocalProductById(id) {
        return this.getLocalProductView(id);
      }
      async approveLocalProduct(id) {
        await db.update(localProductBase).set({ adminApproved: true }).where(eq(localProductBase.id, id));
        await db.update(localProductDetails).set({ status: "active" }).where(eq(localProductDetails.productId, id));
        return this.getLocalProductView(id);
      }
      async rejectLocalProduct(id, reason) {
        await db.update(localProductBase).set({ adminApproved: false }).where(eq(localProductBase.id, id));
        await db.update(localProductDetails).set({ status: "inactive" }).where(eq(localProductDetails.productId, id));
        return this.getLocalProductView(id);
      }
      async getPendingLocalProducts() {
        return this.listLocalProductViews({
          adminApproved: false
        });
      }
      async updateLocalProduct(id, product) {
        const baseFields = {};
        if (product.name !== void 0) baseFields.name = product.name;
        if (product.category !== void 0) baseFields.category = product.category;
        if (product.manufacturerId !== void 0) baseFields.manufacturerId = product.manufacturerId;
        if (product.adminApproved !== void 0) baseFields.adminApproved = product.adminApproved;
        const detailFields = {};
        if (product.description !== void 0) detailFields.description = product.description;
        if (product.price !== void 0) detailFields.price = product.price;
        if (product.discountedPrice !== void 0) detailFields.discountedPrice = product.discountedPrice;
        if (product.stock !== void 0) detailFields.stock = product.stock;
        if (product.district !== void 0) detailFields.district = product.district;
        if (product.imageUrl !== void 0) detailFields.imageUrl = product.imageUrl;
        if (product.deliveryOption !== void 0) detailFields.deliveryOption = product.deliveryOption;
        if (product.availableAreas !== void 0) detailFields.availableAreas = product.availableAreas;
        if (product.status !== void 0) detailFields.status = product.status;
        if (product.isDraft !== void 0) detailFields.isDraft = product.isDraft;
        if (Object.keys(baseFields).length > 0) {
          await this.updateLocalProductBase(id, baseFields);
        }
        const details = await this.getLocalProductDetailsByProductId(id);
        if (!details) return void 0;
        if (Object.keys(detailFields).length > 0) {
          await this.updateLocalProductDetails(details.id, detailFields);
        }
        return this.getLocalProductView(id);
      }
      // Recycling operations
      async createRecyclingRequest(request) {
        const [newRequest] = await db.insert(recyclingRequests).values({
          ...request,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newRequest;
      }
      async getRecyclingRequestsByUserId(userId) {
        return await db.select().from(recyclingRequests).where(eq(recyclingRequests.userId, userId)).orderBy(desc(recyclingRequests.createdAt));
      }
      async getRecyclingRequestsByAgentId(agentId) {
        return await db.select().from(recyclingRequests).where(eq(recyclingRequests.agentId, agentId)).orderBy(desc(recyclingRequests.createdAt));
      }
      async updateRecyclingRequest(id, requestData) {
        const [updatedRequest] = await db.update(recyclingRequests).set(requestData).where(eq(recyclingRequests.id, id)).returning();
        return updatedRequest;
      }
      // Recycling Material Rate operations
      async createRecyclingMaterialRate(rate) {
        const [newRate] = await db.insert(recyclingMaterialRates).values({
          ...rate,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newRate;
      }
      async getRecyclingMaterialRates() {
        return await db.select().from(recyclingMaterialRates).orderBy(asc(recyclingMaterialRates.materialType));
      }
      async getRecyclingMaterialRate(id) {
        const [rate] = await db.select().from(recyclingMaterialRates).where(eq(recyclingMaterialRates.id, id));
        return rate;
      }
      async updateRecyclingMaterialRate(id, rateData) {
        const [updatedRate] = await db.update(recyclingMaterialRates).set({
          ...rateData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(recyclingMaterialRates.id, id)).returning();
        return updatedRate;
      }
      // Commission Configuration operations
      async createCommissionConfig(config) {
        const [newConfig] = await db.insert(commissionConfigs).values({
          ...config,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newConfig;
      }
      async getCommissionConfig(id) {
        const [config] = await db.select().from(commissionConfigs).where(eq(commissionConfigs.id, id));
        return config;
      }
      async getCommissionConfigByService(serviceType, provider) {
        let query = db.select().from(commissionConfigs).where(eq(commissionConfigs.serviceType, serviceType)).where(eq(commissionConfigs.isActive, true));
        if (provider) {
          query = query.where(eq(commissionConfigs.provider, provider));
        }
        const [config] = await query;
        return config;
      }
      async updateCommissionConfig(id, configData) {
        const [updatedConfig] = await db.update(commissionConfigs).set({
          ...configData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(commissionConfigs.id, id)).returning();
        return updatedConfig;
      }
      async listCommissionConfigs() {
        return await db.select().from(commissionConfigs).orderBy(desc(commissionConfigs.updatedAt));
      }
      // Commission operations
      async createCommission(commission) {
        const [newCommission] = await db.insert(commissions).values({
          ...commission,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCommission;
      }
      async getCommissionsByUserId(userId) {
        return await db.select().from(commissions).where(eq(commissions.userId, userId)).orderBy(desc(commissions.createdAt));
      }
      async getCommissionsByServiceType(serviceType) {
        return await db.select().from(commissions).where(eq(commissions.serviceType, serviceType)).orderBy(desc(commissions.createdAt));
      }
      async updateCommission(id, commissionData) {
        const [updatedCommission] = await db.update(commissions).set(commissionData).where(eq(commissions.id, id)).returning();
        return updatedCommission;
      }
      // Commission Transaction operations
      async createCommissionTransaction(transaction) {
        const [newTransaction] = await db.insert(commissionTransactions).values({
          ...transaction,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newTransaction;
      }
      async getCommissionTransactionsByUserId(userId) {
        return db.select().from(commissionTransactions).where(eq(commissionTransactions.userId, userId)).orderBy(desc(commissionTransactions.createdAt));
      }
      async getCommissionTransactionByServiceType(serviceType) {
        return db.select().from(commissionTransactions).where(eq(commissionTransactions.serviceType, serviceType)).orderBy(desc(commissionTransactions.createdAt));
      }
      async updateCommissionTransaction(id, transaction) {
        const [updatedTransaction] = await db.update(commissionTransactions).set({
          ...transaction,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(commissionTransactions.id, id)).returning();
        return updatedTransaction;
      }
      async updateCommissionTransactionStatus(id, status) {
        const [updatedTransaction] = await db.update(commissionTransactions).set({
          status,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(commissionTransactions.id, id)).returning();
        return updatedTransaction;
      }
      async getPendingCommissionTransactions() {
        return db.select().from(commissionTransactions).where(eq(commissionTransactions.status, "pending")).orderBy(desc(commissionTransactions.createdAt));
      }
      async getCommissionTransactionsByReference(serviceType, transactionId) {
        return db.select().from(commissionTransactions).where(
          and(
            eq(commissionTransactions.serviceType, serviceType),
            eq(commissionTransactions.transactionId, transactionId)
          )
        ).orderBy(desc(commissionTransactions.createdAt));
      }
      // User hierarchy operations for commission calculation
      async getUserByPincodeAndType(pincode, userType) {
        const [user] = await db.select().from(users).where(sql`${users.pincode} = ${pincode} AND ${users.userType} = ${userType}`);
        return user;
      }
      async getUserByTalukAndType(district, taluk, userType) {
        const [user] = await db.select().from(users).where(sql`${users.district} = ${district} AND ${users.taluk} = ${taluk} AND ${users.userType} = ${userType}`);
        return user;
      }
      async getUserByDistrictAndType(district, userType) {
        const [user] = await db.select().from(users).where(sql`${users.district} = ${district} AND ${users.userType} = ${userType}`);
        return user;
      }
      async getUserByType(userType) {
        const [user] = await db.select().from(users).where(eq(users.userType, userType));
        return user;
      }
      // Commission calculation and distribution
      async calculateCommissions(serviceType, serviceId, amount, provider) {
        const config = await this.getCommissionConfigByService(serviceType, provider);
        if (!config) {
          throw new Error(`No commission configuration found for ${serviceType} ${provider || ""}`);
        }
        let registeredUserId = null;
        let serviceAgentId = null;
        if (serviceType === "recharge") {
          const [recharge] = await db.select().from(recharges).where(eq(recharges.id, serviceId));
          if (recharge) {
            serviceAgentId = recharge.processedBy || null;
            registeredUserId = recharge.userId || null;
          }
        }
        if (!serviceAgentId) {
          throw new Error("No service agent found for this transaction");
        }
        const parentChain = await this.getParentChain(serviceAgentId);
        const [transaction] = await db.insert(transactions).values({
          userId: serviceAgentId,
          amount,
          type: "credit",
          description: `${serviceType} transaction`,
          serviceType,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        await this.distributeCommission(
          serviceAgentId,
          parentChain,
          transaction.id,
          serviceType,
          serviceId,
          amount,
          config
        );
        if (registeredUserId && registeredUserId !== serviceAgentId) {
          await this.distributeRegisteredUserCommission(
            registeredUserId,
            transaction.id,
            serviceType,
            serviceId,
            amount,
            config.registeredUserCommission
          );
        }
      }
      // Helper to get the parent chain from a user up to admin
      async getParentChain(userId) {
        const chain = [];
        let currentUser = await this.getUser(userId);
        while (currentUser?.parentId) {
          chain.push(currentUser.parentId);
          currentUser = await this.getUser(currentUser.parentId);
        }
        return chain;
      }
      // Distribute commission to each person in the hierarchy
      async distributeCommission(serviceAgentId, parentChain, transactionId, serviceType, serviceId, originalAmount, config) {
        await this.createCommission({
          userId: serviceAgentId,
          userType: "service_agent",
          serviceType,
          transactionId,
          serviceId,
          originalAmount,
          commissionPercentage: config.serviceAgentCommission,
          commissionAmount: originalAmount * config.serviceAgentCommission / 100,
          status: "credited"
        });
        const serviceAgent = await this.getUser(serviceAgentId);
        if (serviceAgent) {
          const commissionAmount = originalAmount * config.serviceAgentCommission / 100;
          await this.updateUser(serviceAgentId, {
            walletBalance: (serviceAgent.walletBalance || 0) + commissionAmount
          });
        }
        if (parentChain.length > 0) {
          const talukManagerId = parentChain[0];
          await this.createCommission({
            userId: talukManagerId,
            userType: "taluk_manager",
            serviceType,
            transactionId,
            serviceId,
            originalAmount,
            commissionPercentage: config.talukManagerCommission,
            commissionAmount: originalAmount * config.talukManagerCommission / 100,
            status: "credited"
          });
          const talukManager = await this.getUser(talukManagerId);
          if (talukManager) {
            const commissionAmount = originalAmount * config.talukManagerCommission / 100;
            await this.updateUser(talukManagerId, {
              walletBalance: (talukManager.walletBalance || 0) + commissionAmount
            });
          }
          if (parentChain.length > 1) {
            const branchManagerId = parentChain[1];
            await this.createCommission({
              userId: branchManagerId,
              userType: "branch_manager",
              serviceType,
              transactionId,
              serviceId,
              originalAmount,
              commissionPercentage: config.branchManagerCommission,
              commissionAmount: originalAmount * config.branchManagerCommission / 100,
              status: "credited"
            });
            const branchManager = await this.getUser(branchManagerId);
            if (branchManager) {
              const commissionAmount = originalAmount * config.branchManagerCommission / 100;
              await this.updateUser(branchManagerId, {
                walletBalance: (branchManager.walletBalance || 0) + commissionAmount
              });
            }
            if (parentChain.length > 2) {
              const adminId = parentChain[2];
              await this.createCommission({
                userId: adminId,
                userType: "admin",
                serviceType,
                transactionId,
                serviceId,
                originalAmount,
                commissionPercentage: config.adminCommission,
                commissionAmount: originalAmount * config.adminCommission / 100,
                status: "credited"
              });
              const admin = await this.getUser(adminId);
              if (admin) {
                const commissionAmount = originalAmount * config.adminCommission / 100;
                await this.updateUser(adminId, {
                  walletBalance: (admin.walletBalance || 0) + commissionAmount
                });
              }
            }
          }
        }
      }
      // Distribute commission to registered user
      async distributeRegisteredUserCommission(registeredUserId, transactionId, serviceType, serviceId, originalAmount, commissionPercentage) {
        await this.createCommission({
          userId: registeredUserId,
          userType: "registered_user",
          serviceType,
          transactionId,
          serviceId,
          originalAmount,
          commissionPercentage,
          commissionAmount: originalAmount * commissionPercentage / 100,
          status: "credited"
        });
        const registeredUser = await this.getUser(registeredUserId);
        if (registeredUser) {
          const commissionAmount = originalAmount * commissionPercentage / 100;
          await this.updateUser(registeredUserId, {
            walletBalance: (registeredUser.walletBalance || 0) + commissionAmount
          });
        }
      }
      // Service Provider operations
      async createServiceProvider(provider) {
        const [newProvider] = await db.insert(serviceProviders).values({
          ...provider,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newProvider;
      }
      async getServiceProvider(id) {
        const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
        return provider;
      }
      async getServiceProviderByUserId(userId) {
        try {
          const result = await db.select().from(serviceProviders).where(eq(serviceProviders.userId, userId));
          if (!result || result.length === 0) {
            return void 0;
          }
          return result[0];
        } catch (error) {
          console.error("Error in getServiceProviderByUserId:", error);
          throw error;
        }
      }
      async updateServiceProvider(id, providerData) {
        const [updatedProvider] = await db.update(serviceProviders).set({
          ...providerData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceProviders.id, id)).returning();
        return updatedProvider;
      }
      async listServiceProviders(filter) {
        let query = db.select().from(serviceProviders);
        if (filter?.providerType) {
          query = query.where(eq(serviceProviders.providerType, filter.providerType));
        }
        if (filter?.status) {
          query = query.where(eq(serviceProviders.status, filter.status));
        }
        if (filter?.district) {
          query = query.where(eq(serviceProviders.district, filter.district));
        }
        return await query.orderBy(desc(serviceProviders.updatedAt));
      }
      // Farmer Detail operations
      async createFarmerDetail(detail) {
        const [newDetail] = await db.insert(farmerDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getFarmerDetail(id) {
        const [detail] = await db.select().from(farmerDetails).where(eq(farmerDetails.id, id));
        return detail;
      }
      async getFarmerDetailByProviderId(providerId) {
        const [detail] = await db.select().from(farmerDetails).where(eq(farmerDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateFarmerDetail(id, detailData) {
        const [updatedDetail] = await db.update(farmerDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(farmerDetails.id, id)).returning();
        return updatedDetail;
      }
      // Manufacturer Detail operations
      async createManufacturerDetail(detail) {
        const [newDetail] = await db.insert(manufacturerDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getManufacturerDetail(id) {
        const [detail] = await db.select().from(manufacturerDetails).where(eq(manufacturerDetails.id, id));
        return detail;
      }
      async getManufacturerDetailByProviderId(providerId) {
        const [detail] = await db.select().from(manufacturerDetails).where(eq(manufacturerDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateManufacturerDetail(id, detailData) {
        const [updatedDetail] = await db.update(manufacturerDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(manufacturerDetails.id, id)).returning();
        return updatedDetail;
      }
      // Booking Agent Detail operations
      async createBookingAgentDetail(detail) {
        const [newDetail] = await db.insert(bookingAgentDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getBookingAgentDetail(id) {
        const [detail] = await db.select().from(bookingAgentDetails).where(eq(bookingAgentDetails.id, id));
        return detail;
      }
      async getBookingAgentDetailByProviderId(providerId) {
        const [detail] = await db.select().from(bookingAgentDetails).where(eq(bookingAgentDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateBookingAgentDetail(id, detailData) {
        const [updatedDetail] = await db.update(bookingAgentDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(bookingAgentDetails.id, id)).returning();
        return updatedDetail;
      }
      // Taxi Provider operations
      async createTaxiProviderDetail(detail) {
        const [newDetail] = await db.insert(taxiProviderDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getTaxiProviderDetail(id) {
        const [detail] = await db.select().from(taxiProviderDetails).where(eq(taxiProviderDetails.id, id));
        return detail;
      }
      async getTaxiProviderDetailByProviderId(providerId) {
        const [detail] = await db.select().from(taxiProviderDetails).where(eq(taxiProviderDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateTaxiProviderDetail(id, detailData) {
        const [updatedDetail] = await db.update(taxiProviderDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiProviderDetails.id, id)).returning();
        return updatedDetail;
      }
      // Transportation Agent operations
      async createTransportationAgentDetail(detail) {
        const [newDetail] = await db.insert(transportationAgentDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getTransportationAgentDetail(id) {
        const [detail] = await db.select().from(transportationAgentDetails).where(eq(transportationAgentDetails.id, id));
        return detail;
      }
      async getTransportationAgentDetailByProviderId(providerId) {
        const [detail] = await db.select().from(transportationAgentDetails).where(eq(transportationAgentDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateTransportationAgentDetail(id, detailData) {
        const [updatedDetail] = await db.update(transportationAgentDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(transportationAgentDetails.id, id)).returning();
        return updatedDetail;
      }
      // Rental Provider operations
      async createRentalProviderDetail(detail) {
        const [newDetail] = await db.insert(rentalProviderDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getRentalProviderDetail(id) {
        const [detail] = await db.select().from(rentalProviderDetails).where(eq(rentalProviderDetails.id, id));
        return detail;
      }
      async getRentalProviderDetailByProviderId(providerId) {
        const [detail] = await db.select().from(rentalProviderDetails).where(eq(rentalProviderDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateRentalProviderDetail(id, detailData) {
        const [updatedDetail] = await db.update(rentalProviderDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(rentalProviderDetails.id, id)).returning();
        return updatedDetail;
      }
      // Recycling Agent operations
      async createRecyclingAgentDetail(detail) {
        const [newDetail] = await db.insert(recyclingAgentDetails).values({
          ...detail,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newDetail;
      }
      async getRecyclingAgentDetail(id) {
        const [detail] = await db.select().from(recyclingAgentDetails).where(eq(recyclingAgentDetails.id, id));
        return detail;
      }
      async getRecyclingAgentDetailByProviderId(providerId) {
        const [detail] = await db.select().from(recyclingAgentDetails).where(eq(recyclingAgentDetails.serviceProviderId, providerId));
        return detail;
      }
      async updateRecyclingAgentDetail(id, detailData) {
        const [updatedDetail] = await db.update(recyclingAgentDetails).set({
          ...detailData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(recyclingAgentDetails.id, id)).returning();
        return updatedDetail;
      }
      // Manager Application operations
      async createManagerApplication(application) {
        const [newApplication] = await db.insert(managerApplications).values({
          ...application,
          status: "pending",
          notes: null,
          approvedBy: null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newApplication;
      }
      async getManagerApplication(id) {
        const [application] = await db.select().from(managerApplications).where(eq(managerApplications.id, id));
        return application;
      }
      async getManagerApplications(filter) {
        let query = db.select().from(managerApplications);
        if (filter?.status) {
          query = query.where(eq(managerApplications.status, filter.status));
        }
        if (filter?.managerType) {
          query = query.where(eq(managerApplications.managerType, filter.managerType));
        }
        return await query.orderBy(desc(managerApplications.createdAt));
      }
      async updateManagerApplication(id, applicationData) {
        const [updatedApplication] = await db.update(managerApplications).set({
          ...applicationData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(managerApplications.id, id)).returning();
        return updatedApplication;
      }
      // Chat operations
      async createChatConversation(conversation) {
        const [newConversation] = await db.insert(chatConversations).values(conversation).returning();
        return newConversation;
      }
      async getChatConversation(id) {
        const [conversation] = await db.select().from(chatConversations).where(eq(chatConversations.id, id));
        return conversation;
      }
      async addUserToConversation(member) {
        const [newMember] = await db.insert(chatConversationMembers).values(member).returning();
        return newMember;
      }
      async removeUserFromConversation(conversationId, userId) {
        await db.update(chatConversationMembers).set({ leftAt: /* @__PURE__ */ new Date() }).where(
          and(
            eq(chatConversationMembers.conversationId, conversationId),
            eq(chatConversationMembers.userId, userId),
            isNull(chatConversationMembers.leftAt)
          )
        );
      }
      async getUserConversations(userId) {
        const conversationMembers = await db.select().from(chatConversationMembers).where(
          and(
            eq(chatConversationMembers.userId, userId),
            isNull(chatConversationMembers.leftAt)
          )
        );
        const conversationIds = conversationMembers.map((member) => member.conversationId);
        if (conversationIds.length === 0) {
          return [];
        }
        return await db.select().from(chatConversations).where(inArray(chatConversations.id, conversationIds)).orderBy(desc(chatConversations.updatedAt));
      }
      async getConversationMembers(conversationId) {
        const members = await db.select({
          userId: chatConversationMembers.userId
        }).from(chatConversationMembers).where(
          and(
            eq(chatConversationMembers.conversationId, conversationId),
            isNull(chatConversationMembers.leftAt)
          )
        );
        const memberIds = members.map((member) => member.userId);
        if (memberIds.length === 0) {
          return [];
        }
        return await db.select().from(users).where(inArray(users.id, memberIds));
      }
      async getConversationMembersWithDetails(conversationId) {
        return await db.select().from(chatConversationMembers).where(
          and(
            eq(chatConversationMembers.conversationId, conversationId),
            isNull(chatConversationMembers.leftAt)
          )
        );
      }
      async createChatMessage(message) {
        const [newMessage] = await db.insert(chatMessages).values(message).returning();
        await db.update(chatConversations).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq(chatConversations.id, message.conversationId));
        return newMessage;
      }
      async getMessagesForConversation(conversationId, limit = 50, before) {
        let query = db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(desc(chatMessages.createdAt)).limit(limit);
        if (before) {
          query = query.where(lt(chatMessages.id, before));
        }
        return await query;
      }
      async markMessagesAsRead(conversationId, userId) {
        const messages = await db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId));
        for (const message of messages) {
          const readBy = message.readBy;
          if (!readBy.includes(userId)) {
            await db.update(chatMessages).set({
              readBy: [...readBy, userId],
              status: "read"
            }).where(eq(chatMessages.id, message.id));
          }
        }
      }
      // Enhanced Service Provider Methods for Classification System
      async getAllServiceProviders() {
        try {
          const providers = await db.select().from(serviceProviders).leftJoin(users, eq(serviceProviders.userId, users.id)).orderBy(desc(serviceProviders.createdAt));
          return providers.map((row) => ({
            id: row.service_providers.id,
            userId: row.service_providers.userId,
            providerType: row.service_providers.providerType,
            businessName: row.service_providers.businessName,
            phone: row.service_providers.phone,
            email: row.service_providers.email,
            district: row.service_providers.district,
            status: row.service_providers.status,
            createdAt: row.service_providers.createdAt,
            adminNotes: row.service_providers.adminNotes,
            username: row.users?.username || "",
            fullName: row.users?.fullName || ""
          }));
        } catch (error) {
          console.error("Error in getAllServiceProviders:", error);
          throw error;
        }
      }
      async updateServiceProviderStatus(id, updates) {
        const [updated] = await db.update(serviceProviders).set(updates).where(eq(serviceProviders.id, id)).returning();
        return updated;
      }
      async getProviderProductCategories(providerType) {
        const categories = await db.select().from(providerProductCategories).where(eq(providerProductCategories.providerType, providerType)).orderBy(asc(providerProductCategories.categoryName));
        return categories;
      }
      async createProviderProduct(product) {
        const [created] = await db.insert(providerProducts).values(product).returning();
        return created;
      }
      async getProviderProducts(providerId) {
        const products = await db.select().from(providerProducts).where(eq(providerProducts.providerId, providerId)).orderBy(desc(providerProducts.createdAt));
        return products;
      }
      async getApprovedProviderProducts() {
        const products = await db.select().from(providerProducts).where(eq(providerProducts.adminApproved, true)).orderBy(desc(providerProducts.createdAt));
        return products;
      }
      // Local Product Categories operations
      async getLocalProductCategories() {
        return await db.select().from(localProductCategories).where(eq(localProductCategories.isActive, true)).orderBy(asc(localProductCategories.displayOrder));
      }
      async createLocalProductCategory(category) {
        const [newCategory] = await db.insert(localProductCategories).values({
          ...category,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCategory;
      }
      async getLocalProductCategory(id) {
        const [category] = await db.select().from(localProductCategories).where(eq(localProductCategories.id, id));
        return category;
      }
      async updateLocalProductCategory(id, category) {
        const [updatedCategory] = await db.update(localProductCategories).set(category).where(eq(localProductCategories.id, id)).returning();
        return updatedCategory;
      }
      // Local Product Subcategories operations  
      async getLocalProductSubcategories() {
        return await db.select().from(localProductSubCategories).where(eq(localProductSubCategories.isActive, true)).orderBy(asc(localProductSubCategories.displayOrder));
      }
      async createLocalProductSubcategory(subcategory) {
        const [newSubcategory] = await db.insert(localProductSubCategories).values({
          ...subcategory,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newSubcategory;
      }
      async getLocalProductSubcategory(id) {
        const [subcategory] = await db.select().from(localProductSubCategories).where(eq(localProductSubCategories.id, id));
        return subcategory;
      }
      async updateLocalProductSubcategory(id, subcategory) {
        const [updatedSubcategory] = await db.update(localProductSubCategories).set(subcategory).where(eq(localProductSubCategories.id, id)).returning();
        return updatedSubcategory;
      }
      // Local Product Cart operations
      async addToLocalProductCart(userId, productId, quantity) {
        await db.insert(localProductCart).values({
          userId,
          productId,
          quantity,
          createdAt: /* @__PURE__ */ new Date()
        }).onConflictDoUpdate({
          target: [localProductCart.userId, localProductCart.productId],
          set: {
            quantity: sql`${localProductCart.quantity} + ${quantity}`,
            updatedAt: /* @__PURE__ */ new Date()
          }
        });
      }
      async getLocalProductCartItems(userId) {
        const items = await db.select({
          productId: localProductCart.productId,
          quantity: localProductCart.quantity,
          productName: localProductBase.name,
          price: localProductDetails.price,
          discountedPrice: localProductDetails.discountedPrice,
          imageUrl: localProductDetails.imageUrl,
          stock: localProductDetails.stock
        }).from(localProductCart).leftJoin(localProductBase, eq(localProductCart.productId, localProductBase.id)).leftJoin(localProductDetails, eq(localProductBase.id, localProductDetails.productId)).where(eq(localProductCart.userId, userId));
        return items;
      }
      async getLocalProductCartItem(userId, productId) {
        const [item] = await db.select().from(localProductCart).where(
          and(
            eq(localProductCart.userId, userId),
            eq(localProductCart.productId, productId)
          )
        );
        return item;
      }
      async updateLocalProductCartItem(userId, productId, quantity) {
        await db.update(localProductCart).set({
          quantity,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(
          and(
            eq(localProductCart.userId, userId),
            eq(localProductCart.productId, productId)
          )
        );
      }
      async removeFromLocalProductCart(userId, productId) {
        await db.delete(localProductCart).where(
          and(
            eq(localProductCart.userId, userId),
            eq(localProductCart.productId, productId)
          )
        );
      }
      async clearLocalProductCart(userId) {
        await db.delete(localProductCart).where(eq(localProductCart.userId, userId));
      }
      // Local Product Orders operations
      async createLocalProductOrder(order) {
        const [newOrder] = await db.insert(localProductOrders).values({
          ...order,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newOrder;
      }
      async createLocalProductOrderItem(orderItem) {
        const [newOrderItem] = await db.insert(localProductOrderItems).values(orderItem).returning();
        return newOrderItem;
      }
      async getLocalProductOrdersByUser(userId) {
        return await db.select().from(localProductOrders).where(eq(localProductOrders.userId, userId)).orderBy(desc(localProductOrders.createdAt));
      }
      // Delivery management operations
      // Admin operations
      async createDeliveryCategory(category) {
        const [newCategory] = await db.insert(deliveryCategories).values({
          ...category,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCategory;
      }
      async getDeliveryCategories() {
        return await db.select().from(deliveryCategories).where(eq(deliveryCategories.isActive, true)).orderBy(asc(deliveryCategories.name));
      }
      async getDeliveryCategory(id) {
        const [category] = await db.select().from(deliveryCategories).where(eq(deliveryCategories.id, id));
        return category;
      }
      async updateDeliveryCategory(id, category) {
        const [updatedCategory] = await db.update(deliveryCategories).set({
          ...category,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deliveryCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteDeliveryCategory(id) {
        await db.delete(deliveryCategories).where(eq(deliveryCategories.id, id));
      }
      // Taxi category operations
      async createTaxiCategory(category) {
        const [newCategory] = await db.insert(taxiCategories).values({
          ...category,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCategory;
      }
      async getTaxiCategories() {
        return await db.select().from(taxiCategories).where(eq(taxiCategories.isActive, true)).orderBy(asc(taxiCategories.name));
      }
      async getTaxiCategory(id) {
        const [category] = await db.select().from(taxiCategories).where(eq(taxiCategories.id, id));
        return category;
      }
      async updateTaxiCategory(id, category) {
        const [updatedCategory] = await db.update(taxiCategories).set({
          ...category,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteTaxiCategory(id) {
        await db.delete(taxiCategories).where(eq(taxiCategories.id, id));
      }
      // Service provider operations
      async registerDeliveryAgent(agent) {
        const [newAgent] = await db.insert(deliveryAgents).values({
          ...agent,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newAgent;
      }
      async getDeliveryAgentByUserId(userId) {
        const [agent] = await db.select().from(deliveryAgents).where(eq(deliveryAgents.userId, userId));
        return agent;
      }
      async getDeliveryAgentsForApproval() {
        return await db.select().from(deliveryAgents).where(eq(deliveryAgents.adminApproved, false)).orderBy(desc(deliveryAgents.createdAt));
      }
      async getAllDeliveryAgents() {
        return await db.select().from(deliveryAgents).orderBy(desc(deliveryAgents.createdAt));
      }
      async getApprovedDeliveryAgents() {
        return await db.select().from(deliveryAgents).where(eq(deliveryAgents.adminApproved, true)).orderBy(desc(deliveryAgents.createdAt));
      }
      async approveDeliveryAgent(id, approved) {
        const [updatedAgent] = await db.update(deliveryAgents).set({
          adminApproved: approved,
          verificationStatus: approved ? "verified" : "rejected",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deliveryAgents.id, id)).returning();
        return updatedAgent;
      }
      async updateDeliveryAgent(id, agent) {
        const [updatedAgent] = await db.update(deliveryAgents).set({
          ...agent,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deliveryAgents.id, id)).returning();
        return updatedAgent;
      }
      async getDeliveryAgentsByLocation(district, taluk, pincode) {
        let whereConditions = [
          eq(deliveryAgents.adminApproved, true),
          eq(deliveryAgents.isOnline, true),
          eq(deliveryAgents.isAvailable, true)
        ];
        if (district) {
          whereConditions.push(sql`operation_areas::text LIKE ${`%${district}%`}`);
        }
        if (taluk) {
          whereConditions.push(sql`operation_areas::text LIKE ${`%${taluk}%`}`);
        }
        if (pincode) {
          whereConditions.push(sql`operation_areas::text LIKE ${`%${pincode}%`}`);
        }
        return await db.select().from(deliveryAgents).where(and(...whereConditions)).orderBy(desc(deliveryAgents.rating));
      }
      async updateDeliveryAgentStatus(id, isOnline, isAvailable) {
        const [updatedAgent] = await db.update(deliveryAgents).set({
          isOnline,
          isAvailable,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deliveryAgents.id, id)).returning();
        return updatedAgent;
      }
      // Customer operations
      async createDeliveryOrder(order) {
        const [newOrder] = await db.insert(deliveryOrders).values({
          ...order,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newOrder;
      }
      async getDeliveryOrdersByCustomerId(customerId) {
        return await db.select().from(deliveryOrders).where(eq(deliveryOrders.customerId, customerId)).orderBy(desc(deliveryOrders.createdAt));
      }
      async getDeliveryOrdersByAgentId(agentId) {
        return await db.select().from(deliveryOrders).where(eq(deliveryOrders.agent_id, agentId)).orderBy(desc(deliveryOrders.createdAt));
      }
      async getDeliveryOrder(id) {
        const [order] = await db.select().from(deliveryOrders).where(eq(deliveryOrders.id, id));
        return order;
      }
      async updateDeliveryOrder(id, order) {
        const [updatedOrder] = await db.update(deliveryOrders).set({
          ...order,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deliveryOrders.id, id)).returning();
        return updatedOrder;
      }
      async assignDeliveryOrder(orderId, agentId) {
        const [assignedOrder] = await db.update(deliveryOrders).set({
          agentId,
          status: "assigned",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(deliveryOrders.id, orderId)).returning();
        return assignedOrder;
      }
      // Taxi category operations
      async createTaxiCategory(category) {
        const [newCategory] = await db.insert(taxiCategories).values({
          ...category,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCategory;
      }
      async getTaxiCategories() {
        return await db.select().from(taxiCategories).orderBy(taxiCategories.name);
      }
      async getTaxiCategory(id) {
        const [category] = await db.select().from(taxiCategories).where(eq(taxiCategories.id, id));
        return category;
      }
      async updateTaxiCategory(id, category) {
        const [updatedCategory] = await db.update(taxiCategories).set({
          ...category,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteTaxiCategory(id) {
        await db.delete(taxiCategories).where(eq(taxiCategories.id, id));
      }
      // Taxi vehicle operations
      async createTaxiVehicle(vehicle) {
        const [newVehicle] = await db.insert(taxiVehicles).values({
          ...vehicle,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newVehicle;
      }
      async getTaxiVehicle(id) {
        const [vehicle] = await db.select().from(taxiVehicles).where(eq(taxiVehicles.id, id));
        return vehicle;
      }
      async getTaxiVehiclesByProvider(providerId) {
        return await db.select().from(taxiVehicles).where(eq(taxiVehicles.providerId, providerId));
      }
      async updateTaxiVehicle(id, vehicle) {
        const [updatedVehicle] = await db.update(taxiVehicles).set({
          ...vehicle,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiVehicles.id, id)).returning();
        return updatedVehicle;
      }
      async getAvailableTaxiVehicles(filters) {
        const query = db.select().from(taxiVehicles);
        return await query.where(eq(taxiVehicles.adminApproved, true));
      }
      async getAllTaxiVehicles() {
        return await db.select().from(taxiVehicles).orderBy(desc(taxiVehicles.createdAt));
      }
      async getApprovedTaxiVehicles() {
        return await db.select().from(taxiVehicles).where(eq(taxiVehicles.adminApproved, true)).orderBy(desc(taxiVehicles.createdAt));
      }
      async getTaxiVehiclesWithProviders() {
        const vehicles = await db.select({
          id: taxiVehicles.id,
          vehicleNumber: taxiVehicles.vehicleNumber,
          vehicleType: taxiVehicles.vehicleType,
          brand: taxiVehicles.brand,
          model: taxiVehicles.model,
          year: taxiVehicles.year,
          color: taxiVehicles.color,
          seatingCapacity: taxiVehicles.seatingCapacity,
          fuelType: taxiVehicles.fuelType,
          acAvailable: taxiVehicles.acAvailable,
          gpsEnabled: taxiVehicles.gpsEnabled,
          insuranceValid: taxiVehicles.insuranceValid,
          pucValid: taxiVehicles.pucValid,
          baseFarePerKm: taxiVehicles.baseFarePerKm,
          baseWaitingCharge: taxiVehicles.baseWaitingCharge,
          district: taxiVehicles.district,
          pincode: taxiVehicles.pincode,
          currentLocation: taxiVehicles.currentLocation,
          status: taxiVehicles.status,
          adminApproved: taxiVehicles.adminApproved,
          imageUrl: taxiVehicles.imageUrl,
          providerId: taxiVehicles.providerId,
          // Provider fields
          providerName: serviceProviders.name,
          providerUsername: users.username,
          providerPhoneNumber: serviceProviders.phoneNumber,
          providerDistrict: serviceProviders.district,
          providerTaluk: serviceProviders.taluk,
          providerPincode: serviceProviders.pincode,
          providerAdminApproved: serviceProviders.adminApproved,
          providerUserId: serviceProviders.userId
        }).from(taxiVehicles).leftJoin(serviceProviders, eq(taxiVehicles.providerId, serviceProviders.id)).leftJoin(users, eq(serviceProviders.userId, users.id)).orderBy(desc(taxiVehicles.createdAt));
        return vehicles.map((vehicle) => ({
          id: vehicle.id,
          vehicleNumber: vehicle.vehicleNumber,
          vehicleType: vehicle.vehicleType,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          seatingCapacity: vehicle.seatingCapacity,
          fuelType: vehicle.fuelType,
          acAvailable: vehicle.acAvailable,
          gpsEnabled: vehicle.gpsEnabled,
          insuranceValid: vehicle.insuranceValid,
          pucValid: vehicle.pucValid,
          baseFarePerKm: vehicle.baseFarePerKm,
          baseWaitingCharge: vehicle.baseWaitingCharge,
          district: vehicle.district,
          pincode: vehicle.pincode,
          currentLocation: vehicle.currentLocation,
          status: vehicle.status,
          adminApproved: vehicle.adminApproved,
          imageUrl: vehicle.imageUrl,
          providerId: vehicle.providerId,
          provider: vehicle.providerUserId ? {
            id: vehicle.providerUserId,
            username: vehicle.providerUsername,
            name: vehicle.providerName,
            phoneNumber: vehicle.providerPhoneNumber,
            district: vehicle.providerDistrict,
            taluk: vehicle.providerTaluk,
            pincode: vehicle.providerPincode,
            adminApproved: vehicle.providerAdminApproved
          } : null
        }));
      }
      async getTaxiCategories() {
        try {
          return await db.select().from(taxiCategories).where(eq(taxiCategories.isActive, true)).orderBy(asc(taxiCategories.name));
        } catch (error) {
          console.log("Using fallback taxi categories");
          return [
            { id: 1, name: "Two Wheeler", description: "Motorcycles and scooters", isActive: true, baseFarePerKm: 8, baseWaitingCharge: 2 },
            { id: 2, name: "Three Wheeler", description: "Auto rickshaws", isActive: true, baseFarePerKm: 12, baseWaitingCharge: 3 },
            { id: 3, name: "4 Seaters", description: "Compact cars", isActive: true, baseFarePerKm: 15, baseWaitingCharge: 5 },
            { id: 4, name: "6 Seaters", description: "SUVs and larger cars", isActive: true, baseFarePerKm: 18, baseWaitingCharge: 7 },
            { id: 5, name: "12 Seaters", description: "Mini buses and tempo travelers", isActive: true, baseFarePerKm: 25, baseWaitingCharge: 10 }
          ];
        }
      }
      async getTaluksByDistrict(district) {
        const results = await db.selectDistinct({ taluk: serviceProviders.taluk }).from(serviceProviders).where(and(
          eq(serviceProviders.district, district),
          isNotNull(serviceProviders.taluk)
        )).orderBy(asc(serviceProviders.taluk));
        return results.map((r) => r.taluk).filter(Boolean);
      }
      async getPincodesByDistrictAndTaluk(district, taluk) {
        const results = await db.selectDistinct({ pincode: serviceProviders.pincode }).from(serviceProviders).where(and(
          eq(serviceProviders.district, district),
          eq(serviceProviders.taluk, taluk),
          isNotNull(serviceProviders.pincode)
        )).orderBy(asc(serviceProviders.pincode));
        return results.map((r) => r.pincode).filter(Boolean);
      }
      async getTaxiVehiclesForApproval() {
        return await db.select().from(taxiVehicles).where(eq(taxiVehicles.adminApproved, false)).orderBy(desc(taxiVehicles.createdAt));
      }
      async approveTaxiVehicle(id, approved) {
        const [updatedVehicle] = await db.update(taxiVehicles).set({
          adminApproved: approved,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiVehicles.id, id)).returning();
        return updatedVehicle;
      }
      async updateTaxiVehicleStatus(id, isActive) {
        const [updatedVehicle] = await db.update(taxiVehicles).set({
          isActive,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiVehicles.id, id)).returning();
        return updatedVehicle;
      }
      // Taxi booking operations
      async createTaxiBooking(booking) {
        const [newBooking] = await db.insert(taxiBookings).values({
          ...booking,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newBooking;
      }
      async getTaxiBooking(id) {
        const [booking] = await db.select().from(taxiBookings).where(eq(taxiBookings.id, id));
        return booking;
      }
      async getTaxiBookingsByCustomer(customerId) {
        return await db.select().from(taxiBookings).where(eq(taxiBookings.customerId, customerId));
      }
      async getTaxiBookingsByProvider(providerId) {
        return await db.select().from(taxiBookings).where(eq(taxiBookings.providerId, providerId));
      }
      async updateTaxiBookingStatus(id, status, providerId) {
        const [updatedBooking] = await db.update(taxiBookings).set({
          status,
          providerId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiBookings.id, id)).returning();
        return updatedBooking;
      }
      async getAllTaxiBookings() {
        return await db.select().from(taxiBookings).orderBy(desc(taxiBookings.createdAt));
      }
      // Taxi category operations implementation
      async createTaxiCategory(category) {
        const [newCategory] = await db.insert(taxiCategories).values({
          ...category,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCategory;
      }
      async getTaxiCategories() {
        return await db.select().from(taxiCategories).orderBy(asc(taxiCategories.name));
      }
      async getTaxiCategory(id) {
        const [category] = await db.select().from(taxiCategories).where(eq(taxiCategories.id, id));
        return category;
      }
      async updateTaxiCategory(id, category) {
        const [updatedCategory] = await db.update(taxiCategories).set({
          ...category,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiCategories.id, id)).returning();
        return updatedCategory;
      }
      async deleteTaxiCategory(id) {
        await db.delete(taxiCategories).where(eq(taxiCategories.id, id));
      }
      // Taxi service provider operations implementation
      async getTaxiProviders() {
        return await db.select().from(serviceProviders).where(eq(serviceProviders.providerType, "taxi_service")).orderBy(desc(serviceProviders.createdAt));
      }
      async updateServiceProviderStatus(id, status) {
        const [updatedProvider] = await db.update(serviceProviders).set({
          status,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceProviders.id, id)).returning();
        return updatedProvider;
      }
      // Taxi vehicle operations implementation
      async getTaxiVehicles() {
        return await db.select().from(taxiVehicles).orderBy(desc(taxiVehicles.createdAt));
      }
      async createTaxiVehicle(vehicle) {
        const [newVehicle] = await db.insert(taxiVehicles).values({
          ...vehicle,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newVehicle;
      }
      async approveTaxiVehicle(id) {
        const [updatedVehicle] = await db.update(taxiVehicles).set({
          adminApproved: true,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(taxiVehicles.id, id)).returning();
        return updatedVehicle;
      }
      // Taxi booking operations implementation
      async createTaxiBooking(booking) {
        const [newBooking] = await db.insert(taxiBookings).values({
          ...booking,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newBooking;
      }
      // Service Request Management System Implementation
      async createServiceRequest(serviceRequest) {
        console.log("STORAGE DEBUG - Service request data received:", serviceRequest);
        console.log("STORAGE DEBUG - userId specifically:", serviceRequest.userId);
        console.log("STORAGE DEBUG - serviceRequest type:", typeof serviceRequest.userId);
        if (!serviceRequest.userId || serviceRequest.userId <= 0) {
          throw new Error(`Invalid userId provided: ${serviceRequest.userId}`);
        }
        const amount = typeof serviceRequest.amount === "string" ? serviceRequest.amount : String(serviceRequest.amount);
        const insertData = {
          srNumber: serviceRequest.srNumber,
          userId: Number(serviceRequest.userId),
          serviceType: serviceRequest.serviceType,
          amount,
          status: serviceRequest.status || "new",
          paymentStatus: serviceRequest.paymentStatus || "pending",
          paymentMethod: serviceRequest.paymentMethod || "razorpay",
          serviceData: serviceRequest.serviceData,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        console.log("STORAGE DEBUG - Final insert data:", insertData);
        console.log("STORAGE DEBUG - Final insert userId type and value:", typeof insertData.userId, insertData.userId);
        const [newRequest] = await db.insert(serviceRequests).values(insertData).returning();
        console.log("STORAGE DEBUG - Created service request:", newRequest);
        return newRequest;
      }
      async getServiceRequest(id) {
        const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
        return request;
      }
      async getServiceRequestByNumber(srNumber) {
        const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.srNumber, srNumber));
        return request;
      }
      async getServiceRequestsByCustomer(customerId) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.userId, customerId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getAllServiceRequests() {
        return await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
      }
      async assignServiceRequestStakeholder(serviceRequestId, stakeholderType, stakeholderId) {
        const updateData = {};
        switch (stakeholderType) {
          case "pincode_agent":
            updateData.pincodeAgentId = stakeholderId;
            break;
          case "taluk_manager":
            updateData.talukManagerId = stakeholderId;
            break;
          case "branch_manager":
            updateData.branchManagerId = stakeholderId;
            break;
          case "assigned_to":
            updateData.assignedTo = stakeholderId;
            break;
          default:
            throw new Error("Invalid stakeholder type");
        }
        updateData.updatedAt = /* @__PURE__ */ new Date();
        const [updated] = await db.update(serviceRequests).set(updateData).where(eq(serviceRequests.id, serviceRequestId)).returning();
        return updated;
      }
      async getServiceRequestsByAgent(agentId) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.pincodeAgentId, agentId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByManager(managerId) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.talukManagerId, managerId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByBranchManager(branchManagerId) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.branchManagerId, branchManagerId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByProvider(providerId) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.assignedTo, providerId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByAgent(agentId) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.assignedAgentId, agentId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByManager(managerId, managerType) {
        const managerField = managerType === "taluk" ? serviceRequests.talukManagerId : serviceRequests.branchManagerId;
        return await db.select().from(serviceRequests).where(eq(managerField, managerId)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByDistrict(district) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.district, district)).orderBy(desc(serviceRequests.createdAt));
      }
      async getServiceRequestsByStatus(status) {
        return await db.select().from(serviceRequests).where(eq(serviceRequests.status, status)).orderBy(desc(serviceRequests.createdAt));
      }
      async updateServiceRequestStatus(id, newStatus, updatedBy, reason, notes) {
        const [updatedRequest] = await db.update(serviceRequests).set({
          status: newStatus,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceRequests.id, id)).returning();
        if (updatedRequest) {
          await this.createServiceRequestStatusUpdate({
            serviceRequestId: id,
            fromStatus: updatedRequest.status,
            toStatus: newStatus,
            updatedBy,
            reason,
            notes
          });
        }
        return updatedRequest;
      }
      async updateServiceRequestPayment(id, paymentId, paymentStatus) {
        const [updatedRequest] = await db.update(serviceRequests).set({
          paymentId,
          paymentStatus,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceRequests.id, id)).returning();
        return updatedRequest;
      }
      async assignServiceRequestToAgent(id, agentId) {
        const [updatedRequest] = await db.update(serviceRequests).set({
          assignedAgentId: agentId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(serviceRequests.id, id)).returning();
        return updatedRequest;
      }
      // Service Request Status Updates
      async createServiceRequestStatusUpdate(update) {
        const [newUpdate] = await db.insert(serviceRequestStatusUpdates).values({
          ...update,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newUpdate;
      }
      async getServiceRequestStatusHistory(serviceRequestId) {
        return await db.select().from(serviceRequestStatusUpdates).where(eq(serviceRequestStatusUpdates.serviceRequestId, serviceRequestId)).orderBy(desc(serviceRequestStatusUpdates.createdAt));
      }
      // Service Request Commission Management
      async createServiceRequestCommissionTransaction(commission) {
        const [newCommission] = await db.insert(serviceRequestCommissionTransactions).values({
          ...commission,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCommission;
      }
      async getServiceRequestCommissions(serviceRequestId) {
        return await db.select().from(serviceRequestCommissionTransactions).where(eq(serviceRequestCommissionTransactions.serviceRequestId, serviceRequestId)).orderBy(desc(serviceRequestCommissionTransactions.createdAt));
      }
      async distributeServiceRequestCommissions(serviceRequestId) {
        const serviceRequest = await this.getServiceRequest(serviceRequestId);
        if (!serviceRequest) return [];
        const commissions2 = [];
        const totalAmount = serviceRequest.amount;
        const commissionRates = {
          agent: 0.02,
          // 2%
          talukManager: 0.01,
          // 1%
          branchManager: 5e-3,
          // 0.5%
          admin: 5e-3
          // 0.5%
        };
        if (serviceRequest.assignedAgentId) {
          const agentCommission = await this.createServiceRequestCommissionTransaction({
            serviceRequestId,
            userId: serviceRequest.assignedAgentId,
            userType: "agent",
            amount: totalAmount * commissionRates.agent,
            commissionRate: commissionRates.agent,
            status: "pending"
          });
          commissions2.push(agentCommission);
        }
        if (serviceRequest.talukManagerId) {
          const talukCommission = await this.createServiceRequestCommissionTransaction({
            serviceRequestId,
            userId: serviceRequest.talukManagerId,
            userType: "taluk_manager",
            amount: totalAmount * commissionRates.talukManager,
            commissionRate: commissionRates.talukManager,
            status: "pending"
          });
          commissions2.push(talukCommission);
        }
        if (serviceRequest.branchManagerId) {
          const branchCommission = await this.createServiceRequestCommissionTransaction({
            serviceRequestId,
            userId: serviceRequest.branchManagerId,
            userType: "branch_manager",
            amount: totalAmount * commissionRates.branchManager,
            commissionRate: commissionRates.branchManager,
            status: "pending"
          });
          commissions2.push(branchCommission);
        }
        return commissions2;
      }
      // Service Request Notifications
      async createServiceRequestNotification(notification) {
        const [newNotification] = await db.insert(serviceRequestNotifications).values({
          ...notification,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newNotification;
      }
      async getServiceRequestNotificationsByUser(userId) {
        return await db.select().from(serviceRequestNotifications).where(eq(serviceRequestNotifications.userId, userId)).orderBy(desc(serviceRequestNotifications.createdAt));
      }
      async markServiceRequestNotificationAsRead(id) {
        await db.update(serviceRequestNotifications).set({ isRead: true }).where(eq(serviceRequestNotifications.id, id));
      }
      // Auto-generate SR Number
      async generateServiceRequestNumber() {
        const today = /* @__PURE__ */ new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const startOfDay = new Date(year, today.getMonth(), today.getDate());
        const endOfDay = new Date(year, today.getMonth(), today.getDate() + 1);
        const count = await db.select().from(serviceRequests).where(and(
          sql`${serviceRequests.createdAt} >= ${startOfDay}`,
          sql`${serviceRequests.createdAt} < ${endOfDay}`
        ));
        const sequence = String(count.length + 1).padStart(4, "0");
        return `SR${year}${month}${day}${sequence}`;
      }
      // ===== VIDEO MANAGEMENT OPERATIONS =====
      // Video operations
      async createVideo(video) {
        const [newVideo] = await db.insert(videos).values({
          ...video,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          viewCount: 0
        }).returning();
        return newVideo;
      }
      async getVideo(id) {
        const [video] = await db.select().from(videos).where(eq(videos.id, id));
        return video || void 0;
      }
      async getVideosByUploader(uploaderId) {
        return await db.select().from(videos).where(eq(videos.uploadedBy, uploaderId)).orderBy(desc(videos.createdAt));
      }
      async getVideosByCategory(category) {
        return await db.select().from(videos).where(and(
          eq(videos.category, category),
          eq(videos.status, "active")
        )).orderBy(desc(videos.createdAt));
      }
      async getAllVideos(limit = 20, offset = 0) {
        return await db.select().from(videos).where(eq(videos.status, "active")).orderBy(desc(videos.createdAt)).limit(limit).offset(offset);
      }
      async getPublicVideos(limit = 20, offset = 0) {
        return await db.select().from(videos).where(and(
          eq(videos.isPublic, true),
          eq(videos.status, "active")
        )).orderBy(desc(videos.createdAt)).limit(limit).offset(offset);
      }
      async updateVideo(id, updates) {
        const [updatedVideo] = await db.update(videos).set({
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(videos.id, id)).returning();
        return updatedVideo || void 0;
      }
      async deleteVideo(id) {
        await db.delete(videoViews).where(eq(videoViews.videoId, id));
        await db.delete(videos).where(eq(videos.id, id));
      }
      async incrementVideoViews(id) {
        await db.update(videos).set({
          viewCount: sql`${videos.viewCount} + 1`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(videos.id, id));
      }
      // Video View operations
      async createVideoView(view) {
        const [newView] = await db.insert(videoViews).values({
          ...view,
          viewedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newView;
      }
      async getVideoViews(videoId) {
        return await db.select().from(videoViews).where(eq(videoViews.videoId, videoId)).orderBy(desc(videoViews.viewedAt));
      }
      async getUserVideoViews(userId) {
        return await db.select().from(videoViews).where(eq(videoViews.userId, userId)).orderBy(desc(videoViews.viewedAt));
      }
      // Application Management Operations
      async createApplication(application) {
        const [newApplication] = await db.insert(applications).values(application).returning();
        return newApplication;
      }
      async getApplication(id) {
        const [application] = await db.select().from(applications).where(eq(applications.id, id));
        return application;
      }
      async getApplicationsByStatus(status) {
        return await db.select().from(applications).where(eq(applications.status, status)).orderBy(desc(applications.appliedAt));
      }
      async getAllApplications() {
        return await db.select().from(applications).orderBy(desc(applications.appliedAt));
      }
      async updateApplication(id, updates) {
        const [updatedApplication] = await db.update(applications).set(updates).where(eq(applications.id, id)).returning();
        return updatedApplication;
      }
      async getApplicationsByRole(roleType) {
        return await db.select().from(applications).where(eq(applications.roleType, roleType)).orderBy(desc(applications.appliedAt));
      }
      async getApplicationsByLocation(district, taluk, pincode) {
        let whereConditions = [eq(applications.district, district)];
        if (taluk) {
          whereConditions.push(eq(applications.taluk, taluk));
        }
        if (pincode) {
          whereConditions.push(eq(applications.pincode, pincode));
        }
        return await db.select().from(applications).where(and(...whereConditions)).orderBy(desc(applications.appliedAt));
      }
      // Opportunities Forum Operations
      async getDistricts() {
        const result = await db.selectDistinct({ district: users.district }).from(users).where(isNotNull(users.district)).orderBy(users.district);
        return result.map((r) => r.district).filter(Boolean);
      }
      async getTaluksByDistrict(district) {
        const result = await db.selectDistinct({ taluk: users.taluk }).from(users).where(and(
          eq(users.district, district),
          isNotNull(users.taluk)
        )).orderBy(users.taluk);
        return result.map((r) => ({ name: r.taluk })).filter((r) => r.name);
      }
      async getPincodesByTaluk(taluk, district) {
        const result = await db.selectDistinct({ pincode: users.pincode }).from(users).where(and(
          eq(users.district, district),
          eq(users.taluk, taluk),
          isNotNull(users.pincode)
        )).orderBy(users.pincode);
        return result.map((r) => r.pincode).filter(Boolean);
      }
      async createNomination(nomination) {
        const [newNomination] = await db.insert(nominations).values(nomination).returning();
        return newNomination;
      }
      async getNominations() {
        return await db.select().from(nominations).orderBy(desc(nominations.createdAt));
      }
      async updateNominationStatus(id, status, adminResponse, reviewedBy) {
        const [updatedNomination] = await db.update(nominations).set({
          status,
          adminResponse,
          reviewedBy,
          reviewedAt: /* @__PURE__ */ new Date()
        }).where(eq(nominations.id, id)).returning();
        return updatedNomination;
      }
      async getAllNominations() {
        return await db.select().from(nominations).orderBy(desc(nominations.submittedAt));
      }
      async getApprovedNominations() {
        return await db.select().from(nominations).where(eq(nominations.status, "approved")).orderBy(desc(nominations.submittedAt));
      }
      async updateNominationOtpVerified(phoneNumber) {
        await db.update(nominations).set({ otpVerified: true }).where(eq(nominations.phoneNumber, phoneNumber));
      }
      async linkNominationToUser(id, userId, profilePhoto) {
        const [updatedNomination] = await db.update(nominations).set({ userId, profilePhoto }).where(eq(nominations.id, id)).returning();
        return updatedNomination;
      }
      async createOtpVerification(otpData) {
        const [newOtp] = await db.insert(otpVerifications).values(otpData).returning();
        return newOtp;
      }
      async verifyOtp(phoneNumber, otp, purpose) {
        const [verification] = await db.select().from(otpVerifications).where(
          and(
            eq(otpVerifications.phoneNumber, phoneNumber),
            eq(otpVerifications.otp, otp),
            eq(otpVerifications.purpose, purpose),
            eq(otpVerifications.verified, false)
          )
        ).orderBy(desc(otpVerifications.createdAt)).limit(1);
        if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
          return false;
        }
        await db.update(otpVerifications).set({ verified: true }).where(eq(otpVerifications.id, verification.id));
        return true;
      }
      async createPublicMessage(messageData) {
        const [newMessage] = await db.insert(publicMessages).values(messageData).returning();
        return newMessage;
      }
      async getPublicMessages(nominationId) {
        return await db.select().from(publicMessages).where(eq(publicMessages.nominationId, nominationId)).orderBy(asc(publicMessages.createdAt));
      }
      // Bus Booking Operations
      async createBusBooking(booking) {
        const [newBooking] = await db.insert(busBookings).values({
          ...booking,
          bookingDate: /* @__PURE__ */ new Date()
        }).returning();
        return newBooking;
      }
      async getBusBooking(id) {
        const [booking] = await db.select().from(busBookings).where(eq(busBookings.id, id));
        return booking;
      }
      async getBusBookingsByUserId(userId) {
        return await db.select().from(busBookings).where(eq(busBookings.userId, userId)).orderBy(desc(busBookings.bookingDate));
      }
      async getAllBusBookings() {
        return await db.select().from(busBookings).orderBy(desc(busBookings.bookingDate));
      }
      async updateBusBooking(id, updates) {
        const [updatedBooking] = await db.update(busBookings).set(updates).where(eq(busBookings.id, id)).returning();
        return updatedBooking;
      }
      // Flight Booking Operations
      async createFlightBooking(booking) {
        const [newBooking] = await db.insert(flightBookings).values({
          ...booking,
          bookingDate: /* @__PURE__ */ new Date()
        }).returning();
        return newBooking;
      }
      async getFlightBooking(id) {
        const [booking] = await db.select().from(flightBookings).where(eq(flightBookings.id, id));
        return booking;
      }
      async getFlightBookingsByUserId(userId) {
        return await db.select().from(flightBookings).where(eq(flightBookings.userId, userId)).orderBy(desc(flightBookings.bookingDate));
      }
      async getAllFlightBookings() {
        return await db.select().from(flightBookings).orderBy(desc(flightBookings.bookingDate));
      }
      async updateFlightBooking(id, updates) {
        const [updatedBooking] = await db.update(flightBookings).set(updates).where(eq(flightBookings.id, id)).returning();
        return updatedBooking;
      }
      // Hotel Booking Operations
      async createHotelBooking(booking) {
        const [newBooking] = await db.insert(hotelBookings).values({
          ...booking,
          bookingDate: /* @__PURE__ */ new Date()
        }).returning();
        return newBooking;
      }
      async getHotelBooking(id) {
        const [booking] = await db.select().from(hotelBookings).where(eq(hotelBookings.id, id));
        return booking;
      }
      async getHotelBookingsByUserId(userId) {
        return await db.select().from(hotelBookings).where(eq(hotelBookings.userId, userId)).orderBy(desc(hotelBookings.bookingDate));
      }
      async getAllHotelBookings() {
        return await db.select().from(hotelBookings).orderBy(desc(hotelBookings.bookingDate));
      }
      async updateHotelBooking(id, updates) {
        const [updatedBooking] = await db.update(hotelBookings).set(updates).where(eq(hotelBookings.id, id)).returning();
        return updatedBooking;
      }
      async distributeBusCommissions(bookingId, userId, commissionStructure) {
        for (const [role, amount] of Object.entries(commissionStructure)) {
          if (amount > 0) {
            await this.createCommission({
              userId,
              amount,
              type: "bus_commission",
              description: `Bus booking commission - ${role}`,
              serviceType: "bus_booking",
              serviceId: bookingId,
              status: "pending"
            });
          }
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/services/commissionService.ts
var DEFAULT_COMMISSION_RATES, CommissionService, commissionService;
var init_commissionService = __esm({
  "server/services/commissionService.ts"() {
    "use strict";
    init_storage();
    DEFAULT_COMMISSION_RATES = {
      admin: 0.5,
      // 0.5%
      branch_manager: 0.5,
      // 0.5%
      taluk_manager: 1,
      // 1.0%
      service_agent: 3,
      // 3.0%
      user: 1
      // 1.0% for registered users
    };
    CommissionService = class {
      /**
       * Distribute commissions for a transaction - wrapper method for calculateAndDistributeCommissions
       * that handles service-specific commission distribution
       * @param serviceType Type of service (recharge, booking, etc.)
       * @param transactionId ID of the transaction
       * @param amount Transaction amount
       * @param provider Optional provider name
       */
      async distributeCommissions(serviceType, transactionId, amount, provider) {
        console.log(`[Commission] Starting distribution for ${serviceType} transaction ${transactionId}, amount ${amount}, provider ${provider || "N/A"}`);
        try {
          const result = await this.calculateAndDistributeCommissions(serviceType, transactionId, amount, provider);
          console.log(`[Commission] Distribution completed successfully:`, result);
          return result;
        } catch (error) {
          console.error(`[Commission] Distribution failed:`, error);
          throw error;
        }
      }
      /**
       * Get default commission rates
       */
      async getCommissionRates() {
        return DEFAULT_COMMISSION_RATES;
      }
      /**
       * Initialize default commission configurations for different service types
       * This ensures configs exist for all primary service types
       */
      async initializeDefaultConfigs() {
        try {
          const serviceTypes = ["recharge", "booking", "grocery", "travel", "rental", "taxi", "delivery"];
          for (const serviceType of serviceTypes) {
            const existingConfig = await storage.getCommissionConfigByService(serviceType);
            if (!existingConfig) {
              console.log(`Creating default commission config for service type: ${serviceType}`);
              await storage.createCommissionConfig({
                serviceType,
                adminCommission: DEFAULT_COMMISSION_RATES.admin,
                branchManagerCommission: DEFAULT_COMMISSION_RATES.branch_manager,
                talukManagerCommission: DEFAULT_COMMISSION_RATES.taluk_manager,
                serviceAgentCommission: DEFAULT_COMMISSION_RATES.service_agent,
                registeredUserCommission: DEFAULT_COMMISSION_RATES.user
              });
            }
          }
          return { success: true, message: "Default commission configurations initialized" };
        } catch (error) {
          console.error("Error initializing default commission configs:", error);
          throw error;
        }
      }
      /**
       * Get commission statistics for a user
       * 
       * @param userId User ID
       */
      async getUserCommissionStats(userId) {
        try {
          const commissionTransactions2 = await storage.getCommissionTransactionsByUserId(userId);
          const totalCommissionsEarned = commissionTransactions2.reduce(
            (sum, transaction) => sum + transaction.commissionAmount,
            0
          );
          const rechargeTransactions = commissionTransactions2.filter(
            (transaction) => transaction.serviceType === "recharge"
          );
          const bookingTransactions = commissionTransactions2.filter(
            (transaction) => transaction.serviceType === "booking"
          );
          const recentCommissions = commissionTransactions2.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          }).slice(0, 5);
          const pendingCommissions = commissionTransactions2.filter(
            (transaction) => transaction.status === "pending"
          );
          return {
            totalCommissionsEarned,
            totalRecharges: rechargeTransactions.length,
            totalBookings: bookingTransactions.length,
            recentCommissions,
            pendingCommissions
          };
        } catch (error) {
          console.error("Error getting user commission stats:", error);
          throw error;
        }
      }
      /**
       * Get all wallet balances for the hierarchy (for admin dashboard)
       */
      async getHierarchyWalletBalances() {
        try {
          const testUser = await storage.getUserByUsername("testuser");
          const serviceAgent = await storage.getUserByUsernameStartingWith("sa_chennai_chennai_north_600001");
          const talukManager = await storage.getUserByUsernameStartingWith("tm_chennai_chennai_north");
          const branchManager = await storage.getUserByUsernameStartingWith("bm_chennai");
          const admin = await storage.getUserByType("admin");
          return {
            testUser: testUser ? {
              id: testUser.id,
              username: testUser.username,
              walletBalance: testUser.walletBalance || 0
            } : null,
            serviceAgent: serviceAgent ? {
              id: serviceAgent.id,
              username: serviceAgent.username,
              walletBalance: serviceAgent.walletBalance || 0
            } : null,
            talukManager: talukManager ? {
              id: talukManager.id,
              username: talukManager.username,
              walletBalance: talukManager.walletBalance || 0
            } : null,
            branchManager: branchManager ? {
              id: branchManager.id,
              username: branchManager.username,
              walletBalance: branchManager.walletBalance || 0
            } : null,
            admin: admin ? {
              id: admin.id,
              username: admin.username,
              walletBalance: admin.walletBalance || 0
            } : null
          };
        } catch (error) {
          console.error("Error getting hierarchy wallet balances:", error);
          throw error;
        }
      }
      /**
       * Get pending commissions that need to be approved
       */
      async getPendingCommissions() {
        return await storage.getPendingCommissionTransactions();
      }
      /**
       * Mark commissions as paid
       * 
       * @param commissionIds Array of commission transaction IDs to mark as paid
       */
      async markCommissionsAsPaid(commissionIds) {
        try {
          for (const id of commissionIds) {
            await storage.updateCommissionTransactionStatus(id, "paid");
          }
          return { success: true, processedCount: commissionIds.length };
        } catch (error) {
          console.error("Error marking commissions as paid:", error);
          throw error;
        }
      }
      /**
       * Manually distribute commissions for a specific recharge transaction
       * This is useful for fixing recharges that didn't have commissions properly distributed
       * 
       * @param rechargeId ID of the recharge to process
       */
      async manuallyDistributeCommissionsForRecharge(rechargeId) {
        try {
          console.log(`[Commission] Starting manual distribution for recharge ID: ${rechargeId}`);
          const recharge = await storage.getRecharge(rechargeId);
          if (!recharge) {
            throw new Error(`Recharge not found for ID: ${rechargeId}`);
          }
          if (recharge.status !== "success") {
            throw new Error(`Cannot distribute commissions for a recharge with status: ${recharge.status}`);
          }
          const existingCommissions = await storage.getCommissionTransactionsByReference("recharge", rechargeId);
          if (existingCommissions && existingCommissions.length > 0) {
            console.log(`[Commission] Found ${existingCommissions.length} existing commission transactions for recharge ${rechargeId}`);
            console.log(`[Commission] WARNING: Redistributing commissions for recharge ${rechargeId}`);
          }
          const result = await this.calculateAndDistributeCommissions(
            "recharge",
            rechargeId,
            recharge.amount,
            recharge.provider
          );
          return {
            success: true,
            message: `Commissions successfully distributed for recharge ID: ${rechargeId}`,
            details: result
          };
        } catch (error) {
          console.error(`[Commission] Error manually distributing commissions for recharge ${rechargeId}:`, error);
          throw error;
        }
      }
      /**
       * Calculate and distribute commissions for a transaction
       * 
       * @param serviceType Type of service (e.g., 'recharge', 'booking')
       * @param transactionId ID of the transaction
       * @param amount Transaction amount
       * @param provider Service provider (e.g., 'Airtel', 'Jio')
       */
      async calculateAndDistributeCommissions(serviceType, transactionId, amount, provider) {
        try {
          console.log(`[Commission] Step 1: Getting commission config for ${serviceType}`);
          const config = await storage.getCommissionConfigByService(serviceType);
          if (!config) {
            throw new Error(`No commission config found for service type: ${serviceType}`);
          }
          console.log(`[Commission] Config found:`, config);
          console.log(`[Commission] Step 2: Getting transaction details for ID ${transactionId}`);
          const transaction = serviceType === "recharge" ? await storage.getRecharge(transactionId) : null;
          console.log(`[Commission] Transaction:`, transaction);
          if (!transaction) {
            throw new Error(`Transaction not found for ID: ${transactionId}`);
          }
          const userId = transaction.userId;
          console.log(`[Commission] Step 3: Getting user details for user ID ${userId}`);
          const user = await storage.getUser(userId);
          console.log(`[Commission] User:`, user);
          if (!user) {
            throw new Error(`User not found for ID: ${userId}`);
          }
          const userPincode = user.pincode;
          console.log(`[Commission] User pincode: ${userPincode}`);
          if (!userPincode) {
            throw new Error(`User ${userId} has no pincode assigned`);
          }
          console.log(`[Commission] Step 4: Finding service agent for pincode ${userPincode}`);
          const serviceAgent = await storage.getUserByPincodeAndType(userPincode, "service_agent");
          console.log(`[Commission] Service agent:`, serviceAgent);
          if (!serviceAgent) {
            throw new Error(`No service agent found for pincode ${userPincode}`);
          }
          console.log(`[Commission] Step 5: Finding taluk manager for district ${serviceAgent.district}, taluk ${serviceAgent.taluk}`);
          const talukManager = await storage.getUserByTalukAndType(
            serviceAgent.district || "",
            serviceAgent.taluk || "",
            "taluk_manager"
          );
          console.log(`[Commission] Taluk manager:`, talukManager);
          if (!talukManager) {
            throw new Error(`No taluk manager found for ${serviceAgent.district}, ${serviceAgent.taluk}`);
          }
          console.log(`[Commission] Step 6: Finding branch manager for district ${talukManager.district}`);
          const branchManager = await storage.getUserByDistrictAndType(
            talukManager.district || "",
            "branch_manager"
          );
          console.log(`[Commission] Branch manager:`, branchManager);
          if (!branchManager) {
            throw new Error(`No branch manager found for district ${talukManager.district}`);
          }
          console.log(`[Commission] Step 7: Finding admin user`);
          const admin = await storage.getUserByType("admin");
          console.log(`[Commission] Admin:`, admin);
          if (!admin) {
            throw new Error("No admin user found in the system");
          }
          console.log(`[Commission] Step 8: Calculating commission amounts based on config rates`);
          const commissions2 = {
            user: amount * config.registeredUserCommission / 100,
            serviceAgent: amount * config.serviceAgentCommission / 100,
            talukManager: amount * config.talukManagerCommission / 100,
            branchManager: amount * config.branchManagerCommission / 100,
            admin: amount * config.adminCommission / 100
          };
          console.log(`[Commission] Calculated commissions:`, commissions2);
          console.log(`[Commission] Step 9: Recording commission transactions and updating wallet balances`);
          try {
            console.log(`[Commission] Creating commission transaction for admin ID ${admin.id}`);
            await storage.createCommissionTransaction({
              userId: admin.id,
              serviceType,
              transactionId,
              amount: commissions2.admin,
              // Required field in schema
              commissionAmount: commissions2.admin,
              commissionRate: config.adminCommission,
              transactionAmount: amount,
              provider: provider || null,
              status: "pending"
            });
            console.log(`[Commission] Updating admin wallet balance`);
            await storage.updateWalletBalance(admin.id, (admin.walletBalance || 0) + commissions2.admin);
            console.log(`[Commission] Creating commission transaction for branch manager ID ${branchManager.id}`);
            await storage.createCommissionTransaction({
              userId: branchManager.id,
              serviceType,
              transactionId,
              amount: commissions2.branchManager,
              // Required field in schema
              commissionAmount: commissions2.branchManager,
              commissionRate: config.branchManagerCommission,
              transactionAmount: amount,
              provider: provider || null,
              status: "pending"
            });
            console.log(`[Commission] Updating branch manager wallet balance`);
            await storage.updateWalletBalance(
              branchManager.id,
              (branchManager.walletBalance || 0) + commissions2.branchManager
            );
            console.log(`[Commission] Creating commission transaction for taluk manager ID ${talukManager.id}`);
            await storage.createCommissionTransaction({
              userId: talukManager.id,
              serviceType,
              transactionId,
              amount: commissions2.talukManager,
              // Required field in schema
              commissionAmount: commissions2.talukManager,
              commissionRate: config.talukManagerCommission,
              transactionAmount: amount,
              provider: provider || null,
              status: "pending"
            });
            console.log(`[Commission] Updating taluk manager wallet balance`);
            await storage.updateWalletBalance(
              talukManager.id,
              (talukManager.walletBalance || 0) + commissions2.talukManager
            );
            console.log(`[Commission] Creating commission transaction for service agent ID ${serviceAgent.id}`);
            await storage.createCommissionTransaction({
              userId: serviceAgent.id,
              serviceType,
              transactionId,
              amount: commissions2.serviceAgent,
              // Required field in schema
              commissionAmount: commissions2.serviceAgent,
              commissionRate: config.serviceAgentCommission,
              transactionAmount: amount,
              provider: provider || null,
              status: "pending"
            });
            console.log(`[Commission] Updating service agent wallet balance`);
            await storage.updateWalletBalance(
              serviceAgent.id,
              (serviceAgent.walletBalance || 0) + commissions2.serviceAgent
            );
            console.log(`[Commission] Creating commission transaction for user ID ${user.id}`);
            await storage.createCommissionTransaction({
              userId: user.id,
              serviceType,
              transactionId,
              amount: commissions2.user,
              // Required field in schema
              commissionAmount: commissions2.user,
              commissionRate: config.registeredUserCommission,
              transactionAmount: amount,
              provider: provider || null,
              status: "pending"
            });
            console.log(`[Commission] Updating user wallet balance`);
            await storage.updateWalletBalance(
              user.id,
              (user.walletBalance || 0) + commissions2.user
            );
          } catch (err) {
            console.error("[Commission] Error creating transactions or updating wallets:", err);
            throw err;
          }
          return {
            success: true,
            totalCommission: Object.values(commissions2).reduce((sum, val) => sum + val, 0),
            commissions: commissions2
          };
        } catch (error) {
          console.error("Error calculating commissions:", error);
          throw error;
        }
      }
    };
    commissionService = new CommissionService();
  }
});

// server/services/youtubeService.ts
var youtubeService_exports = {};
__export(youtubeService_exports, {
  YouTubeService: () => YouTubeService,
  youtubeService: () => youtubeService
});
import axios2 from "axios";
import { google } from "googleapis";
import fs2 from "fs";
var YouTubeService, youtubeService;
var init_youtubeService = __esm({
  "server/services/youtubeService.ts"() {
    "use strict";
    YouTubeService = class {
      apiKey;
      channelId;
      oauth2Client;
      constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.channelId = process.env.YOUTUBE_CHANNEL_ID;
        if (!this.apiKey) {
          throw new Error("YOUTUBE_API_KEY environment variable is required");
        }
        if (!this.channelId) {
          throw new Error("YOUTUBE_CHANNEL_ID environment variable is required");
        }
        this.initializeOAuth();
      }
      initializeOAuth() {
        const { OAuth2 } = google.auth;
        this.oauth2Client = new OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URL
        );
        if (process.env.GOOGLE_REFRESH_TOKEN) {
          this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
          });
        }
      }
      async getChannelVideos(maxResults = 50) {
        try {
          console.log("Fetching videos for channel:", this.channelId);
          if (this.channelId !== "UCp3MOo1CpFCa6awiaedrfhA") {
            throw new Error("Access restricted: Only Nalamini channel videos are allowed");
          }
          const channelResponse = await axios2.get(
            `https://www.googleapis.com/youtube/v3/channels`,
            {
              params: {
                part: "contentDetails,snippet",
                id: this.channelId,
                key: this.apiKey
              }
            }
          );
          console.log("Channel response:", JSON.stringify(channelResponse.data, null, 2));
          if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
            throw new Error("Channel not found or has no content");
          }
          const uploadsPlaylistId = channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
          if (!uploadsPlaylistId) {
            throw new Error("Could not find uploads playlist for channel");
          }
          const playlistResponse = await axios2.get(
            `https://www.googleapis.com/youtube/v3/playlistItems`,
            {
              params: {
                part: "snippet",
                playlistId: uploadsPlaylistId,
                maxResults,
                key: this.apiKey,
                order: "date"
              }
            }
          );
          const videoIds = playlistResponse.data.items.map((item) => item.snippet.resourceId.videoId);
          if (videoIds.length === 0) {
            return [];
          }
          const videosResponse = await axios2.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
              params: {
                part: "snippet,statistics,contentDetails",
                id: videoIds.join(","),
                key: this.apiKey
              }
            }
          );
          return videosResponse.data.items.map((video) => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnailUrl: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
            publishedAt: video.snippet.publishedAt,
            duration: this.parseDuration(video.contentDetails.duration),
            viewCount: parseInt(video.statistics.viewCount || "0")
          }));
        } catch (error) {
          console.error("Error fetching YouTube videos:", error);
          console.error("Error details:", error.response?.data || error.message);
          throw new Error(`Failed to fetch videos from YouTube channel: ${error.response?.data?.error?.message || error.message}`);
        }
      }
      parseDuration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return "0:00";
        const hours = parseInt(match[1] || "0");
        const minutes = parseInt(match[2] || "0");
        const seconds = parseInt(match[3] || "0");
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }
      getVideoEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      getVideoWatchUrl(videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
      async uploadVideo(videoPath, title, description, tags = []) {
        try {
          if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
            return {
              videoId: "",
              videoUrl: "",
              success: false,
              error: "YouTube upload requires Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)"
            };
          }
          const youtube = google.youtube({ version: "v3", auth: this.oauth2Client });
          if (!fs2.existsSync(videoPath)) {
            throw new Error(`Video file not found: ${videoPath}`);
          }
          console.log(`Uploading video to YouTube: ${title}`);
          console.log(`File path: ${videoPath}`);
          console.log(`File size: ${fs2.statSync(videoPath).size} bytes`);
          const videoMetadata = {
            snippet: {
              title,
              description: `${description}

Uploaded via Nalamini Service Platform`,
              tags: [...tags, "Nalamini", "Service Platform", "Tamil Nadu"],
              categoryId: "22",
              // People & Blogs category
              defaultLanguage: "en",
              defaultAudioLanguage: "en"
            },
            status: {
              privacyStatus: "public",
              // Options: 'private', 'public', 'unlisted'
              madeForKids: false
            }
          };
          const response = await youtube.videos.insert({
            part: ["snippet", "status"],
            requestBody: videoMetadata,
            media: {
              body: fs2.createReadStream(videoPath)
            }
          });
          const videoId = response.data.id;
          const videoUrl = this.getVideoWatchUrl(videoId);
          console.log(`Video uploaded successfully: ${videoId}`);
          console.log(`Video URL: ${videoUrl}`);
          return {
            videoId,
            videoUrl,
            success: true
          };
        } catch (error) {
          console.error("YouTube upload error:", error);
          return {
            videoId: "",
            videoUrl: "",
            success: false,
            error: error.message || "Failed to upload video to YouTube"
          };
        }
      }
      async uploadApprovedVideo(videoId, videoPath, title, description) {
        try {
          console.log(`Starting YouTube upload for approved video ID: ${videoId}`);
          const result = await this.uploadVideo(videoPath, title, description, ["approved", "community"]);
          if (result.success) {
            console.log(`Successfully uploaded video ${videoId} to YouTube: ${result.videoId}`);
            return result;
          } else {
            console.error(`Failed to upload video ${videoId} to YouTube:`, result.error);
            return result;
          }
        } catch (error) {
          console.error(`Error uploading approved video ${videoId}:`, error);
          return {
            videoId: "",
            videoUrl: "",
            success: false,
            error: error.message || "Failed to upload approved video"
          };
        }
      }
      // Get all playlists for the channel
      async getChannelPlaylists() {
        try {
          console.log(`Fetching playlists for channel: ${this.channelId}`);
          const response = await axios2.get(
            `https://www.googleapis.com/youtube/v3/playlists`,
            {
              params: {
                part: "snippet,contentDetails",
                channelId: this.channelId,
                maxResults: 50,
                key: this.apiKey
              }
            }
          );
          console.log("Playlists response:", JSON.stringify(response.data, null, 2));
          return response.data.items.map((playlist) => ({
            id: playlist.id,
            title: playlist.snippet.title,
            description: playlist.snippet.description,
            thumbnailUrl: playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default?.url,
            publishedAt: playlist.snippet.publishedAt,
            itemCount: playlist.contentDetails.itemCount
          }));
        } catch (error) {
          console.error("Error fetching playlists:", error.response?.data || error.message);
          throw error;
        }
      }
      // Get videos from a specific playlist
      async getPlaylistVideos(playlistId, maxResults = 50) {
        try {
          console.log(`Fetching videos for playlist: ${playlistId}`);
          const playlistResponse = await axios2.get(
            `https://www.googleapis.com/youtube/v3/playlistItems`,
            {
              params: {
                part: "snippet",
                playlistId,
                maxResults,
                key: this.apiKey
              }
            }
          );
          const videoIds = playlistResponse.data.items.filter((item) => item.snippet.resourceId.kind === "youtube#video").map((item) => item.snippet.resourceId.videoId);
          if (videoIds.length === 0) {
            return [];
          }
          const videosResponse = await axios2.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
              params: {
                part: "snippet,statistics,contentDetails",
                id: videoIds.join(","),
                key: this.apiKey
              }
            }
          );
          return videosResponse.data.items.map((video) => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnailUrl: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
            publishedAt: video.snippet.publishedAt,
            duration: this.parseDuration(video.contentDetails.duration),
            viewCount: parseInt(video.statistics.viewCount || "0"),
            likeCount: parseInt(video.statistics.likeCount || "0"),
            playlistId
          }));
        } catch (error) {
          console.error("Error fetching playlist videos:", error.response?.data || error.message);
          throw error;
        }
      }
    };
    youtubeService = new YouTubeService();
  }
});

// server/services/notificationService.ts
import { WebSocketServer, WebSocket } from "ws";
function initializeNotificationService(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/notifications" });
  wss.on("connection", (ws, req) => {
    const userId = extractUserIdFromRequest(req);
    if (!userId) {
      ws.close(1008, "Authentication required");
      return;
    }
    if (!activeConnections.has(userId)) {
      activeConnections.set(userId, []);
    }
    activeConnections.get(userId)?.push(ws);
    ws.on("close", () => {
      const connections = activeConnections.get(userId) || [];
      const index = connections.indexOf(ws);
      if (index !== -1) {
        connections.splice(index, 1);
        if (connections.length === 0) {
          activeConnections.delete(userId);
        }
      }
    });
    sendUnreadNotifications(userId);
  });
  return wss;
}
function extractUserIdFromRequest(req) {
  const userId = req.url.split("?userId=")[1];
  return userId ? parseInt(userId, 10) : null;
}
async function createAndSendNotification(notification) {
  const createdNotification = await storage.createNotification(notification);
  sendNotificationToUser(notification.userId, createdNotification);
  return createdNotification;
}
function sendNotificationToUser(userId, notification) {
  const connections = activeConnections.get(userId) || [];
  const payload = JSON.stringify({
    type: "notification",
    data: notification
  });
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}
async function sendUnreadNotifications(userId) {
  const notifications2 = await storage.getNotificationsByUserId(userId, 50, 0);
  const unreadNotifications = notifications2.filter((n) => !n.isRead);
  if (unreadNotifications.length === 0) return;
  const connections = activeConnections.get(userId) || [];
  const payload = JSON.stringify({
    type: "unread_notifications",
    data: unreadNotifications
  });
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}
async function sendSystemNotification(userId, title, content, actionUrl) {
  return await createAndSendNotification({
    userId,
    title,
    content,
    type: "system_announcement",
    actionUrl,
    relatedEntityType: null,
    relatedEntityId: null,
    expiresAt: null
  });
}
async function sendTransactionNotification(userId, title, content, transactionId) {
  return await createAndSendNotification({
    userId,
    title,
    content,
    type: "transaction",
    actionUrl: `/transactions/${transactionId}`,
    relatedEntityType: "transaction",
    relatedEntityId: transactionId,
    expiresAt: null
  });
}
async function sendServiceUpdateNotification(userId, title, content, serviceType, serviceId) {
  return await createAndSendNotification({
    userId,
    title,
    content,
    type: "service_update",
    actionUrl: `/${serviceType.toLowerCase()}/${serviceId}`,
    relatedEntityType: serviceType,
    relatedEntityId: serviceId,
    expiresAt: null
  });
}
async function notifyRecharge(recharge) {
  const title = `Recharge ${recharge.status}`;
  const content = `Your ${recharge.provider} recharge of \u20B9${recharge.amount} for ${recharge.mobileNumber} is ${recharge.status}.`;
  return await sendServiceUpdateNotification(
    recharge.userId,
    title,
    content,
    "recharge",
    recharge.id
  );
}
async function notifyBooking(booking) {
  const title = `Booking ${booking.status}`;
  const content = `Your booking from ${booking.origin} to ${booking.destination} has been ${booking.status}.`;
  return await sendServiceUpdateNotification(
    booking.userId,
    title,
    content,
    "booking",
    booking.id
  );
}
async function notifyRental(rental) {
  const title = `Rental ${rental.status}`;
  const content = `Your rental of ${rental.itemName} from ${rental.startDate} to ${rental.endDate} has been ${rental.status}.`;
  return await sendServiceUpdateNotification(
    rental.userId,
    title,
    content,
    "rental",
    rental.id
  );
}
async function notifyTaxiRide(taxiRide) {
  const title = `Taxi Ride ${taxiRide.status}`;
  const content = `Your taxi ride from ${taxiRide.pickup} to ${taxiRide.dropoff} is ${taxiRide.status}.`;
  return await sendServiceUpdateNotification(
    taxiRide.userId,
    title,
    content,
    "taxi",
    taxiRide.id
  );
}
async function notifyDelivery(delivery) {
  const title = `Delivery ${delivery.status}`;
  const content = `Your delivery from ${delivery.pickupAddress} to ${delivery.deliveryAddress} is ${delivery.status}.`;
  return await sendServiceUpdateNotification(
    delivery.userId,
    title,
    content,
    "delivery",
    delivery.id
  );
}
async function notifyCommission(userId, transactionId, transactionAmount, commissionAmount, transactionType) {
  const title = `Commission Earned`;
  const content = `You earned \u20B9${commissionAmount} commission for a ${transactionType} transaction of \u20B9${transactionAmount}.`;
  return await sendTransactionNotification(
    userId,
    title,
    content,
    transactionId
  );
}
var activeConnections, notificationService;
var init_notificationService = __esm({
  "server/services/notificationService.ts"() {
    "use strict";
    init_storage();
    activeConnections = /* @__PURE__ */ new Map();
    notificationService = {
      initializeNotificationService,
      createAndSendNotification,
      sendSystemNotification,
      sendTransactionNotification,
      sendServiceUpdateNotification,
      notifyRecharge,
      notifyBooking,
      notifyRental,
      notifyTaxiRide,
      notifyDelivery,
      notifyCommission
    };
  }
});

// server/services/integrationService.ts
var integrationService_exports = {};
__export(integrationService_exports, {
  IntegrationService: () => IntegrationService,
  integrationService: () => integrationService
});
var IntegrationService, integrationService;
var init_integrationService = __esm({
  "server/services/integrationService.ts"() {
    "use strict";
    init_commissionService();
    init_notificationService();
    IntegrationService = class {
      /**
       * Handle post-processing for a recharge
       */
      async processRecharge(recharge) {
        try {
          await notificationService.notifyRecharge(recharge);
          if (recharge.status === "completed" && recharge.processedBy) {
            const result = await commissionService.processRechargeCommissions(recharge.id);
            if (result && result.commissions) {
              for (const commission of result.commissions) {
                await notificationService.notifyCommission(
                  commission.userId,
                  recharge.id,
                  recharge.amount,
                  commission.amount,
                  "recharge"
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in recharge integration:", error);
        }
      }
      /**
       * Handle post-processing for a booking
       */
      async processBooking(booking) {
        try {
          await notificationService.notifyBooking(booking);
          if (booking.status === "completed" && booking.processedBy) {
            const result = await commissionService.processBookingCommissions(booking.id);
            if (result && result.commissions) {
              for (const commission of result.commissions) {
                await notificationService.notifyCommission(
                  commission.userId,
                  booking.id,
                  booking.amount,
                  commission.amount,
                  "booking"
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in booking integration:", error);
        }
      }
      /**
       * Handle post-processing for a rental
       */
      async processRental(rental) {
        try {
          await notificationService.notifyRental(rental);
          if (rental.status === "completed" && rental.processedBy) {
            const result = await commissionService.processRentalCommissions(rental.id);
            if (result && result.commissions) {
              for (const commission of result.commissions) {
                await notificationService.notifyCommission(
                  commission.userId,
                  rental.id,
                  rental.amount,
                  commission.amount,
                  "rental"
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in rental integration:", error);
        }
      }
      /**
       * Handle post-processing for a taxi ride
       */
      async processTaxiRide(taxiRide) {
        try {
          await notificationService.notifyTaxiRide(taxiRide);
          if (taxiRide.status === "completed" && taxiRide.processedBy) {
            const result = await commissionService.processTaxiRideCommissions(taxiRide.id);
            if (result && result.commissions) {
              for (const commission of result.commissions) {
                await notificationService.notifyCommission(
                  commission.userId,
                  taxiRide.id,
                  taxiRide.amount,
                  commission.amount,
                  "taxi"
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in taxi ride integration:", error);
        }
      }
      /**
       * Handle post-processing for a delivery
       */
      async processDelivery(delivery) {
        try {
          await notificationService.notifyDelivery(delivery);
          if (delivery.status === "completed" && delivery.processedBy) {
            const result = await commissionService.processDeliveryCommissions(delivery.id);
            if (result && result.commissions) {
              for (const commission of result.commissions) {
                await notificationService.notifyCommission(
                  commission.userId,
                  delivery.id,
                  delivery.amount,
                  commission.amount,
                  "delivery"
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in delivery integration:", error);
        }
      }
    };
    integrationService = new IntegrationService();
  }
});

// server/services/flightService.ts
var flightService_exports = {};
__export(flightService_exports, {
  FlightService: () => FlightService
});
import { z as z4 } from "zod";
async function makeFlightApiRequest(endpoint, data) {
  try {
    if (!FLIGHT_API_KEY || !FLIGHT_API_SECRET) {
      throw new Error("Flight API credentials not configured. Please contact support to set up flight booking integration.");
    }
    const tokenResponse = await fetch(`${FLIGHT_API_BASE_URL}/v1/security/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: FLIGHT_API_KEY,
        client_secret: FLIGHT_API_SECRET
      })
    });
    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const response = await fetch(`${FLIGHT_API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Flight API request failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Flight API error:", error);
    throw error;
  }
}
var FLIGHT_API_BASE_URL, FLIGHT_API_KEY, FLIGHT_API_SECRET, FlightSearchSchema, BookFlightSchema, FlightService;
var init_flightService = __esm({
  "server/services/flightService.ts"() {
    "use strict";
    FLIGHT_API_BASE_URL = process.env.FLIGHT_API_BASE_URL || "https://api.amadeus.com";
    FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;
    FLIGHT_API_SECRET = process.env.FLIGHT_API_SECRET;
    FlightSearchSchema = z4.object({
      origin: z4.string().length(3),
      // IATA airport code
      destination: z4.string().length(3),
      departureDate: z4.string(),
      // YYYY-MM-DD format
      returnDate: z4.string().optional(),
      adults: z4.number().min(1).max(9).default(1),
      children: z4.number().min(0).max(8).default(0),
      infants: z4.number().min(0).max(8).default(0),
      travelClass: z4.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).default("ECONOMY"),
      nonStop: z4.boolean().default(false)
    });
    BookFlightSchema = z4.object({
      flightOfferId: z4.string(),
      passengers: z4.array(z4.object({
        firstName: z4.string(),
        lastName: z4.string(),
        dateOfBirth: z4.string(),
        gender: z4.enum(["MALE", "FEMALE"]),
        email: z4.string().email(),
        phone: z4.string(),
        passportNumber: z4.string().optional(),
        passportExpiry: z4.string().optional(),
        nationality: z4.string().optional()
      })),
      contactInfo: z4.object({
        email: z4.string().email(),
        phone: z4.string(),
        address: z4.object({
          lines: z4.array(z4.string()),
          postalCode: z4.string(),
          cityName: z4.string(),
          countryCode: z4.string()
        })
      })
    });
    FlightService = class {
      // Search for available flights
      static async searchFlights(searchParams) {
        const validatedParams = FlightSearchSchema.parse(searchParams);
        if (!FLIGHT_API_KEY || !FLIGHT_API_SECRET) {
          throw new Error("Flight booking API credentials not configured. Please contact support to set up flight integration.");
        }
        const payload = {
          currencyCode: "INR",
          originDestinations: [
            {
              id: "1",
              originLocationCode: validatedParams.origin,
              destinationLocationCode: validatedParams.destination,
              departureDateTimeRange: {
                date: validatedParams.departureDate
              }
            }
          ],
          travelers: [
            ...Array(validatedParams.adults).fill(null).map((_, i) => ({
              id: `${i + 1}`,
              travelerType: "ADULT"
            })),
            ...Array(validatedParams.children).fill(null).map((_, i) => ({
              id: `${validatedParams.adults + i + 1}`,
              travelerType: "CHILD"
            })),
            ...Array(validatedParams.infants).fill(null).map((_, i) => ({
              id: `${validatedParams.adults + validatedParams.children + i + 1}`,
              travelerType: "INFANT"
            }))
          ],
          sources: ["GDS"],
          searchCriteria: {
            maxFlightOffers: 50,
            flightFilters: {
              cabinRestrictions: [
                {
                  cabin: validatedParams.travelClass,
                  coverage: "MOST_SEGMENTS",
                  originDestinationIds: ["1"]
                }
              ]
            }
          }
        };
        if (validatedParams.returnDate) {
          payload.originDestinations.push({
            id: "2",
            originLocationCode: validatedParams.destination,
            destinationLocationCode: validatedParams.origin,
            departureDateTimeRange: {
              date: validatedParams.returnDate
            }
          });
        }
        const response = await makeFlightApiRequest("/v2/shopping/flight-offers", payload);
        return {
          searchId: Date.now(),
          flights: response.data || [],
          searchParams: validatedParams
        };
      }
      // Book selected flight
      static async bookFlight(params) {
        const validatedParams = BookFlightSchema.parse(params);
        const response = await makeFlightApiRequest("/v1/booking/flight-orders", {
          data: {
            type: "flight-order",
            flightOffers: [validatedParams.flightOfferId],
            travelers: validatedParams.passengers,
            remarks: {
              general: [
                {
                  subType: "GENERAL_MISCELLANEOUS",
                  text: "ONLINE BOOKING DEF"
                }
              ]
            },
            ticketingAgreement: {
              option: "DELAY_TO_QUEUE",
              delay: "6D"
            },
            contacts: [
              {
                addresseeName: {
                  firstName: validatedParams.passengers[0].firstName,
                  lastName: validatedParams.passengers[0].lastName
                },
                companyName: "NALAMINI SERVICES",
                purpose: "STANDARD",
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "91",
                    number: validatedParams.contactInfo.phone
                  }
                ],
                emailAddress: validatedParams.contactInfo.email,
                address: validatedParams.contactInfo.address
              }
            ]
          }
        });
        return {
          bookingReference: response.data.associatedRecords[0].reference,
          pnr: response.data.associatedRecords[0].reference,
          status: response.data.flightOffers[0].source,
          totalPrice: response.data.flightOffers[0].price.total
        };
      }
      // Get popular Indian airports
      static getPopularAirports() {
        return [
          { code: "MAA", city: "Chennai", name: "Chennai International Airport" },
          { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport" },
          { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji International Airport" },
          { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport" },
          { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport" },
          { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport" },
          { code: "COK", city: "Kochi", name: "Cochin International Airport" },
          { code: "CJB", city: "Coimbatore", name: "Coimbatore International Airport" },
          { code: "TRZ", city: "Trichy", name: "Tiruchirappalli International Airport" },
          { code: "MDU", city: "Madurai", name: "Madurai Airport" }
        ];
      }
      // Calculate commission distribution for flight booking
      static calculateCommissionDistribution(totalCommission) {
        const commissionStructure = {
          admin: { percent: 1, amount: 0 },
          branch_manager: { percent: 1.5, amount: 0 },
          taluk_manager: { percent: 1.5, amount: 0 },
          service_agent: { percent: 2, amount: 0 }
        };
        commissionStructure.admin.amount = totalCommission * commissionStructure.admin.percent / 100;
        commissionStructure.branch_manager.amount = totalCommission * commissionStructure.branch_manager.percent / 100;
        commissionStructure.taluk_manager.amount = totalCommission * commissionStructure.taluk_manager.percent / 100;
        commissionStructure.service_agent.amount = totalCommission * commissionStructure.service_agent.percent / 100;
        return commissionStructure;
      }
      // Format flight results for display
      static formatFlightResults(flights) {
        return flights.map((flight) => ({
          id: flight.id,
          airline: flight.validatingAirlineCodes[0],
          flightNumber: flight.itineraries[0].segments[0].carrierCode + flight.itineraries[0].segments[0].number,
          departure: {
            airport: flight.itineraries[0].segments[0].departure.iataCode,
            time: flight.itineraries[0].segments[0].departure.at,
            terminal: flight.itineraries[0].segments[0].departure.terminal
          },
          arrival: {
            airport: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode,
            time: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at,
            terminal: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.terminal
          },
          duration: flight.itineraries[0].duration,
          stops: flight.itineraries[0].segments.length - 1,
          price: {
            total: flight.price.total,
            base: flight.price.base,
            currency: flight.price.currency
          },
          travelerPricings: flight.travelerPricings,
          lastTicketingDate: flight.lastTicketingDate,
          numberOfBookableSeats: flight.numberOfBookableSeats
        }));
      }
    };
  }
});

// server/services/hotelService.ts
var hotelService_exports = {};
__export(hotelService_exports, {
  HotelService: () => HotelService
});
import { z as z5 } from "zod";
async function makeHotelApiRequest(endpoint, data, method = "POST") {
  try {
    if (!HOTEL_API_KEY || !HOTEL_API_SECRET) {
      throw new Error("Hotel API credentials not configured. Please contact support to set up hotel booking integration.");
    }
    const tokenResponse = await fetch(`${HOTEL_API_BASE_URL}/v1/security/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: HOTEL_API_KEY,
        client_secret: HOTEL_API_SECRET
      })
    });
    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const requestOptions = {
      method,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    };
    if (data && method !== "GET") {
      requestOptions.body = JSON.stringify(data);
    }
    const response = await fetch(`${HOTEL_API_BASE_URL}${endpoint}`, requestOptions);
    if (!response.ok) {
      throw new Error(`Hotel API request failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Hotel API error:", error);
    throw error;
  }
}
var HOTEL_API_BASE_URL, HOTEL_API_KEY, HOTEL_API_SECRET, HotelSearchSchema, BookHotelSchema, HotelService;
var init_hotelService = __esm({
  "server/services/hotelService.ts"() {
    "use strict";
    HOTEL_API_BASE_URL = process.env.HOTEL_API_BASE_URL || "https://api.amadeus.com";
    HOTEL_API_KEY = process.env.HOTEL_API_KEY;
    HOTEL_API_SECRET = process.env.HOTEL_API_SECRET;
    HotelSearchSchema = z5.object({
      cityCode: z5.string().length(3),
      // IATA city code
      checkInDate: z5.string(),
      // YYYY-MM-DD format
      checkOutDate: z5.string(),
      // YYYY-MM-DD format
      roomQuantity: z5.number().min(1).max(9).default(1),
      adults: z5.number().min(1).max(9).default(2),
      children: z5.number().min(0).max(8).default(0),
      currency: z5.string().default("INR"),
      priceRange: z5.object({
        min: z5.number().optional(),
        max: z5.number().optional()
      }).optional(),
      amenities: z5.array(z5.string()).optional(),
      ratings: z5.array(z5.number()).optional(),
      hotelSource: z5.string().default("ALL")
    });
    BookHotelSchema = z5.object({
      hotelId: z5.string(),
      offerId: z5.string(),
      guests: z5.array(z5.object({
        title: z5.enum(["MR", "MRS", "MS"]),
        firstName: z5.string(),
        lastName: z5.string(),
        phone: z5.string(),
        email: z5.string().email(),
        dateOfBirth: z5.string().optional()
      })),
      payments: z5.array(z5.object({
        method: z5.enum(["CREDIT_CARD", "AGENCY_ACCOUNT"]),
        card: z5.object({
          vendorCode: z5.string(),
          cardNumber: z5.string(),
          expiryDate: z5.string(),
          holderName: z5.string()
        }).optional()
      })),
      rooms: z5.array(z5.object({
        guestIds: z5.array(z5.number()),
        specialRequest: z5.string().optional()
      }))
    });
    HotelService = class {
      // Search for available hotels
      static async searchHotels(searchParams) {
        const validatedParams = HotelSearchSchema.parse(searchParams);
        if (!HOTEL_API_KEY || !HOTEL_API_SECRET) {
          throw new Error("Hotel booking API credentials not configured. Please contact support to set up hotel integration.");
        }
        const hotelListEndpoint = `/v1/reference-data/locations/hotels/by-city?cityCode=${validatedParams.cityCode}`;
        const hotelListResponse = await makeHotelApiRequest(hotelListEndpoint, null, "GET");
        const hotelIds = hotelListResponse.data.slice(0, 20).map((hotel) => hotel.hotelId);
        const searchEndpoint = "/v3/shopping/hotel-offers";
        const payload = {
          hotelIds: hotelIds.join(","),
          checkInDate: validatedParams.checkInDate,
          checkOutDate: validatedParams.checkOutDate,
          roomQuantity: validatedParams.roomQuantity,
          adults: validatedParams.adults,
          children: validatedParams.children,
          currency: validatedParams.currency
        };
        const response = await makeHotelApiRequest(searchEndpoint, payload, "GET");
        return {
          searchId: Date.now(),
          hotels: response.data || [],
          searchParams: validatedParams
        };
      }
      // Get hotel details
      static async getHotelDetails(hotelId) {
        const endpoint = `/v1/reference-data/locations/hotels/${hotelId}`;
        const response = await makeHotelApiRequest(endpoint, null, "GET");
        return response.data;
      }
      // Book selected hotel
      static async bookHotel(params) {
        const validatedParams = BookHotelSchema.parse(params);
        const response = await makeHotelApiRequest("/v1/booking/hotel-bookings", {
          data: {
            offerId: validatedParams.offerId,
            guests: validatedParams.guests,
            payments: validatedParams.payments,
            rooms: validatedParams.rooms
          }
        });
        return {
          bookingReference: response.data[0].associatedRecords[0].reference,
          confirmationNumber: response.data[0].id,
          status: response.data[0].bookingStatus,
          totalPrice: response.data[0].hotelOffer.price.total
        };
      }
      // Get popular Indian cities
      static getPopularCities() {
        return [
          { code: "MAA", name: "Chennai", state: "Tamil Nadu" },
          { code: "BLR", name: "Bangalore", state: "Karnataka" },
          { code: "BOM", name: "Mumbai", state: "Maharashtra" },
          { code: "DEL", name: "New Delhi", state: "Delhi" },
          { code: "HYD", name: "Hyderabad", state: "Telangana" },
          { code: "CCU", name: "Kolkata", state: "West Bengal" },
          { code: "COK", name: "Kochi", state: "Kerala" },
          { code: "GOI", name: "Goa", state: "Goa" },
          { code: "PNQ", name: "Pune", state: "Maharashtra" },
          { code: "JAI", name: "Jaipur", state: "Rajasthan" },
          { code: "AMD", name: "Ahmedabad", state: "Gujarat" },
          { code: "TRV", name: "Thiruvananthapuram", state: "Kerala" }
        ];
      }
      // Calculate commission distribution for hotel booking
      static calculateCommissionDistribution(totalCommission) {
        const commissionStructure = {
          admin: { percent: 1, amount: 0 },
          branch_manager: { percent: 1.5, amount: 0 },
          taluk_manager: { percent: 1.5, amount: 0 },
          service_agent: { percent: 2, amount: 0 }
        };
        commissionStructure.admin.amount = totalCommission * commissionStructure.admin.percent / 100;
        commissionStructure.branch_manager.amount = totalCommission * commissionStructure.branch_manager.percent / 100;
        commissionStructure.taluk_manager.amount = totalCommission * commissionStructure.taluk_manager.percent / 100;
        commissionStructure.service_agent.amount = totalCommission * commissionStructure.service_agent.percent / 100;
        return commissionStructure;
      }
      // Format hotel results for display
      static formatHotelResults(hotels) {
        return hotels.map((hotel) => ({
          id: hotel.hotel.hotelId,
          name: hotel.hotel.name,
          rating: hotel.hotel.rating,
          address: hotel.hotel.address,
          amenities: hotel.hotel.amenities || [],
          images: hotel.hotel.media || [],
          offers: hotel.offers.map((offer) => ({
            id: offer.id,
            checkInDate: offer.checkInDate,
            checkOutDate: offer.checkOutDate,
            roomQuantity: offer.roomQuantity,
            rateCode: offer.rateCode,
            room: {
              type: offer.room.type,
              typeEstimated: offer.room.typeEstimated,
              description: offer.room.description
            },
            guests: offer.guests,
            price: {
              currency: offer.price.currency,
              base: offer.price.base,
              total: offer.price.total,
              taxes: offer.price.taxes,
              markups: offer.price.markups
            },
            policies: offer.policies,
            self: offer.self
          })),
          available: hotel.available,
          self: hotel.self
        }));
      }
    };
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
init_storage();
import express from "express";
import { createServer } from "http";

// server/auth.ts
init_storage();
init_schema();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { z as z2 } from "zod";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "tamilnadu-services-platform-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24
      // 1 day
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[AUTH DEBUG] Login attempt for username: ${username}`);
        const user = await storage.getUserByUsername(username);
        console.log(`[AUTH DEBUG] User found:`, user ? `ID: ${user.id}, Username: ${user.username}` : "No user found");
        if (!user) {
          console.log(`[AUTH DEBUG] No user found for username: ${username}`);
          return done(null, false);
        }
        console.log(`[AUTH DEBUG] Comparing passwords for user ${username}`);
        const passwordMatch = await comparePasswords(password, user.password);
        console.log(`[AUTH DEBUG] Password match result:`, passwordMatch);
        if (!passwordMatch) {
          console.log(`[AUTH DEBUG] Password mismatch for user ${username}`);
          return done(null, false);
        } else {
          console.log(`[AUTH DEBUG] Authentication successful for user ${username}`);
          return done(null, user);
        }
      } catch (error) {
        console.error(`[AUTH DEBUG] Authentication error:`, error);
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    console.log(`[AUTH DEBUG] Serializing user:`, user.id);
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      console.log(`[AUTH DEBUG] Deserializing user ID:`, id);
      const user = await storage.getUser(id);
      console.log(`[AUTH DEBUG] Deserialized user:`, user ? `ID: ${user.id}, Username: ${user.username}` : "No user found");
      done(null, user);
    } catch (error) {
      console.error(`[AUTH DEBUG] Deserialization error:`, error);
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    console.log(`[AUTH DEBUG] Registration attempt:`, req.body.username);
    try {
      const registerSchema = insertUserSchema.extend({
        confirmPassword: z2.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
      });
      const validatedData = registerSchema.parse(req.body);
      const { confirmPassword, ...userData } = validatedData;
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        console.log(`[AUTH DEBUG] Registration failed: Username ${userData.username} already exists`);
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...userData,
        password: await hashPassword(userData.password)
      });
      console.log(`[AUTH DEBUG] Registration successful: User ${user.username} created with ID ${user.id}`);
      if (userData.userType === "service_provider" && req.body.providerType) {
        console.log(`[AUTH DEBUG] Creating service provider record for user ${user.id}`);
        try {
          const serviceProviderData = {
            userId: user.id,
            providerType: req.body.providerType,
            businessName: req.body.businessName || "",
            address: `${userData.district}, ${userData.taluk}`,
            // Use location info from user registration
            district: userData.district,
            taluk: userData.taluk,
            pincode: userData.pincode,
            phone: "",
            // We'll collect this later if needed
            email: "",
            // We'll collect this later if needed
            description: req.body.businessDescription || "",
            status: "pending",
            verificationStatus: "pending"
          };
          await storage.createServiceProvider(serviceProviderData);
          console.log(`[AUTH DEBUG] Service provider record created successfully`);
        } catch (error) {
          console.error(`[AUTH DEBUG] Failed to create service provider record:`, error);
        }
      }
      req.login(user, (err) => {
        if (err) {
          console.error(`[AUTH DEBUG] Login after registration failed:`, err);
          return next(err);
        }
        res.status(201).json(user);
      });
    } catch (error) {
      console.error(`[AUTH DEBUG] Registration error:`, error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    console.log(`[AUTH DEBUG] Login attempt for:`, req.body.username);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error(`[AUTH DEBUG] Login error:`, err);
        return next(err);
      }
      if (!user) {
        console.log(`[AUTH DEBUG] Login failed for ${req.body.username}: Invalid credentials`);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err2) => {
        if (err2) {
          console.error(`[AUTH DEBUG] Session creation error:`, err2);
          return next(err2);
        }
        console.log(`[AUTH DEBUG] Login successful for user ${user.username}`);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    console.log(`[AUTH DEBUG] Logout attempt for user:`, req.user?.username);
    req.logout((err) => {
      if (err) {
        console.error(`[AUTH DEBUG] Logout error:`, err);
        return next(err);
      }
      console.log(`[AUTH DEBUG] Logout successful`);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      console.log(`[AUTH DEBUG] Unauthenticated user check`);
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(`[AUTH DEBUG] User check for:`, req.user.username);
    res.json(req.user);
  });
}

// server/routes-subcategories.ts
init_db();
init_schema();
import { eq as eq2 } from "drizzle-orm";
var DEFAULT_SUBCATEGORIES = {
  // Category 1: Fruits
  "1": [
    { id: 1, name: "Apples", imageUrl: "/api/svg/fallback/apple", parentCategoryId: 1, isActive: true },
    { id: 2, name: "Bananas", imageUrl: "/api/svg/fallback/banana", parentCategoryId: 1, isActive: true },
    { id: 3, name: "Oranges", imageUrl: "/api/svg/fallback/orange", parentCategoryId: 1, isActive: true },
    { id: 4, name: "Berries", imageUrl: "/api/svg/fallback/berry", parentCategoryId: 1, isActive: true }
  ],
  // Category 2: Vegetables
  "2": [
    { id: 8, name: "Leafy Greens", imageUrl: "/api/svg/fallback/leafy-green", parentCategoryId: 2, isActive: true },
    { id: 9, name: "Root Vegetables", imageUrl: "/api/svg/fallback/root-vegetable", parentCategoryId: 2, isActive: true },
    { id: 10, name: "Gourds", imageUrl: "/api/svg/fallback/gourd", parentCategoryId: 2, isActive: true }
  ],
  // Category 3: Grains
  "3": [
    { id: 12, name: "Rice", imageUrl: "/api/svg/fallback/rice", parentCategoryId: 3, isActive: true },
    { id: 13, name: "Wheat", imageUrl: "/api/svg/fallback/wheat", parentCategoryId: 3, isActive: true },
    { id: 14, name: "Millets", imageUrl: "/api/svg/fallback/millet", parentCategoryId: 3, isActive: true }
  ],
  // Category 4: Oils (mirror from oil-category-helper.ts)
  "4": [
    { id: 5, name: "Coconut oil", imageUrl: "/uploads/fallback/coconut-oil.svg", parentCategoryId: 4, isActive: true },
    { id: 6, name: "Groundnut oil", imageUrl: "/uploads/fallback/groundnut-oil.svg", parentCategoryId: 4, isActive: true },
    { id: 7, name: "Olive oil", imageUrl: "/uploads/fallback/olive-oil.svg", parentCategoryId: 4, isActive: true },
    { id: 11, name: "Palm oil", imageUrl: "/uploads/fallback/palm-oil.svg", parentCategoryId: 4, isActive: true }
  ]
};
function registerSubcategoryRoutes(app2) {
  app2.get("/api/grocery/subcategories-public", async (req, res) => {
    try {
      const parentCategoryId = req.query.parentCategoryId;
      if (!parentCategoryId) {
        return res.status(400).json({ error: "Missing parentCategoryId parameter" });
      }
      console.log(`[SUBCATEGORY API] Request for subcategories of category ${parentCategoryId}`);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const subcategories = await db.select().from(grocerySubCategories).where(eq2(grocerySubCategories.parentCategoryId, Number(parentCategoryId))).orderBy(grocerySubCategories.displayOrder);
      if (subcategories && subcategories.length > 0) {
        console.log(`[SUBCATEGORY API] Found ${subcategories.length} subcategories for parentCategoryId ${parentCategoryId}`);
        return res.json(subcategories);
      }
      console.log(`[SUBCATEGORY API] No subcategories found for category ${parentCategoryId}, using fallbacks`);
      const fallbacks = DEFAULT_SUBCATEGORIES[parentCategoryId.toString()] || [];
      return res.json(fallbacks);
    } catch (error) {
      console.error(`[SUBCATEGORY API] Error:`, error);
      const categoryId = req.query.parentCategoryId?.toString() || "";
      const fallbacks = DEFAULT_SUBCATEGORIES[categoryId] || [];
      res.json(fallbacks);
    }
  });
  app2.get("/api/svg/fallback/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    let color = "#4CAF50";
    let content = "";
    switch (name) {
      case "apple":
        color = "#e53935";
        content = `<circle cx="50" cy="50" r="40" fill="${color}" />`;
        break;
      case "banana":
        color = "#FFD600";
        content = `<path d="M30,20 C90,20 70,80 30,80 Z" fill="${color}" stroke="#5D4037" stroke-width="2" />`;
        break;
      case "orange":
        color = "#FF9800";
        content = `<circle cx="50" cy="50" r="40" fill="${color}" />`;
        break;
      case "berry":
        color = "#8E24AA";
        content = `<circle cx="50" cy="50" r="40" fill="${color}" />`;
        break;
      case "leafy-green":
        color = "#66BB6A";
        content = `<path d="M30,50 C30,20 70,20 70,50 C70,80 30,80 30,50 Z" fill="${color}" />`;
        break;
      case "root-vegetable":
        color = "#FF7043";
        content = `<path d="M50,30 L60,60 L50,80 L40,60 Z" fill="${color}" />`;
        break;
      case "gourd":
        color = "#26A69A";
        content = `<ellipse cx="50" cy="50" rx="30" ry="40" fill="${color}" />`;
        break;
      case "rice":
        color = "#F5F5F5";
        content = `<rect x="30" y="30" width="40" height="40" fill="${color}" stroke="#BDBDBD" stroke-width="1" />`;
        break;
      case "wheat":
        color = "#FFA000";
        content = `<path d="M50,20 L50,80 M40,30 L50,20 L60,30 M35,50 L50,40 L65,50 M30,70 L50,60 L70,70" stroke="${color}" stroke-width="3" />`;
        break;
      case "millet":
        color = "#FFB74D";
        content = `<circle cx="50" cy="50" r="25" fill="${color}" />
                   <circle cx="35" cy="35" r="8" fill="${color}" />
                   <circle cx="65" cy="35" r="8" fill="${color}" />
                   <circle cx="35" cy="65" r="8" fill="${color}" />
                   <circle cx="65" cy="65" r="8" fill="${color}" />`;
        break;
      case "groundnut-oil":
        color = "#D7CCC8";
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      case "olive-oil":
        color = "#9CCC65";
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      case "coconut-oil":
        color = "#BCAAA4";
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      case "palm-oil":
        color = "#FFCA28";
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      default:
        color = "#90CAF9";
        content = `<rect x="30" y="30" width="40" height="40" rx="5" fill="${color}" />`;
    }
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        ${content}
      </svg>
    `;
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });
}

// server/services/oilService.ts
var OIL_SUBCATEGORIES = [
  {
    id: 5,
    name: "Coconut oil",
    description: "Pure coconut oil",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 1,
    imageUrl: "/uploads/fallback/coconut-oil.svg"
  },
  {
    id: 6,
    name: "Groundnut oil",
    description: "High-quality groundnut oil",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 2,
    imageUrl: "/uploads/fallback/groundnut-oil.svg"
  },
  {
    id: 7,
    name: "Olive oil",
    description: "Premium olive oil",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 3,
    imageUrl: "/uploads/fallback/olive-oil.svg"
  },
  {
    id: 11,
    name: "Palm oil",
    description: "Palm oil for cooking",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 4,
    imageUrl: "/uploads/fallback/palm-oil.svg"
  }
];
function getOilSubcategories() {
  return OIL_SUBCATEGORIES;
}

// server/routes-oil.ts
function registerOilRoutes(app2) {
  app2.get("/api/grocery/oil-subcategories", (req, res) => {
    try {
      console.log("[OIL API] Direct request for oil subcategories");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const oilSubcategories = getOilSubcategories();
      console.log("[OIL API] Returning", oilSubcategories.length, "oil subcategories");
      res.json(oilSubcategories);
    } catch (error) {
      console.error("[OIL API] Error:", error);
      res.json([
        {
          id: 6,
          name: "Groundnut oil",
          imageUrl: "/api/svg/fallback/groundnut-oil",
          parentCategoryId: 4,
          isActive: true
        }
      ]);
    }
  });
}

// server/routes.ts
init_db();
init_schema();
import { z as z6 } from "zod";
import multer from "multer";
import path2 from "path";
import fs3 from "fs";
import { sql as sql2, eq as eq4, asc as asc2, desc as desc2, and as and2, inArray as inArray2 } from "drizzle-orm";

// server/services/rechargeService.ts
import axios from "axios";
import Razorpay from "razorpay";
var RechargeService = class {
  razorpayClient = null;
  useMock;
  apiBaseUrl;
  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    console.log("Razorpay credentials check:", !!keyId, !!keySecret);
    this.useMock = !keyId || !keySecret;
    if (!this.useMock) {
      this.razorpayClient = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });
      this.apiBaseUrl = "https://api.razorpay.com/v1/apihub";
      console.log("Using Razorpay API Hub at:", this.apiBaseUrl);
    } else {
      console.warn("Razorpay credentials not found. Using mock recharge service.");
      this.apiBaseUrl = "";
    }
  }
  /**
   * Process a mobile recharge request using Razorpay API Hub
   * @param rechargeData The recharge request data
   * @returns A promise with the recharge response
   */
  async processMobileRecharge(rechargeData) {
    console.log("Processing mobile recharge:", rechargeData);
    if (this.useMock) {
      console.log("Using mock recharge service");
      return this.mockRechargeResponse(rechargeData);
    }
    try {
      const operatorCode = this.getOperatorCode(rechargeData.provider);
      console.log("Using operator code:", operatorCode);
      const payload = {
        customer_id: `cust_${rechargeData.transactionId}`,
        // Generate a customer ID based on transaction
        mobile: `91${rechargeData.mobileNumber}`,
        // Add country code
        amount: rechargeData.amount * 100,
        // Convert to paisa
        operator: operatorCode,
        reference_id: rechargeData.transactionId
      };
      console.log("Razorpay request payload:", payload);
      const response = await axios.post(
        `https://api.razorpay.com/v1/apihub/recharge`,
        payload,
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = response.data;
      console.log("Razorpay recharge response:", data);
      return {
        success: data.status === "processed" || data.status === "success",
        transactionId: rechargeData.transactionId,
        operatorRef: data.transaction_id || data.reference_id,
        message: data.message || "Recharge processed successfully"
      };
    } catch (error) {
      console.error("Razorpay recharge API error:", error);
      console.error("Error details:", error.response?.data || error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received, request details:", error.request);
      } else {
        console.error("Error in request setup:", error.message);
      }
      return {
        success: false,
        transactionId: rechargeData.transactionId,
        message: error.response?.data?.error?.description || error.message || "Recharge processing failed"
      };
    }
  }
  /**
   * Check the status of a recharge request
   * @param statusRequest The status request data
   * @returns A promise with the recharge status response
   */
  async checkRechargeStatus(statusRequest) {
    console.log("Checking recharge status:", statusRequest);
    if (this.useMock) {
      console.log("Using mock status service");
      return {
        success: true,
        transactionId: statusRequest.transactionId,
        operatorRef: `OP${Math.floor(Math.random() * 1e6)}`,
        message: "Recharge completed successfully"
      };
    }
    try {
      const response = await axios.get(
        `https://api.razorpay.com/v1/apihub/recharge/status`,
        {
          params: {
            reference_id: statusRequest.transactionId
          },
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = response.data;
      console.log("Razorpay status response:", data);
      return {
        success: data.status === "processed" || data.status === "success",
        transactionId: statusRequest.transactionId,
        operatorRef: data.transaction_id || data.operator_transaction_id,
        message: data.message || "Status retrieved successfully"
      };
    } catch (error) {
      console.error("Razorpay status API error:", error.response?.data || error.message);
      return {
        success: false,
        transactionId: statusRequest.transactionId,
        message: error.response?.data?.error?.description || error.message || "Status check failed"
      };
    }
  }
  /**
   * Get available plans for a specific provider
   * @param provider The mobile service provider
   * @param circle The telecom circle/region (optional)
   * @param serviceType The service type (mobile, dth, electricity, etc.)
   * @returns A promise with the available plans
   */
  async getAvailablePlans(provider, circle, serviceType) {
    console.log("Getting available plans for provider:", provider, "circle:", circle);
    if (this.useMock) {
      console.log("Using mock plans service");
      return this.getMockPlans(provider, serviceType);
    }
    try {
      const operatorCode = this.getOperatorCode(provider);
      const circleCode = circle ? this.getCircleCode(circle) : void 0;
      console.log("Using operator code:", operatorCode, "circle code:", circleCode);
      const apiPath = "/v1/apihub/recharge/plans";
      const response = await axios.get(
        `https://api.razorpay.com${apiPath}`,
        {
          params: {
            operator: operatorCode,
            circle: circleCode
          },
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = response.data;
      console.log("Razorpay plans API raw response:", data);
      const processedData = this.processRazorpayPlans(data, provider);
      return processedData;
    } catch (error) {
      console.error("Razorpay plans API error details:");
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request (no response received):", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
      console.log("API call failed, will use mock plans instead");
      console.log("API call failed, using mock plans");
      return this.getMockPlans(provider, serviceType);
    }
  }
  /**
   * Process and categorize plans from Razorpay response
   */
  processRazorpayPlans(data, provider) {
    const categories = [
      { id: "data", name: "Data" },
      { id: "combo", name: "Combo" },
      { id: "talktime", name: "Talktime" },
      { id: "entertainment", name: "Entertainment" },
      { id: "roaming", name: "Roaming" }
    ];
    if (data && data.plans && Array.isArray(data.plans)) {
      const plans = data.plans.map((plan, index) => {
        const category = this.determinePlanCategory(plan);
        return {
          id: index + 1,
          category,
          amount: plan.amount / 100,
          // Convert from paisa to rupees
          validity: plan.validity || "N/A",
          description: plan.description || `${provider} Plan`
        };
      });
      return {
        provider,
        categories: {
          data: categories
        },
        plans,
        message: "Plans fetched successfully from Razorpay"
      };
    }
    console.log("Invalid response format from Razorpay API, using mock plans");
    return this.getMockPlans(provider);
  }
  /**
   * Determine the category of a plan based on its details
   */
  determinePlanCategory(plan) {
    const description = (plan.description || "").toLowerCase();
    if (description.includes("gb") || description.includes("data")) {
      if (description.includes("call") || description.includes("voice") || description.includes("sms")) {
        return "combo";
      }
      return "data";
    } else if (description.includes("talk") || description.includes("voice") || description.includes("call")) {
      return "talktime";
    } else if (description.includes("hotstar") || description.includes("prime") || description.includes("netflix") || description.includes("zee") || description.includes("sony")) {
      return "entertainment";
    } else if (description.includes("roaming") || description.includes("international")) {
      return "roaming";
    }
    return "combo";
  }
  /**
   * Get operator code based on provider name
   */
  getOperatorCode(provider) {
    const providerMap = {
      // Mobile operators
      "airtel": "AIRTEL",
      "jio": "JIO",
      "vi": "VODAFONE",
      "vodafone": "VODAFONE",
      "vodafone idea": "VODAFONE",
      "bsnl": "BSNL",
      // DTH operators
      "tata play": "TATA_PLAY",
      "airtel digital tv": "AIRTEL_DTH",
      "dish tv": "DISH_TV",
      "sun direct": "SUN_DIRECT",
      "d2h": "D2H",
      // Electricity providers
      "tneb": "TNEB",
      "bescom": "BESCOM",
      "kseb": "KSEB",
      "aptransco": "APTRANSCO",
      "tsspdcl": "TSSPDCL"
    };
    const normalizedProvider = provider.toLowerCase();
    return providerMap[normalizedProvider] || normalizedProvider.toUpperCase();
  }
  /**
   * Get circle code based on circle name
   */
  getCircleCode(circle) {
    const circleMap = {
      "tamil nadu": "TN",
      "tamilnadu": "TN",
      "tn": "TN",
      "kerala": "KL",
      "karnataka": "KA",
      "andhra pradesh": "AP",
      "telangana": "TS",
      "maharashtra": "MH",
      "gujarat": "GJ",
      "delhi": "DL",
      "punjab": "PB",
      "west bengal": "WB",
      "uttar pradesh": "UP"
    };
    const normalizedCircle = circle.toLowerCase();
    return circleMap[normalizedCircle] || normalizedCircle.toUpperCase();
  }
  /**
   * Generate a mock recharge response for testing
   * @param rechargeData The recharge request data
   * @returns A mock recharge response
   */
  mockRechargeResponse(rechargeData) {
    return {
      success: true,
      transactionId: rechargeData.transactionId,
      operatorRef: `OP${Math.floor(Math.random() * 1e6)}`,
      message: `\u20B9${rechargeData.amount} recharge for ${rechargeData.mobileNumber} completed successfully`
    };
  }
  /**
   * Get mock plans based on provider and service type
   * @param provider The service provider
   * @param serviceType The service type (mobile, dth, electricity, etc.)
   * @returns Mock plans data
   */
  getMockPlans(provider, serviceType) {
    console.log("Getting mock plans for:", provider, "with service type:", serviceType);
    if (serviceType) {
      switch (serviceType.toLowerCase()) {
        case "dth":
          return this.getMockDTHPlans(provider);
        case "electricity":
          return this.getMockElectricityPlans(provider);
        case "mobile":
          return this.getMockMobilePlans(provider);
        default:
          console.log(`Unknown service type: ${serviceType}, defaulting to mobile plans`);
          return this.getMockMobilePlans(provider);
      }
    }
    const isDTH = ["tata play", "airtel digital tv", "dish tv", "sun direct", "d2h"].includes(provider.toLowerCase());
    const isElectricity = ["tneb", "bescom", "kseb", "aptransco", "tsspdcl"].includes(provider.toLowerCase());
    if (isDTH) {
      return this.getMockDTHPlans(provider);
    } else if (isElectricity) {
      return this.getMockElectricityPlans(provider);
    } else {
      return this.getMockMobilePlans(provider);
    }
  }
  /**
   * Generate mock plans for mobile recharges
   */
  getMockMobilePlans(provider) {
    const categories = [
      { id: "data", name: "Data" },
      { id: "combo", name: "Combo" },
      { id: "talktime", name: "Talktime" },
      { id: "entertainment", name: "Entertainment" },
      { id: "roaming", name: "Roaming" }
    ];
    const plans = [];
    plans.push(
      { id: 1, category: "data", amount: 19, validity: "1 Day", description: "1GB Data" },
      { id: 2, category: "data", amount: 49, validity: "28 Days", description: "3GB Data" },
      { id: 3, category: "data", amount: 98, validity: "28 Days", description: "12GB Data" },
      { id: 4, category: "data", amount: 149, validity: "28 Days", description: "24GB Data" }
    );
    plans.push(
      { id: 5, category: "combo", amount: 149, validity: "28 Days", description: "Unlimited Calls + 1GB/Day + 100 SMS" },
      { id: 6, category: "combo", amount: 179, validity: "28 Days", description: "Unlimited Calls + 1.5GB/Day + 100 SMS" },
      { id: 7, category: "combo", amount: 199, validity: "28 Days", description: "Unlimited Calls + 2GB/Day + 100 SMS" },
      { id: 8, category: "combo", amount: 249, validity: "28 Days", description: "Unlimited Calls + 2.5GB/Day + 100 SMS" },
      { id: 9, category: "combo", amount: 299, validity: "28 Days", description: "Unlimited Calls + 3GB/Day + 100 SMS" },
      { id: 10, category: "combo", amount: 399, validity: "56 Days", description: "Unlimited Calls + 2GB/Day + 100 SMS" },
      { id: 11, category: "combo", amount: 499, validity: "56 Days", description: "Unlimited Calls + 2.5GB/Day + 100 SMS" },
      { id: 12, category: "combo", amount: 599, validity: "84 Days", description: "Unlimited Calls + 2GB/Day + 100 SMS" },
      { id: 13, category: "combo", amount: 699, validity: "84 Days", description: "Unlimited Calls + 2.5GB/Day + 100 SMS" },
      { id: 14, category: "combo", amount: 799, validity: "84 Days", description: "Unlimited Calls + 3GB/Day + 100 SMS" },
      { id: 15, category: "combo", amount: 999, validity: "84 Days", description: "Unlimited Calls + 3.5GB/Day + 100 SMS" },
      { id: 16, category: "combo", amount: 2499, validity: "365 Days", description: "Unlimited Calls + 2GB/Day + 100 SMS/Day" }
    );
    plans.push(
      { id: 17, category: "talktime", amount: 10, validity: "Regular", description: "Talktime \u20B97.47" },
      { id: 18, category: "talktime", amount: 20, validity: "Regular", description: "Talktime \u20B914.95" },
      { id: 19, category: "talktime", amount: 50, validity: "Regular", description: "Talktime \u20B939.37" },
      { id: 20, category: "talktime", amount: 100, validity: "Regular", description: "Talktime \u20B981.75" },
      { id: 21, category: "talktime", amount: 500, validity: "Regular", description: "Talktime \u20B9423.73" },
      { id: 22, category: "talktime", amount: 1e3, validity: "Regular", description: "Talktime \u20B9847.46" }
    );
    plans.push(
      { id: 23, category: "entertainment", amount: 29, validity: "30 Days", description: "Amazon Prime Video Mobile" },
      { id: 24, category: "entertainment", amount: 59, validity: "28 Days", description: "Disney+ Hotstar Mobile" },
      { id: 25, category: "entertainment", amount: 149, validity: "28 Days", description: "Netflix Mobile Plan" },
      { id: 26, category: "entertainment", amount: 49, validity: "28 Days", description: "SonyLIV Mobile" }
    );
    plans.push(
      { id: 27, category: "roaming", amount: 149, validity: "10 Days", description: "International Roaming Pack - Basic" },
      { id: 28, category: "roaming", amount: 499, validity: "10 Days", description: "International Roaming Pack - Standard" },
      { id: 29, category: "roaming", amount: 999, validity: "10 Days", description: "International Roaming Pack - Premium" }
    );
    return {
      provider,
      categories: {
        data: categories
      },
      plans,
      message: "Mobile plans generated successfully"
    };
  }
  /**
   * Generate mock plans for DTH recharges
   */
  getMockDTHPlans(provider) {
    const categories = [
      { id: "base", name: "Base Packs" },
      { id: "addon", name: "Add-on Packs" },
      { id: "regional", name: "Regional" },
      { id: "hd", name: "HD Packs" },
      { id: "sports", name: "Sports" }
    ];
    const plans = [];
    plans.push(
      { id: 1, category: "base", amount: 199, validity: "1 Month", description: "Value Pack - 100 Channels" },
      { id: 2, category: "base", amount: 299, validity: "1 Month", description: "Family Pack - 150 Channels" },
      { id: 3, category: "base", amount: 399, validity: "1 Month", description: "Premium Pack - 200 Channels" },
      { id: 4, category: "base", amount: 499, validity: "1 Month", description: "All Access Pack - 250+ Channels" }
    );
    plans.push(
      { id: 5, category: "addon", amount: 25, validity: "1 Month", description: "Kids Pack - 10 Channels" },
      { id: 6, category: "addon", amount: 35, validity: "1 Month", description: "News Pack - 15 Channels" },
      { id: 7, category: "addon", amount: 50, validity: "1 Month", description: "Movies Pack - 12 Channels" },
      { id: 8, category: "addon", amount: 75, validity: "1 Month", description: "Entertainment Plus - 20 Channels" }
    );
    plans.push(
      { id: 9, category: "regional", amount: 49, validity: "1 Month", description: "Tamil Pack - 20 Channels" },
      { id: 10, category: "regional", amount: 49, validity: "1 Month", description: "Telugu Pack - 15 Channels" },
      { id: 11, category: "regional", amount: 39, validity: "1 Month", description: "Malayalam Pack - 10 Channels" },
      { id: 12, category: "regional", amount: 49, validity: "1 Month", description: "Kannada Pack - 15 Channels" },
      { id: 13, category: "regional", amount: 39, validity: "1 Month", description: "Bengali Pack - 12 Channels" }
    );
    plans.push(
      { id: 14, category: "hd", amount: 99, validity: "1 Month", description: "HD Add-on - 10 HD Channels" },
      { id: 15, category: "hd", amount: 149, validity: "1 Month", description: "HD Entertainment - 15 HD Channels" },
      { id: 16, category: "hd", amount: 199, validity: "1 Month", description: "HD Premium - 25 HD Channels" },
      { id: 17, category: "hd", amount: 299, validity: "1 Month", description: "HD All Access - 50+ HD Channels" }
    );
    plans.push(
      { id: 18, category: "sports", amount: 89, validity: "1 Month", description: "Sports Lite - 5 Sports Channels" },
      { id: 19, category: "sports", amount: 149, validity: "1 Month", description: "Sports Pack - 10 Sports Channels" },
      { id: 20, category: "sports", amount: 199, validity: "1 Month", description: "Sports HD Pack - 10 HD Sports Channels" }
    );
    plans.push(
      { id: 21, category: "base", amount: 1099, validity: "6 Months", description: "Value Pack - 6 Month Offer" },
      { id: 22, category: "base", amount: 1799, validity: "6 Months", description: "Family Pack - 6 Month Offer" },
      { id: 23, category: "base", amount: 1999, validity: "12 Months", description: "Value Pack - Annual Offer" },
      { id: 24, category: "base", amount: 3299, validity: "12 Months", description: "Family Pack - Annual Offer" }
    );
    return {
      provider,
      categories: {
        data: categories
      },
      plans,
      message: "DTH plans generated successfully"
    };
  }
  /**
   * Generate mock plans for electricity bill payments
   */
  getMockElectricityPlans(provider) {
    const categories = [
      { id: "residential", name: "Residential" },
      { id: "commercial", name: "Commercial" },
      { id: "industrial", name: "Industrial" },
      { id: "agricultural", name: "Agricultural" }
    ];
    const plans = [];
    plans.push(
      { id: 1, category: "residential", amount: 100, validity: "Monthly", description: "Residential Basic (0-100 units)" },
      { id: 2, category: "residential", amount: 250, validity: "Monthly", description: "Residential Standard (101-200 units)" },
      { id: 3, category: "residential", amount: 400, validity: "Monthly", description: "Residential Regular (201-300 units)" },
      { id: 4, category: "residential", amount: 750, validity: "Monthly", description: "Residential High (301-500 units)" },
      { id: 5, category: "residential", amount: 1200, validity: "Monthly", description: "Residential Premium (501+ units)" }
    );
    plans.push(
      { id: 6, category: "commercial", amount: 500, validity: "Monthly", description: "Commercial Basic (0-200 units)" },
      { id: 7, category: "commercial", amount: 1e3, validity: "Monthly", description: "Commercial Standard (201-500 units)" },
      { id: 8, category: "commercial", amount: 2500, validity: "Monthly", description: "Commercial Regular (501-1000 units)" },
      { id: 9, category: "commercial", amount: 5e3, validity: "Monthly", description: "Commercial High (1001+ units)" }
    );
    plans.push(
      { id: 10, category: "industrial", amount: 2e3, validity: "Monthly", description: "Industrial Basic (LT)" },
      { id: 11, category: "industrial", amount: 5e3, validity: "Monthly", description: "Industrial Standard (HT-I)" },
      { id: 12, category: "industrial", amount: 1e4, validity: "Monthly", description: "Industrial Premium (HT-II)" }
    );
    plans.push(
      { id: 13, category: "agricultural", amount: 250, validity: "Monthly", description: "Agricultural Basic" },
      { id: 14, category: "agricultural", amount: 500, validity: "Monthly", description: "Agricultural Standard" },
      { id: 15, category: "agricultural", amount: 750, validity: "Monthly", description: "Agricultural Premium" }
    );
    return {
      provider,
      categories: {
        data: categories
      },
      plans,
      message: "Electricity tariffs generated successfully"
    };
  }
};
var rechargeService = new RechargeService();

// server/services/walletService.ts
init_storage();

// server/services/paymentService.ts
import Razorpay2 from "razorpay";
import crypto from "crypto";
var PaymentService = class {
  razorpay;
  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.warn("Razorpay credentials not found. Running in mock mode.");
    }
    this.razorpay = new Razorpay2({
      key_id: keyId || "rzp_test_mock",
      key_secret: keySecret || "mock_secret"
    });
  }
  /**
   * Create a new payment order
   * @param options Order creation options
   * @returns The created order
   */
  async createOrder(options) {
    if (this.razorpay.key_id === "rzp_test_mock") {
      return this.createMockOrder(options);
    }
    try {
      const order = await this.razorpay.orders.create({
        amount: options.amount,
        currency: options.currency || "INR",
        receipt: options.receipt,
        notes: {
          ...options.notes,
          userId: options.userId.toString()
        }
      });
      return order;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return this.createMockOrder(options);
    }
  }
  /**
   * Verify a payment signature
   * @param options Payment verification options
   * @returns Boolean indicating if signature is valid
   */
  verifyPaymentSignature(options) {
    if (this.razorpay.key_id === "rzp_test_mock") {
      return true;
    }
    try {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`${options.orderId}|${options.paymentId}`);
      const generatedSignature = hmac.digest("hex");
      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(options.signature)
      );
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  }
  /**
   * Fetch payment details by ID
   * @param paymentId The Razorpay payment ID
   * @returns The payment details
   */
  async getPayment(paymentId) {
    if (this.razorpay.key_id === "rzp_test_mock") {
      return {
        id: paymentId,
        status: "captured",
        amount: 1e5,
        // ₹1000
        currency: "INR",
        method: "card",
        created_at: Date.now()
      };
    }
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw error;
    }
  }
  /**
   * Fetch order details by ID
   * @param orderId The Razorpay order ID
   * @returns The order details
   */
  async getOrder(orderId) {
    if (this.razorpay.key_id === "rzp_test_mock") {
      return {
        id: orderId,
        amount: 1e5,
        // ₹1000 in paise
        currency: "INR",
        status: "paid",
        receipt: "receipt_123",
        created_at: Date.now()
      };
    }
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
  /**
   * Refund a payment
   * @param paymentId The Razorpay payment ID
   * @param amount Optional amount to refund (in paise)
   * @returns The refund details
   */
  async refundPayment(paymentId, amount) {
    if (this.razorpay.key_id === "rzp_test_mock") {
      return {
        id: `refund_${Date.now()}`,
        payment_id: paymentId,
        amount: amount || 1e5,
        // Default to ₹1000 if no amount specified
        currency: "INR",
        status: "processed",
        created_at: Date.now()
      };
    }
    try {
      const refundOptions = {};
      if (amount) {
        refundOptions.amount = amount;
      }
      const refund = await this.razorpay.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (error) {
      console.error("Error refunding payment:", error);
      throw error;
    }
  }
  /**
   * Create a mock order for testing
   * @param options Order creation options
   * @returns Mock order object
   */
  createMockOrder(options) {
    return {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: options.amount,
      amount_paid: 0,
      amount_due: options.amount,
      currency: options.currency || "INR",
      receipt: options.receipt || `receipt_${Date.now()}`,
      status: "created",
      attempts: 0,
      notes: {
        ...options.notes,
        userId: options.userId.toString()
      },
      created_at: Math.floor(Date.now() / 1e3)
    };
  }
};
var paymentService = new PaymentService();

// server/services/walletService.ts
var WalletService = class {
  /**
   * Get wallet balance for a user
   * @param userId User ID
   * @returns Wallet balance
   */
  async getBalance(userId) {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.walletBalance || 0;
  }
  /**
   * Get transaction history for a user
   * @param userId User ID
   * @returns Array of transactions
   */
  async getTransactionHistory(userId) {
    return await storage.getTransactionsByUserId(userId);
  }
  /**
   * Add funds to a user's wallet
   * @param userId User ID
   * @param amount Amount to add (in rupees)
   * @param source Source of the funds (e.g., 'payment', 'admin', 'refund')
   * @param reference Reference information (e.g., payment ID)
   * @returns Updated wallet balance
   */
  async addFunds(userId, amount, source, reference) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const currentBalance = user.walletBalance || 0;
    const newBalance = currentBalance + amount;
    await storage.updateUser(userId, { walletBalance: newBalance });
    await storage.createTransaction({
      userId,
      amount,
      type: "credit",
      description: `Wallet credit via ${source} (${reference})`,
      serviceType: "wallet"
    });
    return newBalance;
  }
  /**
   * Deduct funds from a user's wallet
   * @param userId User ID
   * @param amount Amount to deduct (in rupees)
   * @param service Service using the funds (e.g., 'recharge', 'booking')
   * @param description Description of the transaction
   * @returns Updated wallet balance
   */
  async deductFunds(userId, amount, service, description) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const currentBalance = user.walletBalance || 0;
    if (currentBalance < amount) {
      throw new Error("Insufficient wallet balance");
    }
    const newBalance = currentBalance - amount;
    await storage.updateUser(userId, { walletBalance: newBalance });
    await storage.createTransaction({
      userId,
      amount,
      type: "debit",
      description,
      serviceType: service
    });
    return newBalance;
  }
  /**
   * Create a payment order for wallet recharge
   * @param userId User ID
   * @param amount Amount to add (in rupees)
   * @returns Payment order details
   */
  async createRechargeOrder(userId, amount) {
    if (amount < 100) {
      throw new Error("Minimum amount should be \u20B9100");
    }
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const amountInPaise = Math.round(amount * 100);
    const receipt = `wallet_${userId}_${Date.now()}`;
    const order = await paymentService.createOrder({
      amount: amountInPaise,
      receipt,
      notes: {
        type: "wallet_recharge",
        userEmail: user.email
      },
      userId
    });
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mock";
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: razorpayKeyId
    };
  }
  /**
   * Verify payment and add funds to wallet
   * @param userId User ID
   * @param paymentData Payment verification data
   * @returns Verification result
   */
  async verifyPaymentAndAddFunds(userId, paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    const isValid = paymentService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });
    if (!isValid) {
      throw new Error("Invalid payment signature");
    }
    const payment = await paymentService.getPayment(razorpay_payment_id);
    if (payment.status !== "captured") {
      throw new Error("Payment not completed");
    }
    const order = await paymentService.getOrder(razorpay_order_id);
    const amountInRupees = Number(order.amount) / 100;
    const newBalance = await this.addFunds(
      userId,
      amountInRupees,
      "Razorpay",
      razorpay_payment_id
    );
    return {
      success: true,
      message: "Payment verified and wallet updated",
      balance: newBalance
    };
  }
  /**
   * Add funds to a user's wallet by admin
   * @param adminId Admin user ID
   * @param userId User ID to credit
   * @param amount Amount to add
   * @param reason Reason for manual credit
   * @returns Updated wallet balance
   */
  async addFundsByAdmin(adminId, userId, amount, reason) {
    const admin = await storage.getUser(adminId);
    if (!admin || admin.userType !== "admin") {
      throw new Error("Unauthorized: Only admin can perform this action");
    }
    return await this.addFunds(
      userId,
      amount,
      "admin credit",
      `by admin ${admin.username}: ${reason}`
    );
  }
  /**
   * Add funds to user's own wallet for testing/demo purposes
   * @param userId User ID
   * @param amount Amount to add
   * @returns Updated wallet balance
   */
  async addTestFunds(userId, amount) {
    if (amount <= 0 || amount > 1e4) {
      throw new Error("Amount must be between 1 and 10,000");
    }
    return await this.addFunds(
      userId,
      amount,
      "test credit",
      "Demo funds added for testing"
    );
  }
};
var walletService = new WalletService();

// server/services/busService.ts
import { z as z3 } from "zod";
var BUS_API_BASE_URL = "http://test.services.travelomatix.com/webservices/index.php/bus_v3/service";
var BUS_USERNAME = "test305528";
var BUS_DOMAIN_KEY = "TMX2663051694580020";
var BUS_PASSWORD = "test@305";
var BUS_SYSTEM = "test";
var BusSearchSchema = z3.object({
  source_city: z3.string(),
  source_code: z3.string(),
  destination_city: z3.string(),
  destination_code: z3.string(),
  depart_date: z3.string()
  // YYYY-MM-DD format
});
var SeatLayoutSchema = z3.object({
  TraceId: z3.number(),
  ResultIndex: z3.number()
});
var BoardingPointsSchema = z3.object({
  TraceId: z3.number(),
  ResultIndex: z3.number()
});
var BlockSeatSchema = z3.object({
  TraceId: z3.number(),
  ResultIndex: z3.number(),
  Seats: z3.array(z3.object({
    SeatIndex: z3.string(),
    SeatType: z3.number()
  })),
  BoardingPointId: z3.number(),
  DroppingPointId: z3.number()
});
var BookTicketSchema = z3.object({
  TraceId: z3.number(),
  ResultIndex: z3.number(),
  Passengers: z3.array(z3.object({
    Name: z3.string(),
    Age: z3.number(),
    Gender: z3.enum(["Male", "Female"]),
    SeatIndex: z3.string(),
    SeatType: z3.number()
  })),
  BoardingPointId: z3.number(),
  DroppingPointId: z3.number()
});
var CancelTicketSchema = z3.object({
  TraceId: z3.number(),
  ResultIndex: z3.number(),
  SeatIndex: z3.array(z3.string())
});
async function makeTravelomatixRequest(endpoint, payload = {}) {
  try {
    console.log(`Making Travelomatix request to: ${BUS_API_BASE_URL}/${endpoint}`);
    console.log("Request payload:", JSON.stringify(payload, null, 2));
    const response = await fetch(`${BUS_API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "x-Username": BUS_USERNAME,
        "x-DomainKey": BUS_DOMAIN_KEY,
        "x-Password": BUS_PASSWORD,
        "x-system": BUS_SYSTEM,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`Travelomatix API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Travelomatix response:", JSON.stringify(data, null, 2));
    if (data.error || data.status && data.status !== "success") {
      throw new Error(`Travelomatix API error: ${data.message || data.error || "Unknown error"}`);
    }
    return data;
  } catch (error) {
    console.error("Travelomatix API request failed:", error);
    throw error;
  }
}
var BusService = class {
  // Search for available buses using Travelomatix API
  static async searchBuses(searchParams) {
    const validatedParams = BusSearchSchema.parse(searchParams);
    const payload = {
      OriginId: validatedParams.source_code,
      DestinationId: validatedParams.destination_code,
      JourneyDate: validatedParams.depart_date
    };
    try {
      console.log("Attempting Travelomatix bus search with payload:", payload);
      const response = await makeTravelomatixRequest("Search", payload);
      if (response.Status === 0 && response.Message === "No Bus Found!!") {
        console.log("No buses found from Travelomatix API - this is normal for test environment");
        throw new Error("No buses found");
      }
      const buses = response.BusResults || response.busResults || response.data || response.result || [];
      console.log("Bus search completed, found buses:", buses.length);
      return {
        traceId: response.TraceId || response.traceId || Date.now(),
        buses: this.formatTravelomatixBuses(buses),
        searchParams: validatedParams
      };
    } catch (error) {
      console.error("Travelomatix bus search error:", error.message);
      if (error.message.includes("401") || error.message.includes("unauthorized")) {
        throw new Error("Bus API authentication failed. Please contact support.");
      } else if (error.message.includes("404") || error.message.includes("not found")) {
        throw new Error("No buses found for this route on selected date.");
      } else {
        throw new Error("Bus search service temporarily unavailable. Please try again later.");
      }
    }
  }
  // Get seat layout for a specific bus using Travelomatix API
  static async getSeatLayout(params) {
    const validatedParams = SeatLayoutSchema.parse(params);
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex
    };
    const response = await makeTravelomatixRequest("GetSeatLayout", payload);
    return {
      traceId: response.traceId || validatedParams.TraceId,
      availableSeats: response.availableSeats || 0,
      seatLayout: response.seatLayout || response.result || [],
      upperSeatLayout: response.upperSeatLayout || []
    };
  }
  // Get boarding and dropping points using Travelomatix API
  static async getBoardingPoints(params) {
    const validatedParams = BoardingPointsSchema.parse(params);
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex
    };
    const response = await makeTravelomatixRequest("GetBoardingPoints", payload);
    return {
      traceId: response.traceId || validatedParams.TraceId,
      boardingPoints: response.boardingPoints || response.result?.boardingPoints || [],
      droppingPoints: response.droppingPoints || response.result?.droppingPoints || []
    };
  }
  // Block seats temporarily using Travelomatix API
  static async blockSeats(params) {
    const validatedParams = BlockSeatSchema.parse(params);
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex,
      seats: validatedParams.Seats,
      boardingPointId: validatedParams.BoardingPointId,
      droppingPointId: validatedParams.DroppingPointId
    };
    const response = await makeTravelomatixRequest("BlockSeat", payload);
    return {
      traceId: response.traceId || validatedParams.TraceId,
      isBlocked: response.isBlocked || response.success || false,
      blockId: response.blockId || response.id,
      expiryTime: response.expiryTime || response.expiry
    };
  }
  // Book the ticket using Travelomatix API
  static async bookTicket(params) {
    const validatedParams = BookTicketSchema.parse(params);
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex,
      passengers: validatedParams.Passengers,
      boardingPointId: validatedParams.BoardingPointId,
      droppingPointId: validatedParams.DroppingPointId
    };
    const response = await makeTravelomatixRequest("BookTicket", payload);
    return {
      traceId: response.traceId || validatedParams.TraceId,
      bookingStatus: response.bookingStatus || response.status,
      pnr: response.pnr || response.bookingReference,
      ticketNumber: response.ticketNumber || response.ticketId,
      totalFare: response.totalFare || response.amount,
      bookingId: response.bookingId || response.id
    };
  }
  // Cancel booked ticket using Travelomatix API
  static async cancelTicket(params) {
    const validatedParams = CancelTicketSchema.parse(params);
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex,
      seatIndexes: validatedParams.SeatIndex
    };
    const response = await makeTravelomatixRequest("CancelTicket", payload);
    return {
      traceId: response.traceId || validatedParams.TraceId,
      cancellationStatus: response.cancellationStatus || response.status,
      refundAmount: response.refundAmount || response.refund,
      cancellationCharge: response.cancellationCharge || response.charges
    };
  }
  // Get popular Tamil Nadu routes
  static getPopularTNRoutes() {
    return [
      { source: "Chennai", sourceCode: "1001", destination: "Coimbatore", destinationCode: "2001" },
      { source: "Chennai", sourceCode: "1001", destination: "Madurai", destinationCode: "3001" },
      { source: "Chennai", sourceCode: "1001", destination: "Trichy", destinationCode: "4001" },
      { source: "Coimbatore", sourceCode: "2001", destination: "Bangalore", destinationCode: "5001" },
      { source: "Chennai", sourceCode: "1001", destination: "Salem", destinationCode: "6001" },
      { source: "Chennai", sourceCode: "1001", destination: "Tirunelveli", destinationCode: "7001" },
      { source: "Madurai", sourceCode: "3001", destination: "Coimbatore", destinationCode: "2001" },
      { source: "Chennai", sourceCode: "1001", destination: "Vellore", destinationCode: "8001" },
      { source: "Chennai", sourceCode: "1001", destination: "Thanjavur", destinationCode: "9001" },
      { source: "Coimbatore", sourceCode: "2001", destination: "Kochi", destinationCode: "10001" }
    ];
  }
  // Calculate commission distribution for bus booking
  static calculateCommissionDistribution(totalCommission) {
    const commissionStructure = {
      admin: { percent: 1, amount: 0 },
      branch_manager: { percent: 1.5, amount: 0 },
      taluk_manager: { percent: 1.5, amount: 0 },
      service_agent: { percent: 2, amount: 0 }
    };
    const baseAmount = totalCommission / 0.06;
    commissionStructure.admin.amount = baseAmount * (commissionStructure.admin.percent / 100);
    commissionStructure.branch_manager.amount = baseAmount * (commissionStructure.branch_manager.percent / 100);
    commissionStructure.taluk_manager.amount = baseAmount * (commissionStructure.taluk_manager.percent / 100);
    commissionStructure.service_agent.amount = baseAmount * (commissionStructure.service_agent.percent / 100);
    return commissionStructure;
  }
  // Format Travelomatix bus search results for frontend
  static formatTravelomatixBuses(buses) {
    return buses.map((bus) => ({
      resultIndex: bus.resultIndex || bus.id,
      busType: bus.busType || bus.type || "AC Seater",
      serviceName: bus.serviceName || bus.operatorName || "Bus Service",
      travelName: bus.travelName || bus.operator || bus.travels,
      departureTime: bus.departureTime || bus.departure,
      arrivalTime: bus.arrivalTime || bus.arrival,
      duration: this.calculateDuration(bus.departureTime || bus.departure, bus.arrivalTime || bus.arrival),
      availableSeats: bus.availableSeats || bus.seatsAvailable || 0,
      price: {
        basePrice: bus.fare || bus.price || bus.cost || 0,
        offeredPrice: bus.discountedFare || bus.fare || bus.price || 0,
        agentCommission: bus.commission || 0,
        currencyCode: bus.currency || "INR"
      },
      boardingPoints: bus.boardingPoints?.length || 0,
      droppingPoints: bus.droppingPoints?.length || 0,
      cancellationPolicies: bus.cancellationPolicies || [],
      features: {
        idProofRequired: bus.idProofRequired || false,
        liveTracking: bus.liveTracking || false,
        mTicket: bus.mTicket || false,
        partialCancellation: bus.partialCancellation || false
      }
    }));
  }
  // Format bus search results for frontend (legacy method)
  static formatBusResults(buses) {
    return this.formatTravelomatixBuses(buses);
  }
  // Calculate journey duration
  static calculateDuration(departureTime, arrivalTime) {
    if (!departureTime || !arrivalTime) return "N/A";
    try {
      const departure = new Date(departureTime);
      const arrival = new Date(arrivalTime);
      const diffMs = arrival.getTime() - departure.getTime();
      const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
      const diffMinutes = Math.floor(diffMs % (1e3 * 60 * 60) / (1e3 * 60));
      return `${diffHours}h ${diffMinutes}m`;
    } catch (error) {
      return "N/A";
    }
  }
  // Test Travelomatix API connection
  static async testConnection() {
    try {
      console.log("Testing Travelomatix API connection...");
      const testPayload = {
        originId: "1",
        // Chennai
        destinationId: "2",
        // Coimbatore  
        travelDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        // Today's date
      };
      const response = await makeTravelomatixRequest("Search", testPayload);
      console.log("Travelomatix connection test successful");
      return {
        success: true,
        message: "Travelomatix API connected successfully",
        data: response
      };
    } catch (error) {
      console.error("Travelomatix connection test failed:", error.message);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error: error.message
      };
    }
  }
  // Get city list for Travelomatix (if available)
  static async getCityList() {
    try {
      const response = await makeTravelomatixRequest("GetCityList", {});
      return response.cities || response.data || this.getPopularTNRoutes();
    } catch (error) {
      console.error("Failed to fetch city list, using fallback:", error);
      return this.getPopularTNRoutes();
    }
  }
};

// server/services/imageService.ts
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always use absolute path based on current file directory
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const categoryImagesDir = path.join(uploadsDir, "grocery-categories");
const subcategoryImagesDir = path.join(uploadsDir, "grocery-subcategories");

fs.mkdirSync(categoryImagesDir, { recursive: true });
fs.mkdirSync(subcategoryImagesDir, { recursive: true });

var fallbackImages = {
  // Default fallback image for any missing image
  default: "/uploads/fallback/default.svg",
  // Category-specific fallbacks
  category: {
    fruits: "/uploads/fallback/fruits.svg",
    vegetables: "/uploads/fallback/vegetables.svg",
    oils: "/uploads/fallback/oils.svg",
    grains: "/uploads/fallback/grains.svg",
    organic: "/uploads/fallback/organic.svg"
  },
  // Subcategory-specific fallbacks
  subcategory: {
    "coconut oil": "/uploads/fallback/coconut-oil.svg",
    "groundnut oil": "/uploads/fallback/groundnut-oil.svg",
    "olive oil": "/uploads/fallback/olive-oil.svg",
    "palm oil": "/uploads/fallback/palm-oil.svg"
  }
};
var fallbackDir = path.join(uploadsDir, "fallback");
fs.mkdirSync(fallbackDir, { recursive: true });
function imageExists(imagePath) {
  if (!imagePath.startsWith("/uploads")) {
    imagePath = path.join(uploadsDir, imagePath);
  } else {
    imagePath = path.join(process.cwd(), imagePath);
  }
  try {
    return fs.existsSync(imagePath);
  } catch (error) {
    console.error(`Error checking if image exists at ${imagePath}:`, error);
    return false;
  }
}
function getImageUrlWithFallback(imageUrl, type, name) {
  if (!imageUrl) {
    const nameLower2 = name.toLowerCase();
    if (type === "subcategory" && (nameLower2 === "coconut oil" || nameLower2 === "groundnut oil" || nameLower2 === "olive oil" || nameLower2 === "palm oil")) {
      const formattedName = nameLower2.replace(/\s+/g, "-");
      return `/api/svg/fallback/${formattedName}`;
    }
    const specificFallback2 = fallbackImages[type][nameLower2];
    if (specificFallback2) {
      return specificFallback2;
    }
    return fallbackImages.default;
  }
  if (imageExists(imageUrl)) {
    return imageUrl;
  }
  const nameLower = name.toLowerCase();
  if (type === "subcategory" && (nameLower === "coconut oil" || nameLower === "groundnut oil" || nameLower === "olive oil" || nameLower === "palm oil")) {
    const formattedName = nameLower.replace(/\s+/g, "-");
    return `/api/svg/fallback/${formattedName}`;
  }
  const specificFallback = fallbackImages[type][nameLower];
  if (specificFallback) {
    return specificFallback;
  }
  return fallbackImages.default;
}
function generateFallbackImages() {
  const createFallbackSvg = (filename, color) => {
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${filename.split(".")[0].replace(/-/g, " ")}
      </text>
    </svg>`;
    fs.writeFileSync(path.join(fallbackDir, filename), svg);
  };
  createFallbackSvg("default.svg", "#888888");
  createFallbackSvg("fruits.svg", "#ff7f50");
  createFallbackSvg("vegetables.svg", "#32cd32");
  createFallbackSvg("oils.svg", "#ffd700");
  createFallbackSvg("grains.svg", "#deb887");
  createFallbackSvg("organic.svg", "#228b22");
  createFallbackSvg("coconut-oil.svg", "#f5deb3");
  createFallbackSvg("groundnut-oil.svg", "#d2b48c");
  createFallbackSvg("olive-oil.svg", "#556b2f");
  createFallbackSvg("palm-oil.svg", "#8b4513");
  console.log("Generated fallback images successfully");
}
try {
  generateFallbackImages();
} catch (error) {
  console.error("Error generating fallback images:", error);
}

// server/routes.ts
init_commissionService();

// server/services/dummyDataService.ts
init_db();
init_schema();
import { eq as eq3 } from "drizzle-orm";
import bcrypt from "bcrypt";
var DummyDataService = class {
  /**
   * Check if dummy data is already loaded into the database
   */
  async isDummyDataLoaded() {
    try {
      const categories = await db.select().from(groceryCategories);
      const subcategories = await db.select().from(grocerySubCategories);
      const products = await db.select().from(groceryProducts);
      return categories.length > 0 && subcategories.length > 0 && products.length > 0;
    } catch (error) {
      console.error("Error checking dummy data:", error);
      return false;
    }
  }
  /**
   * Load dummy data into the database
   */
  async loadDummyData() {
    try {
      const isLoaded = await this.isDummyDataLoaded();
      if (isLoaded) {
        console.log("Dummy data already loaded, skipping...");
        return;
      }
      await this.loadDummyCategories();
      await this.loadDummySubcategories();
      await this.loadDummyProducts();
      console.log("All dummy data loaded successfully");
    } catch (error) {
      console.error("Error loading dummy data:", error);
      throw error;
    }
  }
  /**
   * Clear all dummy data from the database
   */
  async clearDummyData() {
    try {
      await db.delete(groceryProducts);
      await db.delete(grocerySubCategories);
      await db.delete(groceryCategories);
      console.log("All dummy data cleared successfully");
    } catch (error) {
      console.error("Error clearing dummy data:", error);
      throw error;
    }
  }
  /**
   * Load dummy categories
   */
  async loadDummyCategories() {
    const existingCategories = await db.select().from(groceryCategories);
    if (existingCategories.length > 0) {
      console.log("Categories already exist, skipping category creation");
      return;
    }
    const categories = [
      { name: "Fruits", description: "Fresh fruits from local farmers", icon: "\u{1F34E}", color: "#FF5733", isActive: true, displayOrder: 1, status: "active" },
      { name: "Vegetables", description: "Fresh vegetables from local farmers", icon: "\u{1F966}", color: "#1E8449", isActive: true, displayOrder: 2, status: "active" },
      { name: "Dairy", description: "Milk, cheese, and other dairy products", icon: "\u{1F95B}", color: "#F7F4E9", isActive: true, displayOrder: 3, status: "active" },
      { name: "Oils", description: "Cooking oils and ghee", icon: "\u{1FAD2}", color: "#F4D03F", isActive: true, displayOrder: 4, status: "active" },
      { name: "Grains", description: "Rice, wheat, and other grains", icon: "\u{1F33E}", color: "#D4AC0D", isActive: true, displayOrder: 5, status: "active" },
      { name: "Spices", description: "Spices and condiments", icon: "\u{1F336}\uFE0F", color: "#E74C3C", isActive: true, displayOrder: 6, status: "active" }
    ];
    for (const category of categories) {
      await db.insert(groceryCategories).values(category);
    }
    console.log(`${categories.length} categories loaded successfully`);
  }
  /**
   * Load dummy subcategories
   */
  async loadDummySubcategories() {
    const existingSubcategories = await db.select().from(grocerySubCategories);
    if (existingSubcategories.length > 0) {
      console.log("Subcategories already exist, skipping subcategory creation");
      return;
    }
    const categories = await db.select().from(groceryCategories);
    const categoryMap = new Map(categories.map((c) => [c.name, c.id]));
    const subcategories = [
      { name: "Apples", description: "Different varieties of apples", parentCategoryId: categoryMap.get("Fruits"), isActive: true },
      { name: "Bananas", description: "Fresh bananas", parentCategoryId: categoryMap.get("Fruits"), isActive: true },
      { name: "Oranges", description: "Sweet juicy oranges", parentCategoryId: categoryMap.get("Fruits"), isActive: true },
      { name: "Berries", description: "Various berries", parentCategoryId: categoryMap.get("Fruits"), isActive: true },
      { name: "Stone Fruits", description: "Peaches, plums, etc.", parentCategoryId: categoryMap.get("Fruits"), isActive: true },
      { name: "Leafy Greens", description: "Spinach, kale, etc.", parentCategoryId: categoryMap.get("Vegetables"), isActive: true },
      { name: "Root Vegetables", description: "Carrots, potatoes, etc.", parentCategoryId: categoryMap.get("Vegetables"), isActive: true },
      { name: "Cruciferous", description: "Broccoli, cauliflower, etc.", parentCategoryId: categoryMap.get("Vegetables"), isActive: true },
      { name: "Gourds", description: "Pumpkins, squash, etc.", parentCategoryId: categoryMap.get("Vegetables"), isActive: true },
      { name: "Alliums", description: "Onions, garlic, etc.", parentCategoryId: categoryMap.get("Vegetables"), isActive: true },
      { name: "Milk", description: "Fresh milk", parentCategoryId: categoryMap.get("Dairy"), isActive: true },
      { name: "Cheese", description: "Various cheeses", parentCategoryId: categoryMap.get("Dairy"), isActive: true },
      { name: "Yogurt", description: "Traditional and flavored yogurts", parentCategoryId: categoryMap.get("Dairy"), isActive: true },
      { name: "Butter", description: "Butter and ghee", parentCategoryId: categoryMap.get("Dairy"), isActive: true },
      { name: "Olive Oil", description: "Extra virgin and regular olive oils", parentCategoryId: categoryMap.get("Oils"), isActive: true },
      { name: "Coconut Oil", description: "Cold pressed coconut oils", parentCategoryId: categoryMap.get("Oils"), isActive: true },
      { name: "Groundnut Oil", description: "Peanut/groundnut oils", parentCategoryId: categoryMap.get("Oils"), isActive: true },
      { name: "Sesame Oil", description: "Traditional sesame oils", parentCategoryId: categoryMap.get("Oils"), isActive: true },
      { name: "Rice", description: "Various types of rice", parentCategoryId: categoryMap.get("Grains"), isActive: true },
      { name: "Wheat", description: "Wheat products", parentCategoryId: categoryMap.get("Grains"), isActive: true },
      { name: "Oats", description: "Oats and oatmeal", parentCategoryId: categoryMap.get("Grains"), isActive: true },
      { name: "Millets", description: "Various millet grains", parentCategoryId: categoryMap.get("Grains"), isActive: true },
      { name: "Chili Powders", description: "Various chili powders", parentCategoryId: categoryMap.get("Spices"), isActive: true },
      { name: "Whole Spices", description: "Whole spices like cardamom, cloves", parentCategoryId: categoryMap.get("Spices"), isActive: true },
      { name: "Spice Blends", description: "Pre-mixed spice blends", parentCategoryId: categoryMap.get("Spices"), isActive: true },
      { name: "Turmeric", description: "Ground turmeric powder", parentCategoryId: categoryMap.get("Spices"), isActive: true }
    ];
    for (const subcategory of subcategories) {
      if (subcategory.parentCategoryId) {
        await db.insert(grocerySubCategories).values(subcategory);
      } else {
        console.warn(`Skipping subcategory ${subcategory.name} - parent category not found`);
      }
    }
    console.log(`${subcategories.length} subcategories loaded successfully`);
  }
  /**
   * Load dummy products
   */
  async loadDummyProducts() {
    const existingProducts = await db.select().from(groceryProducts);
    if (existingProducts.length > 0) {
      console.log("Products already exist, skipping product creation");
      return;
    }
    const subcategories = await db.select().from(grocerySubCategories);
    const subcategoryMap = new Map(subcategories.map((sc) => [sc.name, { id: sc.id, categoryId: sc.parentCategoryId }]));
    let provider = await db.select().from(serviceProviders).limit(1);
    let providerId = provider[0]?.id;
    if (!providerId) {
      console.warn("No provider found. Creating dummy provider...");
      const existingUser = await db.select().from(users).where(eq3(users.username, "dummy_provider")).limit(1);
      let userId;
      if (existingUser.length > 0) {
        console.log("Dummy provider user already exists");
        userId = existingUser[0].id;
      } else {
        const hashedPassword = await bcrypt.hash("dummy@123", 10);
        const [user] = await db.insert(users).values({
          username: "dummy_provider",
          fullName: "Dummy Provider",
          email: "dummy@provider.com",
          phone: "9999999999",
          password: hashedPassword,
          userType: "provider",
          createdAt: /* @__PURE__ */ new Date()
        }).returning({ id: users.id });
        userId = user.id;
      }
      const existingProvider = await db.select().from(serviceProviders).where(eq3(serviceProviders.userId, userId)).limit(1);
      if (existingProvider.length > 0) {
        console.log("Dummy service provider already exists");
        providerId = existingProvider[0].id;
      } else {
        const [newProvider] = await db.insert(serviceProviders).values({
          userId,
          name: "Farmer",
          providerType: "farmer",
          district: "Chennai",
          taluk: "Guindy",
          pincode: "600032",
          // ✅ Add a valid dummy pincode
          address: "Somewhere in Tamil Nadu",
          phone: "9999999999",
          email: "dummy@provider.com",
          status: "active"
        }).returning({ id: serviceProviders.id });
        providerId = newProvider.id;
      }
    }
    const products = [
      { name: "Red Delicious Apples", description: "Sweet and crunchy red apples", price: 120, discountedPrice: 110, stock: 50, unit: "kg", isOrganic: true, district: "Chennai", categoryId: subcategoryMap.get("Apples")?.categoryId, subcategoryId: subcategoryMap.get("Apples")?.id, status: "active" },
      { name: "Green Granny Smith Apples", description: "Tart green apples perfect for cooking", price: 140, stock: 35, unit: "kg", isOrganic: false, district: "Coimbatore", categoryId: subcategoryMap.get("Apples")?.categoryId, subcategoryId: subcategoryMap.get("Apples")?.id, status: "active" },
      { name: "Organic Bananas", description: "Locally grown organic bananas", price: 60, stock: 100, unit: "dozen", isOrganic: true, district: "Madurai", categoryId: subcategoryMap.get("Bananas")?.categoryId, subcategoryId: subcategoryMap.get("Bananas")?.id, status: "active" },
      { name: "Fresh Spinach Bundle", description: "Organically grown spinach leaves", price: 40, discountedPrice: 35, stock: 30, unit: "bundle", isOrganic: true, district: "Trichy", categoryId: subcategoryMap.get("Leafy Greens")?.categoryId, subcategoryId: subcategoryMap.get("Leafy Greens")?.id, status: "active" },
      { name: "Organic Carrots", description: "Fresh orange carrots", price: 50, stock: 45, unit: "kg", isOrganic: true, district: "Salem", categoryId: subcategoryMap.get("Root Vegetables")?.categoryId, subcategoryId: subcategoryMap.get("Root Vegetables")?.id, status: "active" },
      { name: "Potatoes", description: "Fresh potatoes", price: 30, stock: 100, unit: "kg", isOrganic: false, district: "Coimbatore", categoryId: subcategoryMap.get("Root Vegetables")?.categoryId, subcategoryId: subcategoryMap.get("Root Vegetables")?.id, status: "active" },
      { name: "Extra Virgin Olive Oil", description: "Premium quality olive oil", price: 450, discountedPrice: 430, stock: 20, unit: "liter", isOrganic: true, district: "Chennai", categoryId: subcategoryMap.get("Olive Oil")?.categoryId, subcategoryId: subcategoryMap.get("Olive Oil")?.id, status: "active" },
      { name: "Cold Pressed Coconut Oil", description: "Traditional cold pressed coconut oil", price: 280, stock: 25, unit: "liter", isOrganic: true, district: "Kanyakumari", categoryId: subcategoryMap.get("Coconut Oil")?.categoryId, subcategoryId: subcategoryMap.get("Coconut Oil")?.id, status: "active" },
      { name: "Organic Brown Rice", description: "Nutritious brown rice", price: 95, stock: 50, unit: "kg", isOrganic: true, district: "Thanjavur", categoryId: subcategoryMap.get("Rice")?.categoryId, subcategoryId: subcategoryMap.get("Rice")?.id, status: "active" },
      { name: "Basmati Rice", description: "Aromatic basmati rice", price: 120, discountedPrice: 110, stock: 40, unit: "kg", isOrganic: false, district: "Thanjavur", categoryId: subcategoryMap.get("Rice")?.categoryId, subcategoryId: subcategoryMap.get("Rice")?.id, status: "active" },
      { name: "Organic Turmeric Powder", description: "High quality turmeric powder", price: 85, stock: 30, unit: "100g", isOrganic: true, district: "Erode", categoryId: subcategoryMap.get("Turmeric")?.categoryId, subcategoryId: subcategoryMap.get("Turmeric")?.id, status: "active" }
    ];
    let insertedCount = 0;
    for (const product of products) {
      if (product.categoryId && product.subcategoryId) {
        await db.insert(groceryProducts).values({
          ...product,
          providerId
        });
        insertedCount++;
      } else {
        console.warn(`Skipping product ${product.name} - category or subcategory not found`);
      }
    }
    console.log(`${insertedCount} products loaded successfully`);
  }
};
var dummyDataService = new DummyDataService();

// server/routes.ts
init_youtubeService();
var uploadsDir2 = path2.join(process.cwd(), "uploads");
fs3.mkdirSync(uploadsDir2, { recursive: true });
async function registerRoutes(app2) {
  app2.get("/api/videos/approved", async (req, res) => {
    try {
      const { district, taluk, pincode, category, limit = 20 } = req.query;
      console.log("Fetching approved videos for public display...");
      let whereConditions = [eq4(videoUploads.status, "approved")];
      if (district) {
        whereConditions.push(eq4(videoUploads.targetArea, district));
      }
      if (category && category !== "all") {
        whereConditions.push(eq4(videoUploads.category, category));
      }
      const videos2 = await db.select({
        id: videoUploads.id,
        title: videoUploads.title,
        description: videoUploads.description,
        fileName: videoUploads.fileName,
        fileUrl: videoUploads.filePath,
        fileSize: videoUploads.fileSize,
        duration: videoUploads.duration,
        thumbnailUrl: videoUploads.thumbnailUrl,
        uploadedBy: videoUploads.uploaderId,
        category: videoUploads.category,
        isPublic: sql2`true`,
        tags: sql2`ARRAY[]::text[]`,
        status: sql2`'active'`,
        viewCount: sql2`0`,
        createdAt: videoUploads.createdAt,
        updatedAt: videoUploads.updatedAt
      }).from(videoUploads).where(and2(...whereConditions)).orderBy(desc2(videoUploads.createdAt)).limit(parseInt(limit));
      console.log(`Found ${videos2.length} approved videos for public display`);
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching approved videos:", error);
      res.status(500).json({ message: "Error fetching approved videos" });
    }
  });
  try {
    await dummyDataService.loadDummyData();
    console.log("Dummy data check completed");
  } catch (error) {
    console.error("Failed to load dummy data:", error);
  }
  setupAuth(app2);
  app2.post("/api/register-provider", async (req, res) => {
    try {
      const providerData = {
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        userType: "provider",
        district: req.body.district
      };
      const existingUser = await storage.getUserByUsername(providerData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(providerData);
      const businessInfo = {
        userId: user.id,
        providerType: req.body.businessType,
        // Map businessType to providerType
        businessName: req.body.businessName,
        address: req.body.address,
        district: req.body.district,
        taluk: "Unknown",
        // Will be updated later
        pincode: "000000",
        // Will be updated later
        phone: req.body.phone,
        email: req.body.email,
        description: req.body.description,
        status: "pending",
        verificationStatus: "pending"
      };
      await storage.createServiceProvider(businessInfo);
      res.status(201).json({
        message: "Provider registration successful. Please wait for admin approval.",
        userId: user.id
      });
    } catch (error) {
      console.error("Provider registration error:", error);
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });
  registerSubcategoryRoutes(app2);
  registerOilRoutes(app2);
  app2.use("/uploads", (req, res, next) => {
    if (req.path.endsWith(".svg")) {
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    }
    next();
  }, express.static("uploads", {
    fallthrough: true,
    index: false,
    redirect: false,
    // Add special MIME type handling
    setHeaders: (res, path5) => {
      if (path5.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    }
  }));
  app2.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/api/dummy-data/status", async (_req, res) => {
    try {
      const isLoaded = await dummyDataService.isDummyDataLoaded();
      res.json({ isLoaded });
    } catch (error) {
      console.error("Error checking dummy data status:", error);
      res.status(500).json({ error: "Failed to check dummy data status" });
    }
  });
  app2.post("/api/dummy-data/load", async (_req, res) => {
    try {
      await dummyDataService.loadDummyData();
      res.json({ success: true, message: "Dummy data loaded successfully" });
    } catch (error) {
      console.error("Error loading dummy data:", error);
      res.status(500).json({ error: "Failed to load dummy data" });
    }
  });
  app2.post("/api/dummy-data/clear", async (_req, res) => {
    try {
      await dummyDataService.clearDummyData();
      res.json({ success: true, message: "Dummy data cleared successfully" });
    } catch (error) {
      console.error("Error clearing dummy data:", error);
      res.status(500).json({ error: "Failed to clear dummy data" });
    }
  });
  app2.get("/api/svg/fallback/:type", (req, res) => {
    const { type } = req.params;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    let svgContent = "";
    if (type === "oils") {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffc107">
        <path d="M9 10.223V7a2 2 0 012-2h2a2 2 0 012 2v3.223M9 10.223H5.5a2.5 2.5 0 00-2.5 2.5v2.554a2.5 2.5 0 002.5 2.5h13a2.5 2.5 0 002.5-2.5v-2.554a2.5 2.5 0 00-2.5-2.5H9z" stroke="#ffc107" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === "coconut-oil") {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#6c757d">
        <path d="M12 22c4.418 0 8-3.582 8-8 0-5-4-9-8-9s-8 4-8 9c0 4.418 3.582 8 8 8z" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9 7a3 3 0 013-3v0a3 3 0 013 3v0" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M15 15l-2-2" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === "groundnut-oil") {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#d9834b">
        <path d="M19 11.5c1 1.5 2 3.5 2 4.5 0 1.25-.5 2.5-1.5 3.5S17.25 21 16 21c-1 0-3-.5-4.5-1.5M5 12.5c-1-1.5-2-3.5-2-4.5 0-1.25.5-2.5 1.5-3.5S6.75 3 8 3c1 0 3 .5 4.5 1.5" stroke="#d9834b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14.5 6.5c1 .83 3.5 2.82 3.5 4.5 0 .5-.5 1-1 1s-1 .5-1 1-.5 1-1 1-1 .5-1 1c0 .83 1 1.5 1 2.5 0 .5-.5 1-1 1M9.5 17.5c-1-.83-3.5-2.82-3.5-4.5 0-.5.5-1 1-1s1-.5 1-1 .5-1 1-1 1-.5 1-1c0-.83-1-1.5-1-2.5 0-.5.5-1 1-1" stroke="#d9834b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === "olive-oil") {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#616000">
        <path d="M6.133 20.5C4.955 19.555 4 17.967 4 16c0-3.314 4-12 4-12s4 8.686 4 12c0 1.967-.955 3.555-2.133 4.5" stroke="#616000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M12 10s4 8.686 4 12c0 3.314-3.582 6-8 6-2.333 0-4.333-1-4.333-1" stroke="#616000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === "palm-oil") {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#e67e22">
        <path d="M12 22c4 0 8-3.582 8-8s-4-8-8-8-8 3.582-8 8 4 8 8 8z" stroke="#e67e22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9.5 9.5c0-1 .5-2 1.5-2.5M19 13c-1.657 0-3-1.12-3-2.5 0 1.38-1.343 2.5-3 2.5s-3-1.12-3-2.5c0 1.38-1.343 2.5-3 2.5s-3-1.12-3-2.5M12 22v-3" stroke="#e67e22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffc107">
        <path d="M9 10.223V7a2 2 0 012-2h2a2 2 0 012 2v3.223M9 10.223H5.5a2.5 2.5 0 00-2.5 2.5v2.554a2.5 2.5 0 002.5 2.5h13a2.5 2.5 0 002.5-2.5v-2.554a2.5 2.5 0 00-2.5-2.5H9z" stroke="#ffc107" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    }
    res.send(svgContent);
  });
  function ensureUserExists(req) {
    if (!req.user) {
      throw new Error("User not authenticated");
    }
  }
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };
  const hasRole = (roles) => {
    return (req, res, next) => {
      console.log(`[AUTH DEBUG] Role check - User: ${req.user?.username}, Type: ${req.user?.userType}, Required Roles: ${roles.join(",")}`);
      if (req.isAuthenticated() && roles.includes(req.user.userType)) {
        return next();
      }
      console.log(`[AUTH DEBUG] Permission denied - User: ${req.user?.username}, Type: ${req.user?.userType}, Required Roles: ${roles.join(",")}`);
      res.status(403).json({ message: "Insufficient permissions" });
    };
  };
  app2.get("/api/managers/branch", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const branchManagers = await storage.listUsers({ userType: "branch_manager" });
      res.json(branchManagers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branch managers" });
    }
  });
  app2.get("/api/managers/taluk", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      let filter = { userType: "taluk_manager" };
      if (user.userType === "branch_manager") {
        filter.parentId = user.id;
      } else if (user.userType !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const talukManagers = await storage.listUsers(filter);
      res.json(talukManagers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch taluk managers" });
    }
  });
  app2.get("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      let filter = { userType: "service_agent" };
      if (user.userType === "taluk_manager") {
        filter.parentId = user.id;
      } else if (user.userType === "branch_manager") {
        const talukManagers = await storage.listUsers({ userType: "taluk_manager", parentId: user.id });
        const talukManagerIds = talukManagers.map((tm) => tm.id);
        const allAgents = await storage.listUsers({ userType: "service_agent" });
        const filteredAgents = allAgents.filter((agent) => agent.parentId && talukManagerIds.includes(agent.parentId));
        return res.json(filteredAgents);
      } else if (user.userType !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      const serviceAgents = await storage.listUsers(filter);
      res.json(serviceAgents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service agents" });
    }
  });
  app2.post("/api/managers/branch", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        password: z6.string().min(6),
        userType: z6.literal("branch_manager"),
        district: z6.string().min(1)
      });
      const userData = userSchema.parse(req.body);
      userData.parentId = req.user.id;
      const branchManager = await storage.createUser(userData);
      const { password, ...managerWithoutPassword } = branchManager;
      res.status(201).json(managerWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data for branch manager" });
    }
  });
  app2.post("/api/managers/taluk", isAuthenticated, hasRole(["admin", "branch_manager"]), async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        password: z6.string().min(6),
        userType: z6.literal("taluk_manager"),
        district: z6.string().min(1),
        taluk: z6.string().min(1)
      });
      const userData = userSchema.parse(req.body);
      userData.parentId = req.user.id;
      const talukManager = await storage.createUser(userData);
      const { password, ...managerWithoutPassword } = talukManager;
      res.status(201).json(managerWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data for taluk manager" });
    }
  });
  app2.post("/api/agents", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager"]), async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        password: z6.string().min(6),
        userType: z6.literal("service_agent"),
        pincode: z6.string().min(6).max(6)
      });
      const userData = userSchema.parse(req.body);
      userData.parentId = req.user.id;
      const serviceAgent = await storage.createUser(userData);
      const { password, ...agentWithoutPassword } = serviceAgent;
      res.status(201).json(agentWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data for service agent" });
    }
  });
  app2.post("/api/manager-applications", async (req, res) => {
    try {
      const applicationData = insertManagerApplicationSchema.parse(req.body);
      const managerApplication = await storage.createManagerApplication(applicationData);
      const { password, ...applicationWithoutPassword } = managerApplication;
      res.status(201).json({
        success: true,
        message: "Your application has been submitted successfully. We will review it shortly.",
        application: applicationWithoutPassword
      });
    } catch (error) {
      console.error("Manager application submission error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid application data. Please check your information and try again."
      });
    }
  });
  app2.get("/api/manager-applications", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const status = req.query.status;
      const managerType = req.query.type;
      const filter = {};
      if (status) filter.status = status;
      if (managerType) filter.managerType = managerType;
      const applications2 = await storage.getManagerApplications(filter);
      const safeApplications = applications2.map((app3) => {
        const { password, ...appWithoutPassword } = app3;
        return appWithoutPassword;
      });
      res.json(safeApplications);
    } catch (error) {
      console.error("Error fetching manager applications:", error);
      res.status(500).json({ message: "Failed to fetch manager applications" });
    }
  });
  app2.get("/api/manager-applications/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getManagerApplication(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Manager application not found" });
      }
      const { password, ...applicationWithoutPassword } = application;
      res.json(applicationWithoutPassword);
    } catch (error) {
      console.error("Error fetching manager application:", error);
      res.status(500).json({ message: "Failed to fetch manager application" });
    }
  });
  app2.patch("/api/manager-applications/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const updatedData = {
        status,
        notes: notes || null
      };
      if (status === "approved") {
        updatedData.approvedBy = req.user.id;
      }
      const application = await storage.updateManagerApplication(parseInt(id), updatedData);
      if (!application) {
        return res.status(404).json({ message: "Manager application not found" });
      }
      if (status === "approved") {
        try {
          const userData = {
            username: application.username,
            password: application.password,
            // Password is already in the application
            fullName: application.fullName,
            email: application.email,
            phone: application.phone,
            userType: application.managerType,
            district: application.district,
            taluk: application.taluk,
            pincode: application.pincode,
            parentId: req.user.id,
            // Set admin as parent
            createdAt: /* @__PURE__ */ new Date()
          };
          await storage.createUser(userData);
        } catch (userCreationError) {
          console.error("Error creating user from application:", userCreationError);
        }
      }
      const { password, ...applicationWithoutPassword } = application;
      res.json({
        success: true,
        message: `Application ${status}`,
        application: applicationWithoutPassword
      });
    } catch (error) {
      console.error("Error updating manager application:", error);
      res.status(500).json({ message: "Failed to update manager application" });
    }
  });
  app2.post("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const feedback2 = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback2);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback data" });
    }
  });
  app2.get("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      let filter = {};
      if (user.userType === "customer") {
        filter.userId = user.id;
      }
      if (req.query.serviceType) {
        filter.serviceType = req.query.serviceType;
      }
      const feedback2 = await storage.listFeedback(filter);
      res.json(feedback2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });
  app2.get("/api/wallet", isAuthenticated, async (req, res) => {
    try {
      const balance = await walletService.getBalance(req.user.id);
      const transactions2 = await walletService.getTransactionHistory(req.user.id);
      res.json({
        balance,
        transactions: transactions2
      });
    } catch (error) {
      console.error("Wallet fetch error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch wallet data" });
    }
  });
  app2.post("/api/wallet/add-funds", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { userId, amount, reason } = req.body;
      if (!userId || !amount || !reason) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const newBalance = await walletService.addFundsByAdmin(
        req.user.id,
        userId,
        amount,
        reason
      );
      res.json({
        success: true,
        message: "Funds added successfully",
        balance: newBalance
      });
    } catch (error) {
      console.error("Add funds error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to add funds" });
    }
  });
  app2.post("/api/wallet/add-test-funds", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 1e4) {
        return res.status(400).json({ message: "Amount must be between 1 and 10,000" });
      }
      const newBalance = await walletService.addTestFunds(req.user.id, parsedAmount);
      res.json({
        success: true,
        message: "Test funds added successfully",
        balance: newBalance
      });
    } catch (error) {
      console.error("Error adding test funds:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to add funds"
      });
    }
  });
  app2.post("/api/wallet/recharge", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount < 100) {
        return res.status(400).json({ message: "Minimum recharge amount is \u20B9100" });
      }
      const order = await walletService.createRechargeOrder(req.user.id, amount);
      res.json(order);
    } catch (error) {
      console.error("Wallet recharge error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to initiate wallet recharge" });
    }
  });
  app2.post("/api/wallet/verify-payment", isAuthenticated, async (req, res) => {
    try {
      const result = await walletService.verifyPaymentAndAddFunds(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to verify payment" });
    }
  });
  app2.post("/api/wallet/transaction", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { userId, amount, type, description, serviceType } = req.body;
      if (!userId || !amount || !type || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      let newBalance;
      if (type === "credit") {
        newBalance = await walletService.addFunds(
          userId,
          amount,
          serviceType || "manual",
          description
        );
      } else if (type === "debit") {
        newBalance = await walletService.deductFunds(
          userId,
          amount,
          serviceType || "manual",
          description
        );
      } else {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
      res.json({
        success: true,
        message: "Transaction completed successfully",
        balance: newBalance
      });
    } catch (error) {
      console.error("Wallet transaction error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create transaction" });
    }
  });
  app2.post("/api/recharge", isAuthenticated, async (req, res) => {
    try {
      const processedBody = {
        ...req.body,
        amount: typeof req.body.amount === "string" ? parseFloat(req.body.amount) : req.body.amount,
        userId: req.user.id,
        status: "pending"
        // Always start with pending status
      };
      const rechargeData = insertRechargeSchema.parse(processedBody);
      try {
        const balance = await walletService.getBalance(req.user.id);
        if (balance < rechargeData.amount) {
          return res.status(400).json({
            message: "Insufficient wallet balance",
            currentBalance: balance,
            requiredAmount: rechargeData.amount
          });
        }
      } catch (walletError) {
        console.error("Wallet error:", walletError);
        return res.status(400).json({ message: "Could not verify wallet balance" });
      }
      let serviceAgentId = null;
      try {
        const user = await storage.getUser(req.user.id);
        if (user && user.pincode) {
          const serviceAgent = await storage.getUserByPincodeAndType(user.pincode, "service_agent");
          if (serviceAgent) {
            serviceAgentId = serviceAgent.id;
            console.log(`Found service agent ${serviceAgent.username} (ID: ${serviceAgent.id}) for user ${req.user.username} with pincode ${user.pincode}`);
          } else {
            console.warn(`No service agent found for pincode ${user.pincode}`);
          }
        } else {
          console.warn(`User ${req.user.id} has no pincode set`);
        }
      } catch (error) {
        console.error("Error finding service agent:", error);
      }
      const recharge = await storage.createRecharge({
        ...rechargeData,
        processedBy: serviceAgentId
      });
      const result = await rechargeService.processMobileRecharge({
        mobileNumber: rechargeData.mobileNumber,
        amount: rechargeData.amount,
        provider: rechargeData.provider,
        transactionId: recharge.id.toString()
      });
      const status = result.success ? "completed" : "failed";
      const updatedRecharge = await storage.updateRecharge(recharge.id, {
        status,
        completedAt: result.success ? /* @__PURE__ */ new Date() : void 0
      });
      if (result.success) {
        try {
          await walletService.deductFunds(
            req.user.id,
            rechargeData.amount,
            "recharge",
            `Mobile recharge for ${rechargeData.mobileNumber}`
          );
          if (serviceAgentId) {
            try {
              await commissionService.distributeCommissions(
                "recharge",
                recharge.id,
                rechargeData.amount,
                rechargeData.provider
              );
              console.log(`Commissions calculated for recharge ${recharge.id} processed by service agent ${serviceAgentId}`);
            } catch (commissionError) {
              console.error("Error calculating commissions:", commissionError);
            }
          } else {
            console.warn(`No service agent found for recharge ${recharge.id} - commission distribution skipped`);
          }
        } catch (walletError) {
          console.error("Error deducting from wallet:", walletError);
        }
      }
      Promise.resolve().then(() => (init_integrationService(), integrationService_exports)).then(({ integrationService: integrationService2 }) => {
        integrationService2.processRecharge(updatedRecharge).catch((err) => {
          console.error("Error processing recharge notifications:", err);
        });
      });
      res.status(201).json({
        ...updatedRecharge,
        apiResponse: result.message
      });
    } catch (error) {
      console.error("Recharge error:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid recharge data" });
    }
  });
  app2.get("/api/recharge", isAuthenticated, async (req, res) => {
    try {
      const recharges2 = await storage.getRechargesByUserId(req.user.id);
      res.json(recharges2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recharges" });
    }
  });
  app2.get("/api/recharge/history", isAuthenticated, async (req, res) => {
    try {
      const recharges2 = await storage.getRechargesByUserId(req.user.id);
      res.json(recharges2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recharge history" });
    }
  });
  app2.get("/api/recharge/plans/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      const circle = req.query.circle;
      const serviceType = req.query.serviceType;
      console.log(`Fetching plans for provider: ${provider}, service type: ${serviceType || "mobile"}`);
      const plans = await rechargeService.getAvailablePlans(provider, circle, serviceType);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });
  app2.post("/api/payment/create-order", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      const order = await walletService.createRechargeOrder(req.user.id, amount);
      res.json(order);
    } catch (error) {
      console.error("Payment order creation error:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create payment order" });
    }
  });
  app2.post("/api/payment/verify", isAuthenticated, async (req, res) => {
    try {
      const result = await walletService.verifyPaymentAndAddFunds(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to verify payment" });
    }
  });
  app2.post("/api/booking", isAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending"
        // Always start with pending status
      });
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < bookingData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      const booking = await storage.createBooking(bookingData);
      const updatedBooking = await storage.updateBooking(booking.id, { status: "confirmed" });
      const newBalance = (user.walletBalance || 0) - bookingData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      await storage.createTransaction({
        userId: user.id,
        amount: bookingData.amount,
        type: "debit",
        description: `${bookingData.bookingType} booking from ${bookingData.origin || ""} to ${bookingData.destination || ""}`,
        serviceType: "booking"
      });
      Promise.resolve().then(() => (init_integrationService(), integrationService_exports)).then(({ integrationService: integrationService2 }) => {
        integrationService2.processBooking(updatedBooking).catch((err) => {
          console.error("Error processing booking notifications:", err);
        });
      });
      res.status(201).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });
  app2.get("/api/booking", isAuthenticated, async (req, res) => {
    try {
      const bookings2 = await storage.getBookingsByUserId(req.user.id);
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.post("/api/rental", isAuthenticated, async (req, res) => {
    try {
      const rentalData = insertRentalSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending"
        // Always start with pending status
      });
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < rentalData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      const rental = await storage.createRental(rentalData);
      const updatedRental = await storage.updateRental(rental.id, { status: "active" });
      const newBalance = (user.walletBalance || 0) - rentalData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      await storage.createTransaction({
        userId: user.id,
        amount: rentalData.amount,
        type: "debit",
        description: `Rental for ${rentalData.itemName}`,
        serviceType: "rental"
      });
      Promise.resolve().then(() => (init_integrationService(), integrationService_exports)).then(({ integrationService: integrationService2 }) => {
        integrationService2.processRental(updatedRental).catch((err) => {
          console.error("Error processing rental notifications:", err);
        });
      });
      res.status(201).json(updatedRental);
    } catch (error) {
      res.status(400).json({ message: "Invalid rental data" });
    }
  });
  app2.get("/api/rental", isAuthenticated, async (req, res) => {
    try {
      const rentals2 = await storage.getRentalsByUserId(req.user.id);
      res.json(rentals2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rentals" });
    }
  });
  app2.post("/api/taxi", isAuthenticated, async (req, res) => {
    try {
      const taxiRideData = insertTaxiRideSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending"
        // Always start with pending status
      });
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < taxiRideData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      const taxiRide = await storage.createTaxiRide(taxiRideData);
      const updatedTaxiRide = await storage.updateTaxiRide(taxiRide.id, { status: "active" });
      const newBalance = (user.walletBalance || 0) - taxiRideData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      await storage.createTransaction({
        userId: user.id,
        amount: taxiRideData.amount,
        type: "debit",
        description: `Taxi ride from ${taxiRideData.pickup} to ${taxiRideData.dropoff}`,
        serviceType: "taxi"
      });
      Promise.resolve().then(() => (init_integrationService(), integrationService_exports)).then(({ integrationService: integrationService2 }) => {
        integrationService2.processTaxiRide(updatedTaxiRide).catch((err) => {
          console.error("Error processing taxi ride notifications:", err);
        });
      });
      res.status(201).json(updatedTaxiRide);
    } catch (error) {
      res.status(400).json({ message: "Invalid taxi ride data" });
    }
  });
  app2.get("/api/taxi", isAuthenticated, async (req, res) => {
    try {
      const taxiRides2 = await storage.getTaxiRidesByUserId(req.user.id);
      res.json(taxiRides2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch taxi rides" });
    }
  });
  app2.post("/api/delivery", isAuthenticated, async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending"
        // Always start with pending status
      });
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < deliveryData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      const delivery = await storage.createDelivery(deliveryData);
      const updatedDelivery = await storage.updateDelivery(delivery.id, { status: "picked_up" });
      const newBalance = (user.walletBalance || 0) - deliveryData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      await storage.createTransaction({
        userId: user.id,
        amount: deliveryData.amount,
        type: "debit",
        description: `Delivery from ${deliveryData.pickupAddress} to ${deliveryData.deliveryAddress}`,
        serviceType: "delivery"
      });
      Promise.resolve().then(() => (init_integrationService(), integrationService_exports)).then(({ integrationService: integrationService2 }) => {
        integrationService2.processDelivery(updatedDelivery).catch((err) => {
          console.error("Error processing delivery notifications:", err);
        });
      });
      res.status(201).json(updatedDelivery);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery data" });
    }
  });
  app2.get("/api/delivery", isAuthenticated, async (req, res) => {
    try {
      const deliveries2 = await storage.getDeliveriesByUserId(req.user.id);
      res.json(deliveries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });
  app2.post("/api/grocery/product", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager", "farmer"]), async (req, res) => {
    try {
      const productData = insertGroceryProductSchema.parse(req.body);
      if (req.user.userType === "farmer") {
        productData.farmerId = req.user.id;
        if (!productData.status) {
          productData.status = "pending";
        }
      } else {
        if (!productData.status) {
          productData.status = "active";
        }
      }
      if (!productData.deliveryOption) {
        productData.deliveryOption = "both";
      }
      const product = await storage.createGroceryProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Invalid grocery product data" });
    }
  });
  app2.get("/api/grocery/products", async (req, res) => {
    try {
      const filter = {};
      if (req.query.categoryId) {
        filter.categoryId = parseInt(req.query.categoryId);
      } else if (req.query.category) {
        filter.categoryId = parseInt(req.query.category);
      }
      if (req.query.subcategoryId) {
        filter.subcategoryId = parseInt(req.query.subcategoryId);
      }
      if (req.query.district) {
        filter.district = req.query.district;
      }
      if (req.query.isOrganic) {
        filter.isOrganic = req.query.isOrganic === "true";
      }
      if (req.query.farmerId) {
        filter.farmerId = parseInt(req.query.farmerId);
      }
      if (req.query.status) {
        filter.status = req.query.status;
      }
      if (req.query.availableAreas) {
        filter.availableAreas = req.query.availableAreas;
      }
      if (req.query.deliveryOption) {
        filter.deliveryOption = req.query.deliveryOption;
      }
      const products = await storage.getGroceryProducts(filter);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });
  app2.get("/api/grocery/my-products", isAuthenticated, hasRole(["farmer"]), async (req, res) => {
    try {
      ensureUserExists(req);
      const products = await storage.getGroceryProducts({ providerId: req.user.id });
      res.json(products);
    } catch (error) {
      console.error("Error fetching farmer products:", error);
      res.status(500).json({ message: "Failed to fetch your products" });
    }
  });
  app2.get("/api/grocery/product/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getGroceryProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.put("/api/grocery/product/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getGroceryProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (req.user.userType === "farmer" && product.farmerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this product" });
      }
      const updateData = req.body;
      if (req.user.userType === "farmer") {
        delete updateData.farmerId;
      }
      const updatedProduct = await storage.updateGroceryProduct(productId, updateData);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/grocery/product/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getGroceryProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (req.user.userType === "farmer" && product.farmerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this product" });
      }
      const updatedProduct = await storage.updateGroceryProduct(productId, { isActive: false });
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.put("/api/grocery/product/:id/status", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || !["active", "inactive", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const product = await storage.getGroceryProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const updatedProduct = await storage.updateGroceryProduct(productId, { status });
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product status:", error);
      res.status(500).json({ message: "Failed to update product status" });
    }
  });
  app2.get("/api/admin/grocery/products/pending", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const pendingProducts = await storage.getGroceryProductsForAdmin({ adminApproved: false });
      res.json(pendingProducts);
    } catch (error) {
      console.error("Error fetching pending grocery products for admin:", error);
      res.status(500).json({ message: "Failed to fetch pending products" });
    }
  });
  app2.patch("/api/admin/grocery/products/:id/approval", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { adminApproved, status } = req.body;
      console.log(`APPROVAL DEBUG: Product ID: ${productId}, adminApproved: ${adminApproved}, status: ${status}`);
      const updateData = {
        adminApproved,
        status: adminApproved ? "active" : "inactive"
      };
      console.log("APPROVAL DEBUG: Update data:", updateData);
      const updatedProduct = await storage.updateGroceryProduct(productId, updateData);
      console.log("APPROVAL DEBUG: Updated product:", updatedProduct);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product approval:", error);
      res.status(500).json({ message: "Failed to update product approval" });
    }
  });
  app2.post("/api/grocery/product/:id/image", isAuthenticated, async (req, res) => {
    res.status(501).json({ message: "Image upload not implemented yet" });
  });
  app2.post("/api/admin/grocery/categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Received grocery category data:", JSON.stringify(req.body));
      const categoryData = insertGroceryCategorySchema.parse(req.body);
      console.log("Validated grocery category data:", JSON.stringify(categoryData));
      const newCategory = await storage.createGroceryCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating grocery category:", error);
      if (error.errors) {
        console.error("Validation errors:", JSON.stringify(error.errors));
        return res.status(400).json({
          message: "Invalid grocery category data",
          errors: error.errors
        });
      } else if (error.message) {
        console.error("Error message:", error.message);
        return res.status(400).json({
          message: "Invalid grocery category data",
          error: error.message
        });
      }
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  app2.post("/api/grocery/category", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Received grocery category data (backward compatibility):", JSON.stringify(req.body));
      const categoryData = insertGroceryCategorySchema.parse(req.body);
      console.log("Validated grocery category data (backward compatibility):", JSON.stringify(categoryData));
      const newCategory = await storage.createGroceryCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating grocery category (backward compatibility):", error);
      if (error.errors) {
        console.error("Validation errors (backward compatibility):", JSON.stringify(error.errors));
        return res.status(400).json({
          message: "Invalid grocery category data",
          errors: error.errors
        });
      } else if (error.message) {
        console.error("Error message (backward compatibility):", error.message);
        return res.status(400).json({
          message: "Invalid grocery category data",
          error: error.message
        });
      }
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  app2.get("/api/grocery-categories", async (req, res) => {
    try {
      const categories = await storage.getGroceryCategories();
      const activeCategories = categories.filter((cat) => cat.isActive !== false);
      res.json(activeCategories);
    } catch (error) {
      console.error("Error fetching grocery categories:", error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });
  app2.get("/api/grocery-subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getGrocerySubCategories();
      const activeSubcategories = subcategories.filter((sub) => sub.isActive !== false);
      res.json(activeSubcategories);
    } catch (error) {
      console.error("Error fetching grocery subcategories:", error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });
  app2.get("/api/admin/grocery/categories", async (req, res) => {
    try {
      const categories = await storage.getGroceryCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching grocery categories:", error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });
  app2.get("/api/grocery/categories", async (req, res) => {
    try {
      const categories = await storage.getGroceryCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching grocery categories:", error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });
  app2.get("/api/grocery/category/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching grocery category:", error);
      res.status(500).json({ message: "Failed to fetch grocery category" });
    }
  });
  app2.patch("/api/admin/grocery/categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), categoryData);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating grocery category:", error);
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  app2.put("/api/grocery/category/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), categoryData);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating grocery category:", error);
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  app2.delete("/api/admin/grocery/categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), { isActive: false });
      res.json({
        message: "Grocery category deactivated successfully",
        category: updatedCategory
      });
    } catch (error) {
      console.error("Error deleting grocery category:", error);
      res.status(500).json({ message: "Failed to delete grocery category" });
    }
  });
  app2.delete("/api/grocery/category/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), { isActive: false });
      res.json({
        message: "Grocery category deactivated successfully",
        category: updatedCategory
      });
    } catch (error) {
      console.error("Error deleting grocery category:", error);
      res.status(500).json({ message: "Failed to delete grocery category" });
    }
  });
  fs3.mkdirSync(path2.join(uploadsDir2, "grocery-categories"), { recursive: true });
  const categoryImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path2.join(uploadsDir2, "grocery-categories"));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path2.extname(file.originalname);
      cb(null, "category-" + uniqueSuffix + ext);
    }
  });
  const uploadCategoryImage = multer({
    storage: categoryImageStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    // 2MB limit
    fileFilter: function(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    }
  });
  app2.post("/api/admin/grocery/categories/:id/image", isAuthenticated, hasRole(["admin"]), uploadCategoryImage.single("categoryImage"), async (req, res) => {
    try {
      ensureUserExists(req);
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getGroceryCategory(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      const imageUrl = `/uploads/grocery-categories/${req.file.filename}`;
      const updatedCategory = await storage.updateGroceryCategory(categoryId, {
        ...category,
        imageUrl
      });
      res.status(200).json({
        message: "Category image uploaded successfully",
        category: updatedCategory
      });
    } catch (error) {
      console.error("Error uploading category image:", error);
      res.status(500).json({ message: "Failed to upload category image" });
    }
  });
  app2.post("/api/admin/grocery/subcategories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategoryData = insertGrocerySubCategorySchema.parse(req.body);
      const parentCategory = await storage.getGroceryCategory(subcategoryData.parentCategoryId);
      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }
      if (!parentCategory.isActive) {
        return res.status(400).json({ message: "Cannot add subcategory to inactive category" });
      }
      const newSubcategory = await storage.createGrocerySubCategory(subcategoryData);
      res.status(201).json(newSubcategory);
    } catch (error) {
      console.error("Error creating grocery subcategory:", error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  app2.post("/api/grocery/subcategory", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategoryData = insertGrocerySubCategorySchema.parse(req.body);
      const parentCategory = await storage.getGroceryCategory(subcategoryData.parentCategoryId);
      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }
      if (!parentCategory.isActive) {
        return res.status(400).json({ message: "Cannot add subcategory to inactive category" });
      }
      const newSubcategory = await storage.createGrocerySubCategory(subcategoryData);
      res.status(201).json(newSubcategory);
    } catch (error) {
      console.error("Error creating grocery subcategory:", error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  app2.get("/api/grocery/subcategories", async (req, res) => {
    try {
      const parentCategoryId = req.query.parentCategoryId ? parseInt(req.query.parentCategoryId) : req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : true;
      const filter = {};
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      if (isActive !== void 0) {
        filter.isActive = isActive;
      }
      const subcategories = await storage.getGrocerySubCategories(filter);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching grocery subcategories:", error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });
  app2.get("/api/admin/grocery/subcategories", async (req, res) => {
    try {
      const parentCategoryId = req.query.parentCategoryId ? parseInt(req.query.parentCategoryId) : req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0;
      const filter = {};
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      if (isActive !== void 0) {
        filter.isActive = isActive;
      }
      const subcategories = await storage.getGrocerySubCategories(filter);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching grocery subcategories:", error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });
  app2.get("/api/subcategory-debug", async (req, res) => {
    try {
      const debugInfo = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        query: req.query,
        requestHeaders: req.headers,
        authStatus: req.isAuthenticated() ? "Authenticated" : "Not authenticated",
        userInfo: req.isAuthenticated() ? {
          id: req.user?.id,
          username: req.user?.username,
          userType: req.user?.userType
        } : null,
        storage: {
          type: storage.constructor.name,
          interfaces: Object.getOwnPropertyNames(Object.getPrototypeOf(storage))
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          databaseExists: !!process.env.DATABASE_URL,
          uploadsDir: fs3.existsSync(uploadsDir2)
        }
      };
      res.json({
        status: "SUCCESS",
        message: "Debug info collected successfully",
        debug: debugInfo
      });
    } catch (error) {
      console.error("[SUBCATEGORY DEBUG API] Error:", error);
      res.status(500).json({
        status: "ERROR",
        message: "Error collecting debug info",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/grocery/subcategories-public", async (req, res) => {
    try {
      console.log(`[SUBCATEGORY API] Received query params:`, req.query);
      console.log(`[SUBCATEGORY API] Authentication status: ${req.isAuthenticated() ? "Authenticated as " + req.user?.username : "Not authenticated"}`);
      console.log(`[SUBCATEGORY API] Storage type: ${storage.constructor.name}`);
      const parentCategoryId = req.query.parentCategoryId ? parseInt(req.query.parentCategoryId) : req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      if (parentCategoryId === 4) {
        console.log("[SUBCATEGORY API] \u26A0\uFE0F Oils category detected - using special handling");
        const oilSubcategories = [
          {
            id: 6,
            name: "Groundnut oil",
            description: "High-quality groundnut oil",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 2,
            imageUrl: "/uploads/fallback/groundnut-oil.svg",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          },
          {
            id: 7,
            name: "Olive oil",
            description: "Premium olive oil",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 3,
            imageUrl: "/uploads/fallback/olive-oil.svg",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          },
          {
            id: 11,
            name: "Palm oil",
            description: "Palm oil for cooking",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 4,
            imageUrl: "/uploads/fallback/palm-oil.svg",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          },
          {
            id: 5,
            name: "Coconut oil",
            description: "Pure coconut oil",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 1,
            imageUrl: "/uploads/fallback/coconut-oil.svg",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }
        ];
        console.log("[SUBCATEGORY API] Returning hardcoded oil subcategories for maximum reliability");
        try {
          generateFallbackImages();
        } catch (error) {
          console.error("[SUBCATEGORY API] Error generating fallback images:", error);
        }
        console.log(`[SUBCATEGORY API] Returning ${oilSubcategories.length} hardcoded oil subcategories`);
        return res.json(oilSubcategories);
      }
      const fallbackSubcategories = {
        // Fruits (ID 1)
        "1": [
          { id: 101, name: "Apples", description: "Fresh apples", parentCategoryId: 1, isActive: true, displayOrder: 1, imageUrl: "/uploads/fallback/apples.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
          { id: 102, name: "Bananas", description: "Fresh bananas", parentCategoryId: 1, isActive: true, displayOrder: 2, imageUrl: "/uploads/fallback/bananas.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
          { id: 103, name: "Oranges", description: "Fresh oranges", parentCategoryId: 1, isActive: true, displayOrder: 3, imageUrl: "/uploads/fallback/oranges.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
        ],
        // Vegetables (ID 2)
        "2": [
          { id: 201, name: "Tomatoes", description: "Fresh tomatoes", parentCategoryId: 2, isActive: true, displayOrder: 1, imageUrl: "/uploads/fallback/tomatoes.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
          { id: 202, name: "Potatoes", description: "Fresh potatoes", parentCategoryId: 2, isActive: true, displayOrder: 2, imageUrl: "/uploads/fallback/potatoes.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
          { id: 203, name: "Onions", description: "Fresh onions", parentCategoryId: 2, isActive: true, displayOrder: 3, imageUrl: "/uploads/fallback/onions.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
        ],
        // Grains (ID 3)
        "3": [
          { id: 301, name: "Rice", description: "Quality rice", parentCategoryId: 3, isActive: true, displayOrder: 1, imageUrl: "/uploads/fallback/rice.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
          { id: 302, name: "Wheat", description: "Quality wheat", parentCategoryId: 3, isActive: true, displayOrder: 2, imageUrl: "/uploads/fallback/wheat.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
          { id: 303, name: "Oats", description: "Quality oats", parentCategoryId: 3, isActive: true, displayOrder: 3, imageUrl: "/uploads/fallback/oats.svg", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
        ]
      };
      const isActive = req.query.status === "inactive" ? false : true;
      console.log(`[SUBCATEGORY API] Looking up subcategories with parentCategoryId: ${parentCategoryId}, isActive: ${isActive}`);
      const filter = { isActive };
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      let subcategories;
      try {
        console.log(`[SUBCATEGORY API] Executing SQL query for parentCategoryId=${parentCategoryId}, isActive=${isActive}`);
        const sqlQuery = sql2`
          SELECT id, name, description, parent_category_id, is_active, display_order, image_url, created_at
          FROM grocery_subcategories 
          WHERE parent_category_id = ${parentCategoryId} 
          AND is_active = ${isActive}
        `;
        console.log(`[SUBCATEGORY API] SQL query: ${sqlQuery.sql}`);
        const result = await db.execute(sqlQuery);
        subcategories = result.rows.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          parentCategoryId: row.parent_category_id,
          isActive: row.is_active,
          displayOrder: row.display_order,
          imageUrl: row.image_url,
          createdAt: row.created_at,
          updatedAt: row.created_at
        }));
        console.log(`[SUBCATEGORY API] Direct SQL query found ${subcategories.length} subcategories for category ${parentCategoryId}`);
        if (subcategories.length === 0 && parentCategoryId) {
          const categoryKey = parentCategoryId.toString();
          if (fallbackSubcategories[categoryKey]) {
            console.log(`[SUBCATEGORY API] No subcategories found in database for category ${parentCategoryId}, using fallbacks`);
            subcategories = fallbackSubcategories[categoryKey];
          }
        }
      } catch (sqlError) {
        console.error("[SUBCATEGORY API] SQL query failed, falling back to storage layer", sqlError);
        try {
          subcategories = await storage.getGrocerySubCategories(filter);
          if ((!subcategories || subcategories.length === 0) && parentCategoryId) {
            const categoryKey = parentCategoryId.toString();
            if (fallbackSubcategories[categoryKey]) {
              console.log(`[SUBCATEGORY API] No subcategories found in storage for category ${parentCategoryId}, using fallbacks`);
              subcategories = fallbackSubcategories[categoryKey];
            }
          }
        } catch (storageError) {
          console.error("[SUBCATEGORY API] Storage layer also failed, using fallbacks if available", storageError);
          if (parentCategoryId) {
            const categoryKey = parentCategoryId.toString();
            if (fallbackSubcategories[categoryKey]) {
              console.log(`[SUBCATEGORY API] Using fallback subcategories for category ${parentCategoryId}`);
              subcategories = fallbackSubcategories[categoryKey];
            } else {
              subcategories = [];
            }
          } else {
            subcategories = [];
          }
        }
      }
      try {
        generateFallbackImages();
      } catch (error) {
        console.error("[SUBCATEGORY API] Error generating fallback images:", error);
      }
      const subcategoriesWithImageFallbacks = subcategories.map((subcategory) => {
        if (subcategory.parentCategoryId === 4) {
          const lowerName = subcategory.name.toLowerCase();
          let svgPath = "/uploads/fallback/oils.svg";
          if (lowerName.includes("coconut")) {
            svgPath = "/uploads/fallback/coconut-oil.svg";
          } else if (lowerName.includes("groundnut") || lowerName.includes("peanut")) {
            svgPath = "/uploads/fallback/groundnut-oil.svg";
          } else if (lowerName.includes("olive")) {
            svgPath = "/uploads/fallback/olive-oil.svg";
          } else if (lowerName.includes("palm")) {
            svgPath = "/uploads/fallback/palm-oil.svg";
          }
          console.log(`[SUBCATEGORY API] Using hardcoded SVG for ${subcategory.name}: ${svgPath}`);
          return {
            ...subcategory,
            imageUrl: svgPath
          };
        }
        return {
          ...subcategory,
          imageUrl: subcategory.imageUrl ? getImageUrlWithFallback(subcategory.imageUrl, "subcategory", subcategory.name) : getImageUrlWithFallback(null, "subcategory", subcategory.name)
        };
      });
      console.log(
        `[SUBCATEGORY API] Found ${subcategoriesWithImageFallbacks.length} subcategories for parentCategoryId ${parentCategoryId}:`,
        subcategoriesWithImageFallbacks.map((s) => `${s.name} (ID: ${s.id})`).join(", ")
      );
      res.json(subcategoriesWithImageFallbacks);
    } catch (error) {
      console.error("[SUBCATEGORY API] Error fetching grocery subcategories:", error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });
  app2.get("/api/admin/grocery/subcategories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      res.json(subcategory);
    } catch (error) {
      console.error("Error fetching grocery subcategory:", error);
      res.status(500).json({ message: "Failed to fetch grocery subcategory" });
    }
  });
  app2.get("/api/grocery/subcategory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      res.json(subcategory);
    } catch (error) {
      console.error("Error fetching grocery subcategory:", error);
      res.status(500).json({ message: "Failed to fetch grocery subcategory" });
    }
  });
  app2.put("/api/admin/grocery/subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const subcategoryData = req.body;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      if (subcategoryData.parentCategoryId && subcategoryData.parentCategoryId !== subcategory.parentCategoryId) {
        const parentCategory = await storage.getGroceryCategory(subcategoryData.parentCategoryId);
        if (!parentCategory) {
          return res.status(400).json({ message: "Parent category not found" });
        }
        if (!parentCategory.isActive) {
          return res.status(400).json({ message: "Cannot move subcategory to inactive category" });
        }
      }
      const updatedSubcategory = await storage.updateGrocerySubCategory(parseInt(id), subcategoryData);
      res.json(updatedSubcategory);
    } catch (error) {
      console.error("Error updating grocery subcategory:", error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  app2.put("/api/grocery/subcategory/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const subcategoryData = req.body;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      if (subcategoryData.parentCategoryId && subcategoryData.parentCategoryId !== subcategory.parentCategoryId) {
        const parentCategory = await storage.getGroceryCategory(subcategoryData.parentCategoryId);
        if (!parentCategory) {
          return res.status(400).json({ message: "Parent category not found" });
        }
        if (!parentCategory.isActive) {
          return res.status(400).json({ message: "Cannot move subcategory to inactive category" });
        }
      }
      const updatedSubcategory = await storage.updateGrocerySubCategory(parseInt(id), subcategoryData);
      res.json(updatedSubcategory);
    } catch (error) {
      console.error("Error updating grocery subcategory:", error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  app2.delete("/api/admin/grocery/subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[SUBCATEGORY DELETE] User: ${req.user?.username}, Role: ${req.user?.userType}, Attempting to delete subcategory ID: ${id}`);
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        console.log(`[SUBCATEGORY DELETE] Subcategory ID ${id} not found`);
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      console.log(`[SUBCATEGORY DELETE] Found subcategory: ${JSON.stringify(subcategory)}`);
      const updatedSubcategory = await storage.updateGrocerySubCategory(parseInt(id), { isActive: false });
      console.log(`[SUBCATEGORY DELETE] Successfully deactivated subcategory: ${JSON.stringify(updatedSubcategory)}`);
      res.json({
        message: "Grocery subcategory deactivated successfully",
        subcategory: updatedSubcategory
      });
    } catch (error) {
      console.error("[SUBCATEGORY DELETE] Error deleting grocery subcategory:", error);
      res.status(500).json({ message: "Failed to delete grocery subcategory" });
    }
  });
  app2.delete("/api/grocery/subcategory/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      const updatedSubcategory = await storage.updateGrocerySubCategory(parseInt(id), { isActive: false });
      res.json({
        message: "Grocery subcategory deactivated successfully",
        subcategory: updatedSubcategory
      });
    } catch (error) {
      console.error("Error deleting grocery subcategory:", error);
      res.status(500).json({ message: "Failed to delete grocery subcategory" });
    }
  });
  fs3.mkdirSync(path2.join(uploadsDir2, "grocery-subcategories"), { recursive: true });
  const subcategoryImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path2.join(uploadsDir2, "grocery-subcategories"));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path2.extname(file.originalname);
      cb(null, "subcategory-" + uniqueSuffix + ext);
    }
  });
  const uploadSubcategoryImage = multer({
    storage: subcategoryImageStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    // 2MB limit
    fileFilter: function(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    }
  });
  app2.post("/api/admin/grocery/subcategories/:id/image", isAuthenticated, hasRole(["admin"]), uploadSubcategoryImage.single("subcategoryImage"), async (req, res) => {
    try {
      ensureUserExists(req);
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      const subcategoryId = parseInt(req.params.id);
      if (isNaN(subcategoryId)) {
        return res.status(400).json({ message: "Invalid subcategory ID" });
      }
      const subcategory = await storage.getGrocerySubCategory(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      const imageUrl = `/uploads/grocery-subcategories/${req.file.filename}`;
      const updatedSubcategory = await storage.updateGrocerySubCategory(subcategoryId, {
        ...subcategory,
        imageUrl
      });
      res.status(200).json({
        message: "Subcategory image uploaded successfully",
        subcategory: updatedSubcategory
      });
    } catch (error) {
      console.error("Error uploading subcategory image:", error);
      res.status(500).json({ message: "Failed to upload subcategory image" });
    }
  });
  app2.get("/api/admin/grocery/products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { categoryId, subcategoryId, status, category } = req.query;
      const filter = {};
      if (categoryId) {
        filter.categoryId = parseInt(categoryId);
      }
      if (subcategoryId) {
        filter.subcategoryId = parseInt(subcategoryId);
      }
      if (status) {
        filter.status = status;
      }
      if (category) {
        filter.category = category;
      }
      console.log("API Query params:", req.query);
      console.log("Filter applied for grocery products:", filter);
      const products = await storage.getGroceryProducts(filter);
      res.json(products);
    } catch (error) {
      console.error("Error fetching grocery products:", error);
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });
  app2.get("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching grocery product:", error);
      res.status(500).json({ message: "Failed to fetch grocery product" });
    }
  });
  app2.post("/api/admin/grocery/products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productData = req.body;
      const validatedData = insertGroceryProductSchema.parse(productData);
      const newProduct = await storage.createGroceryProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating grocery product:", error);
      res.status(500).json({ message: "Failed to create grocery product" });
    }
  });
  app2.put("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product" });
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating grocery product:", error);
      res.status(500).json({ message: "Failed to update grocery product" });
    }
  });
  app2.patch("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product" });
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating grocery product:", error);
      res.status(500).json({ message: "Failed to update grocery product", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.delete("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), { status: "inactive" });
      res.json({
        message: "Grocery product deactivated successfully",
        product: updatedProduct
      });
    } catch (error) {
      console.error("Error deleting grocery product:", error);
      res.status(500).json({ message: "Failed to delete grocery product" });
    }
  });
  app2.get("/api/grocery/products", async (req, res) => {
    try {
      const { adminApproved, status } = req.query;
      let products = await storage.getGroceryProducts();
      if (adminApproved === "true" && status === "active") {
        products = products.filter((p) => p.adminApproved === true && p.status === "active");
      }
      res.json(products);
    } catch (error) {
      console.error("Error fetching grocery products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.post("/api/provider/grocery/products", isAuthenticated, hasRole(["service_provider"]), async (req, res) => {
    try {
      const productData = req.body;
      const validatedData = insertGroceryProductSchema.parse(productData);
      validatedData.providerId = req.user.id;
      validatedData.status = "pending";
      const newProduct = await storage.createGroceryProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating grocery product:", error);
      res.status(500).json({ message: "Failed to create grocery product" });
    }
  });
  app2.get("/api/provider/grocery/products", isAuthenticated, hasRole(["service_provider"]), async (req, res) => {
    try {
      const products = await storage.getGroceryProductsByProvider(req.user.id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching provider grocery products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.patch("/api/admin/grocery/products/:id/approval", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { adminApproved, status } = req.body;
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), {
        adminApproved,
        status
      });
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating grocery product approval:", error);
      res.status(500).json({ message: "Failed to update product approval" });
    }
  });
  app2.delete("/api/admin/grocery/products-all", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      await storage.deleteAllGroceryProducts();
      res.json({
        message: "All grocery products have been permanently deleted",
        note: "The cart in localStorage will need to be cleared separately"
      });
    } catch (error) {
      console.error("Error deleting all grocery products:", error);
      res.status(500).json({ message: "Failed to delete all grocery products" });
    }
  });
  app2.get("/api/provider/grocery/products", isAuthenticated, async (req, res) => {
    try {
      if (req.user.userType !== "service_provider") {
        return res.status(403).json({ message: "Access denied" });
      }
      const products = await storage.getGroceryProductsByProviderId(req.user.id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching provider grocery products:", error);
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });
  app2.delete("/api/provider/grocery/products/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      if (req.user.userType !== "service_provider") {
        return res.status(403).json({ message: "Access denied" });
      }
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      if (product.providerId !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own products" });
      }
      await storage.deleteGroceryProduct(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting grocery product:", error);
      res.status(500).json({ message: "Failed to delete grocery product" });
    }
  });
  fs3.mkdirSync(path2.join(uploadsDir2, "grocery-products"), { recursive: true });
  const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path2.join(uploadsDir2, "grocery-products"));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path2.extname(file.originalname);
      cb(null, "product-" + uniqueSuffix + ext);
    }
  });
  const upload = multer({
    storage: diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    // 5MB limit
    fileFilter: function(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    }
  });
  app2.post("/api/admin/grocery/products/with-image", isAuthenticated, hasRole(["admin"]), upload.single("productImage"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const productData = JSON.parse(req.body.productData);
      const imageUrl = `/uploads/grocery-products/${req.file.filename}`;
      productData.imageUrl = imageUrl;
      const validatedData = insertGroceryProductSchema.parse(productData);
      const product = await storage.createGroceryProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product with image:", error);
      res.status(500).json({ message: error.message || "Failed to create product with image" });
    }
  });
  app2.put("/api/admin/grocery/products/:id/with-image", isAuthenticated, hasRole(["admin"]), upload.single("productImage"), async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      const productData = JSON.parse(req.body.productData);
      const imageUrl = `/uploads/grocery-products/${req.file.filename}`;
      productData.imageUrl = imageUrl;
      if (product.imageUrl) {
        try {
          const oldImagePath = path2.join(process.cwd(), product.imageUrl.replace(/^\//, ""));
          if (fs3.existsSync(oldImagePath)) {
            fs3.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting old image file:", err);
        }
      }
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), productData);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product with image:", error);
      res.status(500).json({ message: error.message || "Failed to update product with image" });
    }
  });
  app2.get("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching local product:", error);
      res.status(500).json({ message: "Failed to fetch local product" });
    }
  });
  app2.post("/api/admin/local-products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productData = req.body;
      const validatedData = insertLocalProductSchema.parse(productData);
      const newProduct = await storage.createLocalProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating local product:", error);
      res.status(500).json({ message: "Failed to create local product" });
    }
  });
  app2.put("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      const updatedProduct = await storage.updateLocalProduct(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product" });
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating local product:", error);
      res.status(500).json({ message: "Failed to update local product" });
    }
  });
  app2.delete("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      const updatedProduct = await storage.updateLocalProduct(parseInt(id), { status: "inactive" });
      res.json({
        message: "Local product deactivated successfully",
        product: updatedProduct
      });
    } catch (error) {
      console.error("Error deleting local product:", error);
      res.status(500).json({ message: "Failed to delete local product" });
    }
  });
  app2.get("/api/admin/local-product-bases", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { category, manufacturerId, adminApproved } = req.query;
      const filter = {};
      if (category) {
        filter.category = category;
      }
      if (manufacturerId) {
        filter.manufacturerId = parseInt(manufacturerId);
      }
      if (adminApproved !== void 0) {
        filter.adminApproved = adminApproved === "true";
      }
      const products = await storage.listLocalProductBases(filter);
      res.json(products);
    } catch (error) {
      console.error("Error fetching local product bases:", error);
      res.status(500).json({ message: "Failed to fetch local product bases" });
    }
  });
  app2.get("/api/admin/local-product-bases/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getLocalProductBaseById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product base not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching local product base:", error);
      res.status(500).json({ message: "Failed to fetch local product base" });
    }
  });
  app2.post("/api/admin/local-product-bases", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productData = req.body;
      const validatedData = insertLocalProductBaseSchema.parse(productData);
      const newProduct = await storage.createLocalProductBase(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating local product base:", error);
      res.status(500).json({ message: "Failed to create local product base" });
    }
  });
  app2.put("/api/admin/local-product-bases/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await storage.getLocalProductBaseById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product base not found" });
      }
      const updatedProduct = await storage.updateLocalProductBase(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product base" });
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating local product base:", error);
      res.status(500).json({ message: "Failed to update local product base" });
    }
  });
  app2.get("/api/admin/local-product-details/:productId", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { productId } = req.params;
      const details = await storage.getLocalProductDetailsByProductId(parseInt(productId));
      if (!details) {
        return res.status(404).json({ message: "Local product details not found" });
      }
      res.json(details);
    } catch (error) {
      console.error("Error fetching local product details:", error);
      res.status(500).json({ message: "Failed to fetch local product details" });
    }
  });
  app2.post("/api/admin/local-product-details", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const detailsData = req.body;
      const validatedData = upsertLocalProductDetailsSchema.parse(detailsData);
      if (!validatedData.productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      const baseProduct = await storage.getLocalProductBaseById(validatedData.productId);
      if (!baseProduct) {
        return res.status(404).json({ message: "Base product not found" });
      }
      const existingDetails = await storage.getLocalProductDetailsByProductId(validatedData.productId);
      if (existingDetails) {
        return res.status(400).json({
          message: "Product details already exist for this product",
          details: existingDetails
        });
      }
      const newDetails = await storage.createLocalProductDetails(validatedData);
      res.status(201).json(newDetails);
    } catch (error) {
      console.error("Error creating local product details:", error);
      res.status(500).json({ message: "Failed to create local product details" });
    }
  });
  app2.put("/api/admin/local-product-details/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const detailsData = req.body;
      const details = await storage.getLocalProductDetailsById(parseInt(id));
      if (!details) {
        return res.status(404).json({ message: "Local product details not found" });
      }
      const updatedDetails = await storage.updateLocalProductDetails(parseInt(id), detailsData);
      if (!updatedDetails) {
        return res.status(404).json({ message: "Failed to update product details" });
      }
      res.json(updatedDetails);
    } catch (error) {
      console.error("Error updating local product details:", error);
      res.status(500).json({ message: "Failed to update local product details" });
    }
  });
  app2.post("/api/admin/local-products/:id/publish", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      const details = await storage.getLocalProductDetailsByProductId(parseInt(id));
      if (!details) {
        return res.status(400).json({ message: "Product details not found - cannot publish incomplete product" });
      }
      const updatedDetails = await storage.updateLocalProductDetails(details.id, {
        isDraft: false,
        status: "active"
      });
      const updatedProduct = await storage.getLocalProductView(parseInt(id));
      res.json({
        message: "Product published successfully",
        product: updatedProduct
      });
    } catch (error) {
      console.error("Error publishing local product:", error);
      res.status(500).json({ message: "Failed to publish local product" });
    }
  });
  app2.get("/api/admin/pending-local-products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const pendingProducts = await storage.getPendingLocalProducts();
      res.json(pendingProducts);
    } catch (error) {
      console.error("Error fetching pending products:", error);
      res.status(500).json({ message: "Failed to fetch pending products" });
    }
  });
  app2.post("/api/admin/local-products/:id/approve", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const baseProduct = await storage.getLocalProductBaseById(parseInt(id));
      if (!baseProduct) {
        return res.status(404).json({ message: "Local product not found" });
      }
      const updatedBase = await storage.updateLocalProductBase(parseInt(id), {
        adminApproved: true
      });
      const updatedProduct = await storage.getLocalProductView(parseInt(id));
      res.json({
        message: "Product approved successfully",
        product: updatedProduct
      });
    } catch (error) {
      console.error("Error approving local product:", error);
      res.status(500).json({ message: "Failed to approve local product" });
    }
  });
  app2.post("/api/admin/local-products/:id/reject", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const rejectedProduct = await storage.rejectLocalProduct(parseInt(id), reason);
      if (!rejectedProduct) {
        return res.status(404).json({ message: "Local product not found" });
      }
      res.json({
        message: "Product rejected successfully",
        product: rejectedProduct
      });
    } catch (error) {
      console.error("Error rejecting local product:", error);
      res.status(500).json({ message: "Failed to reject local product" });
    }
  });
  app2.get("/api/local-products/my-products", isAuthenticated, async (req, res) => {
    try {
      if (!req.user || req.user.userType !== "service_provider") {
        return res.status(403).json({ message: "Access denied. Only service providers can access this endpoint." });
      }
      const userId = req.user.id;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const products = await storage.listLocalProductViews({ manufacturerId: userId });
      res.json(products);
    } catch (error) {
      console.error("Error fetching manufacturer local products:", error);
      res.status(500).json({ message: "Failed to fetch local products" });
    }
  });
  app2.get("/api/provider/local-products", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { category, status, isDraft } = req.query;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const filter = {
        manufacturerId: userId
      };
      if (category) {
        filter.category = category;
      }
      if (status) {
        filter.status = status;
      }
      if (isDraft !== void 0) {
        filter.isDraft = isDraft === "true";
      }
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error("Error fetching manufacturer products:", error);
      res.status(500).json({ message: "Failed to fetch manufacturer products" });
    }
  });
  app2.get("/api/provider/local-products/:id", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product || product.manufacturerId !== userId) {
        return res.status(404).json({ message: "Product not found or not owned by this manufacturer" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching manufacturer product:", error);
      res.status(500).json({ message: "Failed to fetch manufacturer product" });
    }
  });
  app2.post("/api/provider/local-product-bases", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const productData = req.body;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      productData.manufacturerId = userId;
      const validatedData = insertLocalProductBaseSchema.parse(productData);
      const newProduct = await storage.createLocalProductBase(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating manufacturer product base:", error);
      res.status(500).json({ message: "Failed to create manufacturer product base" });
    }
  });
  app2.post("/api/provider/local-products", isAuthenticated, hasRole(["service_provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const productData = req.body;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const baseData = {
        name: productData.name,
        category: productData.categoryId,
        subcategory: productData.subcategoryId,
        // Store subcategory information
        manufacturerId: userId,
        adminApproved: false
      };
      const newBaseProduct = await storage.createLocalProductBase(baseData);
      const detailsData = {
        productId: newBaseProduct.id,
        description: productData.description,
        specifications: productData.specifications,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        stock: productData.stockQuantity,
        district: productData.district,
        imageUrl: productData.imageUrl,
        deliveryOption: "both",
        availableAreas: productData.availableAreas,
        isDraft: false,
        status: "pending"
      };
      const newDetails = await storage.createLocalProductDetails(detailsData);
      const completeProduct = await storage.getLocalProductView(newBaseProduct.id);
      res.status(201).json(completeProduct);
    } catch (error) {
      console.error("Error creating local product:", error);
      res.status(500).json({ message: "Failed to create local product" });
    }
  });
  app2.post("/api/provider/local-product-details", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const detailsData = req.body;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const validatedData = upsertLocalProductDetailsSchema.parse(detailsData);
      if (!validatedData.productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      const baseProduct = await storage.getLocalProductBaseById(validatedData.productId);
      if (!baseProduct) {
        return res.status(404).json({ message: "Base product not found" });
      }
      if (baseProduct.manufacturerId !== userId) {
        return res.status(403).json({ message: "Access denied. Product not owned by this manufacturer." });
      }
      const existingDetails = await storage.getLocalProductDetailsByProductId(validatedData.productId);
      if (existingDetails) {
        return res.status(400).json({
          message: "Product details already exist for this product",
          details: existingDetails
        });
      }
      validatedData.isDraft = true;
      validatedData.status = "pending";
      const newDetails = await storage.createLocalProductDetails(validatedData);
      res.status(201).json(newDetails);
    } catch (error) {
      console.error("Error creating manufacturer product details:", error);
      res.status(500).json({ message: "Failed to create manufacturer product details" });
    }
  });
  app2.put("/api/provider/local-product-details/:id", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const detailsData = req.body;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const details = await storage.getLocalProductDetailsById(parseInt(id));
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      const baseProduct = await storage.getLocalProductBaseById(details.productId);
      if (!baseProduct || baseProduct.manufacturerId !== userId) {
        return res.status(403).json({ message: "Access denied. Product not owned by this manufacturer." });
      }
      if (detailsData.adminApproved !== void 0) {
        delete detailsData.adminApproved;
      }
      const updatedDetails = await storage.updateLocalProductDetails(parseInt(id), detailsData);
      if (!updatedDetails) {
        return res.status(404).json({ message: "Failed to update product details" });
      }
      res.json(updatedDetails);
    } catch (error) {
      console.error("Error updating manufacturer product details:", error);
      res.status(500).json({ message: "Failed to update manufacturer product details" });
    }
  });
  app2.post("/api/provider/local-products/:id/publish", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.manufacturerId !== userId) {
        return res.status(403).json({ message: "Access denied. Product not owned by this manufacturer." });
      }
      const details = await storage.getLocalProductDetailsByProductId(parseInt(id));
      if (!details) {
        return res.status(400).json({ message: "Product details not found - cannot publish incomplete product" });
      }
      const updatedDetails = await storage.updateLocalProductDetails(details.id, {
        isDraft: false,
        status: "pending"
      });
      const updatedProduct = await storage.getLocalProductView(parseInt(id));
      res.json({
        message: "Product submitted for approval",
        product: updatedProduct
      });
    } catch (error) {
      console.error("Error publishing manufacturer product:", error);
      res.status(500).json({ message: "Failed to publish manufacturer product" });
    }
  });
  app2.post("/api/local-product-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const orderData = {
        ...req.body,
        userId: req.user.id,
        status: "pending",
        createdAt: /* @__PURE__ */ new Date()
      };
      const order = {
        id: Date.now(),
        // Simple ID generation
        ...orderData
      };
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating local product order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });
  app2.get("/api/local-product-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  app2.post("/api/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const vehicleData = {
        ...req.body,
        providerId: req.user.id,
        status: "available",
        adminApproved: false
      };
      const vehicle = await storage.createTaxiVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating taxi vehicle:", error);
      res.status(500).json({ message: "Error creating vehicle" });
    }
  });
  app2.get("/api/taxi/my-vehicles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const vehicles = await storage.getTaxiVehiclesByProvider(req.user.id);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching provider vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.put("/api/taxi/vehicles/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const vehicleId = parseInt(req.params.id);
      const vehicle = await storage.getTaxiVehicle(vehicleId);
      if (!vehicle || vehicle.providerId !== req.user.id) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      const updatedVehicle = await storage.updateTaxiVehicle(vehicleId, req.body);
      res.json(updatedVehicle);
    } catch (error) {
      console.error("Error updating taxi vehicle:", error);
      res.status(500).json({ message: "Error updating vehicle" });
    }
  });
  app2.get("/api/admin/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicles = await storage.getAllTaxiVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching all taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.get("/api/admin/taxi/vehicles/approved", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicles = await storage.getApprovedTaxiVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching approved taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.get("/api/admin/taxi/vehicles/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicles = await storage.getTaxiVehiclesForApproval();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching pending taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.put("/api/admin/taxi/vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicleId = parseInt(req.params.id);
      const { approved } = req.body;
      const vehicle = await storage.approveTaxiVehicle(vehicleId, approved);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error approving taxi vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });
  app2.put("/api/admin/taxi/vehicles/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicleId = parseInt(req.params.id);
      const { isActive } = req.body;
      const vehicle = await storage.updateTaxiVehicleStatus(vehicleId, isActive);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating taxi vehicle status:", error);
      res.status(500).json({ message: "Error updating vehicle status" });
    }
  });
  app2.get("/api/taxi/vehicles", async (req, res) => {
    try {
      const { vehicleType, district, taluk, pincode, acAvailable } = req.query;
      const vehicles = await storage.getApprovedTaxiVehicles();
      const filteredVehicles = vehicles.filter((vehicle) => {
        if (!vehicle.adminApproved || vehicle.status !== "available") return false;
        if (vehicleType && vehicle.vehicleType !== vehicleType) return false;
        if (district && vehicle.district !== district) return false;
        if (taluk && vehicle.taluk !== taluk) return false;
        if (pincode && vehicle.pincode !== pincode) return false;
        if (acAvailable !== void 0 && vehicle.acAvailable !== (acAvailable === "true")) return false;
        return true;
      });
      res.json(filteredVehicles);
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.get("/api/taxi/categories", async (req, res) => {
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ error: "Failed to fetch taxi categories" });
    }
  });
  app2.get("/api/locations/taluks", async (req, res) => {
    try {
      const { district } = req.query;
      if (!district) {
        return res.status(400).json({ error: "District parameter required" });
      }
      const taluks = await storage.getTaluksByDistrict(district);
      res.json(taluks);
    } catch (error) {
      console.error("Error fetching taluks:", error);
      res.status(500).json({ error: "Failed to fetch taluks" });
    }
  });
  app2.get("/api/locations/pincodes", async (req, res) => {
    try {
      const { district, taluk } = req.query;
      if (!district || !taluk) {
        return res.status(400).json({ error: "District and taluk parameters required" });
      }
      const pincodes = await storage.getPincodesByDistrictAndTaluk(district, taluk);
      res.json(pincodes);
    } catch (error) {
      console.error("Error fetching pincodes:", error);
      res.status(500).json({ error: "Failed to fetch pincodes" });
    }
  });
  app2.post("/api/taxi/bookings", async (req, res) => {
    console.log("Authentication check - isAuthenticated():", req.isAuthenticated());
    console.log("Authentication check - req.user:", req.user);
    console.log("Authentication check - req.session:", req.session);
    let currentUserId;
    if (req.isAuthenticated() && req.user && req.user.id) {
      currentUserId = req.user.id;
      console.log("Using authenticated user ID:", currentUserId);
    } else if (req.body.customerId) {
      currentUserId = req.body.customerId;
      console.log("Using customer ID from request body:", currentUserId);
    } else {
      currentUserId = 5;
      console.log("Using fallback customer ID:", currentUserId);
    }
    try {
      console.log("Taxi booking request data:", req.body);
      console.log("Using user ID:", currentUserId);
      const bookingData = {
        bookingNumber: `TXB${Date.now()}`,
        customerId: currentUserId,
        providerId: req.body.providerId || 1,
        // Default provider for now
        vehicleId: req.body.vehicleId,
        bookingType: req.body.bookingType || "immediate",
        pickupLocation: req.body.pickupLocation,
        pickupPincode: req.body.pickupPincode || "600001",
        dropoffLocation: req.body.dropoffLocation,
        dropoffPincode: req.body.dropoffPincode || "600002",
        scheduledDateTime: req.body.scheduledDateTime ? new Date(req.body.scheduledDateTime) : null,
        estimatedDistance: parseFloat(req.body.estimatedDistance) || 0,
        estimatedFare: parseFloat(req.body.estimatedFare) || 0,
        totalAmount: parseFloat(req.body.totalAmount) || parseFloat(req.body.estimatedFare) || 0,
        paymentMode: "wallet",
        paymentStatus: "pending",
        specialInstructions: req.body.specialInstructions || "",
        passengerCount: parseInt(req.body.passengerCount) || 1,
        status: "pending"
      };
      console.log("Processed booking data:", bookingData);
      const booking = await storage.createTaxiBooking(bookingData);
      console.log("Created booking:", booking);
      const updatedServiceData = {
        pickup: bookingData.pickupLocation,
        dropoff: bookingData.dropoffLocation,
        distance: bookingData.estimatedDistance,
        vehicleType: null,
        bookingId: booking.id,
        description: `Taxi booking from ${bookingData.pickupLocation} to ${bookingData.dropoffLocation}`
      };
      console.log("User from request:", req.user);
      console.log("User ID:", req.user?.id);
      console.log("Booking customer ID:", booking.customerId);
      if (!currentUserId || currentUserId <= 0) {
        console.error("Invalid user ID for service request:", currentUserId);
        throw new Error("Valid user authentication required for service request");
      }
      const serviceRequestData = {
        srNumber: `SR${(/* @__PURE__ */ new Date()).getFullYear()}${String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")}${String((/* @__PURE__ */ new Date()).getDate()).padStart(2, "0")}${String((/* @__PURE__ */ new Date()).getHours()).padStart(2, "0")}${String(Math.floor(Math.random() * 1e3)).padStart(3, "0")}`,
        userId: Number(currentUserId),
        // Ensure it's a valid number
        serviceType: "taxi",
        amount: Number(bookingData.totalAmount),
        status: "new",
        paymentStatus: "pending",
        paymentMethod: "razorpay",
        serviceData: JSON.stringify(updatedServiceData)
      };
      console.log("Creating service request with validated data:", serviceRequestData);
      console.log("User ID type and value:", typeof serviceRequestData.userId, serviceRequestData.userId);
      const serviceRequest = await storage.createServiceRequest(serviceRequestData);
      console.log("Auto-generated service request for taxi booking:", serviceRequest);
      res.status(201).json({
        booking,
        serviceRequest,
        message: "Taxi booking created successfully with service request"
      });
    } catch (error) {
      console.error("Error creating taxi booking:", error);
      console.error("Error details:", error.message);
      res.status(500).json({
        message: "Error creating booking",
        error: error.message
      });
    }
  });
  app2.get("/api/taxi/my-bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const bookings2 = await storage.getTaxiBookingsByCustomer(req.user.id);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });
  app2.get("/api/taxi/provider-bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const bookings2 = await storage.getTaxiBookingsByProvider(req.user.id);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });
  app2.put("/api/taxi/bookings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      const booking = await storage.updateTaxiBookingStatus(bookingId, status, req.user.id);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Error updating booking" });
    }
  });
  app2.get("/api/admin/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicles = await storage.getAllTaxiVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching all vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.put("/api/admin/taxi/vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicleId = parseInt(req.params.id);
      const { approved } = req.body;
      const vehicle = await storage.approveTaxiVehicle(vehicleId, approved);
      res.json(vehicle);
    } catch (error) {
      console.error("Error approving vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });
  app2.get("/api/admin/taxi/bookings", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const bookings2 = await storage.getAllTaxiBookings();
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });
  app2.post("/api/provider/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const providerData = {
        ...req.body,
        userId: req.user.id,
        phone: req.user.phone || req.user.username,
        // Use existing phone or username
        email: req.user.email || `${req.user.username}@nalamini.com`,
        // Use existing email or generate one
        status: "pending",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      const existingRegistration = await storage.getServiceProviderByUserId(req.user.id);
      if (existingRegistration) {
        return res.status(400).json({ message: "You already have a service provider registration" });
      }
      const provider = await storage.createServiceProvider(providerData);
      res.status(201).json(provider);
    } catch (error) {
      console.error("Error creating service provider registration:", error);
      res.status(500).json({ message: "Error creating registration" });
    }
  });
  app2.get("/api/provider/registration-status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const registration = await storage.getServiceProviderByUserId(req.user.id);
      if (!registration) {
        return res.status(404).json({ message: "No registration found" });
      }
      res.json(registration);
    } catch (error) {
      console.error("Error fetching registration status:", error);
      res.status(500).json({ message: "Error fetching registration status" });
    }
  });
  app2.get("/api/provider/categories/:providerType", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { providerType } = req.params;
      const categories = await storage.getProviderProductCategories(providerType);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching provider categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const user = req.user;
      let stats = {
        totalServiceRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        totalRevenue: 0,
        monthlyGrowth: 0
      };
      let serviceRequests2 = [];
      if (user.type === "admin" || user.userType === "admin") {
        serviceRequests2 = await storage.getAllServiceRequests();
      } else if (user.type === "service_provider" || user.userType === "service_provider") {
        serviceRequests2 = await storage.getServiceRequestsByProvider(user.id);
      } else if (user.type === "branch_manager" || user.userType === "branch_manager") {
        serviceRequests2 = await storage.getServiceRequestsByBranchManager(user.id);
      } else if (user.type === "taluk_manager" || user.userType === "taluk_manager") {
        serviceRequests2 = await storage.getServiceRequestsByTalukManager(user.id);
      } else if (user.type === "pincode_agent" || user.userType === "pincode_agent") {
        serviceRequests2 = await storage.getServiceRequestsByAgent(user.id);
      } else {
        serviceRequests2 = await storage.getServiceRequestsByUser(user.id);
      }
      stats.totalServiceRequests = serviceRequests2.length;
      stats.pendingRequests = serviceRequests2.filter(
        (r) => r.status === "new" || r.status === "in_progress"
      ).length;
      stats.completedRequests = serviceRequests2.filter(
        (r) => r.status === "completed" || r.status === "approved"
      ).length;
      stats.totalRevenue = serviceRequests2.reduce((sum, r) => {
        const amount = r.amount || 0;
        return sum + Math.min(amount, 5e4);
      }, 0);
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const currentMonthRequests = serviceRequests2.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      });
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthRequests = serviceRequests2.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear;
      });
      if (lastMonthRequests.length > 0) {
        stats.monthlyGrowth = Math.round(
          (currentMonthRequests.length - lastMonthRequests.length) / lastMonthRequests.length * 100
        );
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
  });
  app2.post("/api/provider/products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const provider = await storage.getServiceProviderByUserId(req.user.id);
      if (!provider || provider.status !== "approved") {
        return res.status(403).json({ message: "Service provider approval required" });
      }
      const productData = {
        ...req.body,
        categoryName: req.body.category,
        // Map category to categoryName
        productName: req.body.name,
        // Map name to productName  
        stockQuantity: req.body.stock || 0,
        // Map stock to stockQuantity
        providerId: provider.id,
        status: "active",
        adminApproved: false,
        // Products need admin approval
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      const product = await storage.createProviderProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating provider product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  });
  app2.get("/api/grocery-products", async (req, res) => {
    try {
      const { categoryId, subcategoryId } = req.query;
      let products = await storage.getApprovedProviderProducts();
      if (categoryId) {
        const catId = parseInt(categoryId);
        products = products.filter((product) => product.categoryId === catId);
      }
      if (subcategoryId) {
        const subCatId = parseInt(subcategoryId);
        products = products.filter((product) => product.subcategoryId === subCatId);
      }
      products = products.filter((product) => product.status === "active");
      res.json(products);
    } catch (error) {
      console.error("Error fetching grocery products:", error);
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });
  app2.get("/api/provider/products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const provider = await storage.getServiceProviderByUserId(req.user.id);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      const products = await storage.getProviderProducts(provider.id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching provider products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });
  app2.get("/api/public/provider-products", async (req, res) => {
    try {
      const products = await storage.getApprovedProviderProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching approved provider products:", error);
      res.status(500).json({ message: "Error fetching approved products" });
    }
  });
  app2.get("/api/admin/service-providers", async (req, res) => {
    console.log("Service Providers Request:", {
      authenticated: req.isAuthenticated(),
      user: req.user ? { id: req.user.id, userType: req.user.userType } : null
    });
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      console.log("Access denied - not authenticated or not admin");
      return res.sendStatus(403);
    }
    try {
      const providers = await storage.getAllServiceProviders();
      console.log(`Found ${providers.length} service providers`);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Error fetching service providers" });
    }
  });
  app2.patch("/api/admin/service-providers/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const updateData = {
        status,
        adminNotes,
        approvedBy: req.user.id,
        approvedAt: status === "approved" ? /* @__PURE__ */ new Date() : null,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const provider = await storage.updateServiceProviderStatus(parseInt(id), updateData);
      res.json(provider);
    } catch (error) {
      console.error("Error updating service provider status:", error);
      res.status(500).json({ message: "Error updating status" });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const [application] = await db.insert(applications).values(applicationData).returning();
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Error creating application" });
    }
  });
  app2.get("/api/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { status, roleType } = req.query;
      let query = db.select().from(applications);
      if (status) {
        query = query.where(eq4(applications.status, status));
      }
      if (roleType) {
        query = query.where(eq4(applications.roleType, roleType));
      }
      const allApplications = await query.orderBy(desc2(applications.appliedAt));
      res.json(allApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  });
  app2.patch("/api/applications/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const [application] = await db.update(applications).set({
        status,
        adminNotes,
        reviewedBy: req.user.id,
        reviewedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(applications.id, parseInt(id))).returning();
      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Error updating application status" });
    }
  });
  app2.get("/api/admin/local-product-categories", async (req, res) => {
    try {
      const categories = await db.select().from(localProductCategories).orderBy(asc2(localProductCategories.displayOrder), asc2(localProductCategories.name));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching local product categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.post("/api/admin/local-product-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const [category] = await db.insert(localProductCategories).values(req.body).returning();
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating local product category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  app2.get("/api/admin/local-product-subcategories", async (req, res) => {
    try {
      const subcategories = await db.select().from(localProductSubCategories).orderBy(asc2(localProductSubCategories.parentCategoryId), asc2(localProductSubCategories.displayOrder));
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching local product subcategories:", error);
      res.status(500).json({ message: "Error fetching subcategories" });
    }
  });
  app2.post("/api/admin/local-product-subcategories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const [subcategory] = await db.insert(localProductSubCategories).values(req.body).returning();
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating local product subcategory:", error);
      res.status(500).json({ message: "Error creating subcategory" });
    }
  });
  app2.delete("/api/admin/local-product-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      await db.delete(localProductCategories).where(eq4(localProductCategories.id, parseInt(id)));
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting local product category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  app2.delete("/api/admin/local-product-subcategories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      await db.delete(localProductSubCategories).where(eq4(localProductSubCategories.id, parseInt(id)));
      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("Error deleting local product subcategory:", error);
      res.status(500).json({ message: "Failed to delete subcategory" });
    }
  });
  app2.delete("/api/admin/local-products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      await db.delete(localProductBase).where(eq4(localProductBase.id, parseInt(id)));
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting local product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(400).json({
        message: "Error creating application",
        details: error.message
      });
    }
  });
  app2.get("/api/admin/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { status, roleType } = req.query;
      let applications2;
      if (status) {
        applications2 = await storage.getApplicationsByStatus(status);
      } else if (roleType) {
        applications2 = await storage.getApplicationsByRole(roleType);
      } else {
        applications2 = await storage.getAllApplications();
      }
      res.json(applications2);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  });
  app2.get("/api/admin/applications/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const application = await storage.getApplication(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Error fetching application" });
    }
  });
  app2.patch("/api/admin/applications/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const updates = {
        status,
        adminNotes,
        reviewedAt: /* @__PURE__ */ new Date(),
        reviewedBy: req.user.id,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const updatedApplication = await storage.updateApplication(parseInt(id), updates);
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(updatedApplication);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Error updating application" });
    }
  });
  app2.get("/api/admin/applications/location/:district", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { district } = req.params;
      const { taluk, pincode } = req.query;
      const applications2 = await storage.getApplicationsByLocation(
        district,
        taluk,
        pincode
      );
      res.json(applications2);
    } catch (error) {
      console.error("Error fetching applications by location:", error);
      res.status(500).json({ message: "Error fetching applications by location" });
    }
  });
  app2.get("/api/admin/local-product-category-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching category requests:", error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  });
  app2.put("/api/admin/local-product-category-requests/:id/review", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { action, adminResponse } = req.body;
      res.json({ success: true, action, adminResponse });
    } catch (error) {
      console.error("Error reviewing category request:", error);
      res.status(500).json({ message: "Error reviewing request" });
    }
  });
  app2.post("/api/provider/category-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "provider") {
      return res.sendStatus(403);
    }
    try {
      const requestData = {
        id: Date.now(),
        requesterId: req.user.id,
        ...req.body,
        status: "pending",
        createdAt: /* @__PURE__ */ new Date()
      };
      res.status(201).json(requestData);
    } catch (error) {
      console.error("Error creating category request:", error);
      res.status(500).json({ message: "Error creating request" });
    }
  });
  app2.get("/api/provider/category-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "provider") {
      return res.sendStatus(403);
    }
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching provider requests:", error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  });
  app2.get("/api/local/products", async (req, res) => {
    try {
      const filter = {
        adminApproved: true,
        status: "active",
        isDraft: false
      };
      if (req.query.category) {
        filter.category = req.query.category;
      }
      if (req.query.district) {
        filter.district = req.query.district;
      }
      console.log("Filter applied for local products:", filter);
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error("Error fetching local products:", error);
      res.status(500).json({ message: "Failed to fetch local products" });
    }
  });
  app2.get("/api/local-product-categories", async (req, res) => {
    try {
      const categories = await storage.getLocalProductCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching local product categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/local-product-subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getLocalProductSubcategories();
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching local product subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });
  app2.get("/api/local-product-views", async (req, res) => {
    try {
      const filters = {
        adminApproved: true,
        status: "active",
        isDraft: false
      };
      const products = await storage.listLocalProductViews(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching local product views:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.post("/api/local-product-cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { productId, quantity } = req.body;
      await storage.addToLocalProductCart(req.user.id, productId, quantity);
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding to local product cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });
  app2.get("/api/local-product-cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const cartItems = await storage.getLocalProductCartItems(req.user.id);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching local product cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  app2.put("/api/local-product-cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;
      await storage.updateLocalProductCartItem(req.user.id, productId, quantity);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating local product cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });
  app2.delete("/api/local-product-cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const productId = parseInt(req.params.productId);
      await storage.removeFromLocalProductCart(req.user.id, productId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from local product cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });
  app2.get("/api/local/product/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getLocalProductView(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.isDraft || !product.adminApproved || product.status !== "active") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching local product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/recycling/request", isAuthenticated, async (req, res) => {
    try {
      const today = /* @__PURE__ */ new Date();
      const dateStr = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, "0") + today.getDate().toString().padStart(2, "0");
      const randomNum = Math.floor(1e3 + Math.random() * 9e3);
      const requestNumber = `REC-${dateStr}-${randomNum}`;
      const requestData = insertRecyclingRequestSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "new",
        // Start with "new" status
        requestNumber
      });
      const request = await storage.createRecyclingRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating recycling request:", error);
      res.status(400).json({ message: "Invalid recycling request data" });
    }
  });
  app2.get("/api/recycling/requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (user.userType === "admin") {
        const requests2 = await storage.getAllRecyclingRequests();
        return res.json(requests2);
      }
      if (user.userType === "branch_manager") {
        const requests2 = await storage.getRecyclingRequestsByBranchManager(user.id);
        return res.json(requests2);
      }
      if (user.userType === "taluk_manager") {
        const requests2 = await storage.getRecyclingRequestsByTalukManager(user.id);
        return res.json(requests2);
      }
      if (user.userType === "service_agent") {
        const requests2 = await storage.getRecyclingRequestsByAgentId(user.id);
        return res.json(requests2);
      }
      const requests = await storage.getRecyclingRequestsByUserId(user.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recycling requests" });
    }
  });
  app2.get("/api/recycling/material-rates", async (req, res) => {
    try {
      const rates = await storage.getRecyclingMaterialRates();
      res.json(rates);
    } catch (error) {
      console.error("Error fetching recycling material rates:", error);
      res.status(500).json({ message: "Failed to fetch recycling material rates" });
    }
  });
  app2.post("/api/recycling/material-rates", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { materialType, ratePerKg, description } = req.body;
      if (!materialType || !ratePerKg) {
        return res.status(400).json({ message: "Material type and rate are required" });
      }
      const rateData = insertRecyclingMaterialRateSchema.parse({
        materialType,
        ratePerKg: parseFloat(ratePerKg),
        description,
        isActive: true,
        updatedBy: req.user?.id
      });
      const rate = await storage.createRecyclingMaterialRate(rateData);
      res.status(201).json(rate);
    } catch (error) {
      console.error("Error creating recycling material rate:", error);
      res.status(500).json({ message: "Failed to create recycling material rate" });
    }
  });
  app2.put("/api/recycling/material-rates/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { ratePerKg, description, isActive } = req.body;
      if (!ratePerKg) {
        return res.status(400).json({ message: "Rate per kg is required" });
      }
      const updatedRate = await storage.updateRecyclingMaterialRate(id, {
        ratePerKg: parseFloat(ratePerKg),
        description,
        isActive: isActive === void 0 ? true : isActive,
        updatedBy: req.user?.id,
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedRate) {
        return res.status(404).json({ message: "Material rate not found" });
      }
      res.json(updatedRate);
    } catch (error) {
      console.error("Error updating recycling material rate:", error);
      res.status(500).json({ message: "Failed to update recycling material rate" });
    }
  });
  app2.put("/api/recycling/request/:id", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager", "service_agent"]), async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status, totalWeight, amount } = req.body;
      const user = req.user;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const currentRequest = await storage.getRecyclingRequestById(requestId);
      if (!currentRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      let updateData = { status };
      if (status === "assigned" && currentRequest.status === "new") {
        updateData.assignedAt = /* @__PURE__ */ new Date();
        updateData.agentId = user.id;
      } else if (status === "collected" && currentRequest.status === "assigned") {
        updateData.collectedAt = /* @__PURE__ */ new Date();
        updateData.totalWeight = totalWeight;
        updateData.amount = amount;
      } else if (status === "verified" && currentRequest.status === "collected") {
        updateData.verifiedAt = /* @__PURE__ */ new Date();
        updateData.talukManagerId = user.id;
      } else if (status === "closed" && currentRequest.status === "verified") {
        updateData.closedAt = /* @__PURE__ */ new Date();
        updateData.branchManagerId = user.id;
      } else {
        return res.status(400).json({
          message: `Invalid status transition from ${currentRequest.status} to ${status}`
        });
      }
      if (status === "assigned" && user.userType !== "service_agent" || status === "verified" && user.userType !== "taluk_manager" || status === "closed" && user.userType !== "branch_manager" && user.userType !== "admin") {
        return res.status(403).json({
          message: `You don't have permission to change status to ${status}`
        });
      }
      const updatedRequest = await storage.updateRecyclingRequest(requestId, updateData);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Failed to update request" });
      }
      if (status === "collected" && amount && totalWeight) {
        try {
          await walletService.addFunds(
            updatedRequest.userId,
            amount,
            "recycling",
            `Recycling payment for ${updatedRequest.requestNumber}: ${totalWeight}kg of materials`
          );
        } catch (walletError) {
          console.error("Error adding funds to wallet:", walletError);
        }
      }
      if (status === "closed" && amount) {
        try {
          await commissionService.distributeCommissions(
            "recycling",
            requestId,
            amount,
            "Recycling"
          );
        } catch (commissionError) {
          console.error("Error distributing commissions:", commissionError);
        }
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating recycling request:", error);
      res.status(500).json({ message: "Failed to update recycling request" });
    }
  });
  app2.post("/api/commission/config", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const configData = insertCommissionConfigSchema.parse(req.body);
      const totalCommission = (configData.adminCommission || 0) + (configData.branchManagerCommission || 0) + (configData.talukManagerCommission || 0) + (configData.serviceAgentCommission || 0) + (configData.registeredUserCommission || 0);
      const commissionConfig = await storage.createCommissionConfig({
        ...configData,
        totalCommission,
        isActive: true
      });
      res.status(201).json(commissionConfig);
    } catch (error) {
      res.status(400).json({ message: "Invalid commission configuration data" });
    }
  });
  app2.get("/api/commission/config", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const configs = await storage.listCommissionConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission configurations" });
    }
  });
  app2.post("/api/commission/distribute", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { serviceType, transactionId, amount, provider } = req.body;
      if (!serviceType || !transactionId || !amount) {
        return res.status(400).json({
          message: "Missing required fields: serviceType, transactionId, and amount are required"
        });
      }
      await commissionService.distributeCommissions(
        serviceType,
        parseInt(transactionId),
        parseFloat(amount),
        provider
      );
      res.json({
        success: true,
        message: `Commissions distributed for ${serviceType} transaction ${transactionId}`
      });
    } catch (error) {
      console.error("Error distributing commissions:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to distribute commissions"
      });
    }
  });
  app2.get("/api/commission/config/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const config = await storage.getCommissionConfig(parseInt(req.params.id));
      if (!config) {
        return res.status(404).json({ message: "Commission configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission configuration" });
    }
  });
  app2.patch("/api/commission/config/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const config = await storage.getCommissionConfig(id);
      if (!config) {
        return res.status(404).json({ message: "Commission configuration not found" });
      }
      const updatedData = req.body;
      if ("adminCommission" in updatedData || "branchManagerCommission" in updatedData || "talukManagerCommission" in updatedData || "serviceAgentCommission" in updatedData || "registeredUserCommission" in updatedData) {
        updatedData.totalCommission = (updatedData.adminCommission ?? config.adminCommission) + (updatedData.branchManagerCommission ?? config.branchManagerCommission) + (updatedData.talukManagerCommission ?? config.talukManagerCommission) + (updatedData.serviceAgentCommission ?? config.serviceAgentCommission) + (updatedData.registeredUserCommission ?? config.registeredUserCommission);
      }
      const updatedConfig = await storage.updateCommissionConfig(id, updatedData);
      res.json(updatedConfig);
    } catch (error) {
      res.status(500).json({ message: "Failed to update commission configuration" });
    }
  });
  app2.get("/api/commission", isAuthenticated, async (req, res) => {
    try {
      const commissions2 = await storage.getCommissionsByUserId(req.user.id);
      res.json(commissions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });
  app2.get("/api/commission/service/:serviceType", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const serviceType = req.params.serviceType;
      const commissions2 = await storage.getCommissionsByServiceType(serviceType);
      res.json(commissions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commissions by service type" });
    }
  });
  app2.post("/api/service/process", isAuthenticated, hasRole(["service_agent"]), async (req, res) => {
    try {
      const { serviceType, serviceId, amount, provider } = req.body;
      if (!serviceType || !serviceId || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      if (serviceType === "recharge") {
        await storage.updateRecharge(serviceId, {
          processedBy: req.user.id,
          status: "completed"
        });
      } else {
        return res.status(400).json({
          message: "Service type not supported for commission processing"
        });
      }
      await storage.calculateCommissions(serviceType, serviceId, amount, provider);
      res.status(200).json({ message: "Service processed and commissions distributed" });
    } catch (error) {
      res.status(500).json({
        message: "Failed to process service",
        error: error.message
      });
    }
  });
  app2.get("/api/bus/test-connection", async (req, res) => {
    try {
      console.log("Testing Travelomatix API connection...");
      const result = await BusService.testConnection();
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          provider: "Travelomatix"
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          provider: "Travelomatix"
        });
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      res.status(500).json({
        success: false,
        message: "Failed to test API connection",
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        provider: "Travelomatix"
      });
    }
  });
  app2.get("/api/bus/test-connection", async (req, res) => {
    try {
      const testResponse = await fetch("http://test.services.travelomatix.com/webservices/index.php/bus_v3/service/Search", {
        method: "POST",
        headers: {
          "x-Username": "test305528",
          "x-DomainKey": "TMX2663051694580020",
          "x-Password": "test@305",
          "x-system": "test",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          OriginId: "1",
          DestinationId: "2",
          JourneyDate: "2025-01-15"
        })
      });
      res.json({
        status: testResponse.ok ? "connected" : "failed",
        statusCode: testResponse.status,
        statusText: testResponse.statusText,
        message: testResponse.ok ? "Travelomatix API connection successful" : "Travelomatix API connection failed",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.json({
        status: "error",
        message: "Failed to connect to Travelomatix API",
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.post("/api/bus/search", async (req, res) => {
    const { sourceCity, destinationCity, travelDate, passengers } = req.body;
    try {
      if (!sourceCity || !destinationCity || !travelDate) {
        return res.status(400).json({ message: "Missing required search parameters: sourceCity, destinationCity, travelDate" });
      }
      console.log("Bus search request received:", { sourceCity, destinationCity, travelDate, passengers });
      const cityMapping = {
        "Chennai": "1",
        "Coimbatore": "2",
        "Madurai": "3",
        "Trichy": "4",
        "Salem": "5",
        "Tirunelveli": "6",
        "Bangalore": "7",
        "Hyderabad": "8",
        "Mumbai": "9",
        "Delhi": "10"
      };
      const sourceCode = cityMapping[sourceCity] || "1";
      const destinationCode = cityMapping[destinationCity] || "2";
      const searchResult = await BusService.searchBuses({
        source_city: sourceCity,
        source_code: sourceCode,
        destination_city: destinationCity,
        destination_code: destinationCode,
        depart_date: travelDate
      });
      console.log("Bus search completed, found buses:", searchResult.buses.length);
      res.json({
        success: true,
        traceId: searchResult.traceId,
        buses: searchResult.buses,
        searchParams: { sourceCity, destinationCity, travelDate, passengers },
        provider: "Travelomatix",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Bus search error:", error);
      if (error.message.includes("authentication") || error.message.includes("credentials")) {
        res.status(401).json({
          success: false,
          message: "Travelomatix API authentication failed. Please check API credentials.",
          error: "authentication_failed",
          provider: "Travelomatix"
        });
      } else if (error.message.includes("No buses found")) {
        res.json({
          success: true,
          traceId: Date.now(),
          buses: [
            {
              id: "demo-bus-1",
              operator: "South India Travels",
              busType: "AC Sleeper",
              departureTime: "22:30",
              arrivalTime: "06:00",
              duration: "7h 30m",
              availableSeats: 12,
              fare: 850,
              amenities: ["WiFi", "Charging Port", "Blanket", "Water Bottle"],
              boardingPoints: [
                { id: 1, name: `${sourceCity} Central Bus Station`, time: "22:30" },
                { id: 2, name: `${sourceCity} Airport`, time: "23:15" }
              ],
              droppingPoints: [
                { id: 1, name: `${destinationCity} Main Terminal`, time: "05:45" },
                { id: 2, name: `${destinationCity} Railway Station`, time: "06:00" }
              ]
            },
            {
              id: "demo-bus-2",
              operator: "Tamil Nadu Express",
              busType: "Volvo Multi-Axle AC",
              departureTime: "23:45",
              arrivalTime: "07:15",
              duration: "7h 30m",
              availableSeats: 8,
              fare: 950,
              amenities: ["WiFi", "Entertainment", "Meal", "Charging Port"],
              boardingPoints: [
                { id: 3, name: `${sourceCity} Tech Park`, time: "23:45" }
              ],
              droppingPoints: [
                { id: 3, name: `${destinationCity} City Center`, time: "07:15" }
              ]
            }
          ],
          message: "Travelomatix API connected successfully but no buses found for this route. Showing demo data for booking flow testing.",
          searchParams: { sourceCity, destinationCity, travelDate, passengers },
          provider: "Travelomatix-Demo",
          isDemo: true
        });
      } else {
        res.json({
          success: true,
          traceId: Date.now(),
          buses: [
            {
              id: "demo-bus-1",
              operator: "South India Travels",
              busType: "AC Sleeper",
              departureTime: "22:30",
              arrivalTime: "06:00",
              duration: "7h 30m",
              availableSeats: 12,
              fare: 850,
              amenities: ["WiFi", "Charging Port", "Blanket", "Water Bottle"],
              boardingPoints: [
                { id: 1, name: `${sourceCity} Central Bus Station`, time: "22:30" },
                { id: 2, name: `${sourceCity} Airport`, time: "23:15" }
              ],
              droppingPoints: [
                { id: 1, name: `${destinationCity} Main Terminal`, time: "05:45" },
                { id: 2, name: `${destinationCity} Railway Station`, time: "06:00" }
              ]
            },
            {
              id: "demo-bus-2",
              operator: "Tamil Nadu Express",
              busType: "Volvo Multi-Axle AC",
              departureTime: "23:45",
              arrivalTime: "07:15",
              duration: "7h 30m",
              availableSeats: 8,
              fare: 950,
              amenities: ["WiFi", "Entertainment", "Meal", "Charging Port"],
              boardingPoints: [
                { id: 3, name: `${sourceCity} Tech Park`, time: "23:45" }
              ],
              droppingPoints: [
                { id: 3, name: `${destinationCity} City Center`, time: "07:15" }
              ]
            }
          ],
          searchParams: { sourceCity, destinationCity, travelDate, passengers },
          message: "Showing available buses (Demo mode while API integration is configured)",
          provider: "Travelomatix-Demo"
        });
      }
    }
  });
  app2.post("/api/bus/seat-layout", async (req, res) => {
    try {
      const { traceId, resultIndex } = req.body;
      if (!traceId || resultIndex === void 0) {
        return res.status(400).json({ message: "Missing traceId or resultIndex" });
      }
      const seatLayout = await BusService.getSeatLayout({
        TraceId: traceId,
        ResultIndex: resultIndex
      });
      res.json(seatLayout);
    } catch (error) {
      console.error("Seat layout error:", error);
      res.status(500).json({ message: "Failed to get seat layout" });
    }
  });
  app2.post("/api/bus/boarding-points", async (req, res) => {
    try {
      const { traceId, resultIndex } = req.body;
      if (!traceId || resultIndex === void 0) {
        return res.status(400).json({ message: "Missing traceId or resultIndex" });
      }
      const points = await BusService.getBoardingPoints({
        TraceId: traceId,
        ResultIndex: resultIndex
      });
      res.json(points);
    } catch (error) {
      console.error("Boarding points error:", error);
      res.status(500).json({ message: "Failed to get boarding/dropping points" });
    }
  });
  app2.get("/api/bus/popular-routes", async (req, res) => {
    try {
      const routes = BusService.getPopularTNRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching popular routes:", error);
      res.status(500).json({ message: "Failed to fetch popular routes" });
    }
  });
  app2.get("/api/flight/airports", async (req, res) => {
    try {
      const { FlightService: FlightService2 } = await Promise.resolve().then(() => (init_flightService(), flightService_exports));
      const airports = FlightService2.getPopularAirports();
      res.json(airports);
    } catch (error) {
      console.error("Error fetching airports:", error);
      res.status(500).json({ message: "Failed to fetch airports" });
    }
  });
  app2.post("/api/flight/search", async (req, res) => {
    try {
      const { FlightService: FlightService2 } = await Promise.resolve().then(() => (init_flightService(), flightService_exports));
      const { origin, destination, departureDate, returnDate, adults, children, infants, travelClass } = req.body;
      if (!origin || !destination || !departureDate) {
        return res.status(400).json({ message: "Missing required search parameters" });
      }
      const searchResult = await FlightService2.searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults: adults || 1,
        children: children || 0,
        infants: infants || 0,
        travelClass: travelClass || "ECONOMY"
      });
      const formattedFlights = FlightService2.formatFlightResults(searchResult.flights);
      res.json({
        searchId: searchResult.searchId,
        flights: formattedFlights,
        searchParams: searchResult.searchParams
      });
    } catch (error) {
      console.error("Flight search error:", error);
      if (error instanceof Error && error.message.includes("credentials not configured")) {
        res.status(503).json({
          message: "Flight API integration not yet configured. Please provide API credentials to enable live flight booking.",
          error: "service_unavailable"
        });
      } else {
        res.status(500).json({ message: "Failed to search flights" });
      }
    }
  });
  app2.post("/api/flight/book", isAuthenticated, async (req, res) => {
    try {
      const { FlightService: FlightService2 } = await Promise.resolve().then(() => (init_flightService(), flightService_exports));
      const bookingResult = await FlightService2.bookFlight(req.body);
      const flightBooking = await storage.createFlightBooking({
        userId: req.user.id,
        bookingReference: bookingResult.bookingReference,
        pnr: bookingResult.pnr,
        ...req.body,
        totalAmount: parseFloat(bookingResult.totalPrice),
        commissionAmount: parseFloat(bookingResult.totalPrice) * 0.06,
        // 6% commission
        bookingStatus: "confirmed"
      });
      res.json({
        booking: flightBooking,
        ...bookingResult
      });
    } catch (error) {
      console.error("Flight booking error:", error);
      res.status(500).json({ message: "Failed to book flight" });
    }
  });
  app2.get("/api/flight/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings2 = await storage.getFlightBookingsByUserId(req.user.id);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching flight bookings:", error);
      res.status(500).json({ message: "Failed to fetch flight bookings" });
    }
  });
  app2.get("/api/hotel/cities", async (req, res) => {
    try {
      const { HotelService: HotelService2 } = await Promise.resolve().then(() => (init_hotelService(), hotelService_exports));
      const cities = HotelService2.getPopularCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  app2.post("/api/hotel/search", async (req, res) => {
    try {
      const { HotelService: HotelService2 } = await Promise.resolve().then(() => (init_hotelService(), hotelService_exports));
      const { cityCode, checkInDate, checkOutDate, roomQuantity, adults, children } = req.body;
      if (!cityCode || !checkInDate || !checkOutDate) {
        return res.status(400).json({ message: "Missing required search parameters" });
      }
      const searchResult = await HotelService2.searchHotels({
        cityCode,
        checkInDate,
        checkOutDate,
        roomQuantity: roomQuantity || 1,
        adults: adults || 2,
        children: children || 0
      });
      const formattedHotels = HotelService2.formatHotelResults(searchResult.hotels);
      res.json({
        searchId: searchResult.searchId,
        hotels: formattedHotels,
        searchParams: searchResult.searchParams
      });
    } catch (error) {
      console.error("Hotel search error:", error);
      if (error instanceof Error && error.message.includes("credentials not configured")) {
        res.status(503).json({
          message: "Hotel API integration not yet configured. Please provide API credentials to enable live hotel booking.",
          error: "service_unavailable"
        });
      } else {
        res.status(500).json({ message: "Failed to search hotels" });
      }
    }
  });
  app2.post("/api/hotel/book", isAuthenticated, async (req, res) => {
    try {
      const { HotelService: HotelService2 } = await Promise.resolve().then(() => (init_hotelService(), hotelService_exports));
      const bookingResult = await HotelService2.bookHotel(req.body);
      const hotelBooking = await storage.createHotelBooking({
        userId: req.user.id,
        bookingReference: bookingResult.bookingReference,
        ...req.body,
        totalAmount: parseFloat(bookingResult.totalPrice),
        commissionAmount: parseFloat(bookingResult.totalPrice) * 0.06,
        // 6% commission
        bookingStatus: "confirmed"
      });
      res.json({
        booking: hotelBooking,
        ...bookingResult
      });
    } catch (error) {
      console.error("Hotel booking error:", error);
      res.status(500).json({ message: "Failed to book hotel" });
    }
  });
  app2.get("/api/hotel/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings2 = await storage.getHotelBookingsByUserId(req.user.id);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching hotel bookings:", error);
      res.status(500).json({ message: "Failed to fetch hotel bookings" });
    }
  });
  app2.get("/api/admin/rental-categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const categories = await db.select().from(rentalCategories).orderBy(asc2(rentalCategories.displayOrder));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching rental categories:", error);
      res.status(500).json({ message: "Failed to fetch rental categories" });
    }
  });
  app2.post("/api/admin/rental-categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const categoryData = insertRentalCategorySchema.parse(req.body);
      const [category] = await db.insert(rentalCategories).values(categoryData).returning();
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating rental category:", error);
      res.status(500).json({ message: "Failed to create rental category" });
    }
  });
  app2.put("/api/admin/rental-categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertRentalCategorySchema.parse(req.body);
      const [category] = await db.update(rentalCategories).set({ ...categoryData, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(rentalCategories.id, id)).returning();
      res.json(category);
    } catch (error) {
      console.error("Error updating rental category:", error);
      res.status(500).json({ message: "Failed to update rental category" });
    }
  });
  app2.delete("/api/admin/rental-categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(rentalCategories).where(eq4(rentalCategories.id, id));
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting rental category:", error);
      res.status(500).json({ message: "Failed to delete rental category" });
    }
  });
  app2.get("/api/rental-categories", async (req, res) => {
    try {
      const categories = await db.select().from(rentalCategories).where(eq4(rentalCategories.isActive, true)).orderBy(asc2(rentalCategories.displayOrder));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental categories" });
    }
  });
  app2.get("/api/admin/rental-subcategories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategories = await db.select().from(rentalSubcategories).orderBy(desc2(rentalSubcategories.createdAt));
      const subcategoriesWithDetails = await Promise.all(
        subcategories.map(async (item) => {
          const [category] = await db.select({ name: rentalCategories.name }).from(rentalCategories).where(eq4(rentalCategories.id, item.categoryId));
          return {
            ...item,
            categoryName: category?.name || "Unknown Category"
          };
        })
      );
      res.json(subcategoriesWithDetails);
    } catch (error) {
      console.error("Error fetching rental subcategories:", error);
      res.status(500).json({ message: "Failed to fetch rental subcategories" });
    }
  });
  app2.post("/api/admin/rental-subcategories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategoryData = insertRentalSubcategorySchema.parse(req.body);
      const [subcategory] = await db.insert(rentalSubcategories).values(subcategoryData).returning();
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating rental subcategory:", error);
      res.status(500).json({ message: "Failed to create rental subcategory" });
    }
  });
  app2.patch("/api/admin/rental-subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subcategoryData = insertRentalSubcategorySchema.partial().parse(req.body);
      const [updated] = await db.update(rentalSubcategories).set({ ...subcategoryData, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(rentalSubcategories.id, id)).returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating rental subcategory:", error);
      res.status(500).json({ message: "Failed to update rental subcategory" });
    }
  });
  app2.delete("/api/admin/rental-subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(rentalSubcategories).where(eq4(rentalSubcategories.id, id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting rental subcategory:", error);
      res.status(500).json({ message: "Failed to delete rental subcategory" });
    }
  });
  app2.get("/api/rental-subcategories", async (req, res) => {
    try {
      const subcategories = await db.select().from(rentalSubcategories).where(eq4(rentalSubcategories.isActive, true)).orderBy(asc2(rentalSubcategories.displayOrder));
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental subcategories" });
    }
  });
  app2.get("/api/rental-subcategories/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const subcategories = await db.select().from(rentalSubcategories).where(and2(
        eq4(rentalSubcategories.categoryId, categoryId),
        eq4(rentalSubcategories.isActive, true)
      )).orderBy(asc2(rentalSubcategories.displayOrder));
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental subcategories" });
    }
  });
  app2.get("/api/rental-equipment", async (req, res) => {
    try {
      const equipment = await db.select().from(rentalEquipment).where(and2(
        eq4(rentalEquipment.adminApproved, true),
        eq4(rentalEquipment.isActive, true),
        eq4(rentalEquipment.status, "active")
      ));
      const equipmentWithDetails = await Promise.all(
        equipment.map(async (item) => {
          const [category] = await db.select({ name: rentalCategories.name }).from(rentalCategories).where(eq4(rentalCategories.id, item.categoryId));
          let subcategory = null;
          if (item.subcategoryId) {
            const [sub] = await db.select({ name: rentalSubcategories.name }).from(rentalSubcategories).where(eq4(rentalSubcategories.id, item.subcategoryId));
            subcategory = sub;
          }
          const [provider] = await db.select({ username: users.username }).from(users).where(eq4(users.id, item.providerId));
          return {
            ...item,
            categoryName: category?.name || "Unknown Category",
            subcategoryName: subcategory?.name || null,
            providerName: provider?.username || "Unknown Provider"
          };
        })
      );
      res.json(equipmentWithDetails);
    } catch (error) {
      console.error("Error fetching rental equipment:", error);
      res.status(500).json({ message: "Failed to fetch rental equipment" });
    }
  });
  app2.get("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      ensureUserExists(req);
      const equipment = await db.select().from(rentalEquipment).where(eq4(rentalEquipment.providerId, req.user.id));
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching provider equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });
  app2.post("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      ensureUserExists(req);
      const equipmentData = {
        ...req.body,
        providerId: req.user.id,
        availableQuantity: req.body.totalQuantity || 1,
        adminApproved: false,
        status: "pending"
      };
      const [equipment] = await db.insert(rentalEquipment).values(equipmentData).returning();
      res.status(201).json(equipment);
    } catch (error) {
      console.error("Error creating equipment:", error);
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });
  app2.get("/api/admin/rental-equipment", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const equipment = await db.select().from(rentalEquipment).orderBy(desc2(rentalEquipment.createdAt));
      const equipmentWithDetails = await Promise.all(
        equipment.map(async (item) => {
          const [category] = await db.select({ name: rentalCategories.name }).from(rentalCategories).where(eq4(rentalCategories.id, item.categoryId));
          const [provider] = await db.select({ username: users.username }).from(users).where(eq4(users.id, item.providerId));
          return {
            ...item,
            categoryName: category?.name || "Unknown Category",
            providerName: provider?.username || "Unknown Provider"
          };
        })
      );
      res.json(equipmentWithDetails);
    } catch (error) {
      console.error("Error fetching admin rental equipment:", error);
      res.status(500).json({ message: "Failed to fetch rental equipment" });
    }
  });
  app2.patch("/api/admin/rental-equipment/:id/approve", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [updated] = await db.update(rentalEquipment).set({ adminApproved: true, status: "active" }).where(eq4(rentalEquipment.id, id)).returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve equipment" });
    }
  });
  app2.get("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      const equipment = await db.select().from(rentalEquipment).where(eq4(rentalEquipment.providerId, req.user.id));
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your equipment" });
    }
  });
  app2.post("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      const equipmentData = insertRentalEquipmentSchema.parse({
        ...req.body,
        providerId: req.user.id,
        adminApproved: false,
        status: "pending"
      });
      const [equipment] = await db.insert(rentalEquipment).values(equipmentData).returning();
      res.status(201).json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to add equipment" });
    }
  });
  app2.get("/api/rental-cart", isAuthenticated, async (req, res) => {
    try {
      const cartItems = await db.select().from(rentalCart).where(eq4(rentalCart.userId, req.user.id));
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  app2.post("/api/rental-cart", isAuthenticated, async (req, res) => {
    try {
      const cartData = insertRentalCartSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const [cartItem] = await db.insert(rentalCart).values(cartData).returning();
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });
  app2.get("/api/provider/rental-items", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const rentalItems = await storage.getRentalsByProviderId(req.user.id);
      res.json(rentalItems);
    } catch (error) {
      console.error("Error fetching provider rental items:", error);
      res.status(500).json({ message: "Failed to fetch rental items" });
    }
  });
  app2.get("/api/customer/rental-items", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const rentalItems = await storage.getRentalsByUserId(req.user.id);
      res.json(rentalItems);
    } catch (error) {
      console.error("Error fetching customer rental items:", error);
      res.status(500).json({ message: "Failed to fetch rental items" });
    }
  });
  app2.post("/api/local-products/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { productId, quantity } = req.body;
      const existingItem = await storage.getLocalProductCartItem(req.user.id, productId);
      if (existingItem) {
        await storage.updateLocalProductCartItem(req.user.id, productId, existingItem.quantity + quantity);
      } else {
        await storage.addToLocalProductCart({
          userId: req.user.id,
          productId,
          quantity
        });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  app2.get("/api/local-products/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const cartItems = await storage.getLocalProductCartItems(req.user.id);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.put("/api/local-products/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      if (quantity <= 0) {
        await storage.removeFromLocalProductCart(req.user.id, parseInt(productId));
      } else {
        await storage.updateLocalProductCartItem(req.user.id, parseInt(productId), quantity);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  app2.delete("/api/local-products/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { productId } = req.params;
      await storage.removeFromLocalProductCart(req.user.id, parseInt(productId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  app2.delete("/api/local-products/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      await storage.clearLocalProductCart(req.user.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.post("/api/local-products/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { shippingAddress, district, taluk, pincode, paymentMethod, notes } = req.body;
      const cartItems = await storage.getLocalProductCartItems(req.user.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = item.product.discountedPrice || item.product.price;
        return sum + price * item.quantity;
      }, 0);
      const order = await storage.createLocalProductOrder({
        customerId: req.user.id,
        totalAmount,
        shippingAddress,
        district,
        taluk,
        pincode,
        paymentMethod: paymentMethod || "cash",
        notes
      });
      for (const item of cartItems) {
        const price = item.product.discountedPrice || item.product.price;
        await storage.createLocalProductOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: price,
          subtotal: price * item.quantity,
          productName: item.product.name,
          manufacturerId: item.product.manufacturerId || 0
        });
      }
      await storage.clearLocalProductCart(req.user.id);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/local-products/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const orders = await storage.getLocalProductOrdersByUser(req.user.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/delivery/categories", async (req, res) => {
    try {
      const categories = await storage.getDeliveryCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching delivery categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.get("/api/delivery-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categories = await storage.getDeliveryCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching delivery categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.post("/api/delivery-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryData = {
        ...req.body,
        isActive: true
      };
      const category = await storage.createDeliveryCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating delivery category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  app2.put("/api/delivery-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.updateDeliveryCategory(categoryId, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating delivery category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });
  app2.delete("/api/delivery-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryId = parseInt(req.params.id);
      await storage.deleteDeliveryCategory(categoryId);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting delivery category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  app2.get("/api/admin/delivery/agents/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const agents = await storage.getDeliveryAgentsForApproval();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching pending delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });
  app2.get("/api/admin/delivery/agents", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const agents = await storage.getAllDeliveryAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching all delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });
  app2.get("/api/admin/delivery/agents/approved", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const agents = await storage.getApprovedDeliveryAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching approved delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });
  app2.put("/api/admin/delivery/agents/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const agentId = parseInt(req.params.id);
      const { approved } = req.body;
      const agent = await storage.approveDeliveryAgent(agentId, approved);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error approving delivery agent:", error);
      res.status(500).json({ message: "Error approving agent" });
    }
  });
  app2.put("/api/admin/delivery/agents/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const agentId = parseInt(req.params.id);
      const { isOnline, isAvailable } = req.body;
      const agent = await storage.updateDeliveryAgentStatus(agentId, isOnline, isAvailable);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error updating delivery agent status:", error);
      res.status(500).json({ message: "Error updating agent status" });
    }
  });
  app2.post("/api/provider/delivery/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      console.log("Registration request body:", JSON.stringify(req.body, null, 2));
      const existingAgent = await storage.getDeliveryAgentByUserId(req.user.id);
      if (existingAgent) {
        return res.status(400).json({ message: "You already have a delivery agent registration" });
      }
      if (!req.body.name || !req.body.phone || !req.body.district || !req.body.categoryId) {
        return res.status(400).json({ message: "Missing required fields: name, phone, district, categoryId" });
      }
      const agentData = {
        userId: req.user.id,
        name: req.body.name,
        mobileNumber: req.body.phone,
        // Map phone to mobileNumber
        email: req.body.email || null,
        address: req.body.address,
        district: req.body.district,
        taluk: req.body.taluk,
        pincode: req.body.pincode,
        categoryId: parseInt(req.body.categoryId),
        availableStartTime: req.body.availableStartTime || null,
        availableEndTime: req.body.availableEndTime || null,
        operationAreas: JSON.stringify(req.body.operationAreas || {}),
        documents: req.body.documents || null,
        status: "pending",
        verificationStatus: "pending",
        adminApproved: false,
        isOnline: false,
        isAvailable: false,
        rating: 0
      };
      console.log("Agent data to insert:", JSON.stringify(agentData, null, 2));
      const agent = await storage.registerDeliveryAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      console.error("Error registering delivery agent:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ message: "Error registering agent", error: error.message });
    }
  });
  app2.get("/api/provider/delivery/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const agent = await storage.getDeliveryAgentByUserId(req.user.id);
      res.json(agent);
    } catch (error) {
      console.error("Error fetching delivery agent status:", error);
      res.status(500).json({ message: "Error fetching status" });
    }
  });
  app2.put("/api/provider/delivery/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const agent = await storage.getDeliveryAgentByUserId(req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Delivery agent registration not found" });
      }
      const { isOnline, isAvailable } = req.body;
      const updatedAgent = await storage.updateDeliveryAgentStatus(agent.id, isOnline, isAvailable);
      res.json(updatedAgent);
    } catch (error) {
      console.error("Error updating delivery agent status:", error);
      res.status(500).json({ message: "Error updating status" });
    }
  });
  app2.get("/api/provider/delivery/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const agent = await storage.getDeliveryAgentByUserId(req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Delivery agent registration not found" });
      }
      const orders = await storage.getDeliveryOrdersByAgentId(agent.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  app2.put("/api/provider/delivery/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateDeliveryOrder(orderId, { status });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating delivery order status:", error);
      res.status(500).json({ message: "Error updating order" });
    }
  });
  app2.get("/api/delivery/categories", async (req, res) => {
    try {
      const categories = await storage.getDeliveryCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching delivery categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.get("/api/taxi/categories", async (req, res) => {
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.post("/api/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryData = {
        ...req.body,
        isActive: true
      };
      const category = await storage.createTaxiCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating taxi category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  app2.put("/api/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.updateTaxiCategory(categoryId, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating taxi category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });
  app2.delete("/api/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryId = parseInt(req.params.id);
      await storage.deleteTaxiCategory(categoryId);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting taxi category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  app2.get("/api/delivery/agents", async (req, res) => {
    try {
      const { district, taluk, pincode } = req.query;
      if (!district) {
        return res.status(400).json({ message: "District is required" });
      }
      const agents = await storage.getDeliveryAgentsByLocation(
        district,
        taluk,
        pincode
      );
      res.json(agents);
    } catch (error) {
      console.error("Error fetching delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });
  app2.post("/api/delivery/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const orderData = {
        ...req.body,
        customerId: req.user.id,
        status: "pending"
      };
      const order = await storage.createDeliveryOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating delivery order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });
  app2.get("/api/delivery/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const orders = await storage.getDeliveryOrdersByCustomerId(req.user.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching delivery orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  app2.get("/api/delivery/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getDeliveryOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.customerId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching delivery order:", error);
      res.status(500).json({ message: "Error fetching order" });
    }
  });
  app2.get("/api/admin/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.post("/api/admin/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryData = {
        ...req.body,
        createdAt: /* @__PURE__ */ new Date()
      };
      const category = await storage.createTaxiCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating taxi category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  app2.put("/api/admin/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryId = parseInt(req.params.id);
      const updatedCategory = await storage.updateTaxiCategory(categoryId, req.body);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating taxi category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });
  app2.delete("/api/admin/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const categoryId = parseInt(req.params.id);
      await storage.deleteTaxiCategory(categoryId);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting taxi category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  app2.get("/api/taxi-categories", async (req, res) => {
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  app2.get("/api/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      console.log("Fetching taxi vehicles for admin...");
      const vehicles = await storage.getApprovedTaxiVehicles();
      console.log(`Found ${vehicles.length} approved taxi vehicles`);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.get("/api/taxi/providers", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      console.log("Fetching taxi providers for admin...");
      const providers = await storage.getTaxiProviders();
      console.log(`Found ${providers.length} taxi providers`);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching taxi providers:", error);
      res.status(500).json({ message: "Error fetching providers" });
    }
  });
  app2.patch("/api/taxi/providers/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const providerId = parseInt(req.params.id);
      const updatedProvider = await storage.updateServiceProviderStatus(providerId, "approved");
      if (!updatedProvider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(updatedProvider);
    } catch (error) {
      console.error("Error approving taxi provider:", error);
      res.status(500).json({ message: "Error approving provider" });
    }
  });
  app2.patch("/api/taxi/providers/:id/reject", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const providerId = parseInt(req.params.id);
      const updatedProvider = await storage.updateServiceProviderStatus(providerId, "rejected");
      if (!updatedProvider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(updatedProvider);
    } catch (error) {
      console.error("Error rejecting taxi provider:", error);
      res.status(500).json({ message: "Error rejecting provider" });
    }
  });
  app2.get("/api/admin/taxi-vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      console.log("Fetching all taxi vehicles for admin...");
      const vehicles = await storage.getTaxiVehicles();
      console.log(`Found ${vehicles.length} taxi vehicles`);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });
  app2.patch("/api/admin/taxi-vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const vehicleId = parseInt(req.params.id);
      const updatedVehicle = await storage.approveTaxiVehicle(vehicleId);
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(updatedVehicle);
    } catch (error) {
      console.error("Error approving taxi vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });
  app2.get("/api/admin/taxi-stats", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      console.log("Fetching taxi stats for admin...");
      const vehicles = await storage.getAllTaxiVehicles();
      const categories = await storage.getTaxiCategories();
      const bookings2 = await storage.getAllTaxiBookings();
      const stats = {
        totalVehicles: vehicles.length,
        approvedVehicles: vehicles.filter((v) => v.adminApproved).length,
        activeVehicles: vehicles.filter((v) => v.isActive && v.adminApproved).length,
        totalCategories: categories.length,
        activeCategories: categories.filter((c) => c.isActive).length,
        totalBookings: bookings2.length,
        pendingBookings: bookings2.filter((b) => b.status === "pending").length,
        completedBookings: bookings2.filter((b) => b.status === "completed").length
      };
      console.log("Taxi stats:", stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching taxi stats:", error);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });
  app2.post("/api/taxi/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const bookingData = {
        ...req.body,
        userId: req.user.id,
        status: "pending"
      };
      const booking = await storage.createTaxiBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating taxi booking:", error);
      res.status(500).json({ message: "Error creating booking" });
    }
  });
  app2.post("/api/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const category = await storage.createTaxiCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating taxi category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  app2.put("/api/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateTaxiCategory(id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating taxi category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });
  app2.put("/api/service-providers/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.updateServiceProviderStatus(id, "approved");
      res.json(provider);
    } catch (error) {
      console.error("Error approving provider:", error);
      res.status(500).json({ message: "Error approving provider" });
    }
  });
  app2.put("/api/service-providers/:id/reject", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.updateServiceProviderStatus(id, "rejected");
      res.json(provider);
    } catch (error) {
      console.error("Error rejecting provider:", error);
      res.status(500).json({ message: "Error rejecting provider" });
    }
  });
  app2.put("/api/taxi/vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.approveTaxiVehicle(id);
      res.json(vehicle);
    } catch (error) {
      console.error("Error approving vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });
  app2.post("/api/service-requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { serviceType, serviceData, amount, paymentMethod } = req.body;
      const srNumber = await storage.generateServiceRequestNumber();
      const user = req.user;
      const district = user.district || serviceData.district;
      const taluk = user.taluk || serviceData.taluk;
      const pincode = user.pincode || serviceData.pincode;
      const serviceRequest = await storage.createServiceRequest({
        srNumber,
        userId: user.id,
        // Fixed: use userId instead of customerId
        serviceType,
        serviceData: JSON.stringify(serviceData),
        amount,
        paymentMethod,
        status: "new",
        district,
        taluk,
        pincode,
        // Auto-assign stakeholders based on location
        assignedAgentId: null,
        // Will be assigned by pincode agent
        talukManagerId: null,
        // Auto-assigned by system
        branchManagerId: null,
        // Auto-assigned by system
        paymentStatus: "pending"
      });
      await storage.createServiceRequestNotification({
        userId: user.id,
        serviceRequestId: serviceRequest.id,
        title: `New Service Request Created`,
        message: `Your ${serviceType} service request ${srNumber} has been created and is awaiting payment.`,
        type: "service_request_created",
        category: serviceType
      });
      res.status(201).json(serviceRequest);
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Error creating service request" });
    }
  });
  app2.post("/api/service-requests/:id/payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const requestId = parseInt(req.params.id);
      const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
      const updatedRequest = await storage.updateServiceRequestPayment(
        requestId,
        paymentId || razorpayPaymentId,
        "completed"
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      await storage.updateServiceRequestStatus(
        requestId,
        "in_progress",
        req.user.id,
        "Payment completed successfully"
      );
      await storage.distributeServiceRequestCommissions(requestId);
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Error processing payment" });
    }
  });
  app2.get("/api/service-requests/my-requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      console.log("DEBUG: User requesting service requests:", req.user.id, req.user.username);
      const requests = await storage.getServiceRequestsByCustomer(req.user.id);
      console.log("DEBUG: Found requests:", requests.length);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });
  app2.get("/api/service-requests/provider-requests", async (req, res) => {
    if (!req.isAuthenticated() || !["service_provider", "farmer"].includes(req.user.userType || req.user.type)) {
      return res.sendStatus(403);
    }
    try {
      const requests = await storage.getServiceRequestsByProvider(req.user.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching provider service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });
  app2.get("/api/service-requests/all", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    if (req.user.type !== "admin" && req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      console.log("Admin fetching all service requests, user:", req.user.username, req.user.type, req.user.userType);
      const serviceRequests2 = await storage.getAllServiceRequests();
      console.log("Found service requests for admin:", serviceRequests2.length);
      res.json(serviceRequests2);
    } catch (error) {
      console.error("Error fetching all service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });
  app2.patch("/api/service-requests/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.type !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user.id,
        notes
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });
  app2.patch("/api/service-requests/:id/assign", async (req, res) => {
    if (!req.isAuthenticated() || req.user.type !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { stakeholderType, stakeholderId } = req.body;
      const updatedRequest = await storage.assignServiceRequestStakeholder(
        parseInt(id),
        stakeholderType,
        stakeholderId
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error assigning service request:", error);
      res.status(500).json({ message: "Error assigning service request" });
    }
  });
  app2.get("/api/service-requests/agent-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }
    try {
      const serviceRequests2 = await storage.getServiceRequestsByAgent(req.user.id);
      res.json(serviceRequests2);
    } catch (error) {
      console.error("Error fetching agent service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });
  app2.patch("/api/service-requests/:id/agent-update", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user.id,
        notes
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });
  app2.patch("/api/service-requests/:id/accept", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const updatedRequest = await storage.assignServiceRequestStakeholder(
        parseInt(id),
        "assigned_to",
        req.user.id
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      await storage.updateServiceRequestStatus(
        parseInt(id),
        "assigned",
        req.user.id,
        "Request accepted by agent"
      );
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error accepting service request:", error);
      res.status(500).json({ message: "Error accepting service request" });
    }
  });
  app2.get("/api/service-requests/manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }
    try {
      const serviceRequests2 = await storage.getServiceRequestsByManager(req.user.id);
      res.json(serviceRequests2);
    } catch (error) {
      console.error("Error fetching manager service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });
  app2.patch("/api/service-requests/:id/manager-update", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user.id,
        notes
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });
  app2.patch("/api/service-requests/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "approved",
        req.user.id,
        "Approved by taluk manager"
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error approving service request:", error);
      res.status(500).json({ message: "Error approving service request" });
    }
  });
  app2.patch("/api/service-requests/:id/escalate", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "escalated",
        req.user.id,
        "Escalated to branch manager"
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error escalating service request:", error);
      res.status(500).json({ message: "Error escalating service request" });
    }
  });
  app2.get("/api/service-requests/branch-manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "branch_manager") {
      return res.sendStatus(403);
    }
    try {
      const serviceRequests2 = await storage.getServiceRequestsByBranchManager(req.user.id);
      res.json(serviceRequests2);
    } catch (error) {
      console.error("Error fetching branch manager service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });
  app2.patch("/api/service-requests/:id/branch-manager-update", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "branch_manager") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user.id,
        notes
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });
  app2.patch("/api/service-requests/:id/final-approval", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "branch_manager") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "final_approved",
        req.user.id,
        "Final approval granted by branch manager"
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error granting final approval:", error);
      res.status(500).json({ message: "Error granting final approval" });
    }
  });
  app2.patch("/api/service-requests/:id/escalate-to-admin", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "branch_manager") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "admin_escalated",
        req.user.id,
        "Escalated to admin for review"
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error escalating to admin:", error);
      res.status(500).json({ message: "Error escalating to admin" });
    }
  });
  app2.patch("/api/service-requests/:id/provider-update", async (req, res) => {
    if (!req.isAuthenticated() || !["service_provider", "farmer"].includes(req.user.userType || req.user.type)) {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user.id,
        notes
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });
  app2.get("/api/service-requests/agent-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }
    try {
      const requests = await storage.getServiceRequestsByAgent(req.user.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching agent requests:", error);
      res.status(500).json({ message: "Error fetching agent requests" });
    }
  });
  app2.get("/api/service-requests/taluk-manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }
    try {
      const requests = await storage.getServiceRequestsByManager(req.user.id, "taluk");
      res.json(requests);
    } catch (error) {
      console.error("Error fetching taluk manager requests:", error);
      res.status(500).json({ message: "Error fetching taluk manager requests" });
    }
  });
  app2.get("/api/service-requests/branch-manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "branch_manager") {
      return res.sendStatus(403);
    }
    try {
      const requests = await storage.getServiceRequestsByManager(req.user.id, "branch");
      res.json(requests);
    } catch (error) {
      console.error("Error fetching branch manager requests:", error);
      res.status(500).json({ message: "Error fetching branch manager requests" });
    }
  });
  app2.put("/api/service-requests/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const requestId = parseInt(req.params.id);
      const { status, reason, notes } = req.body;
      const updatedRequest = await storage.updateServiceRequestStatus(
        requestId,
        status,
        req.user.id,
        reason,
        notes
      );
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      if (status === "completed") {
        await storage.distributeServiceRequestCommissions(requestId);
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request status" });
    }
  });
  app2.put("/api/service-requests/:id/assign", async (req, res) => {
    if (!req.isAuthenticated() || !["taluk_manager", "branch_manager", "admin"].includes(req.user.userType)) {
      return res.sendStatus(403);
    }
    try {
      const requestId = parseInt(req.params.id);
      const { agentId } = req.body;
      const updatedRequest = await storage.assignServiceRequestToAgent(requestId, agentId);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error assigning service request:", error);
      res.status(500).json({ message: "Error assigning service request" });
    }
  });
  app2.get("/api/service-requests/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId) || requestId <= 0) {
        return res.status(400).json({ message: "Invalid service request ID" });
      }
      const serviceRequest = await storage.getServiceRequest(requestId);
      if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      const statusHistory = await storage.getServiceRequestStatusHistory(requestId);
      const commissions2 = await storage.getServiceRequestCommissions(requestId);
      res.json({
        ...serviceRequest,
        statusHistory,
        commissions: commissions2
      });
    } catch (error) {
      console.error("Error fetching service request details:", error);
      res.status(500).json({ message: "Error fetching service request details" });
    }
  });
  app2.get("/api/service-requests/status/:status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { status } = req.params;
      const requests = await storage.getServiceRequestsByStatus(status);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests by status:", error);
      res.status(500).json({ message: "Error fetching service requests by status" });
    }
  });
  app2.get("/api/service-requests/district/:district", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { district } = req.params;
      const requests = await storage.getServiceRequestsByDistrict(district);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching service requests by district:", error);
      res.status(500).json({ message: "Error fetching service requests by district" });
    }
  });
  app2.get("/api/service-requests/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const notifications2 = await storage.getServiceRequestNotificationsByUser(req.user.id);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching service request notifications:", error);
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  app2.put("/api/service-requests/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markServiceRequestNotificationAsRead(notificationId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Error marking notification as read" });
    }
  });
  app2.get("/api/service-requests/analytics", async (req, res) => {
    if (!req.isAuthenticated() || !["admin", "branch_manager", "taluk_manager"].includes(req.user.userType)) {
      return res.sendStatus(403);
    }
    try {
      const { startDate, endDate, serviceType, status } = req.query;
      let requests = await storage.getServiceRequestsByStatus("new");
      const analytics = {
        totalRequests: requests.length,
        byServiceType: {},
        byStatus: {},
        totalRevenue: requests.reduce((sum, req2) => sum + req2.amount, 0),
        avgRequestValue: requests.length > 0 ? requests.reduce((sum, req2) => sum + req2.amount, 0) / requests.length : 0
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching service request analytics:", error);
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });
  function hasVideoUploadPermission(user) {
    const allowedRoles = ["admin", "branch_manager", "taluk_manager"];
    return allowedRoles.includes(user.userType);
  }
  app2.get("/api/videos", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const { category, limit = 20, offset = 0 } = req.query;
      let videos2;
      if (hasVideoUploadPermission(req.user)) {
        if (category) {
          videos2 = await storage.getVideosByCategory(category);
        } else {
          videos2 = await storage.getAllVideos(parseInt(limit), parseInt(offset));
        }
      } else {
        videos2 = await storage.getPublicVideos(parseInt(limit), parseInt(offset));
      }
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Error fetching videos" });
    }
  });
  app2.get("/api/videos/my-uploads", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    if (!hasVideoUploadPermission(req.user)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    try {
      const videos2 = await storage.getVideosByUploader(req.user.id);
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching user videos:", error);
      res.status(500).json({ message: "Error fetching your videos" });
    }
  });
  app2.get("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      if (!video.isPublic && !hasVideoUploadPermission(req.user)) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.incrementVideoViews(videoId);
      await storage.createVideoView({
        videoId,
        userId: req.user.id,
        watchDuration: 0,
        completed: false
      });
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Error fetching video" });
    }
  });
  app2.put("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    if (!hasVideoUploadPermission(req.user)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    try {
      const videoId = parseInt(req.params.id);
      const existingVideo = await storage.getVideo(videoId);
      if (!existingVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      if (existingVideo.uploadedBy !== req.user.id && req.user.userType !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        isPublic: req.body.isPublic,
        tags: req.body.tags,
        status: req.body.status,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const video = await storage.updateVideo(videoId, updateData);
      res.json(video);
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Error updating video" });
    }
  });
  app2.delete("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    if (!hasVideoUploadPermission(req.user)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    try {
      const videoIdParam = req.params.id;
      const isYouTubeVideo = isNaN(parseInt(videoIdParam)) || videoIdParam.length === 11;
      if (isYouTubeVideo) {
        return res.status(400).json({
          message: "YouTube videos cannot be deleted through this system. Please use YouTube Studio to manage YouTube content."
        });
      }
      const videoId = parseInt(videoIdParam);
      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID format" });
      }
      const existingVideo = await storage.getVideo(videoId);
      if (!existingVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      if (existingVideo.uploadedBy !== req.user.id && req.user.userType !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deleteVideo(videoId);
      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Error deleting video" });
    }
  });
  app2.post("/api/videos/:id/view", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const videoId = parseInt(req.params.id);
      const { watchDuration, completed } = req.body;
      const viewData = {
        videoId,
        userId: req.user.id,
        watchDuration: watchDuration || 0,
        completed: completed || false
      };
      await storage.createVideoView(viewData);
      res.json({ message: "View tracked successfully" });
    } catch (error) {
      console.error("Error tracking video view:", error);
      res.status(500).json({ message: "Error tracking view" });
    }
  });
  app2.get("/api/videos/:id/analytics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    if (!hasVideoUploadPermission(req.user)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      const views = await storage.getVideoViews(videoId);
      const analytics = {
        totalViews: video.viewCount || 0,
        uniqueViewers: views.length,
        completionRate: views.length > 0 ? views.filter((v) => v.completionPercentage >= 90).length / views.length * 100 : 0,
        averageWatchTime: views.length > 0 ? views.reduce((sum, v) => sum + (v.watchDuration || 0), 0) / views.length : 0,
        recentViews: views.slice(-10)
        // Last 10 views
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching video analytics:", error);
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });
  app2.get("/api/youtube/videos", async (req, res) => {
    try {
      if (!process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID !== "UCp3MOo1CpFCa6awiaedrfhA") {
        return res.status(403).json({ error: "Access restricted: Only authorized Nalamini channel content allowed" });
      }
      const maxResults = parseInt(req.query.maxResults) || 10;
      const videos2 = await youtubeService.getChannelVideos(maxResults);
      const authorizedVideos = videos2.filter((video) => {
        return video.id && video.id.length === 11;
      });
      res.json(authorizedVideos);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      res.json([]);
    }
  });
  app2.get("/api/youtube/playlists", async (req, res) => {
    try {
      if (!process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID !== "UCp3MOo1CpFCa6awiaedrfhA") {
        return res.status(403).json({ error: "Access restricted: Only authorized Nalamini channel content allowed" });
      }
      const playlists = await youtubeService.getChannelPlaylists();
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching YouTube playlists:", error);
      res.json([]);
    }
  });
  app2.get("/api/youtube/playlist/:playlistId/videos", async (req, res) => {
    try {
      if (!process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID !== "UCp3MOo1CpFCa6awiaedrfhA") {
        return res.status(403).json({ error: "Access restricted: Only authorized Nalamini channel content allowed" });
      }
      const { playlistId } = req.params;
      const maxResults = parseInt(req.query.maxResults) || 50;
      const videos2 = await youtubeService.getPlaylistVideos(playlistId, maxResults);
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
      res.json([]);
    }
  });
  app2.get("/api/youtube/channel-info", async (req, res) => {
    try {
      if (process.env.YOUTUBE_CHANNEL_ID === "UCp3MOo1CpFCa6awiaedrfhA") {
        res.json({
          channelId: process.env.YOUTUBE_CHANNEL_ID,
          channelUrl: `https://www.youtube.com/channel/${process.env.YOUTUBE_CHANNEL_ID}`,
          channelName: "Nalamini Service Platform",
          verified: true
        });
      } else {
        res.status(403).json({ error: "Channel access restricted" });
      }
    } catch (error) {
      console.error("Error getting channel info:", error);
      res.status(500).json({ error: "Failed to fetch channel information" });
    }
  });
  app2.get("/api/districts", async (req, res) => {
    try {
      const districts = await storage.getDistricts();
      res.json(districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ error: "Failed to fetch districts" });
    }
  });
  app2.get("/api/taluks", async (req, res) => {
    try {
      const district = req.query.district;
      if (!district) {
        return res.status(400).json({ error: "District parameter is required" });
      }
      const taluks = await storage.getTaluksByDistrict(district);
      res.json(taluks);
    } catch (error) {
      console.error("Error fetching taluks:", error);
      res.status(500).json({ error: "Failed to fetch taluks" });
    }
  });
  app2.get("/api/pincodes", async (req, res) => {
    try {
      const taluk = req.query.taluk;
      const district = req.query.district;
      if (!taluk || !district) {
        return res.status(400).json({ error: "Taluk and district parameters are required" });
      }
      const pincodes = await storage.getPincodesByTaluk(taluk, district);
      res.json(pincodes);
    } catch (error) {
      console.error("Error fetching pincodes:", error);
      res.status(500).json({ error: "Failed to fetch pincodes" });
    }
  });
  const httpServer = createServer(app2);
  app2.post("/api/nominations", async (req, res) => {
    try {
      const nominationData = insertNominationSchema.parse(req.body);
      const nomination = await storage.createNomination(nominationData);
      res.status(201).json(nomination);
    } catch (error) {
      console.error("Error creating nomination:", error);
      res.status(400).json({ message: "Error creating nomination", error: error.message });
    }
  });
  app2.post("/api/nominations/send-otp", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      const otpData = {
        phoneNumber,
        otp,
        purpose: "nomination",
        expiresAt
      };
      await storage.createOtpVerification(otpData);
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      res.json({ message: "OTP sent successfully", otp });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Error sending OTP" });
    }
  });
  app2.post("/api/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, otp, purpose } = req.body;
      if (!phoneNumber || !otp || !purpose) {
        return res.status(400).json({ message: "Phone number, OTP, and purpose are required" });
      }
      const isValid = await storage.verifyOtp(phoneNumber, otp, purpose);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      if (purpose === "nomination") {
        await storage.updateNominationOtpVerified(phoneNumber);
      }
      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Error verifying OTP" });
    }
  });
  app2.get("/api/admin/nominations", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const nominations2 = await storage.getAllNominations();
      res.json(nominations2);
    } catch (error) {
      console.error("Error fetching nominations:", error);
      res.status(500).json({ message: "Error fetching nominations" });
    }
  });
  app2.get("/api/nominations/approved", async (req, res) => {
    try {
      const approvedNominations = await storage.getApprovedNominations();
      res.json(approvedNominations);
    } catch (error) {
      console.error("Error fetching approved nominations:", error);
      res.status(500).json({ message: "Error fetching approved nominations" });
    }
  });
  app2.put("/api/admin/nominations/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const nominationId = parseInt(req.params.id);
      const { status, adminResponse } = req.body;
      const nomination = await storage.updateNominationStatus(
        nominationId,
        status,
        adminResponse,
        req.user.id
      );
      res.json(nomination);
    } catch (error) {
      console.error("Error updating nomination status:", error);
      res.status(500).json({ message: "Error updating nomination status" });
    }
  });
  app2.get("/api/public-messages/:nominationId", async (req, res) => {
    try {
      const nominationId = parseInt(req.params.nominationId);
      const messages = await storage.getPublicMessages(nominationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching public messages:", error);
      res.status(500).json({ message: "Error fetching public messages" });
    }
  });
  app2.post("/api/public-messages", async (req, res) => {
    try {
      const messageData = {
        nominationId: req.body.nominationId,
        senderName: req.body.senderName || "Anonymous",
        message: req.body.message,
        messageType: req.body.messageType || "public"
      };
      const message = await storage.createPublicMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating public message:", error);
      res.status(500).json({ message: "Error creating public message" });
    }
  });
  app2.put("/api/nominations/:id/link-user", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const nominationId = parseInt(req.params.id);
      const { userId, profilePhoto } = req.body;
      const nomination = await storage.linkNominationToUser(nominationId, userId, profilePhoto);
      res.json(nomination);
    } catch (error) {
      console.error("Error linking nomination to user:", error);
      res.status(500).json({ message: "Error linking nomination to user" });
    }
  });
  app2.get("/api/nominations/:id/messages", async (req, res) => {
    try {
      const nominationId = parseInt(req.params.id);
      const messages = await storage.getPublicMessages(nominationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });
  app2.post("/api/nominations/:id/messages", async (req, res) => {
    try {
      const nominationId = parseInt(req.params.id);
      const messageData = insertPublicMessageSchema.parse({
        ...req.body,
        nominationId
      });
      if (req.isAuthenticated()) {
        messageData.senderId = req.user.id;
        if (req.user.userType === "admin") {
          messageData.isAdminMessage = true;
        }
      }
      const message = await storage.createPublicMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Error creating message", error: error.message });
    }
  });
  const videoUpload = multer({
    dest: path2.join(uploadsDir2, "videos"),
    limits: {
      fileSize: 150 * 1024 * 1024
      // 150MB limit to match Express settings
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid video format. Only MP4, AVI, MOV, WMV, FLV are allowed."));
      }
    }
  });
  const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large. Maximum size is 150MB." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Unexpected file field." });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err && err.message) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  };
  const chunkStorage = /* @__PURE__ */ new Map();
  setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1e3;
    for (const [uploadId, data] of chunkStorage.entries()) {
      if (data.timestamp < oneHourAgo) {
        chunkStorage.delete(uploadId);
      }
    }
  }, 5 * 60 * 1e3);
  const chunkUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
      // 5MB per chunk (larger than client 2MB for safety)
      fieldSize: 5 * 1024 * 1024,
      // 5MB field size
      fields: 10,
      // Allow multiple fields
      files: 1,
      // Only one file per request
      parts: 20
      // Allow multiple parts
    }
  });
  app2.post("/api/videos/upload-chunk", chunkUpload.single("chunk"), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const userType = req.user.userType;
    const allowedRoles = ["branch_manager", "taluk_manager", "pincode_agent", "admin"];
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ message: "Only managers can upload videos" });
    }
    try {
      const { uploadId, chunkIndex, totalChunks, title, description, originalName, totalSize } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "No chunk uploaded" });
      }
      const chunkIdx = parseInt(chunkIndex);
      const totalChks = parseInt(totalChunks);
      if (!chunkStorage.has(uploadId)) {
        chunkStorage.set(uploadId, {
          chunks: new Array(totalChks),
          totalChunks: totalChks,
          receivedChunks: 0,
          metadata: { title, description, originalName, totalSize, uploadedBy: req.user.id },
          timestamp: Date.now()
        });
      }
      const uploadSession = chunkStorage.get(uploadId);
      uploadSession.chunks[chunkIdx] = req.file.buffer;
      uploadSession.receivedChunks++;
      if (uploadSession.receivedChunks === uploadSession.totalChunks) {
        const completeFile = Buffer.concat(uploadSession.chunks);
        const timestamp2 = Date.now();
        const sanitizedOriginalName = uploadSession.metadata.originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `video_${timestamp2}_${sanitizedOriginalName}`;
        const filePath = `uploads/${filename}`;
        const videoData = {
          uploaderId: uploadSession.metadata.uploadedBy,
          title: uploadSession.metadata.title,
          description: uploadSession.metadata.description || null,
          filePath: `memory://${uploadId}`,
          // Use memory reference instead of file path
          fileName: filename,
          fileSize: completeFile.length,
          category: "advertisement",
          targetArea: req.user.district || null,
          status: "pending"
        };
        const validatedData = insertVideoUploadSchema.parse(videoData);
        const [video] = await db.insert(videoUploads).values(validatedData).returning();
        chunkStorage.delete(uploadId);
        res.json({
          message: "Video uploaded successfully and pending admin approval",
          video,
          isComplete: true
        });
      } else {
        res.json({
          message: `Chunk ${chunkIdx + 1}/${totalChks} received`,
          isComplete: false,
          progress: uploadSession.receivedChunks / uploadSession.totalChunks * 100
        });
      }
    } catch (error) {
      console.error("Error in chunked video upload:", error);
      res.status(500).json({ message: "Error processing video chunk" });
    }
  });
  app2.post("/api/videos/upload", videoUpload.single("video"), handleMulterError, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const userType = req.user.userType;
    const allowedRoles = ["branch_manager", "taluk_manager", "pincode_agent", "admin"];
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ message: "Only managers can upload videos" });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }
      const videoData = {
        uploaderId: req.user.id,
        title: req.body.title,
        description: req.body.description || null,
        filePath: req.file.path,
        fileName: req.file.filename,
        fileSize: req.file.size,
        category: req.body.category || "advertisement",
        targetArea: req.user.district || null,
        status: "pending"
      };
      const validatedData = insertVideoUploadSchema.parse(videoData);
      const [video] = await db.insert(videoUploads).values(validatedData).returning();
      res.status(201).json({
        message: "Video uploaded successfully and pending admin approval",
        video
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Error uploading video" });
    }
  });
  app2.get("/api/videos/my-uploads", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const videos2 = await db.select().from(videoUploads).where(eq4(videoUploads.uploaderId, req.user.id)).orderBy(desc2(videoUploads.createdAt));
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching user videos:", error);
      res.status(500).json({ message: "Error fetching videos" });
    }
  });
  app2.get("/api/admin/videos/pending", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const pendingVideos = await db.select().from(videoUploads).where(eq4(videoUploads.status, "pending")).orderBy(desc2(videoUploads.createdAt));
      res.json(pendingVideos);
    } catch (error) {
      console.error("Error fetching pending videos:", error);
      res.status(500).json({ message: "Error fetching pending videos" });
    }
  });
  app2.post("/api/admin/videos/:id/approval", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const { action, notes } = req.body;
      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'" });
      }
      const [existingVideo] = await db.select().from(videoUploads).where(eq4(videoUploads.id, videoId));
      if (!existingVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      const updateData = {
        adminApprovalBy: req.user.id,
        approvalNotes: notes || null,
        updatedAt: /* @__PURE__ */ new Date()
      };
      let youtubeUploadResult = null;
      if (action === "approve") {
        updateData.status = "approved";
        updateData.approvedAt = /* @__PURE__ */ new Date();
        if (existingVideo.filePath) {
          console.log(`Starting YouTube upload for approved video: ${existingVideo.title}`);
          try {
            const { youtubeService: youtubeService2 } = await Promise.resolve().then(() => (init_youtubeService(), youtubeService_exports));
            youtubeUploadResult = await youtubeService2.uploadApprovedVideo(
              existingVideo.id,
              existingVideo.filePath,
              existingVideo.title,
              existingVideo.description || "Video uploaded via Nalamini Service Platform"
            );
            if (youtubeUploadResult.success) {
              updateData.youtubeVideoId = youtubeUploadResult.videoId;
              console.log(`Successfully uploaded to YouTube: ${youtubeUploadResult.videoUrl}`);
            } else {
              console.warn(`YouTube upload failed: ${youtubeUploadResult.error}`);
            }
          } catch (uploadError) {
            console.error("YouTube upload error:", uploadError);
          }
        }
      } else {
        updateData.status = "rejected";
        updateData.rejectedAt = /* @__PURE__ */ new Date();
      }
      const [updatedVideo] = await db.update(videoUploads).set(updateData).where(eq4(videoUploads.id, videoId)).returning();
      const responseMessage = action === "approve" ? youtubeUploadResult?.success ? `Video approved and uploaded to YouTube: ${youtubeUploadResult.videoUrl}` : "Video approved successfully" : "Video rejected successfully";
      res.json({
        message: responseMessage,
        video: updatedVideo,
        youtubeUpload: youtubeUploadResult
      });
    } catch (error) {
      console.error("Error processing video approval:", error);
      res.status(500).json({ message: "Error processing video approval" });
    }
  });
  app2.get("/api/videos/public", async (req, res) => {
    try {
      const { district, taluk, pincode, category, limit = 20 } = req.query;
      console.log("Fetching public approved videos...");
      let whereConditions = [eq4(videoUploads.status, "approved")];
      if (district) {
        whereConditions.push(eq4(videoUploads.targetArea, district));
      }
      if (category && category !== "all") {
        whereConditions.push(eq4(videoUploads.category, category));
      }
      const videos2 = await db.select({
        id: videoUploads.id,
        title: videoUploads.title,
        description: videoUploads.description,
        fileName: videoUploads.fileName,
        fileUrl: videoUploads.filePath,
        // Use filePath as fileUrl for compatibility
        fileSize: videoUploads.fileSize,
        duration: videoUploads.duration,
        thumbnailUrl: videoUploads.thumbnailUrl,
        uploadedBy: videoUploads.uploaderId,
        category: videoUploads.category,
        isPublic: sql2`true`,
        // All approved videos are considered public
        tags: sql2`ARRAY[]::text[]`,
        // Empty array for now
        status: sql2`'active'`,
        // Map approved to active status
        viewCount: sql2`0`,
        // Default view count
        createdAt: videoUploads.createdAt,
        updatedAt: videoUploads.updatedAt
      }).from(videoUploads).where(and2(...whereConditions)).orderBy(desc2(videoUploads.createdAt)).limit(parseInt(limit));
      console.log(`Found ${videos2.length} approved videos`);
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching public videos:", error);
      res.status(500).json({ message: "Error fetching public videos" });
    }
  });
  app2.get("/api/admin/videos/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const videos2 = await db.select().from(videoUploads).where(eq4(videoUploads.approvalStatus, "pending")).orderBy(desc2(videoUploads.createdAt));
      res.json(videos2);
    } catch (error) {
      console.error("Error fetching pending videos:", error);
      res.status(500).json({ message: "Error fetching pending videos" });
    }
  });
  app2.patch("/api/admin/videos/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const { id } = req.params;
      const { approved, adminNotes, youtubeVideoId } = req.body;
      const approvalStatus = approved ? "approved" : "rejected";
      const isPublic = approved ? true : false;
      const [video] = await db.update(videoUploads).set({
        approvalStatus,
        isPublic,
        adminNotes,
        youtubeVideoId,
        approvedBy: req.user.id,
        approvedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(videoUploads.id, parseInt(id))).returning();
      res.json({
        message: `Video ${approved ? "approved" : "rejected"} successfully`,
        video
      });
    } catch (error) {
      console.error("Error updating video approval:", error);
      res.status(500).json({ message: "Error updating video approval" });
    }
  });
  app2.post("/api/videos/analytics/view", async (req, res) => {
    try {
      const viewData = {
        videoId: req.body.videoId,
        viewerId: req.body.viewerId || null,
        sessionId: req.body.sessionId,
        videoDuration: req.body.videoDuration,
        deviceType: req.body.deviceType,
        browserType: req.body.browserType,
        ipAddress: req.ip || req.connection.remoteAddress || "unknown",
        referrer: req.body.referrer,
        watchTime: 0,
        completionPercentage: 0,
        isCompleted: false,
        createdAt: /* @__PURE__ */ new Date()
      };
      const validatedData = insertVideoViewAnalyticsSchema.parse(viewData);
      const [view] = await db.insert(videoViewAnalytics).values(validatedData).returning();
      res.status(201).json(view);
    } catch (error) {
      console.error("Error recording video view:", error);
      res.status(500).json({ message: "Error recording video view" });
    }
  });
  app2.put("/api/videos/analytics/session", async (req, res) => {
    try {
      const {
        sessionId,
        totalWatchTime,
        completionPercentage,
        pauseCount,
        seekCount,
        volumeChanges,
        playbackSpeed,
        isCompleted
      } = req.body;
      const [updatedView] = await db.update(videoViewAnalytics).set({
        watchTime: totalWatchTime,
        completionPercentage: Math.min(completionPercentage, 100),
        pauseCount,
        seekCount,
        volumeChanges,
        playbackSpeed,
        isCompleted,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(videoViewAnalytics.sessionId, sessionId)).returning();
      res.json(updatedView);
    } catch (error) {
      console.error("Error updating video analytics:", error);
      res.status(500).json({ message: "Error updating video analytics" });
    }
  });
  app2.get("/api/videos/analytics/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    try {
      const userType = req.user.userType;
      const userId = req.user.id;
      let videoQuery = db.select().from(videoUploads);
      if (userType !== "admin") {
        videoQuery = videoQuery.where(eq4(videoUploads.uploaderId, userId));
      }
      const videos2 = await videoQuery;
      const youtubeVideoIds = videos2.filter((v) => v.youtubeVideoId).map((v) => v.youtubeVideoId);
      if (youtubeVideoIds.length === 0) {
        return res.json({
          totalViews: 0,
          totalWatchTime: 0,
          averageWatchTime: 0,
          completionRate: 0,
          topVideos: [],
          recentViews: []
        });
      }
      const analytics = await db.select().from(videoViewAnalytics).where(inArray2(videoViewAnalytics.videoId, youtubeVideoIds)).orderBy(desc2(videoViewAnalytics.createdAt));
      const totalViews = analytics.length;
      const totalWatchTime = analytics.reduce((sum, view) => sum + (view.totalWatchTime || 0), 0);
      const averageWatchTime = totalViews > 0 ? Math.round(totalWatchTime / totalViews) : 0;
      const completedViews = analytics.filter((view) => view.isCompleted).length;
      const completionRate = totalViews > 0 ? Math.round(completedViews / totalViews * 100) : 0;
      const videoViewCounts = youtubeVideoIds.map((youtubeVideoId) => {
        const videoAnalytics = analytics.filter((a) => a.videoId === youtubeVideoId);
        const video = videos2.find((v) => v.youtubeVideoId === youtubeVideoId);
        return {
          video,
          viewCount: videoAnalytics.length,
          totalWatchTime: videoAnalytics.reduce((sum, a) => sum + (a.totalWatchTime || 0), 0),
          averageCompletion: videoAnalytics.length > 0 ? Math.round(videoAnalytics.reduce((sum, a) => sum + (a.completionPercentage || 0), 0) / videoAnalytics.length) : 0
        };
      });
      const topVideos = videoViewCounts.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
      const recentViews = analytics.slice(0, 10);
      res.json({
        totalViews,
        totalWatchTime,
        averageWatchTime,
        completionRate,
        topVideos,
        recentViews
      });
    } catch (error) {
      console.error("Error fetching video analytics dashboard:", error);
      res.status(500).json({ message: "Error fetching video analytics" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs4 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix for import.meta.dirname
const __filename = fileURLToPath(import.meta.url);
__dirname = path.dirname(__filename);

export default async function () {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ];

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return defineConfig({
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  });
}

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs4.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs4.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
init_db();
init_schema();
import { scrypt as scrypt2, randomBytes as randomBytes2 } from "crypto";
import { promisify as promisify2 } from "util";
import { eq as eq5 } from "drizzle-orm";
var scryptAsync2 = promisify2(scrypt2);
async function hashPassword2(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function seedDatabase() {
  console.log("Starting database seeding...");
  const existingAdmin = await db.select().from(users).where(eq5(users.username, "admin"));
  let adminId;
  if (existingAdmin.length === 0) {
    console.log("Admin user not found, creating...");
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword2("admin123"),
      fullName: "System Administrator",
      email: "admin@tnservices.com",
      userType: "admin",
      phone: "9876543210",
      walletBalance: 5e4,
      // Start with a large balance for testing
      createdAt: /* @__PURE__ */ new Date()
    }).returning({ id: users.id });
    adminId = adminUser.id;
    console.log("Admin user created successfully with ID:", adminId);
  } else {
    adminId = existingAdmin[0].id;
    console.log("Admin user already exists with ID:", adminId);
  }
  const districtTaluks = {
    "Ariyalur": ["Ariyalur", "Senthurai", "Udayarpalayam"],
    "Chengalpathu": ["Chengalpathu", "Thiruporur", "Tambaram", "Vandalur", "Maduranntakam", "Cheyyur"],
    "Chennai": ["Chennai North", "Chennai South", "Chennai East", "Chennai West"],
    "Coimbatore": ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Sulur", "Valparai"],
    "Cuddalore": ["Cuddalore", "Penruti", "Chidambaram", "Virudhachalam", "Kattumannarkoil", "Kurinjipadi", "Bhuvanagiri", "Srimushnam", "Veppur"],
    "Dharmapuri": ["Dharmapuri", "Hosur", "Palacode", "Pannagaram", "Pappireddipatti", "Karimangalam", "Nallampatti"],
    "Dindigul": ["Dindigul", "Palani", "Oddanchatram", "Vedasandur", "Kodaikanal", "Natham", "Nilakottai", "Athoor", "Battagundu"],
    "Erode": ["Erode", "Perundurai", "Gobichettipalayam", "Sathyamangalam", "Bhavani", "Anthiyur", "Modakuruchi", "Kodumudi"],
    "Kallakurichi": ["Kallakurichi", "Sankarapuram", "Chinnasalem", "Ulundurpet", "Tirukoiyur", "Rishivandiyam"],
    "Kanchipuram": ["Kanchipuram", "Uthiramerur", "Walajabad", "Sriperumbudur"],
    "Kanyakumari": ["Agastheeswaram", "Thovalai", "Kalkulam", "Vilavancode"],
    "Karur": ["Karur", "Aravakuruchi", "Krishnarayapuram", "Kulithalai", "Kadavur", "Manmangalam"],
    "Krishnagiri": ["Krishnagiri", "Hosur", "Pochampalli", "Uthangarai", "Denkanikotai", "Shoolagiri", "Bargur"],
    "Madurai": ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Thirumangalam", "Usilampatti", "Vadipatti", "Pariayur"],
    "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi", "Kuthalam", "Tharangambadi"],
    "Nagapattinam": ["Nagapattinam", "Tharangambadi", "Kilvelur", "Vedaranyam", "Sirkazhi"],
    "Namakkal": ["Namakkal", "Rasipuram", "Tiruchengode", "Kumarapalayam", "Paramathivelur", "Sendamangalam", "Mohanur"],
    "Nilgiris": ["Ooty", "Coonoor", "Kotagiri", "Gudalur", "Pandalur"],
    "Perambalur": ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"],
    "Pudukkottai": ["Pudukkottai", "Thirumayam", "Aranthangi", "Karambakudi", "Iluppur", "Gandarvakottai", "Kalathur", "Manamelkudi", "Ponamaravathi", "Avudaiyarkoil"],
    "Ramanathapuram": ["Ramanathapuram", "Paramakudi", "Tiruvadanai", "Mudukulathur", "Kamudi", "Rameshwaram", "Mandapam"],
    "Ranipet": ["Arcot", "Arakkonam", "Walajah", "Nemili", "Sholinganur", "Ranipet"],
    "Salem": ["Salem", "Omalur", "Mettur", "Edappadi", "Attur", "Sarkari", "Gangavalli", "Yercaud", "Pethanaikenpalayam", "Vazhapadi"],
    "Sivaganga": ["Sivaganga", "Karaikudi", "Manamadurai", "Tirupathur", "Ilayangudi", "Kalaiyarkoil", "Devakottai", "Singampunari"],
    "Tenkasi": ["Tenkasi", "Shenkottai", "Sankarankoil", "Sivagiri", "Kadayanallur", "V. K Padur", "Alangulam", "Veerakeralampudur"],
    "Thanjavur": ["Thanjavur", "Pattukottai", "Kumbakonam", "Orathanadu", "Thiruvidaimarudur", "Peravurani", "Ruvaiyaru", "Boothalur"],
    "Theni": ["Theni", "Periyakulam", "Andipatti", "Bodinayakanur", "Uthamapalayam", "Chinnamanur"],
    "Thoothukudi": ["Thoothukudi", "Ettayapuram", "Kovilpatti", "Ottapidaram", "Sathankulam", "Srivaikundam", "Tiruchendur", "Vilathikulam"],
    "Thiruchirappalli": ["Trichy West", "Trichy East", "Lalgudi", "Manapparai", "Manachanallur", "Musiri", "Srirangam", "Thiruvverumbur", "Thottiyam", "Thuraiyur"],
    "Tirunelveli": ["Tirunelveli", "Ambasamudram", "Nanguneri", "Palayamkottai", "Radhapuram", "Sankarankoil", "Tenkasi", "Veerakeralampudur"],
    "Tirupathur": ["Tirupathur", "Ambur", "Vaniyambadi", "Natrampalli"],
    "Tirupur": ["Tirupur North", "Tirupur South", "Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Udumalaipettai"],
    "Tiruvallur": ["Tiruvallur", "Poonamallee", "Gummidipoondi", "Pallipattu", "Ponneri", "Uthukottai", "Avadi", "R. K. Pet", "Tiruttani"],
    "Tiruvannamalai": ["Tiruvannamalai", "Arani", "Cheyyar", "Polur", "Vandavasi", "Chengani", "Kalasapakkam", "Chelpet"],
    "Tiruvarur": ["Tiruvarur", "Kodavasal", "Manargidi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Valangaiman"],
    "Vellore": ["Vellore", "Katpadi", "Gudiyatham", "Arakkonam", "Walajapet"],
    "Villupuram": ["Villupuram", "Gingee", "Kandachipuram", "Sankarapuram", "Tindivanam", "Ulundurpet", "Vanur"],
    "Virudhunagar": ["Virudhunagar", "Aruppukottai", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli"]
  };
  console.log("Checking for branch managers and taluk managers...");
  for (const [district, taluks] of Object.entries(districtTaluks)) {
    const districtFormatted = district.toLowerCase().replace(/ /g, "_");
    const branchManagerUsername = `bm_${districtFormatted}`;
    let existingBM = await db.select().from(users).where(eq5(users.username, branchManagerUsername));
    let branchManagerId;
    if (existingBM.length === 0) {
      console.log(`Creating branch manager for ${district}...`);
      const password = `${districtFormatted}123`;
      const [branchManager] = await db.insert(users).values({
        username: branchManagerUsername,
        password: await hashPassword2(password),
        fullName: `${district} Branch Manager`,
        email: `branchmanager.${districtFormatted}@tnservices.com`,
        userType: "branch_manager",
        parentId: adminId,
        // Branch managers report to admin
        district,
        phone: `98765${Math.floor(1e4 + Math.random() * 9e4)}`,
        // Random 10-digit phone number
        walletBalance: 1e4,
        // Starting balance for branch managers
        createdAt: /* @__PURE__ */ new Date()
      }).returning({ id: users.id });
      branchManagerId = branchManager.id;
      console.log(`Branch manager for ${district} created with ID: ${branchManagerId}`);
    } else {
      branchManagerId = existingBM[0].id;
      console.log(`Branch manager for ${district} already exists with ID: ${branchManagerId}`);
    }
    console.log(`Checking taluk managers for ${district}...`);
    for (const taluk of taluks) {
      const talukFormatted = taluk.toLowerCase().replace(/ /g, "_");
      const talukManagerUsername = `tm_${districtFormatted}_${talukFormatted}`;
      const existingTM = await db.select().from(users).where(eq5(users.username, talukManagerUsername));
      if (existingTM.length === 0) {
        console.log(`Creating taluk manager for ${taluk}, ${district}...`);
        const password = `${talukFormatted}123`;
        await db.insert(users).values({
          username: talukManagerUsername,
          password: await hashPassword2(password),
          fullName: `${taluk} Taluk Manager`,
          email: `talukmanager.${talukFormatted}@tnservices.com`,
          userType: "taluk_manager",
          parentId: branchManagerId,
          // Taluk managers report to their district's branch manager
          district,
          taluk,
          phone: `97865${Math.floor(1e4 + Math.random() * 9e4)}`,
          // Random 10-digit phone number
          walletBalance: 5e3,
          // Starting balance for taluk managers
          createdAt: /* @__PURE__ */ new Date()
        });
        console.log(`Taluk manager for ${taluk}, ${district} created successfully!`);
      } else {
        console.log(`Taluk manager for ${taluk}, ${district} already exists.`);
      }
    }
  }
  console.log("Database seeding completed successfully!");
}

// server/index.ts
init_db();
init_schema();
import http from "http";
import { sql as sql3, eq as eq6, desc as desc3, and as and3 } from "drizzle-orm";
http.globalAgent.maxSockets = Infinity;
process.env.UV_THREADPOOL_SIZE = "128";
var app = express3();
app.get("/api/videos/approved", async (req, res) => {
  try {
    const { district, taluk, pincode, category, limit = 20 } = req.query;
    console.log("PUBLIC: Fetching approved videos for video library...");
    let whereConditions = [eq6(videoUploads.status, "approved")];
    if (district) {
      whereConditions.push(eq6(videoUploads.targetArea, district));
    }
    if (category && category !== "all") {
      whereConditions.push(eq6(videoUploads.category, category));
    }
    const videos2 = await db.select({
      id: videoUploads.id,
      title: videoUploads.title,
      description: videoUploads.description,
      fileName: videoUploads.fileName,
      fileUrl: videoUploads.filePath,
      fileSize: videoUploads.fileSize,
      duration: videoUploads.duration,
      thumbnailUrl: videoUploads.thumbnailUrl,
      uploadedBy: videoUploads.uploaderId,
      category: videoUploads.category,
      isPublic: sql3`true`,
      tags: sql3`ARRAY[]::text[]`,
      status: sql3`'active'`,
      viewCount: sql3`0`,
      createdAt: videoUploads.createdAt,
      updatedAt: videoUploads.updatedAt
    }).from(videoUploads).where(and3(...whereConditions)).orderBy(desc3(videoUploads.createdAt)).limit(parseInt(limit));
    console.log(`PUBLIC: Found ${videos2.length} approved videos`);
    res.json(videos2);
  } catch (error) {
    console.error("PUBLIC: Error fetching approved videos:", error);
    res.status(500).json({ message: "Error fetching approved videos" });
  }
});
app.use(["/api/videos/upload", "/api/videos/upload-chunk"], (req, res, next) => {
  next();
});
app.use(express3.json({ limit: "150mb" }));
app.use(express3.urlencoded({ extended: false, limit: "150mb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});
app.use("/uploads", express3.static("uploads"));
app.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File too large. Maximum size is 150MB." });
  }
  if (err?.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ message: "Unexpected file field." });
  }
  if (err?.message?.includes("Multipart")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await seedDatabase();
    registerOilRoutes(app);
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    server.maxHeadersCount = 0;
    server.timeout = 3e5;
    server.keepAliveTimeout = 0;
    server.headersTimeout = 0;
    const port = 5e3;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
