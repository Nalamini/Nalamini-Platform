import { users, User, InsertUser, transactions, Transaction, InsertTransaction, feedback, Feedback, InsertFeedback, recharges, Recharge, InsertRecharge, bookings, Booking, InsertBooking, rentals, Rental, InsertRental, taxiRides, TaxiRide, InsertTaxiRide, deliveries, Delivery, InsertDelivery, groceryProducts, GroceryProduct, InsertGroceryProduct, localProductBase, localProductDetails, InsertLocalProductBase, UpsertLocalProductDetails, LocalProductView, recyclingRequests, RecyclingRequest, InsertRecyclingRequest, recyclingMaterialRates, RecyclingMaterialRate, InsertRecyclingMaterialRate, commissionConfigs, CommissionConfig, InsertCommissionConfig, commissions, Commission, InsertCommission, serviceProviders, ServiceProvider, InsertServiceProvider, farmerDetails, FarmerDetail, InsertFarmerDetail, manufacturerDetails, ManufacturerDetail, InsertManufacturerDetail, bookingAgentDetails, BookingAgentDetail, InsertBookingAgentDetail, taxiProviderDetails, TaxiProviderDetail, InsertTaxiProviderDetail, transportationAgentDetails, TransportationAgentDetail, InsertTransportationAgentDetail, rentalProviderDetails, RentalProviderDetail, InsertRentalProviderDetail, recyclingAgentDetails, RecyclingAgentDetail, InsertRecyclingAgentDetail, managerApplications, ManagerApplication, InsertManagerApplication, groceryCategories, GroceryCategory, InsertGroceryCategory, grocerySubCategories, GrocerySubCategory, InsertGrocerySubCategory, farmerProductListings, FarmerProductListing, InsertFarmerProductListing, deliveryAreas, DeliveryArea, InsertDeliveryArea, productRequests, ProductRequest, InsertProductRequest, groceryOrders, GroceryOrder, InsertGroceryOrder, groceryOrderItems, GroceryOrderItem, InsertGroceryOrderItem, commissionTransactions, CommissionTransaction, InsertCommissionTransaction, chatConversations, ChatConversation, InsertChatConversation, chatConversationMembers, ChatConversationMember, InsertChatConversationMember, chatMessages, ChatMessage, InsertChatMessage, notifications, Notification, InsertNotification, userDevices, UserDevice, InsertUserDevice, analyticsDaily, AnalyticsDaily, InsertAnalyticsDaily, reports, Report, InsertReport, analyticsEvents, AnalyticsEvent, InsertAnalyticsEvent, localProductCategories, LocalProductCategory, InsertLocalProductCategory, localProductSubCategories, LocalProductSubCategory, InsertLocalProductSubCategory, localProductCategoryRequests, LocalProductCategoryRequest, InsertLocalProductCategoryRequest, providerProducts, ProviderProduct, InsertProviderProduct, providerProductCategories, ProviderProductCategory, InsertProviderProductCategory, rentalCategories, RentalCategory, InsertRentalCategory, rentalEquipment, RentalEquipment, InsertRentalEquipment, rentalOrders, RentalOrder, InsertRentalOrder, rentalOrderItems, RentalOrderItem, rentalCart, RentalCartItem, InsertRentalCartItem, deliveryCategories, DeliveryCategory, InsertDeliveryCategory, deliveryAgents, DeliveryAgent, InsertDeliveryAgent, deliveryOrders, DeliveryOrder, InsertDeliveryOrder, taxiCategories, TaxiCategory, InsertTaxiCategory, taxiVehicles, TaxiVehicle, InsertTaxiVehicle, taxiBookings, TaxiBooking, InsertTaxiBooking, serviceRequests, ServiceRequest, InsertServiceRequest, serviceRequestStatusUpdates, ServiceRequestStatusUpdate, InsertServiceRequestStatusUpdate, serviceRequestCommissionTransactions, ServiceRequestCommissionTransaction, InsertServiceRequestCommissionTransaction, serviceRequestNotifications, ServiceRequestNotification, InsertServiceRequestNotification, videos, Video, InsertVideo, videoViews, VideoView, InsertVideoView, applications, Application, InsertApplication, nominations, Nomination, InsertNomination, otpVerifications, OtpVerification, InsertOtpVerification, publicMessages, PublicMessage, InsertPublicMessage, videoUploads, VideoUpload, InsertVideoUpload, videoViewAnalytics, VideoViewAnalytics, InsertVideoViewAnalytics, dailyVideoStats, DailyVideoStats, busBookings } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, asc, desc, sql, and, inArray, lt, isNull, isNotNull } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByUsernameStartingWith(prefix: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  listUsers(filter?: { userType?: string, parentId?: number }): Promise<User[]>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: number, limit?: number, offset?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
  
  // User devices operations (for push notifications)
  registerUserDevice(device: InsertUserDevice): Promise<UserDevice>;
  getUserDevices(userId: number): Promise<UserDevice[]>;
  updateUserDeviceLastSeen(deviceToken: string): Promise<void>;
  deactivateUserDevice(deviceToken: string): Promise<void>;
  
  // Analytics operations
  recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  updateDailyMetric(metric: InsertAnalyticsDaily): Promise<AnalyticsDaily>;
  getDailyMetrics(params: { 
    startDate: Date, 
    endDate: Date, 
    metrics?: string[], 
    categories?: string[],
    district?: string,
    taluk?: string
  }): Promise<AnalyticsDaily[]>;
  
  // Reports operations
  createReport(report: InsertReport): Promise<Report>;
  getReportById(id: number): Promise<Report | undefined>;
  getReportsByUser(userId: number): Promise<Report[]>;
  getPublicReports(): Promise<Report[]>;
  updateReport(id: number, updates: Partial<Report>): Promise<Report | undefined>;
  deleteReport(id: number): Promise<void>;
  
  // Wallet operations
  deductUserWalletBalance(userId: number, amount: number): Promise<number>;
  updateWalletBalance(userId: number, newBalance: number): Promise<void>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  
  // Chat operations
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  addUserToConversation(member: InsertChatConversationMember): Promise<ChatConversationMember>;
  removeUserFromConversation(conversationId: number, userId: number): Promise<void>;
  getUserConversations(userId: number): Promise<ChatConversation[]>;
  getConversationMembers(conversationId: number): Promise<User[]>;
  getConversationMembersWithDetails(conversationId: number): Promise<ChatConversationMember[]>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getMessagesForConversation(conversationId: number, limit?: number, before?: number): Promise<ChatMessage[]>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<void>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  listFeedback(filter?: { userId?: number, serviceType?: string }): Promise<Feedback[]>;

  // Recharge operations
  createRecharge(recharge: InsertRecharge): Promise<Recharge>;
  getRecharge(id: number): Promise<Recharge | undefined>;
  getRechargesByUserId(userId: number): Promise<Recharge[]>;
  updateRecharge(id: number, recharge: Partial<Recharge>): Promise<Recharge | undefined>;
  listRecharges(): Promise<Recharge[]>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBooking(id: number, booking: Partial<Booking>): Promise<Booking | undefined>;

  // Rental operations
  createRental(rental: InsertRental): Promise<Rental>;
  getRentalsByUserId(userId: number): Promise<Rental[]>;
  updateRental(id: number, rental: Partial<Rental>): Promise<Rental | undefined>;

  // Taxi operations
  createTaxiRide(taxiRide: InsertTaxiRide): Promise<TaxiRide>;
  getTaxiRidesByUserId(userId: number): Promise<TaxiRide[]>;
  updateTaxiRide(id: number, taxiRide: Partial<TaxiRide>): Promise<TaxiRide | undefined>;

  // Delivery operations
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  getDeliveriesByUserId(userId: number): Promise<Delivery[]>;
  updateDelivery(id: number, delivery: Partial<Delivery>): Promise<Delivery | undefined>;

  // Grocery Category operations
  getGroceryCategories(): Promise<GroceryCategory[]>;
  getGroceryCategory(id: number): Promise<GroceryCategory | undefined>;
  createGroceryCategory(category: InsertGroceryCategory): Promise<GroceryCategory>;
  updateGroceryCategory(id: number, category: Partial<GroceryCategory>): Promise<GroceryCategory | undefined>;
  deleteGroceryCategory(id: number): Promise<void>;
  
  // Grocery SubCategory operations
  getGrocerySubCategories(filter?: { parentCategoryId?: number, isActive?: boolean }): Promise<GrocerySubCategory[]>;
  getGrocerySubCategory(id: number): Promise<GrocerySubCategory | undefined>;
  createGrocerySubCategory(subcategory: InsertGrocerySubCategory): Promise<GrocerySubCategory>;
  updateGrocerySubCategory(id: number, subcategory: Partial<GrocerySubCategory>): Promise<GrocerySubCategory | undefined>;
  deleteGrocerySubCategory(id: number): Promise<void>;
  
  // Grocery operations
  createGroceryProduct(product: InsertGroceryProduct): Promise<GroceryProduct>;
  getGroceryProducts(filter?: { 
    category?: string, 
    district?: string, 
    isOrganic?: boolean, 
    farmerId?: number,
    status?: string,
    categoryId?: number,
    subcategoryId?: number
  }): Promise<GroceryProduct[]>;
  getGroceryProductById(id: number): Promise<GroceryProduct | undefined>;
  getGroceryProductsByProvider(providerId: number): Promise<GroceryProduct[]>;
  getGroceryProductsByProviderId(providerId: number): Promise<GroceryProduct[]>;
  updateGroceryProduct(id: number, product: Partial<GroceryProduct>): Promise<GroceryProduct | undefined>;
  getGroceryProductsForAdmin(filter?: { adminApproved?: boolean }): Promise<GroceryProduct[]>;
  clearGroceryProductsFromMemory(): Promise<void>;
  clearMemoryGroceryProducts(): Promise<void>;
  deleteAllGroceryProducts(): Promise<void>;
  deleteGroceryProduct(id: number): Promise<void>;

  // Local products operations - updated for new architecture
  // Base product operations
  createLocalProductBase(product: InsertLocalProductBase): Promise<typeof localProductBase.$inferSelect>;
  getLocalProductBaseById(id: number): Promise<typeof localProductBase.$inferSelect | undefined>;
  listLocalProductBases(filter?: { manufacturerId?: number, adminApproved?: boolean }): Promise<typeof localProductBase.$inferSelect[]>;
  updateLocalProductBase(id: number, data: Partial<InsertLocalProductBase>): Promise<typeof localProductBase.$inferSelect | undefined>;
  
  // Product details operations
  createLocalProductDetails(details: UpsertLocalProductDetails): Promise<typeof localProductDetails.$inferSelect>;
  getLocalProductDetailsById(id: number): Promise<typeof localProductDetails.$inferSelect | undefined>;
  getLocalProductDetailsByProductId(productId: number): Promise<typeof localProductDetails.$inferSelect | undefined>;
  updateLocalProductDetails(id: number, details: Partial<UpsertLocalProductDetails>): Promise<typeof localProductDetails.$inferSelect | undefined>;
  
  // Composite product view operations
  getLocalProductView(id: number): Promise<LocalProductView | undefined>;
  listLocalProductViews(filter?: { 
    category?: string, 
    district?: string, 
    manufacturerId?: number, 
    status?: string,
    isDraft?: boolean,
    adminApproved?: boolean
  }): Promise<LocalProductView[]>;
  
  // Local Product Categories operations
  getLocalProductCategories(): Promise<LocalProductCategory[]>;
  createLocalProductCategory(category: InsertLocalProductCategory): Promise<LocalProductCategory>;
  getLocalProductCategory(id: number): Promise<LocalProductCategory | undefined>;
  updateLocalProductCategory(id: number, category: Partial<LocalProductCategory>): Promise<LocalProductCategory | undefined>;
  
  // Local Product Subcategories operations  
  getLocalProductSubcategories(): Promise<LocalProductSubCategory[]>;
  createLocalProductSubcategory(subcategory: InsertLocalProductSubCategory): Promise<LocalProductSubCategory>;
  getLocalProductSubcategory(id: number): Promise<LocalProductSubCategory | undefined>;
  updateLocalProductSubcategory(id: number, subcategory: Partial<LocalProductSubCategory>): Promise<LocalProductSubCategory | undefined>;
  
  // Local Product Cart operations
  addToLocalProductCart(userId: number, productId: number, quantity: number): Promise<void>;
  getLocalProductCartItems(userId: number): Promise<any[]>;
  getLocalProductCartItem(userId: number, productId: number): Promise<any | undefined>;
  updateLocalProductCartItem(userId: number, productId: number, quantity: number): Promise<void>;
  removeFromLocalProductCart(userId: number, productId: number): Promise<void>;
  clearLocalProductCart(userId: number): Promise<void>;
  
  // Local Product Orders operations
  createLocalProductOrder(order: any): Promise<any>;
  createLocalProductOrderItem(orderItem: any): Promise<any>;
  getLocalProductOrdersByUser(userId: number): Promise<any[]>;

  // Backward compatibility
  createLocalProduct(product: InsertLocalProduct): Promise<LocalProduct>;
  getLocalProducts(filter?: { category?: string, district?: string, availableAreas?: string, deliveryOption?: string }): Promise<LocalProduct[]>;
  getLocalProductById(id: number): Promise<LocalProduct | undefined>;
  updateLocalProduct(id: number, product: Partial<LocalProduct>): Promise<LocalProduct | undefined>;

  // Recycling operations
  createRecyclingRequest(request: InsertRecyclingRequest): Promise<RecyclingRequest>;
  getRecyclingRequestsByUserId(userId: number): Promise<RecyclingRequest[]>;
  getRecyclingRequestsByAgentId(agentId: number): Promise<RecyclingRequest[]>;
  getRecyclingRequestsByTalukManager(userId: number): Promise<RecyclingRequest[]>;
  getRecyclingRequestsByBranchManager(userId: number): Promise<RecyclingRequest[]>;
  getAllRecyclingRequests(): Promise<RecyclingRequest[]>;
  updateRecyclingRequest(id: number, request: Partial<RecyclingRequest>): Promise<RecyclingRequest | undefined>;
  
  // Recycling Material Rate operations
  createRecyclingMaterialRate(rate: InsertRecyclingMaterialRate): Promise<RecyclingMaterialRate>;
  getRecyclingMaterialRates(): Promise<RecyclingMaterialRate[]>;
  getRecyclingMaterialRate(id: number): Promise<RecyclingMaterialRate | undefined>;
  updateRecyclingMaterialRate(id: number, rate: Partial<RecyclingMaterialRate>): Promise<RecyclingMaterialRate | undefined>;

  // Commission Configuration operations
  createCommissionConfig(config: InsertCommissionConfig): Promise<CommissionConfig>;
  getCommissionConfig(id: number): Promise<CommissionConfig | undefined>;
  getCommissionConfigByService(serviceType: string, provider?: string): Promise<CommissionConfig | undefined>;
  updateCommissionConfig(id: number, config: Partial<CommissionConfig>): Promise<CommissionConfig | undefined>;
  listCommissionConfigs(): Promise<CommissionConfig[]>;

  // Commission operations
  createCommission(commission: InsertCommission): Promise<Commission>;
  getCommissionsByUserId(userId: number): Promise<Commission[]>;
  getCommissionsByServiceType(serviceType: string): Promise<Commission[]>;
  updateCommission(id: number, commission: Partial<Commission>): Promise<Commission | undefined>;
  
  // Commission Transaction operations
  createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction>;
  getCommissionTransactionsByUserId(userId: number): Promise<CommissionTransaction[]>;
  getCommissionTransactionByServiceType(serviceType: string): Promise<CommissionTransaction[]>;
  updateCommissionTransaction(id: number, transaction: Partial<CommissionTransaction>): Promise<CommissionTransaction | undefined>;
  updateCommissionTransactionStatus(id: number, status: string): Promise<CommissionTransaction | undefined>;
  getPendingCommissionTransactions(): Promise<CommissionTransaction[]>;
  
  // Commission calculation and distribution
  calculateCommissions(serviceType: string, serviceId: number, amount: number, provider?: string): Promise<void>;
  distributeCommission(
    serviceAgentId: number, 
    parentChain: number[], 
    transactionId: number, 
    serviceType: string, 
    serviceId: number, 
    originalAmount: number, 
    config: CommissionConfig
  ): Promise<void>;
  distributeRegisteredUserCommission(
    registeredUserId: number,
    transactionId: number,
    serviceType: string,
    serviceId: number,
    originalAmount: number,
    commissionPercentage: number
  ): Promise<void>;
  getParentChain(userId: number): Promise<number[]>;
  
  // User hierarchy operations
  getUserByPincodeAndType(pincode: string, userType: string): Promise<User | undefined>;
  getUserByTalukAndType(district: string, taluk: string, userType: string): Promise<User | undefined>;
  getUserByDistrictAndType(district: string, userType: string): Promise<User | undefined>;
  getUserByType(userType: string): Promise<User | undefined>;
  
  // Service Provider operations
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByUserId(userId: number): Promise<ServiceProvider | undefined>;
  updateServiceProvider(id: number, provider: Partial<ServiceProvider>): Promise<ServiceProvider | undefined>;
  listServiceProviders(filter?: { providerType?: string, status?: string, district?: string }): Promise<ServiceProvider[]>;
  
  // Farmer Detail operations
  createFarmerDetail(detail: InsertFarmerDetail): Promise<FarmerDetail>;
  getFarmerDetail(id: number): Promise<FarmerDetail | undefined>;
  getFarmerDetailByProviderId(providerId: number): Promise<FarmerDetail | undefined>;
  updateFarmerDetail(id: number, detail: Partial<FarmerDetail>): Promise<FarmerDetail | undefined>;
  
  // Manufacturer Detail operations
  createManufacturerDetail(detail: InsertManufacturerDetail): Promise<ManufacturerDetail>;
  getManufacturerDetail(id: number): Promise<ManufacturerDetail | undefined>;
  getManufacturerDetailByProviderId(providerId: number): Promise<ManufacturerDetail | undefined>;
  updateManufacturerDetail(id: number, detail: Partial<ManufacturerDetail>): Promise<ManufacturerDetail | undefined>;
  
  // Booking Agent Detail operations
  createBookingAgentDetail(detail: InsertBookingAgentDetail): Promise<BookingAgentDetail>;
  getBookingAgentDetail(id: number): Promise<BookingAgentDetail | undefined>;
  getBookingAgentDetailByProviderId(providerId: number): Promise<BookingAgentDetail | undefined>;
  updateBookingAgentDetail(id: number, detail: Partial<BookingAgentDetail>): Promise<BookingAgentDetail | undefined>;
  
  // Taxi Provider operations
  createTaxiProviderDetail(detail: InsertTaxiProviderDetail): Promise<TaxiProviderDetail>;
  getTaxiProviderDetail(id: number): Promise<TaxiProviderDetail | undefined>;
  getTaxiProviderDetailByProviderId(providerId: number): Promise<TaxiProviderDetail | undefined>;
  updateTaxiProviderDetail(id: number, detail: Partial<TaxiProviderDetail>): Promise<TaxiProviderDetail | undefined>;

  // Taxi Service operations
  createTaxiVehicle(vehicle: any): Promise<any>;
  getTaxiVehicle(id: number): Promise<any>;
  getTaxiVehiclesByProvider(providerId: number): Promise<any[]>;
  updateTaxiVehicle(id: number, vehicle: any): Promise<any>;
  getAvailableTaxiVehicles(filters: any): Promise<any[]>;
  getAllTaxiVehicles(): Promise<any[]>;
  getApprovedTaxiVehicles(): Promise<any[]>;
  getTaxiVehiclesForApproval(): Promise<any[]>;
  approveTaxiVehicle(id: number, approved: boolean): Promise<any>;
  updateTaxiVehicleStatus(id: number, isActive: boolean): Promise<any>;
  getTaxiVehiclesWithProviders(): Promise<any[]>;
  getTaxiCategories(): Promise<any[]>;
  getTaluksByDistrict(district: string): Promise<string[]>;
  getPincodesByDistrictAndTaluk(district: string, taluk: string): Promise<string[]>;

  createTaxiBooking(booking: any): Promise<any>;
  getTaxiBooking(id: number): Promise<any>;
  getTaxiBookingsByCustomer(customerId: number): Promise<any[]>;
  getTaxiBookingsByProvider(providerId: number): Promise<any[]>;
  updateTaxiBookingStatus(id: number, status: string, providerId: number): Promise<any>;
  getAllTaxiBookings(): Promise<any[]>;
  
  // Transportation Agent operations
  createTransportationAgentDetail(detail: InsertTransportationAgentDetail): Promise<TransportationAgentDetail>;
  getTransportationAgentDetail(id: number): Promise<TransportationAgentDetail | undefined>;
  getTransportationAgentDetailByProviderId(providerId: number): Promise<TransportationAgentDetail | undefined>;
  updateTransportationAgentDetail(id: number, detail: Partial<TransportationAgentDetail>): Promise<TransportationAgentDetail | undefined>;
  
  // Rental Provider operations
  createRentalProviderDetail(detail: InsertRentalProviderDetail): Promise<RentalProviderDetail>;
  getRentalProviderDetail(id: number): Promise<RentalProviderDetail | undefined>;
  getRentalProviderDetailByProviderId(providerId: number): Promise<RentalProviderDetail | undefined>;
  updateRentalProviderDetail(id: number, detail: Partial<RentalProviderDetail>): Promise<RentalProviderDetail | undefined>;
  
  // Recycling Agent operations
  createRecyclingAgentDetail(detail: InsertRecyclingAgentDetail): Promise<RecyclingAgentDetail>;
  getRecyclingAgentDetail(id: number): Promise<RecyclingAgentDetail | undefined>;
  getRecyclingAgentDetailByProviderId(providerId: number): Promise<RecyclingAgentDetail | undefined>;
  updateRecyclingAgentDetail(id: number, detail: Partial<RecyclingAgentDetail>): Promise<RecyclingAgentDetail | undefined>;
  
  // Manager Application operations
  createManagerApplication(application: InsertManagerApplication): Promise<ManagerApplication>;
  getManagerApplication(id: number): Promise<ManagerApplication | undefined>;
  getManagerApplications(filter?: { status?: string, managerType?: string }): Promise<ManagerApplication[]>;
  updateManagerApplication(id: number, application: Partial<ManagerApplication>): Promise<ManagerApplication | undefined>;
  
  // Farmer Product Listing operations
  createFarmerProductListing(listing: InsertFarmerProductListing): Promise<FarmerProductListing>;
  getFarmerProductListings(filter?: { farmerId?: number, groceryProductId?: number, status?: string }): Promise<FarmerProductListing[]>;
  getFarmerProductListing(id: number): Promise<FarmerProductListing | undefined>;
  updateFarmerProductListing(id: number, listing: Partial<FarmerProductListing>): Promise<FarmerProductListing | undefined>;
  deleteFarmerProductListing(id: number): Promise<void>;
  
  // Delivery Area operations
  createDeliveryArea(area: InsertDeliveryArea): Promise<DeliveryArea>;
  getDeliveryAreas(listingId: number): Promise<DeliveryArea[]>;
  getDeliveryArea(id: number): Promise<DeliveryArea | undefined>;
  deleteDeliveryArea(id: number): Promise<void>;
  
  // Product Request operations
  createProductRequest(request: InsertProductRequest): Promise<ProductRequest>;
  getProductRequests(filter?: { farmerId?: number, status?: string }): Promise<ProductRequest[]>;
  getProductRequest(id: number): Promise<ProductRequest | undefined>;
  updateProductRequest(id: number, request: Partial<ProductRequest>): Promise<ProductRequest | undefined>;
  
  // Grocery Order operations
  createGroceryOrder(order: InsertGroceryOrder): Promise<GroceryOrder>;
  getGroceryOrders(filter?: { customerId?: number, status?: string, district?: string, taluk?: string, pincode?: string }): Promise<GroceryOrder[]>;
  getGroceryOrder(id: number): Promise<GroceryOrder | undefined>;
  updateGroceryOrder(id: number, order: Partial<GroceryOrder>): Promise<GroceryOrder | undefined>;
  
  // Grocery Order Item operations
  createGroceryOrderItem(item: InsertGroceryOrderItem): Promise<GroceryOrderItem>;
  getGroceryOrderItems(orderId: number): Promise<GroceryOrderItem[]>;
  getFarmerOrderItems(farmerId: number, status?: string): Promise<GroceryOrderItem[]>;
  updateGroceryOrderItem(id: number, item: Partial<GroceryOrderItem>): Promise<GroceryOrderItem | undefined>;

  // Delivery management operations
  // Admin operations
  createDeliveryCategory(category: InsertDeliveryCategory): Promise<DeliveryCategory>;
  getDeliveryCategories(): Promise<DeliveryCategory[]>;
  getDeliveryCategory(id: number): Promise<DeliveryCategory | undefined>;
  updateDeliveryCategory(id: number, category: Partial<DeliveryCategory>): Promise<DeliveryCategory | undefined>;
  deleteDeliveryCategory(id: number): Promise<void>;

  // Service provider operations
  registerDeliveryAgent(agent: InsertDeliveryAgent): Promise<DeliveryAgent>;
  getDeliveryAgentByUserId(userId: number): Promise<DeliveryAgent | undefined>;
  getDeliveryAgentsForApproval(): Promise<DeliveryAgent[]>;
  getAllDeliveryAgents(): Promise<DeliveryAgent[]>;
  getApprovedDeliveryAgents(): Promise<DeliveryAgent[]>;
  approveDeliveryAgent(id: number, approved: boolean): Promise<DeliveryAgent | undefined>;
  updateDeliveryAgent(id: number, agent: Partial<DeliveryAgent>): Promise<DeliveryAgent | undefined>;
  getDeliveryAgentsByLocation(district: string, taluk?: string, pincode?: string): Promise<DeliveryAgent[]>;
  updateDeliveryAgentStatus(id: number, isOnline: boolean, isAvailable: boolean): Promise<DeliveryAgent | undefined>;

  // Customer operations
  createDeliveryOrder(order: InsertDeliveryOrder): Promise<DeliveryOrder>;
  getDeliveryOrdersByCustomerId(customerId: number): Promise<DeliveryOrder[]>;
  getDeliveryOrdersByAgentId(agentId: number): Promise<DeliveryOrder[]>;
  getDeliveryOrder(id: number): Promise<DeliveryOrder | undefined>;
  updateDeliveryOrder(id: number, order: Partial<DeliveryOrder>): Promise<DeliveryOrder | undefined>;
  assignDeliveryOrder(orderId: number, agentId: number): Promise<DeliveryOrder | undefined>;

  // Taxi category operations
  createTaxiCategory(category: InsertTaxiCategory): Promise<TaxiCategory>;
  getTaxiCategories(): Promise<TaxiCategory[]>;
  getTaxiCategory(id: number): Promise<TaxiCategory | undefined>;
  updateTaxiCategory(id: number, category: Partial<TaxiCategory>): Promise<TaxiCategory | undefined>;
  deleteTaxiCategory(id: number): Promise<void>;

  // Taxi service provider operations
  getTaxiProviders(): Promise<ServiceProvider[]>;
  updateServiceProviderStatus(id: number, status: string): Promise<ServiceProvider | undefined>;

  // Taxi vehicle operations
  getTaxiVehicles(): Promise<TaxiVehicle[]>;
  createTaxiVehicle(vehicle: InsertTaxiVehicle): Promise<TaxiVehicle>;
  approveTaxiVehicle(id: number): Promise<TaxiVehicle | undefined>;

  // Taxi booking operations
  createTaxiBooking(booking: InsertTaxiBooking): Promise<TaxiBooking>;

  // Service Request Management System
  createServiceRequest(serviceRequest: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  getServiceRequestByNumber(srNumber: string): Promise<ServiceRequest | undefined>;
  getServiceRequestsByCustomer(customerId: number): Promise<ServiceRequest[]>;
  getServiceRequestsByAgent(agentId: number): Promise<ServiceRequest[]>;
  getServiceRequestsByManager(managerId: number, managerType: 'taluk' | 'branch'): Promise<ServiceRequest[]>;
  getServiceRequestsByDistrict(district: string): Promise<ServiceRequest[]>;
  getServiceRequestsByStatus(status: string): Promise<ServiceRequest[]>;
  updateServiceRequestStatus(id: number, newStatus: string, updatedBy: number, reason?: string, notes?: string): Promise<ServiceRequest | undefined>;
  updateServiceRequestPayment(id: number, paymentId: string, paymentStatus: string): Promise<ServiceRequest | undefined>;
  assignServiceRequestToAgent(id: number, agentId: number): Promise<ServiceRequest | undefined>;
  
  // Service Request Status Updates
  createServiceRequestStatusUpdate(update: InsertServiceRequestStatusUpdate): Promise<ServiceRequestStatusUpdate>;
  getServiceRequestStatusHistory(serviceRequestId: number): Promise<ServiceRequestStatusUpdate[]>;
  
  // Service Request Commission Management
  createServiceRequestCommissionTransaction(commission: InsertServiceRequestCommissionTransaction): Promise<ServiceRequestCommissionTransaction>;
  getServiceRequestCommissions(serviceRequestId: number): Promise<ServiceRequestCommissionTransaction[]>;
  distributeServiceRequestCommissions(serviceRequestId: number): Promise<ServiceRequestCommissionTransaction[]>;
  
  // Service Request Notifications
  createServiceRequestNotification(notification: InsertServiceRequestNotification): Promise<ServiceRequestNotification>;
  getServiceRequestNotificationsByUser(userId: number): Promise<ServiceRequestNotification[]>;
  markServiceRequestNotificationAsRead(id: number): Promise<void>;
  
  // Auto-generate SR Number
  generateServiceRequestNumber(): Promise<string>;
  
  // Video Management Operations
  createVideoUpload(upload: InsertVideoUpload): Promise<VideoUpload>;
  getVideoUpload(id: number): Promise<VideoUpload | undefined>;
  getVideoUploadsByUploader(uploaderId: number): Promise<VideoUpload[]>;
  getVideoUploadsByStatus(status: string): Promise<VideoUpload[]>;
  updateVideoUploadStatus(id: number, status: string, adminId?: number, notes?: string): Promise<VideoUpload | undefined>;
  updateVideoUploadYouTubeData(id: number, youtubeVideoId: string, youtubeUrl: string): Promise<VideoUpload | undefined>;
  
  // Video Analytics Operations
  recordVideoView(analytics: InsertVideoViewAnalytics): Promise<VideoViewAnalytics>;
  updateVideoViewSession(sessionId: string, watchTime: number, percentage: number, isCompleted: boolean): Promise<void>;
  getVideoAnalytics(videoId: string, startDate?: Date, endDate?: Date): Promise<VideoViewAnalytics[]>;
  getDailyVideoStats(videoId: string, date: Date): Promise<DailyVideoStats | undefined>;
  getUserViewingHistory(userId: number): Promise<VideoViewAnalytics[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUploader(uploaderId: number): Promise<Video[]>;
  getVideosByCategory(category: string): Promise<Video[]>;
  getAllVideos(limit?: number, offset?: number): Promise<Video[]>;
  getPublicVideos(limit?: number, offset?: number): Promise<Video[]>;
  updateVideo(id: number, updates: Partial<Video>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<void>;
  incrementVideoViews(id: number): Promise<void>;
  
  // Video View Operations
  createVideoView(view: InsertVideoView): Promise<VideoView>;
  getVideoViews(videoId: number): Promise<VideoView[]>;
  getUserVideoViews(userId: number): Promise<VideoView[]>;
  
  // Application Operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByStatus(status: string): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
  updateApplication(id: number, updates: Partial<Application>): Promise<Application | undefined>;
  getApplicationsByRole(roleType: string): Promise<Application[]>;
  getApplicationsByLocation(district: string, taluk?: string, pincode?: string): Promise<Application[]>;

  // Opportunities Forum Operations
  getDistricts(): Promise<string[]>;
  getTaluksByDistrict(district: string): Promise<{name: string}[]>;
  getPincodesByTaluk(taluk: string, district: string): Promise<string[]>;
  
  // Nomination System Operations
  createNomination(nomination: InsertNomination): Promise<Nomination>;
  getAllNominations(): Promise<Nomination[]>;
  getApprovedNominations(): Promise<Nomination[]>;
  updateNominationStatus(id: number, status: string, adminResponse: string, reviewedBy: number): Promise<Nomination | undefined>;
  updateNominationOtpVerified(phoneNumber: string): Promise<void>;
  linkNominationToUser(id: number, userId: number, profilePhoto: string): Promise<Nomination | undefined>;
  
  // OTP System Operations
  createOtpVerification(otp: any): Promise<any>;
  verifyOtp(phoneNumber: string, otp: string, purpose: string): Promise<boolean>;
  
  // Public Messaging Operations
  createPublicMessage(message: any): Promise<any>;
  getPublicMessages(nominationId: number): Promise<any[]>;
  
  // Bus Booking Operations
  createBusBooking(booking: any): Promise<any>;
  getBusBooking(id: number): Promise<any>;
  getBusBookingsByUserId(userId: number): Promise<any[]>;
  getAllBusBookings(): Promise<any[]>;
  updateBusBooking(id: number, updates: any): Promise<any>;
  distributeBusCommissions(bookingId: number, userId: number, commissionStructure: any): Promise<void>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;

  // In-memory storage
  private users: User[] = [];
  private userIdCounter: number = 1;
  
  private transactions: Transaction[] = [];
  private transactionIdCounter: number = 1;
  
  private feedback: Feedback[] = [];
  private feedbackIdCounter: number = 1;
  
  private recharges: Recharge[] = [];
  private rechargeIdCounter: number = 1;
  
  private bookings: Booking[] = [];
  private bookingIdCounter: number = 1;
  
  private rentals: Rental[] = [];
  private rentalIdCounter: number = 1;
  
  private taxiRides: TaxiRide[] = [];
  private taxiRideIdCounter: number = 1;
  
  private deliveries: Delivery[] = [];
  private deliveryIdCounter: number = 1;
  
  private groceryCategories: GroceryCategory[] = [];
  private groceryCategoryIdCounter: number = 1;
  
  private grocerySubCategories: GrocerySubCategory[] = [];
  private grocerySubCategoryIdCounter: number = 1;
  
  private groceryProducts: GroceryProduct[] = [];
  private groceryProductIdCounter: number = 1;
  
  private localProducts: LocalProduct[] = [];
  private localProductIdCounter: number = 1;
  
  private recyclingRequests: RecyclingRequest[] = [];
  private recyclingRequestIdCounter: number = 1;
  
  private recyclingMaterialRates: RecyclingMaterialRate[] = [];
  private recyclingMaterialRateIdCounter: number = 1;
  
  private commissionConfigs: CommissionConfig[] = [];
  private commissionConfigIdCounter: number = 1;
  
  private commissions: Commission[] = [];
  private commissionIdCounter: number = 1;
  
  private commissionTransactions: CommissionTransaction[] = [];
  private commissionTransactionIdCounter: number = 1;
  
  private serviceProviders: ServiceProvider[] = [];
  private serviceProviderIdCounter: number = 1;
  
  private farmerDetails: FarmerDetail[] = [];
  private farmerDetailIdCounter: number = 1;
  
  private manufacturerDetails: ManufacturerDetail[] = [];
  private manufacturerDetailIdCounter: number = 1;
  
  private bookingAgentDetails: BookingAgentDetail[] = [];
  private bookingAgentDetailIdCounter: number = 1;
  
  private taxiProviderDetails: TaxiProviderDetail[] = [];
  private taxiProviderDetailIdCounter: number = 1;
  
  private transportationAgentDetails: TransportationAgentDetail[] = [];
  private transportationAgentDetailIdCounter: number = 1;
  
  private rentalProviderDetails: RentalProviderDetail[] = [];
  private rentalProviderDetailIdCounter: number = 1;
  
  private recyclingAgentDetails: RecyclingAgentDetail[] = [];
  private recyclingAgentDetailIdCounter: number = 1;
  
  private managerApplications: ManagerApplication[] = [];
  private managerApplicationIdCounter: number = 1;
  
  // Farmer product listings
  private farmerProductListings: FarmerProductListing[] = [];
  private farmerProductListingIdCounter: number = 1;
  
  // Delivery areas
  private deliveryAreas: DeliveryArea[] = [];
  private deliveryAreaIdCounter: number = 1;
  
  // Product requests
  private productRequests: ProductRequest[] = [];
  private productRequestIdCounter: number = 1;
  
  // Grocery orders
  private groceryOrders: GroceryOrder[] = [];
  private groceryOrderIdCounter: number = 1;
  
  // Grocery order items
  private groceryOrderItems: GroceryOrderItem[] = [];
  private groceryOrderItemIdCounter: number = 1;
  
  private busBookings: any[] = [];
  private busBookingIdCounter: number = 1;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async deductUserWalletBalance(userId: number, amount: number): Promise<number> {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Initialize wallet balance if it doesn't exist
    const currentBalance = user.walletBalance || 0;
    
    // Check if user has sufficient balance
    if (currentBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }
    
    // Update user's wallet balance
    const newBalance = currentBalance - amount;
    user.walletBalance = newBalance;
    
    return newBalance;
  }
  
  async updateWalletBalance(userId: number, newBalance: number): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user's wallet balance directly to the new value
    user.walletBalance = newBalance;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  
  async getUserByUsernameStartingWith(prefix: string): Promise<User | undefined> {
    return this.users.find(user => user.username.startsWith(prefix));
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.userIdCounter++,
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || null,
      userType: user.userType,
      parentId: user.parentId || null,
      district: user.district || null,
      taluk: user.taluk || null,
      pincode: user.pincode || null,
      walletBalance: user.walletBalance || null,
      createdAt: new Date(),
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;
    
    const updatedUser = {
      ...this.users[index],
      ...userData,
    };
    
    this.users[index] = updatedUser;
    return updatedUser;
  }
  
  async getUsersByPincode(pincode: string, userType?: string): Promise<User[]> {
    return this.users.filter(user => 
      user.pincode === pincode && 
      (userType ? user.userType === userType : true)
    );
  }

  async listUsers(filter?: { userType?: string, parentId?: number }): Promise<User[]> {
    let filteredUsers = [...this.users];
    
    if (filter?.userType) {
      filteredUsers = filteredUsers.filter(user => user.userType === filter.userType);
    }
    
    if (filter?.parentId !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.parentId === filter.parentId);
    }
    
    return filteredUsers;
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: this.transactionIdCounter++,
      createdAt: new Date(),
      type: transaction.type,
      userId: transaction.userId,
      amount: transaction.amount,
      description: transaction.description,
      serviceType: transaction.serviceType || null,
    };
    
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return this.transactions
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const newFeedback: Feedback = {
      id: this.feedbackIdCounter++,
      createdAt: new Date(),
      userId: feedbackData.userId,
      serviceType: feedbackData.serviceType,
      rating: feedbackData.rating,
      comment: feedbackData.comment || null,
    };
    
    this.feedback.push(newFeedback);
    return newFeedback;
  }

  async listFeedback(filter?: { userId?: number, serviceType?: string }): Promise<Feedback[]> {
    let filteredFeedback = [...this.feedback];
    
    if (filter?.userId !== undefined) {
      filteredFeedback = filteredFeedback.filter(f => f.userId === filter.userId);
    }
    
    if (filter?.serviceType) {
      filteredFeedback = filteredFeedback.filter(f => f.serviceType === filter.serviceType);
    }
    
    return filteredFeedback.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Recharge operations
  async createRecharge(recharge: InsertRecharge): Promise<Recharge> {
    const newRecharge: Recharge = {
      id: this.rechargeIdCounter++,
      createdAt: new Date(),
      status: recharge.status,
      userId: recharge.userId,
      amount: recharge.amount,
      mobileNumber: recharge.mobileNumber,
      provider: recharge.provider,
      processedBy: recharge.processedBy || null,
      totalCommissionPercent: recharge.totalCommissionPercent || null,
      totalCommissionAmount: recharge.totalCommissionAmount || null,
      commissionConfigId: recharge.commissionConfigId || null,
      completedAt: recharge.completedAt || null,
    };
    
    this.recharges.push(newRecharge);
    return newRecharge;
  }

  async getRecharge(id: number): Promise<Recharge | undefined> {
    return this.recharges.find(recharge => recharge.id === id);
  }

  async getRechargesByUserId(userId: number): Promise<Recharge[]> {
    return this.recharges
      .filter(recharge => recharge.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async listRecharges(): Promise<Recharge[]> {
    return this.recharges
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async updateRecharge(id: number, rechargeData: Partial<Recharge>): Promise<Recharge | undefined> {
    const index = this.recharges.findIndex(recharge => recharge.id === id);
    if (index === -1) return undefined;
    
    const updatedRecharge = {
      ...this.recharges[index],
      ...rechargeData,
    };
    
    this.recharges[index] = updatedRecharge;
    return updatedRecharge;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const newBooking: Booking = {
      id: this.bookingIdCounter++,
      createdAt: new Date(),
      status: booking.status,
      userId: booking.userId,
      amount: booking.amount,
      bookingType: booking.bookingType,
      provider: booking.provider || null,
      processedBy: booking.processedBy || null,
      totalCommissionPercent: booking.totalCommissionPercent || null,
      totalCommissionAmount: booking.totalCommissionAmount || null,
      commissionConfigId: booking.commissionConfigId || null,
      sourceLocation: booking.sourceLocation || null,
      destinationLocation: booking.destinationLocation || null,
      travelDate: booking.travelDate || null,
      returnDate: booking.returnDate || null,
      passengers: booking.passengers || null,
    };
    
    this.bookings.push(newBooking);
    return newBooking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return this.bookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.find(booking => booking.id === id);
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) return undefined;
    
    const updatedBooking = {
      ...this.bookings[index],
      ...bookingData,
    };
    
    this.bookings[index] = updatedBooking;
    return updatedBooking;
  }

  // Rental operations
  async createRental(rental: InsertRental): Promise<Rental> {
    const newRental: Rental = {
      id: this.rentalIdCounter++,
      createdAt: new Date(),
      status: rental.status,
      userId: rental.userId,
      amount: rental.amount,
      itemName: rental.itemName,
      quantity: rental.quantity,
      startDate: rental.startDate,
      endDate: rental.endDate,
      provider: rental.provider || null,
      processedBy: rental.processedBy || null,
      totalCommissionPercent: rental.totalCommissionPercent || null,
      totalCommissionAmount: rental.totalCommissionAmount || null,
      commissionConfigId: rental.commissionConfigId || null,
    };
    
    this.rentals.push(newRental);
    return newRental;
  }

  async getRentalsByUserId(userId: number): Promise<Rental[]> {
    return this.rentals
      .filter(rental => rental.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async updateRental(id: number, rentalData: Partial<Rental>): Promise<Rental | undefined> {
    const index = this.rentals.findIndex(rental => rental.id === id);
    if (index === -1) return undefined;
    
    const updatedRental = {
      ...this.rentals[index],
      ...rentalData,
    };
    
    this.rentals[index] = updatedRental;
    return updatedRental;
  }

  // Taxi operations
  async createTaxiRide(taxiRide: InsertTaxiRide): Promise<TaxiRide> {
    const newTaxiRide: TaxiRide = {
      id: this.taxiRideIdCounter++,
      createdAt: new Date(),
      status: taxiRide.status,
      userId: taxiRide.userId,
      amount: taxiRide.amount,
      sourceLocation: taxiRide.sourceLocation,
      destinationLocation: taxiRide.destinationLocation,
      rideDate: taxiRide.rideDate,
      provider: taxiRide.provider || null,
      vehicleType: taxiRide.vehicleType || null,
      processedBy: taxiRide.processedBy || null,
      totalCommissionPercent: taxiRide.totalCommissionPercent || null,
      totalCommissionAmount: taxiRide.totalCommissionAmount || null,
      commissionConfigId: taxiRide.commissionConfigId || null,
    };
    
    this.taxiRides.push(newTaxiRide);
    return newTaxiRide;
  }

  async getTaxiRidesByUserId(userId: number): Promise<TaxiRide[]> {
    return this.taxiRides
      .filter(taxiRide => taxiRide.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async updateTaxiRide(id: number, taxiRideData: Partial<TaxiRide>): Promise<TaxiRide | undefined> {
    const index = this.taxiRides.findIndex(taxiRide => taxiRide.id === id);
    if (index === -1) return undefined;
    
    const updatedTaxiRide = {
      ...this.taxiRides[index],
      ...taxiRideData,
    };
    
    this.taxiRides[index] = updatedTaxiRide;
    return updatedTaxiRide;
  }

  // Delivery operations
  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    const newDelivery: Delivery = {
      id: this.deliveryIdCounter++,
      createdAt: new Date(),
      status: delivery.status,
      userId: delivery.userId,
      amount: delivery.amount,
      sourceLocation: delivery.sourceLocation,
      destinationLocation: delivery.destinationLocation,
      itemDescription: delivery.itemDescription,
      weight: delivery.weight,
      deliveryDate: delivery.deliveryDate,
      provider: delivery.provider || null,
      processedBy: delivery.processedBy || null,
      totalCommissionPercent: delivery.totalCommissionPercent || null,
      totalCommissionAmount: delivery.totalCommissionAmount || null,
      commissionConfigId: delivery.commissionConfigId || null,
    };
    
    this.deliveries.push(newDelivery);
    return newDelivery;
  }

  async getDeliveriesByUserId(userId: number): Promise<Delivery[]> {
    return this.deliveries
      .filter(delivery => delivery.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async updateDelivery(id: number, deliveryData: Partial<Delivery>): Promise<Delivery | undefined> {
    const index = this.deliveries.findIndex(delivery => delivery.id === id);
    if (index === -1) return undefined;
    
    const updatedDelivery = {
      ...this.deliveries[index],
      ...deliveryData,
    };
    
    this.deliveries[index] = updatedDelivery;
    return updatedDelivery;
  }

  // Grocery Category operations
  async getGroceryCategories(): Promise<GroceryCategory[]> {
    return [...this.groceryCategories]
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  
  async getGroceryCategory(id: number): Promise<GroceryCategory | undefined> {
    return this.groceryCategories.find(category => category.id === id);
  }
  
  async createGroceryCategory(category: InsertGroceryCategory): Promise<GroceryCategory> {
    const newCategory: GroceryCategory = {
      id: this.groceryCategoryIdCounter++,
      name: category.name,
      description: category.description || null,
      icon: category.icon || null,
      color: category.color || null,
      isActive: category.isActive === undefined ? true : category.isActive,
      displayOrder: category.displayOrder || null,
      createdAt: new Date()
    };
    
    this.groceryCategories.push(newCategory);
    return newCategory;
  }
  
  async updateGroceryCategory(id: number, categoryData: Partial<GroceryCategory>): Promise<GroceryCategory | undefined> {
    const index = this.groceryCategories.findIndex(category => category.id === id);
    if (index === -1) return undefined;
    
    const updatedCategory = {
      ...this.groceryCategories[index],
      ...categoryData
    };
    
    this.groceryCategories[index] = updatedCategory;
    return updatedCategory;
  }
  
  async deleteGroceryCategory(id: number): Promise<void> {
    const index = this.groceryCategories.findIndex(category => category.id === id);
    if (index !== -1) {
      this.groceryCategories.splice(index, 1);
      // Also delete all subcategories for this category
      this.grocerySubCategories = this.grocerySubCategories.filter(
        subCategory => subCategory.parentCategoryId !== id
      );
    }
  }
  
  // Grocery SubCategory operations
  async getGrocerySubCategories(filter?: { parentCategoryId?: number, isActive?: boolean }): Promise<GrocerySubCategory[]> {
    let filteredSubCategories = [...this.grocerySubCategories];
    
    if (filter?.parentCategoryId !== undefined) {
      filteredSubCategories = filteredSubCategories.filter(
        subCategory => subCategory.parentCategoryId === filter.parentCategoryId
      );
    }
    
    if (filter?.isActive !== undefined) {
      filteredSubCategories = filteredSubCategories.filter(
        subCategory => subCategory.isActive === filter.isActive
      );
    }
    
    return filteredSubCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  
  async getGrocerySubCategory(id: number): Promise<GrocerySubCategory | undefined> {
    return this.grocerySubCategories.find(subCategory => subCategory.id === id);
  }
  
  async createGrocerySubCategory(subCategory: InsertGrocerySubCategory): Promise<GrocerySubCategory> {
    const newSubCategory: GrocerySubCategory = {
      id: this.grocerySubCategoryIdCounter++,
      name: subCategory.name,
      description: subCategory.description || null,
      parentCategoryId: subCategory.parentCategoryId,
      isActive: subCategory.isActive === undefined ? true : subCategory.isActive,
      displayOrder: subCategory.displayOrder || null,
      createdAt: new Date()
    };
    
    this.grocerySubCategories.push(newSubCategory);
    return newSubCategory;
  }
  
  async updateGrocerySubCategory(id: number, subCategoryData: Partial<GrocerySubCategory>): Promise<GrocerySubCategory | undefined> {
    const index = this.grocerySubCategories.findIndex(subCategory => subCategory.id === id);
    if (index === -1) return undefined;
    
    const updatedSubCategory = {
      ...this.grocerySubCategories[index],
      ...subCategoryData
    };
    
    this.grocerySubCategories[index] = updatedSubCategory;
    return updatedSubCategory;
  }
  
  async deleteGrocerySubCategory(id: number): Promise<void> {
    const index = this.grocerySubCategories.findIndex(subCategory => subCategory.id === id);
    if (index !== -1) {
      this.grocerySubCategories.splice(index, 1);
    }
  }
  
  // Grocery operations
  async createGroceryProduct(product: InsertGroceryProduct): Promise<GroceryProduct> {
    // Only include fields that exist in the actual database table
    const newProduct: GroceryProduct = {
      id: this.groceryProductIdCounter++,
      name: product.name,
      district: product.district,
      createdAt: new Date(),
      description: product.description,
      category: product.category,
      price: product.price,
      discountedPrice: product.discountedPrice || null,
      farmerId: product.farmerId || null,
      stock: product.stock,
      unit: product.unit,
      isOrganic: product.isOrganic || false,
      status: product.status || 'active',
      imageUrl: product.imageUrl || null,
      deliveryOption: product.deliveryOption || 'both',
      availableAreas: product.availableAreas || null
    };
    
    this.groceryProducts.push(newProduct);
    return newProduct;
  }

  async getGroceryProducts(filter?: { 
    category?: string, 
    district?: string, 
    isOrganic?: boolean, 
    farmerId?: number,
    status?: string,
    availableAreas?: string,
    deliveryOption?: string
  }): Promise<GroceryProduct[]> {
    let filteredProducts = [...this.groceryProducts];
    
    if (filter?.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filter.category);
    }
    
    if (filter?.district) {
      filteredProducts = filteredProducts.filter(product => product.district === filter.district);
    }
    
    if (filter?.isOrganic !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.isOrganic === filter.isOrganic);
    }
    
    if (filter?.farmerId !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.farmerId === filter.farmerId);
    }
    
    if (filter?.status) {
      filteredProducts = filteredProducts.filter(product => product.status === filter.status);
    } else {
      // By default, only return active products unless specifically filtered
      filteredProducts = filteredProducts.filter(product => !product.status || product.status === 'active');
    }
    
    // Filter by available areas if provided
    if (filter?.availableAreas) {
      filteredProducts = filteredProducts.filter(product => 
        product.availableAreas && 
        product.availableAreas.includes(filter.availableAreas)
      );
    }
    
    // Filter by delivery option if provided
    if (filter?.deliveryOption) {
      filteredProducts = filteredProducts.filter(product => 
        product.deliveryOption === filter.deliveryOption
      );
    }
    
    return filteredProducts;
  }

  async getGroceryProductById(id: number): Promise<GroceryProduct | undefined> {
    return this.groceryProducts.find(product => product.id === id);
  }

  async getGroceryProductsByProvider(providerId: number): Promise<GroceryProduct[]> {
    return this.groceryProducts
      .filter(product => product.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateGroceryProduct(id: number, productData: Partial<GroceryProduct>): Promise<GroceryProduct | undefined> {
    const index = this.groceryProducts.findIndex(product => product.id === id);
    if (index === -1) return undefined;
    
    const updatedProduct = {
      ...this.groceryProducts[index],
      ...productData,
    };
    
    this.groceryProducts[index] = updatedProduct;
    return updatedProduct;
  }
  
  async clearGroceryProductsFromMemory(): Promise<void> {
    // Clear all grocery products from memory storage
    this.groceryProducts = [];
    console.log('All grocery products have been removed from memory storage');
  }

  // Local products operations
  async createLocalProduct(product: InsertLocalProduct): Promise<LocalProduct> {
    const newProduct: LocalProduct = {
      id: this.localProductIdCounter++,
      name: product.name,
      district: product.district,
      createdAt: new Date(),
      description: product.description,
      category: product.category,
      price: product.price,
      discountedPrice: product.discountedPrice || null,
      stock: product.stock,
      manufacturerId: product.manufacturerId || null,
    };
    
    this.localProducts.push(newProduct);
    return newProduct;
  }

  async getLocalProducts(filter?: { 
    category?: string, 
    district?: string, 
    availableAreas?: string, 
    deliveryOption?: string,
    status?: string
  }): Promise<LocalProduct[]> {
    let filteredProducts = [...this.localProducts];
    
    if (filter?.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filter.category);
    }
    
    if (filter?.district) {
      filteredProducts = filteredProducts.filter(product => product.district === filter.district);
    }
    
    // Filter by available areas (e.g., pincode, district, city)
    if (filter?.availableAreas) {
      filteredProducts = filteredProducts.filter(product => 
        product.availableAreas && 
        product.availableAreas.includes(filter.availableAreas)
      );
    }
    
    // Filter by delivery option (e.g., pickup, delivery, both)
    if (filter?.deliveryOption) {
      filteredProducts = filteredProducts.filter(product =>
        product.deliveryOption === filter.deliveryOption
      );
    }
    
    // Filter by status or default to active products
    if (filter?.status) {
      filteredProducts = filteredProducts.filter(product => 
        product.status === filter.status
      );
    } else {
      // By default, only return active products unless specifically filtered
      filteredProducts = filteredProducts.filter(product => 
        product.status === 'active'
      );
    }
    
    return filteredProducts;
  }

  async getLocalProductById(id: number): Promise<LocalProduct | undefined> {
    return this.localProducts.find(product => product.id === id);
  }
  
  async clearMemoryGroceryProducts(): Promise<void> {
    // Clear all grocery products from memory storage
    this.groceryProducts = [];
    console.log('All grocery products have been removed from memory storage');
  }

  async updateLocalProduct(id: number, productData: Partial<LocalProduct>): Promise<LocalProduct | undefined> {
    const index = this.localProducts.findIndex(product => product.id === id);
    if (index === -1) return undefined;
    
    const updatedProduct = {
      ...this.localProducts[index],
      ...productData,
    };
    
    this.localProducts[index] = updatedProduct;
    return updatedProduct;
  }

  // Recycling operations
  async createRecyclingRequest(request: InsertRecyclingRequest): Promise<RecyclingRequest> {
    const newRequest: RecyclingRequest = {
      id: this.recyclingRequestIdCounter++,
      date: request.date,
      pincode: request.pincode,
      createdAt: new Date(),
      status: request.status,
      userId: request.userId,
      amount: request.amount || null,
      address: request.address,
      timeSlot: request.timeSlot,
      materials: request.materials,
      additionalNotes: request.additionalNotes || null,
      agentId: request.agentId || null,
      totalWeight: request.totalWeight || null,
    };
    
    this.recyclingRequests.push(newRequest);
    return newRequest;
  }

  async getRecyclingRequestsByUserId(userId: number): Promise<RecyclingRequest[]> {
    return this.recyclingRequests
      .filter(request => request.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getRecyclingRequestsByAgentId(agentId: number): Promise<RecyclingRequest[]> {
    return this.recyclingRequests
      .filter(request => request.agentId === agentId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async updateRecyclingRequest(id: number, requestData: Partial<RecyclingRequest>): Promise<RecyclingRequest | undefined> {
    const index = this.recyclingRequests.findIndex(request => request.id === id);
    if (index === -1) return undefined;
    
    const updatedRequest = {
      ...this.recyclingRequests[index],
      ...requestData,
    };
    
    this.recyclingRequests[index] = updatedRequest;
    return updatedRequest;
  }
  
  // Recycling Material Rate operations
  async createRecyclingMaterialRate(rate: InsertRecyclingMaterialRate): Promise<RecyclingMaterialRate> {
    const newRate: RecyclingMaterialRate = {
      id: this.recyclingMaterialRateIdCounter++,
      materialType: rate.materialType,
      ratePerKg: rate.ratePerKg,
      description: rate.description || null,
      isActive: rate.isActive !== undefined ? rate.isActive : true,
      updatedBy: rate.updatedBy || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.recyclingMaterialRates.push(newRate);
    return newRate;
  }
  
  async getRecyclingMaterialRates(): Promise<RecyclingMaterialRate[]> {
    return this.recyclingMaterialRates;
  }
  
  async getRecyclingMaterialRate(id: number): Promise<RecyclingMaterialRate | undefined> {
    return this.recyclingMaterialRates.find(rate => rate.id === id);
  }
  
  async updateRecyclingMaterialRate(id: number, rateData: Partial<RecyclingMaterialRate>): Promise<RecyclingMaterialRate | undefined> {
    const index = this.recyclingMaterialRates.findIndex(rate => rate.id === id);
    if (index === -1) return undefined;
    
    const updatedRate = {
      ...this.recyclingMaterialRates[index],
      ...rateData,
      updatedAt: new Date()
    };
    
    this.recyclingMaterialRates[index] = updatedRate;
    return updatedRate;
  }

  // Commission Configuration operations
  async createCommissionConfig(config: InsertCommissionConfig): Promise<CommissionConfig> {
    const newConfig: CommissionConfig = {
      id: this.commissionConfigIdCounter++,
      createdAt: new Date(),
      serviceType: config.serviceType,
      provider: config.provider || null,
      startDate: config.startDate || null,
      endDate: config.endDate || null,
      adminCommission: config.adminCommission,
      branchManagerCommission: config.branchManagerCommission,
      talukManagerCommission: config.talukManagerCommission,
      serviceAgentCommission: config.serviceAgentCommission,
      registeredUserCommission: config.registeredUserCommission,
      apiProviderCommission: config.apiProviderCommission,
      isActive: config.isActive,
      updatedAt: new Date(),
    };
    
    this.commissionConfigs.push(newConfig);
    return newConfig;
  }

  async getCommissionConfig(id: number): Promise<CommissionConfig | undefined> {
    return this.commissionConfigs.find(config => config.id === id);
  }

  async getCommissionConfigByService(serviceType: string, provider?: string): Promise<CommissionConfig | undefined> {
    let matchingConfigs = this.commissionConfigs
      .filter(config => config.serviceType === serviceType && config.isActive);
    
    if (provider) {
      matchingConfigs = matchingConfigs.filter(config => config.provider === provider);
    }
    
    if (matchingConfigs.length === 0) return undefined;
    
    return matchingConfigs[0];
  }

  async updateCommissionConfig(id: number, configData: Partial<CommissionConfig>): Promise<CommissionConfig | undefined> {
    const index = this.commissionConfigs.findIndex(config => config.id === id);
    if (index === -1) return undefined;
    
    const updatedConfig = {
      ...this.commissionConfigs[index],
      ...configData,
      updatedAt: new Date(),
    };
    
    this.commissionConfigs[index] = updatedConfig;
    return updatedConfig;
  }

  async listCommissionConfigs(): Promise<CommissionConfig[]> {
    return this.commissionConfigs.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  // Commission operations
  async createCommission(commission: InsertCommission): Promise<Commission> {
    const newCommission: Commission = {
      id: this.commissionIdCounter++,
      userType: commission.userType,
      createdAt: new Date(),
      status: commission.status,
      userId: commission.userId,
      serviceType: commission.serviceType,
      transactionId: commission.transactionId,
      serviceId: commission.serviceId,
      originalAmount: commission.originalAmount,
      commissionPercentage: commission.commissionPercentage,
      commissionAmount: commission.commissionAmount,
    };
    
    this.commissions.push(newCommission);
    return newCommission;
  }

  async getCommissionsByUserId(userId: number): Promise<Commission[]> {
    return this.commissions
      .filter(commission => commission.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getCommissionsByServiceType(serviceType: string): Promise<Commission[]> {
    return this.commissions
      .filter(commission => commission.serviceType === serviceType)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async updateCommission(id: number, commissionData: Partial<Commission>): Promise<Commission | undefined> {
    const index = this.commissions.findIndex(commission => commission.id === id);
    if (index === -1) return undefined;
    
    const updatedCommission = {
      ...this.commissions[index],
      ...commissionData,
    };
    
    this.commissions[index] = updatedCommission;
    return updatedCommission;
  }
  
  // Commission Transaction operations
  async createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction> {
    const newTransaction: CommissionTransaction = {
      id: this.commissionTransactionIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: transaction.userId,
      amount: transaction.amount,
      serviceType: transaction.serviceType,
      transactionId: transaction.transactionId,
      description: transaction.description || null,
      status: transaction.status || "pending"
    };
    
    this.commissionTransactions.push(newTransaction);
    return newTransaction;
  }
  
  async getCommissionTransactionsByUserId(userId: number): Promise<CommissionTransaction[]> {
    return this.commissionTransactions
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getCommissionTransactionByServiceType(serviceType: string): Promise<CommissionTransaction[]> {
    return this.commissionTransactions
      .filter(transaction => transaction.serviceType === serviceType)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async updateCommissionTransaction(id: number, transactionData: Partial<CommissionTransaction>): Promise<CommissionTransaction | undefined> {
    const index = this.commissionTransactions.findIndex(transaction => transaction.id === id);
    if (index === -1) return undefined;
    
    const updatedTransaction = {
      ...this.commissionTransactions[index],
      ...transactionData,
      updatedAt: new Date()
    };
    
    this.commissionTransactions[index] = updatedTransaction;
    return updatedTransaction;
  }
  
  async updateCommissionTransactionStatus(id: number, status: string): Promise<CommissionTransaction | undefined> {
    const index = this.commissionTransactions.findIndex(transaction => transaction.id === id);
    if (index === -1) return undefined;
    
    const updatedTransaction = {
      ...this.commissionTransactions[index],
      status,
      updatedAt: new Date()
    };
    
    this.commissionTransactions[index] = updatedTransaction;
    return updatedTransaction;
  }
  
  async getPendingCommissionTransactions(): Promise<CommissionTransaction[]> {
    return this.commissionTransactions
      .filter(transaction => transaction.status === 'pending')
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  // User hierarchy operations for commission calculation
  async getUserByPincodeAndType(pincode: string, userType: string): Promise<User | undefined> {
    return this.users.find(user => 
      user.pincode === pincode && 
      user.userType === userType
    );
  }
  
  async getUserByTalukAndType(district: string, taluk: string, userType: string): Promise<User | undefined> {
    return this.users.find(user => 
      user.district === district && 
      user.taluk === taluk && 
      user.userType === userType
    );
  }
  
  async getUserByDistrictAndType(district: string, userType: string): Promise<User | undefined> {
    return this.users.find(user => 
      user.district === district && 
      user.userType === userType
    );
  }
  
  async getUserByType(userType: string): Promise<User | undefined> {
    return this.users.find(user => 
      user.userType === userType
    );
  }

  // Commission calculation and distribution
  async calculateCommissions(serviceType: string, serviceId: number, amount: number, provider?: string): Promise<void> {
    // Get the commission config for this service type and provider
    const config = await this.getCommissionConfigByService(serviceType, provider);
    if (!config) {
      throw new Error(`No commission configuration found for ${serviceType} ${provider || ''}`);
    }

    // Get the registered user who initiated the transaction
    let registeredUserId: number | null = null;
    let serviceAgentId: number | null = null;

    // For recharge, get the recharge record to find the service agent who processed it and the user who initiated it
    if (serviceType === 'recharge') {
      const recharge = this.recharges.find(r => r.id === serviceId);
      
      if (recharge) {
        serviceAgentId = recharge.processedBy || null;
        registeredUserId = recharge.userId || null;
      }
    }

    if (!serviceAgentId) {
      throw new Error('No service agent found for this transaction');
    }

    // Get the service agent's hierarchy chain (service agent -> taluk manager -> branch manager -> admin)
    const parentChain = await this.getParentChain(serviceAgentId);
    
    // Create a transaction record
    const transaction = await this.createTransaction({
      userId: serviceAgentId,
      amount,
      type: 'credit',
      description: `${serviceType} transaction`,
      serviceType,
    });

    // Distribute commissions to each person in the hierarchy
    await this.distributeCommission(
      serviceAgentId, 
      parentChain, 
      transaction.id, 
      serviceType, 
      serviceId, 
      amount, 
      config
    );
    
    // Distribute commission to registered user if applicable
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
  async getParentChain(userId: number): Promise<number[]> {
    const chain: number[] = [];
    let currentUser = await this.getUser(userId);
    
    while (currentUser?.parentId) {
      chain.push(currentUser.parentId);
      currentUser = await this.getUser(currentUser.parentId);
    }
    
    return chain;
  }

  // Distribute commission to each person in the hierarchy
  async distributeCommission(
    serviceAgentId: number, 
    parentChain: number[], 
    transactionId: number, 
    serviceType: string, 
    serviceId: number, 
    originalAmount: number, 
    config: CommissionConfig
  ): Promise<void> {
    // Service Agent commission
    await this.createCommission({
      userId: serviceAgentId,
      userType: 'service_agent',
      serviceType,
      transactionId,
      serviceId,
      originalAmount,
      commissionPercentage: config.serviceAgentCommission,
      commissionAmount: (originalAmount * config.serviceAgentCommission) / 100,
      status: 'credited',
    });

    // Add commission amount to service agent's wallet
    const serviceAgent = await this.getUser(serviceAgentId);
    if (serviceAgent) {
      const commissionAmount = (originalAmount * config.serviceAgentCommission) / 100;
      await this.updateUser(serviceAgentId, {
        walletBalance: (serviceAgent.walletBalance || 0) + commissionAmount
      });
    }

    // If there are parents, distribute to them as well
    if (parentChain.length > 0) {
      // First parent is taluk manager
      const talukManagerId = parentChain[0];
      await this.createCommission({
        userId: talukManagerId,
        userType: 'taluk_manager',
        serviceType,
        transactionId,
        serviceId,
        originalAmount,
        commissionPercentage: config.talukManagerCommission,
        commissionAmount: (originalAmount * config.talukManagerCommission) / 100,
        status: 'credited',
      });

      // Add commission amount to taluk manager's wallet
      const talukManager = await this.getUser(talukManagerId);
      if (talukManager) {
        const commissionAmount = (originalAmount * config.talukManagerCommission) / 100;
        await this.updateUser(talukManagerId, {
          walletBalance: (talukManager.walletBalance || 0) + commissionAmount
        });
      }

      // Second parent is branch manager
      if (parentChain.length > 1) {
        const branchManagerId = parentChain[1];
        await this.createCommission({
          userId: branchManagerId,
          userType: 'branch_manager',
          serviceType,
          transactionId,
          serviceId,
          originalAmount,
          commissionPercentage: config.branchManagerCommission,
          commissionAmount: (originalAmount * config.branchManagerCommission) / 100,
          status: 'credited',
        });

        // Add commission amount to branch manager's wallet
        const branchManager = await this.getUser(branchManagerId);
        if (branchManager) {
          const commissionAmount = (originalAmount * config.branchManagerCommission) / 100;
          await this.updateUser(branchManagerId, {
            walletBalance: (branchManager.walletBalance || 0) + commissionAmount
          });
        }

        // Third parent is admin
        if (parentChain.length > 2) {
          const adminId = parentChain[2];
          await this.createCommission({
            userId: adminId,
            userType: 'admin',
            serviceType,
            transactionId,
            serviceId,
            originalAmount,
            commissionPercentage: config.adminCommission,
            commissionAmount: (originalAmount * config.adminCommission) / 100,
            status: 'credited',
          });

          // Add commission amount to admin's wallet
          const admin = await this.getUser(adminId);
          if (admin) {
            const commissionAmount = (originalAmount * config.adminCommission) / 100;
            await this.updateUser(adminId, {
              walletBalance: (admin.walletBalance || 0) + commissionAmount
            });
          }
        }
      }
    }
  }

  // Distribute commission to registered user
  async distributeRegisteredUserCommission(
    registeredUserId: number,
    transactionId: number,
    serviceType: string,
    serviceId: number,
    originalAmount: number,
    commissionPercentage: number
  ): Promise<void> {
    await this.createCommission({
      userId: registeredUserId,
      userType: 'registered_user',
      serviceType,
      transactionId,
      serviceId,
      originalAmount,
      commissionPercentage,
      commissionAmount: (originalAmount * commissionPercentage) / 100,
      status: 'credited',
    });

    // Add commission amount to registered user's wallet
    const registeredUser = await this.getUser(registeredUserId);
    if (registeredUser) {
      const commissionAmount = (originalAmount * commissionPercentage) / 100;
      await this.updateUser(registeredUserId, {
        walletBalance: (registeredUser.walletBalance || 0) + commissionAmount
      });
    }
  }

  // Service Provider operations
  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    const newProvider: ServiceProvider = {
      id: this.serviceProviderIdCounter++,
      email: provider.email || null,
      phone: provider.phone,
      district: provider.district,
      taluk: provider.taluk,
      pincode: provider.pincode,
      createdAt: new Date(),
      status: provider.status,
      userId: provider.userId,
      description: provider.description || null,
      providerType: provider.providerType,
      address: provider.address,
      businessName: provider.businessName || null,
      contactPerson: provider.contactPerson || null,
      isVerified: provider.isVerified || false,
      approvedBy: provider.approvedBy || null,
      updatedAt: new Date(),
      documents: provider.documents || null,
    };
    
    this.serviceProviders.push(newProvider);
    return newProvider;
  }

  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.find(provider => provider.id === id);
  }

  async getServiceProviderByUserId(userId: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.find(provider => provider.userId === userId);
  }

  async updateServiceProvider(id: number, providerData: Partial<ServiceProvider>): Promise<ServiceProvider | undefined> {
    const index = this.serviceProviders.findIndex(provider => provider.id === id);
    if (index === -1) return undefined;
    
    const updatedProvider = {
      ...this.serviceProviders[index],
      ...providerData,
      updatedAt: new Date(),
    };
    
    this.serviceProviders[index] = updatedProvider;
    return updatedProvider;
  }

  async listServiceProviders(filter?: { providerType?: string, status?: string, district?: string }): Promise<ServiceProvider[]> {
    let filteredProviders = [...this.serviceProviders];
    
    if (filter?.providerType) {
      filteredProviders = filteredProviders.filter(provider => provider.providerType === filter.providerType);
    }
    
    if (filter?.status) {
      filteredProviders = filteredProviders.filter(provider => provider.status === filter.status);
    }
    
    if (filter?.district) {
      filteredProviders = filteredProviders.filter(provider => provider.district === filter.district);
    }
    
    return filteredProviders.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  // Farmer Detail operations
  async createFarmerDetail(detail: InsertFarmerDetail): Promise<FarmerDetail> {
    const newDetail: FarmerDetail = {
      id: this.farmerDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      farmSize: detail.farmSize || null,
      farmType: detail.farmType || null,
      primaryProducts: detail.primaryProducts || null,
      cultivationSeason: detail.cultivationSeason || null,
      operatingHours: detail.operatingHours || null,
      supportsDelivery: detail.supportsDelivery || null,
      bankDetails: detail.bankDetails || null,
    };
    
    this.farmerDetails.push(newDetail);
    return newDetail;
  }

  async getFarmerDetail(id: number): Promise<FarmerDetail | undefined> {
    return this.farmerDetails.find(detail => detail.id === id);
  }

  async getFarmerDetailByProviderId(providerId: number): Promise<FarmerDetail | undefined> {
    return this.farmerDetails.find(detail => detail.serviceProviderId === providerId);
  }

  async updateFarmerDetail(id: number, detailData: Partial<FarmerDetail>): Promise<FarmerDetail | undefined> {
    const index = this.farmerDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.farmerDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.farmerDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Manufacturer Detail operations
  async createManufacturerDetail(detail: InsertManufacturerDetail): Promise<ManufacturerDetail> {
    const newDetail: ManufacturerDetail = {
      id: this.manufacturerDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      supportsDelivery: detail.supportsDelivery || null,
      bankDetails: detail.bankDetails || null,
      businessType: detail.businessType || null,
      productCategories: detail.productCategories || null,
      establishmentYear: detail.establishmentYear || null,
    };
    
    this.manufacturerDetails.push(newDetail);
    return newDetail;
  }

  async getManufacturerDetail(id: number): Promise<ManufacturerDetail | undefined> {
    return this.manufacturerDetails.find(detail => detail.id === id);
  }

  async getManufacturerDetailByProviderId(providerId: number): Promise<ManufacturerDetail | undefined> {
    return this.manufacturerDetails.find(detail => detail.serviceProviderId === providerId);
  }

  async updateManufacturerDetail(id: number, detailData: Partial<ManufacturerDetail>): Promise<ManufacturerDetail | undefined> {
    const index = this.manufacturerDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.manufacturerDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.manufacturerDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Booking Agent Detail operations
  async createBookingAgentDetail(detail: InsertBookingAgentDetail): Promise<BookingAgentDetail> {
    const newDetail: BookingAgentDetail = {
      id: this.bookingAgentDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      bankDetails: detail.bankDetails || null,
      serviceTypes: detail.serviceTypes || null,
      operatingHours: detail.operatingHours || null,
      yearsOfExperience: detail.yearsOfExperience || null,
      preferredProviders: detail.preferredProviders || null,
      commissionRates: detail.commissionRates || null,
    };
    
    this.bookingAgentDetails.push(newDetail);
    return newDetail;
  }

  async getBookingAgentDetail(id: number): Promise<BookingAgentDetail | undefined> {
    return this.bookingAgentDetails.find(detail => detail.id === id);
  }

  async getBookingAgentDetailByProviderId(providerId: number): Promise<BookingAgentDetail | undefined> {
    return this.bookingAgentDetails.find(detail => detail.serviceProviderId === providerId);
  }

  async updateBookingAgentDetail(id: number, detailData: Partial<BookingAgentDetail>): Promise<BookingAgentDetail | undefined> {
    const index = this.bookingAgentDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.bookingAgentDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.bookingAgentDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Taxi Service operations
  private taxiVehicles: any[] = [];
  private taxiBookings: any[] = [];
  private taxiVehicleIdCounter = 1;
  private taxiBookingIdCounter = 1;

  async createTaxiVehicle(vehicle: any): Promise<any> {
    const newVehicle = {
      id: this.taxiVehicleIdCounter++,
      ...vehicle,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.taxiVehicles.push(newVehicle);
    return newVehicle;
  }

  async getTaxiVehicle(id: number): Promise<any> {
    return this.taxiVehicles.find(v => v.id === id);
  }

  async getTaxiVehiclesByProvider(providerId: number): Promise<any[]> {
    return this.taxiVehicles.filter(v => v.providerId === providerId);
  }

  async updateTaxiVehicle(id: number, vehicle: any): Promise<any> {
    const index = this.taxiVehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    
    this.taxiVehicles[index] = {
      ...this.taxiVehicles[index],
      ...vehicle,
      updatedAt: new Date()
    };
    return this.taxiVehicles[index];
  }

  async getAvailableTaxiVehicles(filters: any): Promise<any[]> {
    return this.taxiVehicles.filter(v => {
      if (!v.adminApproved || v.status !== 'available') return false;
      if (filters.vehicleType && v.vehicleType !== filters.vehicleType) return false;
      if (filters.district && v.district !== filters.district) return false;
      if (filters.acAvailable !== undefined && v.acAvailable !== filters.acAvailable) return false;
      return true;
    });
  }

  async getAllTaxiVehicles(): Promise<any[]> {
    return [...this.taxiVehicles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getApprovedTaxiVehicles(): Promise<any[]> {
    return this.taxiVehicles
      .filter(v => v.adminApproved === true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTaxiVehiclesForApproval(): Promise<any[]> {
    return this.taxiVehicles
      .filter(v => v.adminApproved === false)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async approveTaxiVehicle(id: number, approved: boolean): Promise<any> {
    const index = this.taxiVehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    
    this.taxiVehicles[index] = {
      ...this.taxiVehicles[index],
      adminApproved: approved,
      updatedAt: new Date()
    };
    return this.taxiVehicles[index];
  }

  async updateTaxiVehicleStatus(id: number, isActive: boolean): Promise<any> {
    const index = this.taxiVehicles.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    
    this.taxiVehicles[index] = {
      ...this.taxiVehicles[index],
      isActive: isActive,
      updatedAt: new Date()
    };
    return this.taxiVehicles[index];
  }



  // Taxi booking operations
  async createTaxiBooking(booking: any): Promise<any> {
    const newBooking = {
      id: this.taxiBookingIdCounter++,
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.taxiBookings.push(newBooking);
    return newBooking;
  }

  async getTaxiBooking(id: number): Promise<any> {
    return this.taxiBookings.find(b => b.id === id);
  }

  async getTaxiBookingsByCustomer(customerId: number): Promise<any[]> {
    return this.taxiBookings.filter(b => b.customerId === customerId);
  }

  async getTaxiBookingsByProvider(providerId: number): Promise<any[]> {
    return this.taxiBookings.filter(b => b.providerId === providerId);
  }

  async updateTaxiBookingStatus(id: number, status: string, providerId: number): Promise<any> {
    const booking = this.taxiBookings.find(b => b.id === id && b.providerId === providerId);
    if (!booking) return undefined;
    
    booking.status = status;
    booking.updatedAt = new Date();
    
    if (status === 'confirmed') booking.confirmedAt = new Date();
    if (status === 'started') booking.startedAt = new Date();
    if (status === 'completed') booking.completedAt = new Date();
    if (status === 'cancelled') booking.cancelledAt = new Date();
    
    return booking;
  }

  async getAllTaxiBookings(): Promise<any[]> {
    return this.taxiBookings;
  }

  // Taxi Provider operations
  async createTaxiProviderDetail(detail: InsertTaxiProviderDetail): Promise<TaxiProviderDetail> {
    const newDetail: TaxiProviderDetail = {
      id: this.taxiProviderDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      bankDetails: detail.bankDetails || null,
      vehicleTypes: detail.vehicleTypes || null,
      operatingHours: detail.operatingHours || null,
      licenseNumber: detail.licenseNumber || null,
      dateOfBirth: detail.dateOfBirth || null,
      photoUrl: detail.photoUrl || null,
      aadharVerified: detail.aadharVerified || false,
      panCardNumber: detail.panCardNumber || null,
      vehicleRegistrationNumber: detail.vehicleRegistrationNumber || null,
      vehicleInsuranceDetails: detail.vehicleInsuranceDetails || null,
      vehiclePermitDetails: detail.vehiclePermitDetails || null,
      documents: detail.documents || null,
      approvalStatus: detail.approvalStatus || "pending",
      approvalNotes: detail.approvalNotes || null,
      approvedBy: detail.approvedBy || null,
    };
    
    this.taxiProviderDetails.push(newDetail);
    return newDetail;
  }

  async getTaxiProviderDetail(id: number): Promise<TaxiProviderDetail | undefined> {
    return this.taxiProviderDetails.find(detail => detail.id === id);
  }

  async getTaxiProviderDetailByProviderId(providerId: number): Promise<TaxiProviderDetail | undefined> {
    return this.taxiProviderDetails.find(detail => detail.serviceProviderId === providerId);
  }
  
  // Helper method to get taxi providers with specific filters for approval workflow
  async getTaxiProvidersWithFilter(filter: any): Promise<any[]> {
    // First filter service providers based on location criteria (district, taluk, pincode)
    let filteredProviders = this.serviceProviders.filter(provider => {
      let matches = provider.providerType === "taxi_provider";
      
      if (filter.district) {
        if (Array.isArray(filter.district.$in)) {
          matches = matches && filter.district.$in.includes(provider.district);
        } else {
          matches = matches && provider.district === filter.district;
        }
      }
      
      if (filter.taluk) {
        if (Array.isArray(filter.taluk.$in)) {
          matches = matches && filter.taluk.$in.includes(provider.taluk);
        } else {
          matches = matches && provider.taluk === filter.taluk;
        }
      }
      
      if (filter.pincode) {
        matches = matches && provider.pincode === filter.pincode;
      }
      
      return matches;
    });
    
    // Then get the taxi provider details for these providers
    const results = [];
    for (const provider of filteredProviders) {
      const taxiDetails = this.taxiProviderDetails.find(
        detail => detail.serviceProviderId === provider.id
      );
      
      // Only include if we found details and they match the approvalStatus filter
      if (taxiDetails && 
          (!filter.approvalStatus || taxiDetails.approvalStatus === filter.approvalStatus)) {
        // For each match, return combined provider and detail data
        results.push({
          provider,
          details: taxiDetails,
          user: await this.getUser(provider.userId)
        });
      }
    }
    
    return results;
  }
  
  // Helper methods for manager jurisdictions
  async getTaluksForManager(managerId: number): Promise<string[]> {
    const user = await this.getUser(managerId);
    if (!user || user.userType !== "taluk_manager") {
      return [];
    }
    
    // In a real implementation, you'd query a relationship table
    // For now, we extract the taluk from the username pattern tm_district_taluk
    const username = user.username;
    const match = username.match(/^tm_(\w+)_(\w+)/);
    if (match && match.length >= 3) {
      return [match[2].replace(/_/g, ' ')]; // Return the taluk part
    }
    
    return [];
  }
  
  async getDistrictsForManager(managerId: number): Promise<string[]> {
    const user = await this.getUser(managerId);
    if (!user || user.userType !== "branch_manager") {
      return [];
    }
    
    // In a real implementation, you'd query a relationship table
    // For now, we extract the district from the username pattern bm_district
    const username = user.username;
    const match = username.match(/^bm_(\w+)/);
    if (match && match.length >= 2) {
      return [match[1].replace(/_/g, ' ')]; // Return the district part
    }
    
    return [];
  }

  async updateTaxiProviderDetail(id: number, detailData: Partial<TaxiProviderDetail>): Promise<TaxiProviderDetail | undefined> {
    const index = this.taxiProviderDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.taxiProviderDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.taxiProviderDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Transportation Agent operations
  async createTransportationAgentDetail(detail: InsertTransportationAgentDetail): Promise<TransportationAgentDetail> {
    const newDetail: TransportationAgentDetail = {
      id: this.transportationAgentDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      bankDetails: detail.bankDetails || null,
      vehicleTypes: detail.vehicleTypes || null,
      operatingHours: detail.operatingHours || null,
      vehicleCount: detail.vehicleCount || null,
      serviceAreas: detail.serviceAreas || null,
      maxDistance: detail.maxDistance || null,
      maxWeight: detail.maxWeight || null,
      pricePerKg: detail.pricePerKg || null,
      pricePerKm: detail.pricePerKm || null,
    };
    
    this.transportationAgentDetails.push(newDetail);
    return newDetail;
  }

  async getTransportationAgentDetail(id: number): Promise<TransportationAgentDetail | undefined> {
    return this.transportationAgentDetails.find(detail => detail.id === id);
  }

  async getTransportationAgentDetailByProviderId(providerId: number): Promise<TransportationAgentDetail | undefined> {
    return this.transportationAgentDetails.find(detail => detail.serviceProviderId === providerId);
  }

  async updateTransportationAgentDetail(id: number, detailData: Partial<TransportationAgentDetail>): Promise<TransportationAgentDetail | undefined> {
    const index = this.transportationAgentDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.transportationAgentDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.transportationAgentDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Rental Provider operations
  async createRentalProviderDetail(detail: InsertRentalProviderDetail): Promise<RentalProviderDetail> {
    const newDetail: RentalProviderDetail = {
      id: this.rentalProviderDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      bankDetails: detail.bankDetails || null,
      itemCategories: detail.itemCategories || null,
      operatingHours: detail.operatingHours || null,
      rentalTerms: detail.rentalTerms || null,
      insuranceDetails: detail.insuranceDetails || null,
      securityDepositTerms: detail.securityDepositTerms || null,
      maintenancePolicy: detail.maintenancePolicy || null,
    };
    
    this.rentalProviderDetails.push(newDetail);
    return newDetail;
  }

  async getRentalProviderDetail(id: number): Promise<RentalProviderDetail | undefined> {
    return this.rentalProviderDetails.find(detail => detail.id === id);
  }

  async getRentalProviderDetailByProviderId(providerId: number): Promise<RentalProviderDetail | undefined> {
    return this.rentalProviderDetails.find(detail => detail.serviceProviderId === providerId);
  }

  async updateRentalProviderDetail(id: number, detailData: Partial<RentalProviderDetail>): Promise<RentalProviderDetail | undefined> {
    const index = this.rentalProviderDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.rentalProviderDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.rentalProviderDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Recycling Agent operations
  async createRecyclingAgentDetail(detail: InsertRecyclingAgentDetail): Promise<RecyclingAgentDetail> {
    const newDetail: RecyclingAgentDetail = {
      id: this.recyclingAgentDetailIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceProviderId: detail.serviceProviderId,
      bankDetails: detail.bankDetails || null,
      materialTypes: detail.materialTypes || null,
      operatingHours: detail.operatingHours || null,
    };
    
    this.recyclingAgentDetails.push(newDetail);
    return newDetail;
  }

  async getRecyclingAgentDetail(id: number): Promise<RecyclingAgentDetail | undefined> {
    return this.recyclingAgentDetails.find(detail => detail.id === id);
  }

  async getRecyclingAgentDetailByProviderId(providerId: number): Promise<RecyclingAgentDetail | undefined> {
    return this.recyclingAgentDetails.find(detail => detail.serviceProviderId === providerId);
  }

  async updateRecyclingAgentDetail(id: number, detailData: Partial<RecyclingAgentDetail>): Promise<RecyclingAgentDetail | undefined> {
    const index = this.recyclingAgentDetails.findIndex(detail => detail.id === id);
    if (index === -1) return undefined;
    
    const updatedDetail = {
      ...this.recyclingAgentDetails[index],
      ...detailData,
      updatedAt: new Date(),
    };
    
    this.recyclingAgentDetails[index] = updatedDetail;
    return updatedDetail;
  }

  // Manager Application operations
  async createManagerApplication(application: InsertManagerApplication): Promise<ManagerApplication> {
    const newApplication: ManagerApplication = {
      id: this.managerApplicationIdCounter++,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone || null,
      username: application.username,
      password: application.password,
      managerType: application.managerType,
      district: application.district || null,
      taluk: application.taluk || null,
      pincode: application.pincode || null,
      status: "pending",
      notes: null,
      approvedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.managerApplications.push(newApplication);
    return newApplication;
  }

  async getManagerApplication(id: number): Promise<ManagerApplication | undefined> {
    return this.managerApplications.find(application => application.id === id);
  }

  async getManagerApplications(filter?: { status?: string, managerType?: string }): Promise<ManagerApplication[]> {
    let filteredApplications = [...this.managerApplications];
    
    if (filter?.status) {
      filteredApplications = filteredApplications.filter(app => app.status === filter.status);
    }
    
    if (filter?.managerType) {
      filteredApplications = filteredApplications.filter(app => app.managerType === filter.managerType);
    }
    
    return filteredApplications.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async updateManagerApplication(id: number, applicationData: Partial<ManagerApplication>): Promise<ManagerApplication | undefined> {
    const index = this.managerApplications.findIndex(application => application.id === id);
    if (index === -1) return undefined;
    
    const updatedApplication = {
      ...this.managerApplications[index],
      ...applicationData,
      updatedAt: new Date(),
    };
    
    this.managerApplications[index] = updatedApplication;
    return updatedApplication;
  }
  
  // Farmer Product Listing operations
  async createFarmerProductListing(listing: InsertFarmerProductListing): Promise<FarmerProductListing> {
    const newListing: FarmerProductListing = {
      id: this.farmerProductListingIdCounter++,
      farmerId: listing.farmerId,
      groceryProductId: listing.groceryProductId,
      quantity: listing.quantity,
      price: listing.price,
      unit: listing.unit,
      imageUrl: listing.imageUrl,
      transportAgentRequired: listing.transportAgentRequired !== false, // default to true
      selfDelivery: listing.selfDelivery === true, // default to false
      isOrganic: listing.isOrganic === true, // default to false
      status: listing.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: listing.notes || null
    };
    
    this.farmerProductListings.push(newListing);
    return newListing;
  }
  
  async getFarmerProductListings(filter?: { farmerId?: number, groceryProductId?: number, status?: string }): Promise<FarmerProductListing[]> {
    let results = [...this.farmerProductListings];
    
    if (filter?.farmerId !== undefined) {
      results = results.filter(listing => listing.farmerId === filter.farmerId);
    }
    
    if (filter?.groceryProductId !== undefined) {
      results = results.filter(listing => listing.groceryProductId === filter.groceryProductId);
    }
    
    if (filter?.status) {
      results = results.filter(listing => listing.status === filter.status);
    }
    
    return results;
  }
  
  async getFarmerProductListing(id: number): Promise<FarmerProductListing | undefined> {
    return this.farmerProductListings.find(listing => listing.id === id);
  }
  
  async updateFarmerProductListing(id: number, listing: Partial<FarmerProductListing>): Promise<FarmerProductListing | undefined> {
    const index = this.farmerProductListings.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    
    const updatedListing = {
      ...this.farmerProductListings[index],
      ...listing,
      updatedAt: new Date()
    };
    
    this.farmerProductListings[index] = updatedListing;
    return updatedListing;
  }
  
  async deleteFarmerProductListing(id: number): Promise<void> {
    const index = this.farmerProductListings.findIndex(l => l.id === id);
    if (index !== -1) {
      this.farmerProductListings.splice(index, 1);
    }
  }
  
  // Delivery Area operations
  async createDeliveryArea(area: InsertDeliveryArea): Promise<DeliveryArea> {
    const newArea: DeliveryArea = {
      id: this.deliveryAreaIdCounter++,
      listingId: area.listingId,
      district: area.district,
      taluk: area.taluk,
      pincode: area.pincode,
      isActive: area.isActive !== false, // default to true
      createdAt: new Date()
    };
    
    this.deliveryAreas.push(newArea);
    return newArea;
  }
  
  async getDeliveryAreas(listingId: number): Promise<DeliveryArea[]> {
    return this.deliveryAreas.filter(area => area.listingId === listingId);
  }
  
  async getDeliveryArea(id: number): Promise<DeliveryArea | undefined> {
    return this.deliveryAreas.find(area => area.id === id);
  }
  
  async deleteDeliveryArea(id: number): Promise<void> {
    const index = this.deliveryAreas.findIndex(area => area.id === id);
    if (index !== -1) {
      this.deliveryAreas.splice(index, 1);
    }
  }
  
  // Product Request operations
  async createProductRequest(request: InsertProductRequest): Promise<ProductRequest> {
    const newRequest: ProductRequest = {
      id: this.productRequestIdCounter++,
      farmerId: request.farmerId,
      requestedProductName: request.requestedProductName,
      description: request.description,
      category: request.category,
      unit: request.unit,
      imageUrl: request.imageUrl,
      status: request.status || 'pending',
      adminNotes: request.adminNotes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.productRequests.push(newRequest);
    return newRequest;
  }
  
  async getProductRequests(filter?: { farmerId?: number, status?: string }): Promise<ProductRequest[]> {
    let results = [...this.productRequests];
    
    if (filter?.farmerId !== undefined) {
      results = results.filter(request => request.farmerId === filter.farmerId);
    }
    
    if (filter?.status) {
      results = results.filter(request => request.status === filter.status);
    }
    
    return results;
  }
  
  async getProductRequest(id: number): Promise<ProductRequest | undefined> {
    return this.productRequests.find(request => request.id === id);
  }
  
  async updateProductRequest(id: number, request: Partial<ProductRequest>): Promise<ProductRequest | undefined> {
    const index = this.productRequests.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    const updatedRequest = {
      ...this.productRequests[index],
      ...request,
      updatedAt: new Date()
    };
    
    this.productRequests[index] = updatedRequest;
    return updatedRequest;
  }
  
  // Grocery Order operations
  async createGroceryOrder(order: InsertGroceryOrder): Promise<GroceryOrder> {
    const newOrder: GroceryOrder = {
      id: this.groceryOrderIdCounter++,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      district: order.district,
      taluk: order.taluk,
      pincode: order.pincode,
      status: order.status || 'pending',
      pincodeAgentId: order.pincodeAgentId || null,
      transportAgentId: order.transportAgentId || null,
      deliveryFee: order.deliveryFee || 0,
      paymentMethod: order.paymentMethod || 'cash',
      paymentStatus: order.paymentStatus || 'pending',
      notes: order.notes || null,
      createdAt: new Date(),
      completedAt: null
    };
    
    this.groceryOrders.push(newOrder);
    return newOrder;
  }
  
  async getGroceryOrders(filter?: { customerId?: number, status?: string, district?: string, taluk?: string, pincode?: string }): Promise<GroceryOrder[]> {
    let results = [...this.groceryOrders];
    
    if (filter?.customerId !== undefined) {
      results = results.filter(order => order.customerId === filter.customerId);
    }
    
    if (filter?.status) {
      results = results.filter(order => order.status === filter.status);
    }
    
    if (filter?.district) {
      results = results.filter(order => order.district === filter.district);
    }
    
    if (filter?.taluk) {
      results = results.filter(order => order.taluk === filter.taluk);
    }
    
    if (filter?.pincode) {
      results = results.filter(order => order.pincode === filter.pincode);
    }
    
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getGroceryOrder(id: number): Promise<GroceryOrder | undefined> {
    return this.groceryOrders.find(order => order.id === id);
  }
  
  async updateGroceryOrder(id: number, order: Partial<GroceryOrder>): Promise<GroceryOrder | undefined> {
    const index = this.groceryOrders.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    
    const updatedOrder = {
      ...this.groceryOrders[index],
      ...order
    };
    
    this.groceryOrders[index] = updatedOrder;
    return updatedOrder;
  }
  
  // Grocery Order Item operations
  async createGroceryOrderItem(item: InsertGroceryOrderItem): Promise<GroceryOrderItem> {
    const newItem: GroceryOrderItem = {
      id: this.groceryOrderItemIdCounter++,
      orderId: item.orderId,
      farmerProductListingId: item.farmerProductListingId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      status: item.status || 'pending',
      farmerId: item.farmerId,
      productName: item.productName,
      createdAt: new Date()
    };
    
    this.groceryOrderItems.push(newItem);
    return newItem;
  }
  
  async getGroceryOrderItems(orderId: number): Promise<GroceryOrderItem[]> {
    return this.groceryOrderItems.filter(item => item.orderId === orderId);
  }
  
  async getFarmerOrderItems(farmerId: number, status?: string): Promise<GroceryOrderItem[]> {
    let results = this.groceryOrderItems.filter(item => item.farmerId === farmerId);
    
    if (status) {
      results = results.filter(item => item.status === status);
    }
    
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async updateGroceryOrderItem(id: number, item: Partial<GroceryOrderItem>): Promise<GroceryOrderItem | undefined> {
    const index = this.groceryOrderItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    const updatedItem = {
      ...this.groceryOrderItems[index],
      ...item
    };
    
    this.groceryOrderItems[index] = updatedItem;
    return updatedItem;
  }

  // Bus Booking Operations
  async createBusBooking(booking: any): Promise<any> {
    const newBooking = {
      id: this.busBookingIdCounter++,
      ...booking,
      createdAt: new Date()
    };
    this.busBookings.push(newBooking);
    return newBooking;
  }

  async getBusBooking(id: number): Promise<any> {
    return this.busBookings.find(booking => booking.id === id);
  }

  async getBusBookingsByUserId(userId: number): Promise<any[]> {
    return this.busBookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllBusBookings(): Promise<any[]> {
    return this.busBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateBusBooking(id: number, updates: any): Promise<any> {
    const index = this.busBookings.findIndex(booking => booking.id === id);
    if (index === -1) return undefined;
    
    const updatedBooking = {
      ...this.busBookings[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.busBookings[index] = updatedBooking;
    return updatedBooking;
  }

  async distributeBusCommissions(bookingId: number, userId: number, commissionStructure: any): Promise<void> {
    // Create commission records for each level
    for (const [role, amount] of Object.entries(commissionStructure)) {
      if (amount > 0) {
        await this.createCommission({
          userId: userId,
          amount: amount as number,
          type: 'bus_commission',
          description: `Bus booking commission - ${role}`,
          serviceType: 'bus_booking',
          serviceId: bookingId,
          status: 'pending'
        });
      }
    }
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // Notification and Real-time Messaging methods
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getNotificationsByUserId(userId: number, limit = 50, offset = 0): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
  }

  async deleteNotification(id: number): Promise<void> {
    await db
      .delete(notifications)
      .where(eq(notifications.id, id));
  }

  // User devices operations (for push notifications)
  async registerUserDevice(device: InsertUserDevice): Promise<UserDevice> {
    // Check if device already exists
    const existingDevice = await db
      .select()
      .from(userDevices)
      .where(eq(userDevices.deviceToken, device.deviceToken));
    
    if (existingDevice.length > 0) {
      // Update last seen
      const [updatedDevice] = await db
        .update(userDevices)
        .set({ 
          lastSeen: new Date(),
          isActive: true,
          userId: device.userId // In case the device is now used by a different user
        })
        .where(eq(userDevices.deviceToken, device.deviceToken))
        .returning();
      return updatedDevice;
    }
    
    // Create new device
    const [newDevice] = await db
      .insert(userDevices)
      .values(device)
      .returning();
    return newDevice;
  }

  async getUserDevices(userId: number): Promise<UserDevice[]> {
    return await db
      .select()
      .from(userDevices)
      .where(and(
        eq(userDevices.userId, userId),
        eq(userDevices.isActive, true)
      ));
  }

  async updateUserDeviceLastSeen(deviceToken: string): Promise<void> {
    await db
      .update(userDevices)
      .set({ lastSeen: new Date() })
      .where(eq(userDevices.deviceToken, deviceToken));
  }

  async deactivateUserDevice(deviceToken: string): Promise<void> {
    await db
      .update(userDevices)
      .set({ isActive: false })
      .where(eq(userDevices.deviceToken, deviceToken));
  }
  
  // Analytics operations
  async recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db
      .insert(analyticsEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async updateDailyMetric(metric: InsertAnalyticsDaily): Promise<AnalyticsDaily> {
    // Check if this metric already exists for the same date, category, and district/taluk
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
    
    const existingMetrics = await db
      .select()
      .from(analyticsDaily)
      .where(and(...whereConditions));
    
    if (existingMetrics.length > 0) {
      // Update existing metric
      const [updatedMetric] = await db
        .update(analyticsDaily)
        .set({ value: metric.value })
        .where(eq(analyticsDaily.id, existingMetrics[0].id))
        .returning();
      return updatedMetric;
    }
    
    // Create new metric
    const [newMetric] = await db
      .insert(analyticsDaily)
      .values(metric)
      .returning();
    return newMetric;
  }

  async getDailyMetrics(params: { 
    startDate: Date, 
    endDate: Date, 
    metrics?: string[], 
    categories?: string[],
    district?: string,
    taluk?: string
  }): Promise<AnalyticsDaily[]> {
    let query = db
      .select()
      .from(analyticsDaily)
      .where(and(
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
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db
      .insert(reports)
      .values({
        ...report,
        updatedAt: new Date()
      })
      .returning();
    return newReport;
  }

  async getReportById(id: number): Promise<Report | undefined> {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id));
    return report;
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(and(
        eq(reports.createdBy, userId),
        eq(reports.isPublic, false)
      ))
      .orderBy(desc(reports.updatedAt));
  }

  async getPublicReports(): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.isPublic, true))
      .orderBy(desc(reports.updatedAt));
  }

  async updateReport(id: number, updates: Partial<Report>): Promise<Report | undefined> {
    const [updatedReport] = await db
      .update(reports)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteReport(id: number): Promise<void> {
    await db
      .delete(reports)
      .where(eq(reports.id, id));
  }
  
  // Farmer Product Listing operations
  async createFarmerProductListing(listing: InsertFarmerProductListing): Promise<FarmerProductListing> {
    console.log("Storage: Creating farmer product listing with data:", listing);
    try {
      // Only include fields that actually exist in the database table
      const [insertedListing] = await db
        .insert(farmerProductListings)
        .values({
          farmerId: listing.farmerId,
          groceryProductId: listing.groceryProductId,
          quantity: listing.quantity,
          price: listing.price,
          unit: listing.unit,
          // Skip the description field as it's not in the actual database
          // description: listing.description || null,
          imageUrl: listing.imageUrl || null,
          transportAgentRequired: listing.transportAgentRequired !== false, // default to true
          selfDelivery: listing.selfDelivery === true, // default to false
          isOrganic: listing.isOrganic === true, // default to false
          status: listing.status || 'pending'
        })
        .returning();
      
      console.log("Storage: Successfully created listing:", insertedListing);
      return insertedListing;
    } catch (error) {
      console.error("Storage: Error creating listing:", error);
      throw error;
    }
  }
  
  async getFarmerProductListings(filter?: { farmerId?: number, groceryProductId?: number, status?: string }): Promise<FarmerProductListing[]> {
    try {
      // Only select columns that are actually in the database table
      // Includes only fields that exist in the table based on migrate-farmer-listings.ts
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
  
  async getFarmerProductListing(id: number): Promise<FarmerProductListing | undefined> {
    try {
      // Only select columns that are actually in the database table
      // Includes only fields that exist in the table based on migrate-farmer-listings.ts
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
      })
      .from(farmerProductListings)
      .where(eq(farmerProductListings.id, id));
      
      return listing;
    } catch (error) {
      console.error("Error in getFarmerProductListing:", error);
      throw error;
    }
  }
  
  async updateFarmerProductListing(id: number, listing: Partial<FarmerProductListing>): Promise<FarmerProductListing | undefined> {
    try {
      // Create a clean update object with only the fields present in the DB table
      const updateData: any = { updatedAt: new Date() };
      
      // Only copy fields that exist in the actual database table based on migrate-farmer-listings.ts
      if (listing.farmerId !== undefined) updateData.farmerId = listing.farmerId;
      if (listing.groceryProductId !== undefined) updateData.groceryProductId = listing.groceryProductId;
      if (listing.quantity !== undefined) updateData.quantity = listing.quantity;
      if (listing.price !== undefined) updateData.price = listing.price;
      if (listing.unit !== undefined) updateData.unit = listing.unit;
      if (listing.imageUrl !== undefined) updateData.imageUrl = listing.imageUrl;
      if (listing.transportAgentRequired !== undefined) updateData.transportAgentRequired = listing.transportAgentRequired;
      if (listing.selfDelivery !== undefined) updateData.selfDelivery = listing.selfDelivery;
      if (listing.isOrganic !== undefined) updateData.isOrganic = listing.isOrganic;
      if (listing.status !== undefined) updateData.status = listing.status;
      // Skip adminNotes as it doesn't exist in the actual DB table
      // Skip description as it doesn't exist in the actual DB table
      
      const [updatedListing] = await db
        .update(farmerProductListings)
        .set(updateData)
        .where(eq(farmerProductListings.id, id))
        .returning();
      
      return updatedListing;
    } catch (error) {
      console.error("Error in updateFarmerProductListing:", error);
      throw error;
    }
  }
  
  async deleteFarmerProductListing(id: number): Promise<void> {
    await db
      .delete(farmerProductListings)
      .where(eq(farmerProductListings.id, id));
  }
  
  // Delivery Area operations
  async createDeliveryArea(area: InsertDeliveryArea): Promise<DeliveryArea> {
    const [insertedArea] = await db
      .insert(deliveryAreas)
      .values({
        listingId: area.listingId,
        district: area.district,
        taluk: area.taluk,
        pincode: area.pincode,
        isActive: area.isActive || true
      })
      .returning();
    
    return insertedArea;
  }
  
  async getDeliveryAreas(listingId: number): Promise<DeliveryArea[]> {
    return await db
      .select()
      .from(deliveryAreas)
      .where(eq(deliveryAreas.listingId, listingId));
  }
  
  async getDeliveryArea(id: number): Promise<DeliveryArea | undefined> {
    const [area] = await db
      .select()
      .from(deliveryAreas)
      .where(eq(deliveryAreas.id, id));
    
    return area;
  }
  
  async deleteDeliveryArea(id: number): Promise<void> {
    await db
      .delete(deliveryAreas)
      .where(eq(deliveryAreas.id, id));
  }
  
  // Product Request operations
  async createProductRequest(request: InsertProductRequest): Promise<ProductRequest> {
    const [insertedRequest] = await db
      .insert(productRequests)
      .values({
        farmerId: request.farmerId,
        requestedProductName: request.requestedProductName,
        description: request.description,
        category: request.category,
        unit: request.unit,
        imageUrl: request.imageUrl,
        status: request.status || 'pending',
        adminNotes: request.adminNotes
      })
      .returning();
    
    return insertedRequest;
  }
  
  async getProductRequests(filter?: { farmerId?: number, status?: string }): Promise<ProductRequest[]> {
    let query = db.select().from(productRequests);
    
    if (filter?.farmerId) {
      query = query.where(eq(productRequests.farmerId, filter.farmerId));
    }
    
    if (filter?.status) {
      query = query.where(eq(productRequests.status, filter.status));
    }
    
    return await query;
  }
  
  async getProductRequest(id: number): Promise<ProductRequest | undefined> {
    const [request] = await db
      .select()
      .from(productRequests)
      .where(eq(productRequests.id, id));
    
    return request;
  }
  
  async updateProductRequest(id: number, request: Partial<ProductRequest>): Promise<ProductRequest | undefined> {
    const [updatedRequest] = await db
      .update(productRequests)
      .set({
        ...request,
        updatedAt: new Date()
      })
      .where(eq(productRequests.id, id))
      .returning();
    
    return updatedRequest;
  }
  
  // Grocery Order operations
  async createGroceryOrder(order: InsertGroceryOrder): Promise<GroceryOrder> {
    const [insertedOrder] = await db
      .insert(groceryOrders)
      .values({
        customerId: order.customerId,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        district: order.district,
        taluk: order.taluk,
        pincode: order.pincode,
        status: order.status || 'pending',
        pincodeAgentId: order.pincodeAgentId,
        transportAgentId: order.transportAgentId,
        deliveryFee: order.deliveryFee || 0,
        paymentMethod: order.paymentMethod || 'cash',
        paymentStatus: order.paymentStatus || 'pending',
        notes: order.notes
      })
      .returning();
    
    return insertedOrder;
  }
  
  async getGroceryOrders(filter?: { customerId?: number, status?: string, district?: string, taluk?: string, pincode?: string }): Promise<GroceryOrder[]> {
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
  
  async getGroceryOrder(id: number): Promise<GroceryOrder | undefined> {
    const [order] = await db
      .select()
      .from(groceryOrders)
      .where(eq(groceryOrders.id, id));
    
    return order;
  }
  
  async updateGroceryOrder(id: number, order: Partial<GroceryOrder>): Promise<GroceryOrder | undefined> {
    const [updatedOrder] = await db
      .update(groceryOrders)
      .set(order)
      .where(eq(groceryOrders.id, id))
      .returning();
    
    return updatedOrder;
  }
  
  // Grocery Order Item operations
  async createGroceryOrderItem(item: InsertGroceryOrderItem): Promise<GroceryOrderItem> {
    const [insertedItem] = await db
      .insert(groceryOrderItems)
      .values({
        orderId: item.orderId,
        farmerProductListingId: item.farmerProductListingId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        status: item.status || 'pending',
        farmerId: item.farmerId,
        productName: item.productName
      })
      .returning();
    
    return insertedItem;
  }
  
  async getGroceryOrderItems(orderId: number): Promise<GroceryOrderItem[]> {
    return await db
      .select()
      .from(groceryOrderItems)
      .where(eq(groceryOrderItems.orderId, orderId));
  }
  
  async getFarmerOrderItems(farmerId: number, status?: string): Promise<GroceryOrderItem[]> {
    let query = db
      .select()
      .from(groceryOrderItems)
      .where(eq(groceryOrderItems.farmerId, farmerId));
    
    if (status) {
      query = query.where(eq(groceryOrderItems.status, status));
    }
    
    return await query.orderBy(desc(groceryOrderItems.createdAt));
  }
  
  async updateGroceryOrderItem(id: number, item: Partial<GroceryOrderItem>): Promise<GroceryOrderItem | undefined> {
    const [updatedItem] = await db
      .update(groceryOrderItems)
      .set(item)
      .where(eq(groceryOrderItems.id, id))
      .returning();
    
    return updatedItem;
  }
  
  // Grocery Category operations
  async getGroceryCategories(): Promise<GroceryCategory[]> {
    const categories = await db
      .select()
      .from(groceryCategories)
      .orderBy(asc(groceryCategories.displayOrder));
    return categories;
  }
  
  async getGroceryCategory(id: number): Promise<GroceryCategory | undefined> {
    const [category] = await db
      .select()
      .from(groceryCategories)
      .where(eq(groceryCategories.id, id));
    return category;
  }
  
  async createGroceryCategory(category: InsertGroceryCategory): Promise<GroceryCategory> {
    const [newCategory] = await db
      .insert(groceryCategories)
      .values({
        ...category,
        createdAt: new Date(),
        isActive: category.isActive === undefined ? true : category.isActive
      })
      .returning();
    return newCategory;
  }
  
  async updateGroceryCategory(id: number, categoryData: Partial<GroceryCategory>): Promise<GroceryCategory | undefined> {
    const [updatedCategory] = await db
      .update(groceryCategories)
      .set(categoryData)
      .where(eq(groceryCategories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteGroceryCategory(id: number): Promise<void> {
    // First delete all subcategories in this category
    await db
      .delete(grocerySubCategories)
      .where(eq(grocerySubCategories.parentCategoryId, id));
    
    // Then delete the category
    await db
      .delete(groceryCategories)
      .where(eq(groceryCategories.id, id));
  }
  
  // Grocery SubCategory operations
  async getGrocerySubCategories(filter?: { parentCategoryId?: number, isActive?: boolean }): Promise<GrocerySubCategory[]> {
    let query = db.select().from(grocerySubCategories);
    
    if (filter?.parentCategoryId !== undefined) {
      query = query.where(eq(grocerySubCategories.parentCategoryId, filter.parentCategoryId));
    }
    
    if (filter?.isActive !== undefined) {
      query = query.where(eq(grocerySubCategories.isActive, filter.isActive));
    }
    
    const subCategories = await query.orderBy(asc(grocerySubCategories.displayOrder));
    return subCategories;
  }
  
  async getGrocerySubCategory(id: number): Promise<GrocerySubCategory | undefined> {
    const [subCategory] = await db
      .select()
      .from(grocerySubCategories)
      .where(eq(grocerySubCategories.id, id));
    return subCategory;
  }
  
  async createGrocerySubCategory(subCategory: InsertGrocerySubCategory): Promise<GrocerySubCategory> {
    const [newSubCategory] = await db
      .insert(grocerySubCategories)
      .values({
        ...subCategory,
        createdAt: new Date(),
        isActive: subCategory.isActive === undefined ? true : subCategory.isActive
      })
      .returning();
    return newSubCategory;
  }
  
  async updateGrocerySubCategory(id: number, subCategoryData: Partial<GrocerySubCategory>): Promise<GrocerySubCategory | undefined> {
    const [updatedSubCategory] = await db
      .update(grocerySubCategories)
      .set(subCategoryData)
      .where(eq(grocerySubCategories.id, id))
      .returning();
    return updatedSubCategory;
  }
  
  async deleteGrocerySubCategory(id: number): Promise<void> {
    await db
      .delete(grocerySubCategories)
      .where(eq(grocerySubCategories.id, id));
  }

  // User operations
  async deductUserWalletBalance(userId: number, amount: number): Promise<number> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Initialize wallet balance if it doesn't exist
    const currentBalance = user.walletBalance || 0;
    
    // Check if user has sufficient balance
    if (currentBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }
    
    // Update user's wallet balance
    const newBalance = currentBalance - amount;
    await db.update(users)
      .set({ walletBalance: newBalance })
      .where(eq(users.id, userId));
    
    return newBalance;
  }
  
  async updateWalletBalance(userId: number, newBalance: number): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user's wallet balance directly to the new value
    await db.update(users)
      .set({ walletBalance: newBalance })
      .where(eq(users.id, userId));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByUsernameStartingWith(prefix: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(sql`${users.username} LIKE ${prefix + '%'}`);
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      ...user,
      createdAt: new Date()
    }).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async listUsers(filter?: { userType?: string, parentId?: number }): Promise<User[]> {
    let query = db.select().from(users);
    
    if (filter?.userType) {
      query = query.where(eq(users.userType, filter.userType));
    }
    
    if (filter?.parentId !== undefined) {
      query = query.where(eq(users.parentId, filter.parentId));
    }
    
    return await query;
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values({
      ...transaction,
      createdAt: new Date()
    }).returning();
    return newTransaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values({
      ...feedbackData,
      createdAt: new Date()
    }).returning();
    return newFeedback;
  }

  async listFeedback(filter?: { userId?: number, serviceType?: string }): Promise<Feedback[]> {
    let query = db.select().from(feedback);
    
    if (filter?.userId !== undefined) {
      query = query.where(eq(feedback.userId, filter.userId));
    }
    
    if (filter?.serviceType) {
      query = query.where(eq(feedback.serviceType, filter.serviceType));
    }
    
    return await query.orderBy(desc(feedback.createdAt));
  }

  // Recharge operations
  async createRecharge(recharge: InsertRecharge): Promise<Recharge> {
    const [newRecharge] = await db.insert(recharges).values({
      ...recharge,
      createdAt: new Date()
    }).returning();
    return newRecharge;
  }

  async getRecharge(id: number): Promise<Recharge | undefined> {
    const [recharge] = await db
      .select()
      .from(recharges)
      .where(eq(recharges.id, id));
    return recharge;
  }

  async getRechargesByUserId(userId: number): Promise<Recharge[]> {
    return await db
      .select()
      .from(recharges)
      .where(eq(recharges.userId, userId))
      .orderBy(desc(recharges.createdAt));
  }

  async listRecharges(): Promise<Recharge[]> {
    return await db
      .select()
      .from(recharges)
      .orderBy(desc(recharges.createdAt));
  }

  async updateRecharge(id: number, rechargeData: Partial<Recharge>): Promise<Recharge | undefined> {
    const [updatedRecharge] = await db
      .update(recharges)
      .set(rechargeData)
      .where(eq(recharges.id, id))
      .returning();
    return updatedRecharge;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values({
      ...booking,
      createdAt: new Date()
    }).returning();
    return newBooking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking;
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(bookingData)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Rental operations
  async createRental(rental: InsertRental): Promise<Rental> {
    const [newRental] = await db.insert(rentals).values({
      ...rental,
      createdAt: new Date()
    }).returning();
    return newRental;
  }

  async getRentalsByUserId(userId: number): Promise<Rental[]> {
    return await db
      .select()
      .from(rentals)
      .where(eq(rentals.userId, userId))
      .orderBy(desc(rentals.createdAt));
  }

  async updateRental(id: number, rentalData: Partial<Rental>): Promise<Rental | undefined> {
    const [updatedRental] = await db
      .update(rentals)
      .set(rentalData)
      .where(eq(rentals.id, id))
      .returning();
    return updatedRental;
  }

  // Taxi operations
  async createTaxiRide(taxiRide: InsertTaxiRide): Promise<TaxiRide> {
    const [newTaxiRide] = await db.insert(taxiRides).values({
      ...taxiRide,
      createdAt: new Date()
    }).returning();
    return newTaxiRide;
  }

  async getTaxiRidesByUserId(userId: number): Promise<TaxiRide[]> {
    return await db
      .select()
      .from(taxiRides)
      .where(eq(taxiRides.userId, userId))
      .orderBy(desc(taxiRides.createdAt));
  }

  async updateTaxiRide(id: number, taxiRideData: Partial<TaxiRide>): Promise<TaxiRide | undefined> {
    const [updatedTaxiRide] = await db
      .update(taxiRides)
      .set(taxiRideData)
      .where(eq(taxiRides.id, id))
      .returning();
    return updatedTaxiRide;
  }

  // Delivery operations
  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    const [newDelivery] = await db.insert(deliveries).values({
      ...delivery,
      createdAt: new Date()
    }).returning();
    return newDelivery;
  }

  async getDeliveriesByUserId(userId: number): Promise<Delivery[]> {
    return await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.userId, userId))
      .orderBy(desc(deliveries.createdAt));
  }

  async updateDelivery(id: number, deliveryData: Partial<Delivery>): Promise<Delivery | undefined> {
    const [updatedDelivery] = await db
      .update(deliveries)
      .set(deliveryData)
      .where(eq(deliveries.id, id))
      .returning();
    return updatedDelivery;
  }

  // Grocery operations
  async createGroceryProduct(product: InsertGroceryProduct): Promise<GroceryProduct> {
    // Only include fields that exist in the actual database table
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
      deliveryOption: product.deliveryOption || 'both',
      availableAreas: product.availableAreas || null,
      status: product.status || 'active',
      createdAt: new Date()
    }).returning();
    return newProduct;
  }

  async getGroceryProducts(filter?: { 
    categoryId?: number,
    subcategoryId?: number, 
    district?: string, 
    isOrganic?: boolean,
    providerId?: number,
    status?: string,
    availableAreas?: string,
    deliveryOption?: string,
    adminApproved?: boolean
  }): Promise<GroceryProduct[]> {
    try {
      console.log("Filter applied for grocery products:", filter || {});
      
      let query = db.select().from(groceryProducts);
      
      // Build the WHERE clauses for filtering
      const whereConditions: any[] = [];
      
      if (filter?.categoryId) {
        whereConditions.push(eq(groceryProducts.categoryId, filter.categoryId));
      }
      
      if (filter?.subcategoryId) {
        whereConditions.push(eq(groceryProducts.subcategoryId, filter.subcategoryId));
      }
      
      if (filter?.district) {
        whereConditions.push(eq(groceryProducts.district, filter.district));
      }
      
      if (filter?.isOrganic !== undefined) {
        whereConditions.push(eq(groceryProducts.isOrganic, filter.isOrganic));
      }
      
      if (filter?.providerId !== undefined) {
        whereConditions.push(eq(groceryProducts.providerId, filter.providerId));
      }
      
      if (filter?.adminApproved !== undefined) {
        whereConditions.push(eq(groceryProducts.adminApproved, filter.adminApproved));
      } else {
        // By default, only return admin-approved products
        whereConditions.push(eq(groceryProducts.adminApproved, true));
      }
      
      if (filter?.status) {
        whereConditions.push(eq(groceryProducts.status, filter.status));
      } else {
        // By default, only return active products unless specifically filtered
        whereConditions.push(eq(groceryProducts.status, 'active'));
      }
      
      // Filter by available areas if provided
      if (filter?.availableAreas) {
        whereConditions.push(sql`${groceryProducts.availableAreas} LIKE ${'%' + filter.availableAreas + '%'}`);
      }
      
      // Filter by delivery option if provided
      if (filter?.deliveryOption) {
        whereConditions.push(eq(groceryProducts.deliveryOption, filter.deliveryOption));
      }
      
      // Apply all conditions together with AND logic
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

  async getGroceryProductById(id: number): Promise<GroceryProduct | undefined> {
    try {
      const [product] = await db
        .select()
        .from(groceryProducts)
        .where(eq(groceryProducts.id, id));
      return product;
    } catch (error) {
      console.error(`Error fetching grocery product with ID ${id}:`, error);
      throw error;
    }
  }

  async getGroceryProductsByProvider(providerId: number): Promise<GroceryProduct[]> {
    try {
      return await db
        .select()
        .from(groceryProducts)
        .where(eq(groceryProducts.providerId, providerId))
        .orderBy(desc(groceryProducts.createdAt));
    } catch (error) {
      console.error(`Error fetching grocery products for provider ${providerId}:`, error);
      throw error;
    }
  }

  async getGroceryProductsByProviderId(providerId: number): Promise<GroceryProduct[]> {
    try {
      return await db
        .select()
        .from(groceryProducts)
        .where(eq(groceryProducts.providerId, providerId))
        .orderBy(desc(groceryProducts.createdAt));
    } catch (error) {
      console.error(`Error fetching grocery products for provider ${providerId}:`, error);
      throw error;
    }
  }

  async updateGroceryProduct(id: number, productData: Partial<GroceryProduct>): Promise<GroceryProduct | undefined> {
    try {
      // Filter out any properties that don't exist in the table
      const validData: any = {};
      
      if ('name' in productData) validData.name = productData.name;
      if ('description' in productData) validData.description = productData.description;
      if ('category' in productData) validData.category = productData.category;
      if ('price' in productData) validData.price = productData.price;
      if ('discountedPrice' in productData) validData.discountedPrice = productData.discountedPrice;
      if ('farmerId' in productData) validData.farmerId = productData.farmerId;
      if ('stock' in productData) validData.stock = productData.stock;
      if ('unit' in productData) validData.unit = productData.unit;
      if ('isOrganic' in productData) validData.isOrganic = productData.isOrganic;
      if ('district' in productData) validData.district = productData.district;
      if ('imageUrl' in productData) validData.imageUrl = productData.imageUrl;
      if ('deliveryOption' in productData) validData.deliveryOption = productData.deliveryOption;
      if ('availableAreas' in productData) validData.availableAreas = productData.availableAreas;
      if ('status' in productData) validData.status = productData.status;
      if ('adminApproved' in productData) validData.adminApproved = productData.adminApproved;
      
      // Only update with fields that exist in the database
      // and that were provided in the request
      const [updatedProduct] = await db
        .update(groceryProducts)
        .set(validData)
        .where(eq(groceryProducts.id, id))
        .returning();
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating grocery product with ID ${id}:`, error);
      throw error;
    }
  }
  
  async deleteAllGroceryProducts(): Promise<void> {
    try {
      // Delete all grocery products from the database
      await db.delete(groceryProducts);
      console.log('All grocery products have been removed from the database');
    } catch (error) {
      console.error('Error deleting all grocery products:', error);
      throw error;
    }
  }

  async clearGroceryProductsFromMemory(): Promise<void> {
    // This method is for MemStorage compatibility - in DatabaseStorage, it's the same as deleteAllGroceryProducts
    await this.deleteAllGroceryProducts();
  }

  async clearMemoryGroceryProducts(): Promise<void> {
    // This method is for MemStorage compatibility - in DatabaseStorage, it's the same as deleteAllGroceryProducts
    await this.deleteAllGroceryProducts();
  }

  async deleteGroceryProduct(id: number): Promise<void> {
    try {
      await db
        .delete(groceryProducts)
        .where(eq(groceryProducts.id, id));
    } catch (error) {
      console.error(`Error deleting grocery product ${id}:`, error);
      throw error;
    }
  }

  async getGroceryProductsForAdmin(filter?: { adminApproved?: boolean }): Promise<GroceryProduct[]> {
    try {
      let query = db.select().from(groceryProducts);
      
      if (filter?.adminApproved !== undefined) {
        query = query.where(eq(groceryProducts.adminApproved, filter.adminApproved));
      }
      
      const products = await query.orderBy(desc(groceryProducts.createdAt));
      return products;
    } catch (error) {
      console.error('Error fetching grocery products for admin:', error);
      throw error;
    }
  }

  // Local products operations - new architecture implementation
  
  // Base product operations
  async createLocalProductBase(product: InsertLocalProductBase): Promise<typeof localProductBase.$inferSelect> {
    const [newProduct] = await db.insert(localProductBase).values({
      ...product,
      updatedAt: new Date()
    }).returning();
    return newProduct;
  }

  async getLocalProductBaseById(id: number): Promise<typeof localProductBase.$inferSelect | undefined> {
    const [product] = await db.select().from(localProductBase).where(eq(localProductBase.id, id));
    return product;
  }

  async listLocalProductBases(filter?: { manufacturerId?: number, adminApproved?: boolean, category?: string }): Promise<typeof localProductBase.$inferSelect[]> {
    let query = db.select().from(localProductBase);
    
    if (filter?.manufacturerId !== undefined) {
      query = query.where(eq(localProductBase.manufacturerId, filter.manufacturerId));
    }
    
    if (filter?.adminApproved !== undefined) {
      query = query.where(eq(localProductBase.adminApproved, filter.adminApproved));
    }
    
    if (filter?.category) {
      query = query.where(eq(localProductBase.category, filter.category));
    }
    
    return await query.orderBy(desc(localProductBase.updatedAt));
  }

  async updateLocalProductBase(id: number, data: Partial<InsertLocalProductBase>): Promise<typeof localProductBase.$inferSelect | undefined> {
    const [updatedProduct] = await db.update(localProductBase).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(localProductBase.id, id)).returning();
    return updatedProduct;
  }
  
  // Product details operations
  async createLocalProductDetails(details: UpsertLocalProductDetails): Promise<typeof localProductDetails.$inferSelect> {
    const [newDetails] = await db.insert(localProductDetails).values({
      ...details,
      updatedAt: new Date()
    }).returning();
    return newDetails;
  }

  async getLocalProductDetailsById(id: number): Promise<typeof localProductDetails.$inferSelect | undefined> {
    const [details] = await db.select().from(localProductDetails).where(eq(localProductDetails.id, id));
    return details;
  }

  async getLocalProductDetailsByProductId(productId: number): Promise<typeof localProductDetails.$inferSelect | undefined> {
    const [details] = await db.select().from(localProductDetails).where(eq(localProductDetails.productId, productId));
    return details;
  }

  async updateLocalProductDetails(id: number, details: Partial<UpsertLocalProductDetails>): Promise<typeof localProductDetails.$inferSelect | undefined> {
    const [updatedDetails] = await db.update(localProductDetails).set({
      ...details,
      updatedAt: new Date()
    }).where(eq(localProductDetails.id, id)).returning();
    return updatedDetails;
  }
  
  // Composite product view operations
  async getLocalProductView(id: number): Promise<LocalProductView | undefined> {
    // Get the base product first
    const baseProduct = await this.getLocalProductBaseById(id);
    if (!baseProduct) return undefined;
    
    // Then get the associated details
    const details = await this.getLocalProductDetailsByProductId(baseProduct.id);
    if (!details) return undefined;
    
    // Combine them into a view
    return {
      id: baseProduct.id,
      name: baseProduct.name,
      category: baseProduct.category,
      manufacturerId: baseProduct.manufacturerId,
      adminApproved: baseProduct.adminApproved,
      description: details.description,
      specifications: details.specifications as Record<string, any>,
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

  async listLocalProductViews(filter?: any): Promise<LocalProductView[]> {
    try {
      console.log('listLocalProductViews called with filter:', filter);
      
      // Get category and subcategory lookups first
      const categories = await db.select().from(localProductCategories);
      const subcategories = await db.select().from(localProductSubCategories);
      
      // Create lookup maps for better performance
      const categoryMap = new Map(categories.map(c => [c.id, c.name]));
      const subcategoryMap = new Map(subcategories.map(s => [s.id, s.name]));

      // Build where conditions based on filter
      let whereConditions = [];
      
      if (filter?.adminApproved !== undefined) {
        whereConditions.push(eq(localProductBase.adminApproved, filter.adminApproved));
      }
      
      // Query only the base table since details table doesn't exist in current schema
      let query = db.select().from(localProductBase);
      
      if (whereConditions.length > 0) {
        query = query.where(and(...whereConditions));
      }
      
      const results = await query;
      
      console.log(`Found ${results.length} products matching filter`);

      // Transform results to match UI expectations
      return results.map(row => {
        // Convert category ID to category name - handle string to number conversion
        const categoryId = parseInt(row.category);
        const categoryName = categoryMap.get(categoryId) || `Category ${row.category}`;
        
        // Convert subcategory ID to subcategory name
        const subcategoryId = row.subcategory ? parseInt(row.subcategory) : null;
        const subcategoryName = subcategoryId ? subcategoryMap.get(subcategoryId) || '' : '';
        
        console.log(`Product ${row.name}: categoryId=${row.category} (parsed: ${categoryId}), subcategoryId=${row.subcategory} (parsed: ${subcategoryId}), mapped to: ${categoryName}/${subcategoryName}, adminApproved: ${row.adminApproved}`);

        return {
          id: row.id,
          name: row.name,
          category: categoryName,
          subcategory: subcategoryName,
          description: `Product in ${categoryName}`,
          price: 100,
          discountedPrice: null,
          district: 'Tamil Nadu',
          imageUrl: null,
          deliveryOption: 'both',
          availableAreas: '',
          status: row.adminApproved ? 'active' : 'pending', // Set status based on admin approval
          isDraft: false,
          adminApproved: row.adminApproved,
          manufacturerId: row.manufacturerId,
          createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.updatedAt?.toISOString() || new Date().toISOString(),
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
  async createLocalProduct(product: InsertLocalProduct): Promise<LocalProduct> {
    // Create the base product first
    const baseProduct = await this.createLocalProductBase({
      name: product.name,
      category: product.category,
      manufacturerId: product.manufacturerId
    });
    
    // Then create the product details
    const details = await this.createLocalProductDetails({
      productId: baseProduct.id,
      description: product.description || "",
      price: product.price || 0,
      discountedPrice: product.discountedPrice,
      stock: product.stock || 0,
      district: product.district || "",
      imageUrl: product.imageUrl,
      deliveryOption: product.deliveryOption as "direct" | "service" | "both",
      availableAreas: product.availableAreas,
      status: product.status as "active" | "inactive" | "pending",
      isDraft: false
    });
    
    // Return a combined view
    return {
      id: baseProduct.id,
      name: baseProduct.name,
      category: baseProduct.category,
      manufacturerId: baseProduct.manufacturerId,
      adminApproved: baseProduct.adminApproved,
      description: details.description,
      specifications: details.specifications as Record<string, any>,
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

  async getLocalProducts(filter?: { 
    category?: string, 
    district?: string, 
    availableAreas?: string, 
    deliveryOption?: string,
    status?: string
  }): Promise<LocalProduct[]> {
    return this.listLocalProductViews({
      category: filter?.category,
      district: filter?.district,
      availableAreas: filter?.availableAreas,
      deliveryOption: filter?.deliveryOption,
      status: filter?.status || 'active', // By default only show active products for backward compatibility
      isDraft: false,    // Don't show drafts in the old API
      adminApproved: true // Only approved products for general-purpose API
    });
  }

  async getLocalProductById(id: number): Promise<LocalProduct | undefined> {
    return this.getLocalProductView(id);
  }

  async approveLocalProduct(id: number): Promise<LocalProduct | undefined> {
    // Update the base product to set adminApproved = true
    await db
      .update(localProductBase)
      .set({ adminApproved: true })
      .where(eq(localProductBase.id, id));
    
    // Also set the details status to active if it was pending
    await db
      .update(localProductDetails)
      .set({ status: 'active' })
      .where(eq(localProductDetails.productId, id));
    
    // Return the updated product
    return this.getLocalProductView(id);
  }

  async rejectLocalProduct(id: number, reason?: string): Promise<LocalProduct | undefined> {
    // Set adminApproved = false and status = inactive
    await db
      .update(localProductBase)
      .set({ adminApproved: false })
      .where(eq(localProductBase.id, id));
    
    await db
      .update(localProductDetails)
      .set({ status: 'inactive' })
      .where(eq(localProductDetails.productId, id));
    
    // Return the updated product
    return this.getLocalProductView(id);
  }

  async getPendingLocalProducts(): Promise<LocalProduct[]> {
    // Get products that are not admin approved (regardless of draft status)
    return this.listLocalProductViews({
      adminApproved: false
    });
  }

  async updateLocalProduct(id: number, product: Partial<LocalProduct>): Promise<LocalProduct | undefined> {
    // Extract fields for base product
    const baseFields: Partial<InsertLocalProductBase> = {};
    if (product.name !== undefined) baseFields.name = product.name;
    if (product.category !== undefined) baseFields.category = product.category;
    if (product.manufacturerId !== undefined) baseFields.manufacturerId = product.manufacturerId;
    if (product.adminApproved !== undefined) baseFields.adminApproved = product.adminApproved;
    
    // Extract fields for details
    const detailFields: Partial<UpsertLocalProductDetails> = {};
    if (product.description !== undefined) detailFields.description = product.description;
    if (product.price !== undefined) detailFields.price = product.price;
    if (product.discountedPrice !== undefined) detailFields.discountedPrice = product.discountedPrice;
    if (product.stock !== undefined) detailFields.stock = product.stock;
    if (product.district !== undefined) detailFields.district = product.district;
    if (product.imageUrl !== undefined) detailFields.imageUrl = product.imageUrl;
    if (product.deliveryOption !== undefined) detailFields.deliveryOption = product.deliveryOption as "direct" | "service" | "both";
    if (product.availableAreas !== undefined) detailFields.availableAreas = product.availableAreas;
    if (product.status !== undefined) detailFields.status = product.status as "active" | "inactive" | "pending";
    if (product.isDraft !== undefined) detailFields.isDraft = product.isDraft;
    
    // Update the base product if there are fields to update
    if (Object.keys(baseFields).length > 0) {
      await this.updateLocalProductBase(id, baseFields);
    }
    
    // Find the details record for this product
    const details = await this.getLocalProductDetailsByProductId(id);
    if (!details) return undefined;
    
    // Update the details if there are fields to update
    if (Object.keys(detailFields).length > 0) {
      await this.updateLocalProductDetails(details.id, detailFields);
    }
    
    // Return the updated view
    return this.getLocalProductView(id);
  }

  // Recycling operations
  async createRecyclingRequest(request: InsertRecyclingRequest): Promise<RecyclingRequest> {
    const [newRequest] = await db.insert(recyclingRequests).values({
      ...request,
      createdAt: new Date()
    }).returning();
    return newRequest;
  }

  async getRecyclingRequestsByUserId(userId: number): Promise<RecyclingRequest[]> {
    return await db
      .select()
      .from(recyclingRequests)
      .where(eq(recyclingRequests.userId, userId))
      .orderBy(desc(recyclingRequests.createdAt));
  }

  async getRecyclingRequestsByAgentId(agentId: number): Promise<RecyclingRequest[]> {
    return await db
      .select()
      .from(recyclingRequests)
      .where(eq(recyclingRequests.agentId, agentId))
      .orderBy(desc(recyclingRequests.createdAt));
  }

  async updateRecyclingRequest(id: number, requestData: Partial<RecyclingRequest>): Promise<RecyclingRequest | undefined> {
    const [updatedRequest] = await db
      .update(recyclingRequests)
      .set(requestData)
      .where(eq(recyclingRequests.id, id))
      .returning();
    return updatedRequest;
  }

  // Recycling Material Rate operations
  async createRecyclingMaterialRate(rate: InsertRecyclingMaterialRate): Promise<RecyclingMaterialRate> {
    const [newRate] = await db
      .insert(recyclingMaterialRates)
      .values({
        ...rate,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newRate;
  }

  async getRecyclingMaterialRates(): Promise<RecyclingMaterialRate[]> {
    return await db
      .select()
      .from(recyclingMaterialRates)
      .orderBy(asc(recyclingMaterialRates.materialType));
  }

  async getRecyclingMaterialRate(id: number): Promise<RecyclingMaterialRate | undefined> {
    const [rate] = await db
      .select()
      .from(recyclingMaterialRates)
      .where(eq(recyclingMaterialRates.id, id));
    return rate;
  }

  async updateRecyclingMaterialRate(id: number, rateData: Partial<RecyclingMaterialRate>): Promise<RecyclingMaterialRate | undefined> {
    const [updatedRate] = await db
      .update(recyclingMaterialRates)
      .set({
        ...rateData,
        updatedAt: new Date()
      })
      .where(eq(recyclingMaterialRates.id, id))
      .returning();
    return updatedRate;
  }

  // Commission Configuration operations
  async createCommissionConfig(config: InsertCommissionConfig): Promise<CommissionConfig> {
    const [newConfig] = await db
      .insert(commissionConfigs)
      .values({
        ...config,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newConfig;
  }

  async getCommissionConfig(id: number): Promise<CommissionConfig | undefined> {
    const [config] = await db
      .select()
      .from(commissionConfigs)
      .where(eq(commissionConfigs.id, id));
    return config;
  }

  async getCommissionConfigByService(serviceType: string, provider?: string): Promise<CommissionConfig | undefined> {
    let query = db
      .select()
      .from(commissionConfigs)
      .where(eq(commissionConfigs.serviceType, serviceType))
      .where(eq(commissionConfigs.isActive, true));
    
    if (provider) {
      query = query.where(eq(commissionConfigs.provider, provider));
    }
    
    const [config] = await query;
    return config;
  }

  async updateCommissionConfig(id: number, configData: Partial<CommissionConfig>): Promise<CommissionConfig | undefined> {
    const [updatedConfig] = await db
      .update(commissionConfigs)
      .set({
        ...configData,
        updatedAt: new Date()
      })
      .where(eq(commissionConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  async listCommissionConfigs(): Promise<CommissionConfig[]> {
    return await db
      .select()
      .from(commissionConfigs)
      .orderBy(desc(commissionConfigs.updatedAt));
  }

  // Commission operations
  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [newCommission] = await db
      .insert(commissions)
      .values({
        ...commission,
        createdAt: new Date()
      })
      .returning();
    return newCommission;
  }

  async getCommissionsByUserId(userId: number): Promise<Commission[]> {
    return await db
      .select()
      .from(commissions)
      .where(eq(commissions.userId, userId))
      .orderBy(desc(commissions.createdAt));
  }

  async getCommissionsByServiceType(serviceType: string): Promise<Commission[]> {
    return await db
      .select()
      .from(commissions)
      .where(eq(commissions.serviceType, serviceType))
      .orderBy(desc(commissions.createdAt));
  }

  async updateCommission(id: number, commissionData: Partial<Commission>): Promise<Commission | undefined> {
    const [updatedCommission] = await db
      .update(commissions)
      .set(commissionData)
      .where(eq(commissions.id, id))
      .returning();
    return updatedCommission;
  }
  
  // Commission Transaction operations
  async createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction> {
    const [newTransaction] = await db
      .insert(commissionTransactions)
      .values({
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newTransaction;
  }
  
  async getCommissionTransactionsByUserId(userId: number): Promise<CommissionTransaction[]> {
    return db
      .select()
      .from(commissionTransactions)
      .where(eq(commissionTransactions.userId, userId))
      .orderBy(desc(commissionTransactions.createdAt));
  }
  
  async getCommissionTransactionByServiceType(serviceType: string): Promise<CommissionTransaction[]> {
    return db
      .select()
      .from(commissionTransactions)
      .where(eq(commissionTransactions.serviceType, serviceType))
      .orderBy(desc(commissionTransactions.createdAt));
  }
  
  async updateCommissionTransaction(id: number, transaction: Partial<CommissionTransaction>): Promise<CommissionTransaction | undefined> {
    const [updatedTransaction] = await db
      .update(commissionTransactions)
      .set({
        ...transaction,
        updatedAt: new Date()
      })
      .where(eq(commissionTransactions.id, id))
      .returning();
    return updatedTransaction;
  }
  
  async updateCommissionTransactionStatus(id: number, status: string): Promise<CommissionTransaction | undefined> {
    const [updatedTransaction] = await db
      .update(commissionTransactions)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(commissionTransactions.id, id))
      .returning();
    return updatedTransaction;
  }
  
  async getPendingCommissionTransactions(): Promise<CommissionTransaction[]> {
    return db
      .select()
      .from(commissionTransactions)
      .where(eq(commissionTransactions.status, 'pending'))
      .orderBy(desc(commissionTransactions.createdAt));
  }
  
  async getCommissionTransactionsByReference(serviceType: string, transactionId: number): Promise<CommissionTransaction[]> {
    return db
      .select()
      .from(commissionTransactions)
      .where(
        and(
          eq(commissionTransactions.serviceType, serviceType),
          eq(commissionTransactions.transactionId, transactionId)
        )
      )
      .orderBy(desc(commissionTransactions.createdAt));
  }
  
  // User hierarchy operations for commission calculation
  async getUserByPincodeAndType(pincode: string, userType: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.pincode} = ${pincode} AND ${users.userType} = ${userType}`);
    return user;
  }
  
  async getUserByTalukAndType(district: string, taluk: string, userType: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.district} = ${district} AND ${users.taluk} = ${taluk} AND ${users.userType} = ${userType}`);
    return user;
  }
  
  async getUserByDistrictAndType(district: string, userType: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.district} = ${district} AND ${users.userType} = ${userType}`);
    return user;
  }
  
  async getUserByType(userType: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userType, userType));
    return user;
  }

  // Commission calculation and distribution
  async calculateCommissions(serviceType: string, serviceId: number, amount: number, provider?: string): Promise<void> {
    // Get the commission config for this service type and provider
    const config = await this.getCommissionConfigByService(serviceType, provider);
    if (!config) {
      throw new Error(`No commission configuration found for ${serviceType} ${provider || ''}`);
    }

    // Get the registered user who initiated the transaction
    let registeredUserId: number | null = null;
    let serviceAgentId: number | null = null;

    // For recharge, get the recharge record to find the service agent who processed it and the user who initiated it
    if (serviceType === 'recharge') {
      const [recharge] = await db
        .select()
        .from(recharges)
        .where(eq(recharges.id, serviceId));
      
      if (recharge) {
        serviceAgentId = recharge.processedBy || null;
        registeredUserId = recharge.userId || null;
      }
    }

    if (!serviceAgentId) {
      throw new Error('No service agent found for this transaction');
    }

    // Get the service agent's hierarchy chain (service agent -> taluk manager -> branch manager -> admin)
    const parentChain = await this.getParentChain(serviceAgentId);
    
    // Create a transaction record
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: serviceAgentId,
        amount,
        type: 'credit',
        description: `${serviceType} transaction`,
        serviceType,
        createdAt: new Date()
      })
      .returning();

    // Distribute commissions to each person in the hierarchy
    await this.distributeCommission(
      serviceAgentId, 
      parentChain, 
      transaction.id, 
      serviceType, 
      serviceId, 
      amount, 
      config
    );
    
    // Distribute commission to registered user if applicable
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
  async getParentChain(userId: number): Promise<number[]> {
    const chain: number[] = [];
    let currentUser = await this.getUser(userId);
    
    while (currentUser?.parentId) {
      chain.push(currentUser.parentId);
      currentUser = await this.getUser(currentUser.parentId);
    }
    
    return chain;
  }

  // Distribute commission to each person in the hierarchy
  async distributeCommission(
    serviceAgentId: number, 
    parentChain: number[], 
    transactionId: number, 
    serviceType: string, 
    serviceId: number, 
    originalAmount: number, 
    config: CommissionConfig
  ): Promise<void> {
    // Service Agent commission
    await this.createCommission({
      userId: serviceAgentId,
      userType: 'service_agent',
      serviceType,
      transactionId,
      serviceId,
      originalAmount,
      commissionPercentage: config.serviceAgentCommission,
      commissionAmount: (originalAmount * config.serviceAgentCommission) / 100,
      status: 'credited',
    });

    // Add commission amount to service agent's wallet
    const serviceAgent = await this.getUser(serviceAgentId);
    if (serviceAgent) {
      const commissionAmount = (originalAmount * config.serviceAgentCommission) / 100;
      await this.updateUser(serviceAgentId, {
        walletBalance: (serviceAgent.walletBalance || 0) + commissionAmount
      });
    }

    // If there are parents, distribute to them as well
    if (parentChain.length > 0) {
      // First parent is taluk manager
      const talukManagerId = parentChain[0];
      await this.createCommission({
        userId: talukManagerId,
        userType: 'taluk_manager',
        serviceType,
        transactionId,
        serviceId,
        originalAmount,
        commissionPercentage: config.talukManagerCommission,
        commissionAmount: (originalAmount * config.talukManagerCommission) / 100,
        status: 'credited',
      });

      // Add commission amount to taluk manager's wallet
      const talukManager = await this.getUser(talukManagerId);
      if (talukManager) {
        const commissionAmount = (originalAmount * config.talukManagerCommission) / 100;
        await this.updateUser(talukManagerId, {
          walletBalance: (talukManager.walletBalance || 0) + commissionAmount
        });
      }

      // Second parent is branch manager
      if (parentChain.length > 1) {
        const branchManagerId = parentChain[1];
        await this.createCommission({
          userId: branchManagerId,
          userType: 'branch_manager',
          serviceType,
          transactionId,
          serviceId,
          originalAmount,
          commissionPercentage: config.branchManagerCommission,
          commissionAmount: (originalAmount * config.branchManagerCommission) / 100,
          status: 'credited',
        });

        // Add commission amount to branch manager's wallet
        const branchManager = await this.getUser(branchManagerId);
        if (branchManager) {
          const commissionAmount = (originalAmount * config.branchManagerCommission) / 100;
          await this.updateUser(branchManagerId, {
            walletBalance: (branchManager.walletBalance || 0) + commissionAmount
          });
        }

        // Third parent is admin
        if (parentChain.length > 2) {
          const adminId = parentChain[2];
          await this.createCommission({
            userId: adminId,
            userType: 'admin',
            serviceType,
            transactionId,
            serviceId,
            originalAmount,
            commissionPercentage: config.adminCommission,
            commissionAmount: (originalAmount * config.adminCommission) / 100,
            status: 'credited',
          });

          // Add commission amount to admin's wallet
          const admin = await this.getUser(adminId);
          if (admin) {
            const commissionAmount = (originalAmount * config.adminCommission) / 100;
            await this.updateUser(adminId, {
              walletBalance: (admin.walletBalance || 0) + commissionAmount
            });
          }
        }
      }
    }
  }

  // Distribute commission to registered user
  async distributeRegisteredUserCommission(
    registeredUserId: number,
    transactionId: number,
    serviceType: string,
    serviceId: number,
    originalAmount: number,
    commissionPercentage: number
  ): Promise<void> {
    await this.createCommission({
      userId: registeredUserId,
      userType: 'registered_user',
      serviceType,
      transactionId,
      serviceId,
      originalAmount,
      commissionPercentage,
      commissionAmount: (originalAmount * commissionPercentage) / 100,
      status: 'credited',
    });

    // Add commission amount to registered user's wallet
    const registeredUser = await this.getUser(registeredUserId);
    if (registeredUser) {
      const commissionAmount = (originalAmount * commissionPercentage) / 100;
      await this.updateUser(registeredUserId, {
        walletBalance: (registeredUser.walletBalance || 0) + commissionAmount
      });
    }
  }

  // Service Provider operations
  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    const [newProvider] = await db.insert(serviceProviders).values({
      ...provider,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newProvider;
  }

  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
    return provider;
  }

  async getServiceProviderByUserId(userId: number): Promise<ServiceProvider | undefined> {
    try {
      // Use a simpler approach - select all columns with a WHERE clause
      // Don't need to explicitly select each column which was causing issues
      const result = await db
        .select()
        .from(serviceProviders)
        .where(eq(serviceProviders.userId, userId));
      
      // Handle empty result
      if (!result || result.length === 0) {
        return undefined;
      }
      
      return result[0];
    } catch (error) {
      console.error('Error in getServiceProviderByUserId:', error);
      throw error;
    }
  }

  async updateServiceProvider(id: number, providerData: Partial<ServiceProvider>): Promise<ServiceProvider | undefined> {
    const [updatedProvider] = await db
      .update(serviceProviders)
      .set({
        ...providerData,
        updatedAt: new Date()
      })
      .where(eq(serviceProviders.id, id))
      .returning();
    return updatedProvider;
  }

  async listServiceProviders(filter?: { providerType?: string, status?: string, district?: string }): Promise<ServiceProvider[]> {
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
  async createFarmerDetail(detail: InsertFarmerDetail): Promise<FarmerDetail> {
    const [newDetail] = await db.insert(farmerDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getFarmerDetail(id: number): Promise<FarmerDetail | undefined> {
    const [detail] = await db.select().from(farmerDetails).where(eq(farmerDetails.id, id));
    return detail;
  }

  async getFarmerDetailByProviderId(providerId: number): Promise<FarmerDetail | undefined> {
    const [detail] = await db.select().from(farmerDetails).where(eq(farmerDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateFarmerDetail(id: number, detailData: Partial<FarmerDetail>): Promise<FarmerDetail | undefined> {
    const [updatedDetail] = await db
      .update(farmerDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(farmerDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Manufacturer Detail operations
  async createManufacturerDetail(detail: InsertManufacturerDetail): Promise<ManufacturerDetail> {
    const [newDetail] = await db.insert(manufacturerDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getManufacturerDetail(id: number): Promise<ManufacturerDetail | undefined> {
    const [detail] = await db.select().from(manufacturerDetails).where(eq(manufacturerDetails.id, id));
    return detail;
  }

  async getManufacturerDetailByProviderId(providerId: number): Promise<ManufacturerDetail | undefined> {
    const [detail] = await db.select().from(manufacturerDetails).where(eq(manufacturerDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateManufacturerDetail(id: number, detailData: Partial<ManufacturerDetail>): Promise<ManufacturerDetail | undefined> {
    const [updatedDetail] = await db
      .update(manufacturerDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(manufacturerDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Booking Agent Detail operations
  async createBookingAgentDetail(detail: InsertBookingAgentDetail): Promise<BookingAgentDetail> {
    const [newDetail] = await db.insert(bookingAgentDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getBookingAgentDetail(id: number): Promise<BookingAgentDetail | undefined> {
    const [detail] = await db.select().from(bookingAgentDetails).where(eq(bookingAgentDetails.id, id));
    return detail;
  }

  async getBookingAgentDetailByProviderId(providerId: number): Promise<BookingAgentDetail | undefined> {
    const [detail] = await db.select().from(bookingAgentDetails).where(eq(bookingAgentDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateBookingAgentDetail(id: number, detailData: Partial<BookingAgentDetail>): Promise<BookingAgentDetail | undefined> {
    const [updatedDetail] = await db
      .update(bookingAgentDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(bookingAgentDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Taxi Provider operations
  async createTaxiProviderDetail(detail: InsertTaxiProviderDetail): Promise<TaxiProviderDetail> {
    const [newDetail] = await db.insert(taxiProviderDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getTaxiProviderDetail(id: number): Promise<TaxiProviderDetail | undefined> {
    const [detail] = await db.select().from(taxiProviderDetails).where(eq(taxiProviderDetails.id, id));
    return detail;
  }

  async getTaxiProviderDetailByProviderId(providerId: number): Promise<TaxiProviderDetail | undefined> {
    const [detail] = await db.select().from(taxiProviderDetails).where(eq(taxiProviderDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateTaxiProviderDetail(id: number, detailData: Partial<TaxiProviderDetail>): Promise<TaxiProviderDetail | undefined> {
    const [updatedDetail] = await db
      .update(taxiProviderDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(taxiProviderDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Transportation Agent operations
  async createTransportationAgentDetail(detail: InsertTransportationAgentDetail): Promise<TransportationAgentDetail> {
    const [newDetail] = await db.insert(transportationAgentDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getTransportationAgentDetail(id: number): Promise<TransportationAgentDetail | undefined> {
    const [detail] = await db.select().from(transportationAgentDetails).where(eq(transportationAgentDetails.id, id));
    return detail;
  }

  async getTransportationAgentDetailByProviderId(providerId: number): Promise<TransportationAgentDetail | undefined> {
    const [detail] = await db.select().from(transportationAgentDetails).where(eq(transportationAgentDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateTransportationAgentDetail(id: number, detailData: Partial<TransportationAgentDetail>): Promise<TransportationAgentDetail | undefined> {
    const [updatedDetail] = await db
      .update(transportationAgentDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(transportationAgentDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Rental Provider operations
  async createRentalProviderDetail(detail: InsertRentalProviderDetail): Promise<RentalProviderDetail> {
    const [newDetail] = await db.insert(rentalProviderDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getRentalProviderDetail(id: number): Promise<RentalProviderDetail | undefined> {
    const [detail] = await db.select().from(rentalProviderDetails).where(eq(rentalProviderDetails.id, id));
    return detail;
  }

  async getRentalProviderDetailByProviderId(providerId: number): Promise<RentalProviderDetail | undefined> {
    const [detail] = await db.select().from(rentalProviderDetails).where(eq(rentalProviderDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateRentalProviderDetail(id: number, detailData: Partial<RentalProviderDetail>): Promise<RentalProviderDetail | undefined> {
    const [updatedDetail] = await db
      .update(rentalProviderDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(rentalProviderDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Recycling Agent operations
  async createRecyclingAgentDetail(detail: InsertRecyclingAgentDetail): Promise<RecyclingAgentDetail> {
    const [newDetail] = await db.insert(recyclingAgentDetails).values({
      ...detail,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newDetail;
  }

  async getRecyclingAgentDetail(id: number): Promise<RecyclingAgentDetail | undefined> {
    const [detail] = await db.select().from(recyclingAgentDetails).where(eq(recyclingAgentDetails.id, id));
    return detail;
  }

  async getRecyclingAgentDetailByProviderId(providerId: number): Promise<RecyclingAgentDetail | undefined> {
    const [detail] = await db.select().from(recyclingAgentDetails).where(eq(recyclingAgentDetails.serviceProviderId, providerId));
    return detail;
  }

  async updateRecyclingAgentDetail(id: number, detailData: Partial<RecyclingAgentDetail>): Promise<RecyclingAgentDetail | undefined> {
    const [updatedDetail] = await db
      .update(recyclingAgentDetails)
      .set({
        ...detailData,
        updatedAt: new Date()
      })
      .where(eq(recyclingAgentDetails.id, id))
      .returning();
    return updatedDetail;
  }

  // Manager Application operations
  async createManagerApplication(application: InsertManagerApplication): Promise<ManagerApplication> {
    const [newApplication] = await db
      .insert(managerApplications)
      .values({
        ...application,
        status: "pending",
        notes: null,
        approvedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newApplication;
  }

  async getManagerApplication(id: number): Promise<ManagerApplication | undefined> {
    const [application] = await db
      .select()
      .from(managerApplications)
      .where(eq(managerApplications.id, id));
    return application;
  }

  async getManagerApplications(filter?: { status?: string, managerType?: string }): Promise<ManagerApplication[]> {
    let query = db.select().from(managerApplications);
    
    if (filter?.status) {
      query = query.where(eq(managerApplications.status, filter.status));
    }
    
    if (filter?.managerType) {
      query = query.where(eq(managerApplications.managerType, filter.managerType));
    }
    
    return await query.orderBy(desc(managerApplications.createdAt));
  }

  async updateManagerApplication(id: number, applicationData: Partial<ManagerApplication>): Promise<ManagerApplication | undefined> {
    const [updatedApplication] = await db
      .update(managerApplications)
      .set({
        ...applicationData,
        updatedAt: new Date()
      })
      .where(eq(managerApplications.id, id))
      .returning();
    return updatedApplication;
  }

  // Chat operations
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [newConversation] = await db
      .insert(chatConversations)
      .values(conversation)
      .returning();
    return newConversation;
  }
  
  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.id, id));
    return conversation;
  }
  
  async addUserToConversation(member: InsertChatConversationMember): Promise<ChatConversationMember> {
    const [newMember] = await db
      .insert(chatConversationMembers)
      .values(member)
      .returning();
    return newMember;
  }
  
  async removeUserFromConversation(conversationId: number, userId: number): Promise<void> {
    await db
      .update(chatConversationMembers)
      .set({ leftAt: new Date() })
      .where(
        and(
          eq(chatConversationMembers.conversationId, conversationId),
          eq(chatConversationMembers.userId, userId),
          isNull(chatConversationMembers.leftAt)
        )
      );
  }
  
  async getUserConversations(userId: number): Promise<ChatConversation[]> {
    // Get all conversations where the user is a member and hasn't left
    const conversationMembers = await db
      .select()
      .from(chatConversationMembers)
      .where(
        and(
          eq(chatConversationMembers.userId, userId),
          isNull(chatConversationMembers.leftAt)
        )
      );
    
    // Get the conversation details for each membership
    const conversationIds = conversationMembers.map(member => member.conversationId);
    
    if (conversationIds.length === 0) {
      return [];
    }
    
    return await db
      .select()
      .from(chatConversations)
      .where(inArray(chatConversations.id, conversationIds))
      .orderBy(desc(chatConversations.updatedAt));
  }
  
  async getConversationMembers(conversationId: number): Promise<User[]> {
    // Get all active members of a conversation
    const members = await db
      .select({
        userId: chatConversationMembers.userId
      })
      .from(chatConversationMembers)
      .where(
        and(
          eq(chatConversationMembers.conversationId, conversationId),
          isNull(chatConversationMembers.leftAt)
        )
      );
    
    const memberIds = members.map(member => member.userId);
    
    if (memberIds.length === 0) {
      return [];
    }
    
    // Get user details for each member
    return await db
      .select()
      .from(users)
      .where(inArray(users.id, memberIds));
  }
  
  async getConversationMembersWithDetails(conversationId: number): Promise<ChatConversationMember[]> {
    return await db
      .select()
      .from(chatConversationMembers)
      .where(
        and(
          eq(chatConversationMembers.conversationId, conversationId),
          isNull(chatConversationMembers.leftAt)
        )
      );
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    
    // Update the conversation's updatedAt timestamp
    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, message.conversationId));
    
    return newMessage;
  }
  
  async getMessagesForConversation(conversationId: number, limit: number = 50, before?: number): Promise<ChatMessage[]> {
    let query = db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
    
    if (before) {
      query = query.where(lt(chatMessages.id, before));
    }
    
    return await query;
  }
  
  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    // Get all messages in the conversation
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId));
    
    // Update each message's readBy array to include the user if not already there
    for (const message of messages) {
      const readBy = message.readBy as number[];
      
      if (!readBy.includes(userId)) {
        await db
          .update(chatMessages)
          .set({
            readBy: [...readBy, userId],
            status: 'read'
          })
          .where(eq(chatMessages.id, message.id));
      }
    }
  }

  // Enhanced Service Provider Methods for Classification System
  async getAllServiceProviders(): Promise<any[]> {
    try {
      const providers = await db.select()
        .from(serviceProviders)
        .leftJoin(users, eq(serviceProviders.userId, users.id))
        .orderBy(desc(serviceProviders.createdAt));
      
      // Map the results to the expected format
      return providers.map(row => ({
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
        username: row.users?.username || '',
        fullName: row.users?.fullName || ''
      }));
    } catch (error) {
      console.error("Error in getAllServiceProviders:", error);
      throw error;
    }
  }

  async updateServiceProviderStatus(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(serviceProviders)
      .set(updates)
      .where(eq(serviceProviders.id, id))
      .returning();
    return updated;
  }

  async getProviderProductCategories(providerType: string): Promise<any[]> {
    const categories = await db.select()
      .from(providerProductCategories)
      .where(eq(providerProductCategories.providerType, providerType))
      .orderBy(asc(providerProductCategories.categoryName));
    
    return categories;
  }

  async createProviderProduct(product: any): Promise<any> {
    const [created] = await db.insert(providerProducts)
      .values(product)
      .returning();
    return created;
  }

  async getProviderProducts(providerId: number): Promise<any[]> {
    const products = await db.select()
      .from(providerProducts)
      .where(eq(providerProducts.providerId, providerId))
      .orderBy(desc(providerProducts.createdAt));
    
    return products;
  }

  async getApprovedProviderProducts(): Promise<any[]> {
    const products = await db.select()
      .from(providerProducts)
      .where(eq(providerProducts.adminApproved, true))
      .orderBy(desc(providerProducts.createdAt));
    
    return products;
  }

  // Local Product Categories operations
  async getLocalProductCategories(): Promise<LocalProductCategory[]> {
    return await db
      .select()
      .from(localProductCategories)
      .where(eq(localProductCategories.isActive, true))
      .orderBy(asc(localProductCategories.displayOrder));
  }

  async createLocalProductCategory(category: InsertLocalProductCategory): Promise<LocalProductCategory> {
    const [newCategory] = await db
      .insert(localProductCategories)
      .values({
        ...category,
        createdAt: new Date()
      })
      .returning();
    return newCategory;
  }

  async getLocalProductCategory(id: number): Promise<LocalProductCategory | undefined> {
    const [category] = await db
      .select()
      .from(localProductCategories)
      .where(eq(localProductCategories.id, id));
    return category;
  }

  async updateLocalProductCategory(id: number, category: Partial<LocalProductCategory>): Promise<LocalProductCategory | undefined> {
    const [updatedCategory] = await db
      .update(localProductCategories)
      .set(category)
      .where(eq(localProductCategories.id, id))
      .returning();
    return updatedCategory;
  }

  // Local Product Subcategories operations  
  async getLocalProductSubcategories(): Promise<LocalProductSubCategory[]> {
    return await db
      .select()
      .from(localProductSubCategories)
      .where(eq(localProductSubCategories.isActive, true))
      .orderBy(asc(localProductSubCategories.displayOrder));
  }

  async createLocalProductSubcategory(subcategory: InsertLocalProductSubCategory): Promise<LocalProductSubCategory> {
    const [newSubcategory] = await db
      .insert(localProductSubCategories)
      .values({
        ...subcategory,
        createdAt: new Date()
      })
      .returning();
    return newSubcategory;
  }

  async getLocalProductSubcategory(id: number): Promise<LocalProductSubCategory | undefined> {
    const [subcategory] = await db
      .select()
      .from(localProductSubCategories)
      .where(eq(localProductSubCategories.id, id));
    return subcategory;
  }

  async updateLocalProductSubcategory(id: number, subcategory: Partial<LocalProductSubCategory>): Promise<LocalProductSubCategory | undefined> {
    const [updatedSubcategory] = await db
      .update(localProductSubCategories)
      .set(subcategory)
      .where(eq(localProductSubCategories.id, id))
      .returning();
    return updatedSubcategory;
  }

  // Local Product Cart operations
  async addToLocalProductCart(userId: number, productId: number, quantity: number): Promise<void> {
    await db
      .insert(localProductCart)
      .values({
        userId,
        productId,
        quantity,
        createdAt: new Date()
      })
      .onConflictDoUpdate({
        target: [localProductCart.userId, localProductCart.productId],
        set: {
          quantity: sql`${localProductCart.quantity} + ${quantity}`,
          updatedAt: new Date()
        }
      });
  }

  async getLocalProductCartItems(userId: number): Promise<any[]> {
    const items = await db
      .select({
        productId: localProductCart.productId,
        quantity: localProductCart.quantity,
        productName: localProductBase.name,
        price: localProductDetails.price,
        discountedPrice: localProductDetails.discountedPrice,
        imageUrl: localProductDetails.imageUrl,
        stock: localProductDetails.stock
      })
      .from(localProductCart)
      .leftJoin(localProductBase, eq(localProductCart.productId, localProductBase.id))
      .leftJoin(localProductDetails, eq(localProductBase.id, localProductDetails.productId))
      .where(eq(localProductCart.userId, userId));
    
    return items;
  }

  async getLocalProductCartItem(userId: number, productId: number): Promise<any | undefined> {
    const [item] = await db
      .select()
      .from(localProductCart)
      .where(
        and(
          eq(localProductCart.userId, userId),
          eq(localProductCart.productId, productId)
        )
      );
    return item;
  }

  async updateLocalProductCartItem(userId: number, productId: number, quantity: number): Promise<void> {
    await db
      .update(localProductCart)
      .set({
        quantity,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(localProductCart.userId, userId),
          eq(localProductCart.productId, productId)
        )
      );
  }

  async removeFromLocalProductCart(userId: number, productId: number): Promise<void> {
    await db
      .delete(localProductCart)
      .where(
        and(
          eq(localProductCart.userId, userId),
          eq(localProductCart.productId, productId)
        )
      );
  }

  async clearLocalProductCart(userId: number): Promise<void> {
    await db
      .delete(localProductCart)
      .where(eq(localProductCart.userId, userId));
  }

  // Local Product Orders operations
  async createLocalProductOrder(order: any): Promise<any> {
    const [newOrder] = await db
      .insert(localProductOrders)
      .values({
        ...order,
        createdAt: new Date()
      })
      .returning();
    return newOrder;
  }

  async createLocalProductOrderItem(orderItem: any): Promise<any> {
    const [newOrderItem] = await db
      .insert(localProductOrderItems)
      .values(orderItem)
      .returning();
    return newOrderItem;
  }

  async getLocalProductOrdersByUser(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(localProductOrders)
      .where(eq(localProductOrders.userId, userId))
      .orderBy(desc(localProductOrders.createdAt));
  }

  // Delivery management operations
  // Admin operations
  async createDeliveryCategory(category: InsertDeliveryCategory): Promise<DeliveryCategory> {
    const [newCategory] = await db
      .insert(deliveryCategories)
      .values({
        ...category,
        createdAt: new Date()
      })
      .returning();
    return newCategory;
  }

  async getDeliveryCategories(): Promise<DeliveryCategory[]> {
    return await db
      .select()
      .from(deliveryCategories)
      .where(eq(deliveryCategories.isActive, true))
      .orderBy(asc(deliveryCategories.name));
  }

  async getDeliveryCategory(id: number): Promise<DeliveryCategory | undefined> {
    const [category] = await db
      .select()
      .from(deliveryCategories)
      .where(eq(deliveryCategories.id, id));
    return category;
  }

  async updateDeliveryCategory(id: number, category: Partial<DeliveryCategory>): Promise<DeliveryCategory | undefined> {
    const [updatedCategory] = await db
      .update(deliveryCategories)
      .set({
        ...category,
        updatedAt: new Date()
      })
      .where(eq(deliveryCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteDeliveryCategory(id: number): Promise<void> {
    await db
      .delete(deliveryCategories)
      .where(eq(deliveryCategories.id, id));
  }

  // Taxi category operations
  async createTaxiCategory(category: InsertTaxiCategory): Promise<TaxiCategory> {
    const [newCategory] = await db
      .insert(taxiCategories)
      .values({
        ...category,
        createdAt: new Date()
      })
      .returning();
    return newCategory;
  }

  async getTaxiCategories(): Promise<TaxiCategory[]> {
    return await db
      .select()
      .from(taxiCategories)
      .where(eq(taxiCategories.isActive, true))
      .orderBy(asc(taxiCategories.name));
  }

  async getTaxiCategory(id: number): Promise<TaxiCategory | undefined> {
    const [category] = await db
      .select()
      .from(taxiCategories)
      .where(eq(taxiCategories.id, id));
    return category;
  }

  async updateTaxiCategory(id: number, category: Partial<TaxiCategory>): Promise<TaxiCategory | undefined> {
    const [updatedCategory] = await db
      .update(taxiCategories)
      .set({
        ...category,
        updatedAt: new Date()
      })
      .where(eq(taxiCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteTaxiCategory(id: number): Promise<void> {
    await db
      .delete(taxiCategories)
      .where(eq(taxiCategories.id, id));
  }

  // Service provider operations
  async registerDeliveryAgent(agent: InsertDeliveryAgent): Promise<DeliveryAgent> {
    const [newAgent] = await db
      .insert(deliveryAgents)
      .values({
        ...agent,
        createdAt: new Date()
      })
      .returning();
    return newAgent;
  }

  async getDeliveryAgentByUserId(userId: number): Promise<DeliveryAgent | undefined> {
    const [agent] = await db
      .select()
      .from(deliveryAgents)
      .where(eq(deliveryAgents.userId, userId));
    return agent;
  }

  async getDeliveryAgentsForApproval(): Promise<DeliveryAgent[]> {
    return await db
      .select()
      .from(deliveryAgents)
      .where(eq(deliveryAgents.adminApproved, false))
      .orderBy(desc(deliveryAgents.createdAt));
  }

  async getAllDeliveryAgents(): Promise<DeliveryAgent[]> {
    return await db
      .select()
      .from(deliveryAgents)
      .orderBy(desc(deliveryAgents.createdAt));
  }

  async getApprovedDeliveryAgents(): Promise<DeliveryAgent[]> {
    return await db
      .select()
      .from(deliveryAgents)
      .where(eq(deliveryAgents.adminApproved, true))
      .orderBy(desc(deliveryAgents.createdAt));
  }

  async approveDeliveryAgent(id: number, approved: boolean): Promise<DeliveryAgent | undefined> {
    const [updatedAgent] = await db
      .update(deliveryAgents)
      .set({
        adminApproved: approved,
        verificationStatus: approved ? "verified" : "rejected",
        updatedAt: new Date()
      })
      .where(eq(deliveryAgents.id, id))
      .returning();
    return updatedAgent;
  }

  async updateDeliveryAgent(id: number, agent: Partial<DeliveryAgent>): Promise<DeliveryAgent | undefined> {
    const [updatedAgent] = await db
      .update(deliveryAgents)
      .set({
        ...agent,
        updatedAt: new Date()
      })
      .where(eq(deliveryAgents.id, id))
      .returning();
    return updatedAgent;
  }

  async getDeliveryAgentsByLocation(district: string, taluk?: string, pincode?: string): Promise<DeliveryAgent[]> {
    let whereConditions = [
      eq(deliveryAgents.adminApproved, true),
      eq(deliveryAgents.isOnline, true),
      eq(deliveryAgents.isAvailable, true)
    ];

    // Filter by location in operation areas
    if (district) {
      whereConditions.push(sql`operation_areas::text LIKE ${`%${district}%`}`);
    }

    if (taluk) {
      whereConditions.push(sql`operation_areas::text LIKE ${`%${taluk}%`}`);
    }

    if (pincode) {
      whereConditions.push(sql`operation_areas::text LIKE ${`%${pincode}%`}`);
    }

    return await db
      .select()
      .from(deliveryAgents)
      .where(and(...whereConditions))
      .orderBy(desc(deliveryAgents.rating));
  }

  async updateDeliveryAgentStatus(id: number, isOnline: boolean, isAvailable: boolean): Promise<DeliveryAgent | undefined> {
    const [updatedAgent] = await db
      .update(deliveryAgents)
      .set({
        isOnline,
        isAvailable,
        updatedAt: new Date()
      })
      .where(eq(deliveryAgents.id, id))
      .returning();
    return updatedAgent;
  }

  // Customer operations
  async createDeliveryOrder(order: InsertDeliveryOrder): Promise<DeliveryOrder> {
    // The database schema doesn't have order_number column, so we omit it
    const [newOrder] = await db
      .insert(deliveryOrders)
      .values({
        ...order,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newOrder;
  }

  async getDeliveryOrdersByCustomerId(customerId: number): Promise<DeliveryOrder[]> {
    return await db
      .select()
      .from(deliveryOrders)
      .where(eq(deliveryOrders.customerId, customerId))
      .orderBy(desc(deliveryOrders.createdAt));
  }

  async getDeliveryOrdersByAgentId(agentId: number): Promise<DeliveryOrder[]> {
    return await db
      .select()
      .from(deliveryOrders)
      .where(eq(deliveryOrders.agent_id, agentId))
      .orderBy(desc(deliveryOrders.createdAt));
  }

  async getDeliveryOrder(id: number): Promise<DeliveryOrder | undefined> {
    const [order] = await db
      .select()
      .from(deliveryOrders)
      .where(eq(deliveryOrders.id, id));
    return order;
  }

  async updateDeliveryOrder(id: number, order: Partial<DeliveryOrder>): Promise<DeliveryOrder | undefined> {
    const [updatedOrder] = await db
      .update(deliveryOrders)
      .set({
        ...order,
        updatedAt: new Date()
      })
      .where(eq(deliveryOrders.id, id))
      .returning();
    return updatedOrder;
  }

  async assignDeliveryOrder(orderId: number, agentId: number): Promise<DeliveryOrder | undefined> {
    const [assignedOrder] = await db
      .update(deliveryOrders)
      .set({
        agentId,
        status: "assigned",
        updatedAt: new Date()
      })
      .where(eq(deliveryOrders.id, orderId))
      .returning();
    return assignedOrder;
  }

  // Taxi category operations
  async createTaxiCategory(category: InsertTaxiCategory): Promise<TaxiCategory> {
    const [newCategory] = await db
      .insert(taxiCategories)
      .values({
        ...category,
        createdAt: new Date()
      })
      .returning();
    return newCategory;
  }

  async getTaxiCategories(): Promise<TaxiCategory[]> {
    return await db
      .select()
      .from(taxiCategories)
      .orderBy(taxiCategories.name);
  }

  async getTaxiCategory(id: number): Promise<TaxiCategory | undefined> {
    const [category] = await db
      .select()
      .from(taxiCategories)
      .where(eq(taxiCategories.id, id));
    return category;
  }

  async updateTaxiCategory(id: number, category: Partial<TaxiCategory>): Promise<TaxiCategory | undefined> {
    const [updatedCategory] = await db
      .update(taxiCategories)
      .set({
        ...category,
        updatedAt: new Date()
      })
      .where(eq(taxiCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteTaxiCategory(id: number): Promise<void> {
    await db
      .delete(taxiCategories)
      .where(eq(taxiCategories.id, id));
  }

  // Taxi vehicle operations
  async createTaxiVehicle(vehicle: any): Promise<any> {
    const [newVehicle] = await db
      .insert(taxiVehicles)
      .values({
        ...vehicle,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newVehicle;
  }

  async getTaxiVehicle(id: number): Promise<any> {
    const [vehicle] = await db
      .select()
      .from(taxiVehicles)
      .where(eq(taxiVehicles.id, id));
    return vehicle;
  }

  async getTaxiVehiclesByProvider(providerId: number): Promise<any[]> {
    return await db
      .select()
      .from(taxiVehicles)
      .where(eq(taxiVehicles.providerId, providerId));
  }

  async updateTaxiVehicle(id: number, vehicle: any): Promise<any> {
    const [updatedVehicle] = await db
      .update(taxiVehicles)
      .set({
        ...vehicle,
        updatedAt: new Date()
      })
      .where(eq(taxiVehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async getAvailableTaxiVehicles(filters: any): Promise<any[]> {
    const query = db.select().from(taxiVehicles);
    return await query.where(eq(taxiVehicles.adminApproved, true));
  }

  async getAllTaxiVehicles(): Promise<any[]> {
    return await db
      .select()
      .from(taxiVehicles)
      .orderBy(desc(taxiVehicles.createdAt));
  }

  async getApprovedTaxiVehicles(): Promise<any[]> {
    return await db
      .select()
      .from(taxiVehicles)
      .where(eq(taxiVehicles.adminApproved, true))
      .orderBy(desc(taxiVehicles.createdAt));
  }

  async getTaxiVehiclesWithProviders(): Promise<any[]> {
    const vehicles = await db
      .select({
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
        providerUserId: serviceProviders.userId,
      })
      .from(taxiVehicles)
      .leftJoin(serviceProviders, eq(taxiVehicles.providerId, serviceProviders.id))
      .leftJoin(users, eq(serviceProviders.userId, users.id))
      .orderBy(desc(taxiVehicles.createdAt));

    // Transform the flat structure to include nested provider object
    return vehicles.map(vehicle => ({
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
        adminApproved: vehicle.providerAdminApproved,
      } : null
    }));
  }

  async getTaxiCategories(): Promise<any[]> {
    try {
      return await db
        .select()
        .from(taxiCategories)
        .where(eq(taxiCategories.isActive, true))
        .orderBy(asc(taxiCategories.name));
    } catch (error) {
      console.log('Using fallback taxi categories');
      return [
        { id: 1, name: 'Two Wheeler', description: 'Motorcycles and scooters', isActive: true, baseFarePerKm: 8, baseWaitingCharge: 2 },
        { id: 2, name: 'Three Wheeler', description: 'Auto rickshaws', isActive: true, baseFarePerKm: 12, baseWaitingCharge: 3 },
        { id: 3, name: '4 Seaters', description: 'Compact cars', isActive: true, baseFarePerKm: 15, baseWaitingCharge: 5 },
        { id: 4, name: '6 Seaters', description: 'SUVs and larger cars', isActive: true, baseFarePerKm: 18, baseWaitingCharge: 7 },
        { id: 5, name: '12 Seaters', description: 'Mini buses and tempo travelers', isActive: true, baseFarePerKm: 25, baseWaitingCharge: 10 }
      ];
    }
  }

  async getTaluksByDistrict(district: string): Promise<string[]> {
    const results = await db
      .selectDistinct({ taluk: serviceProviders.taluk })
      .from(serviceProviders)
      .where(and(
        eq(serviceProviders.district, district),
        isNotNull(serviceProviders.taluk)
      ))
      .orderBy(asc(serviceProviders.taluk));
    
    return results.map(r => r.taluk).filter(Boolean);
  }

  async getPincodesByDistrictAndTaluk(district: string, taluk: string): Promise<string[]> {
    const results = await db
      .selectDistinct({ pincode: serviceProviders.pincode })
      .from(serviceProviders)
      .where(and(
        eq(serviceProviders.district, district),
        eq(serviceProviders.taluk, taluk),
        isNotNull(serviceProviders.pincode)
      ))
      .orderBy(asc(serviceProviders.pincode));
    
    return results.map(r => r.pincode).filter(Boolean);
  }

  async getTaxiVehiclesForApproval(): Promise<any[]> {
    return await db
      .select()
      .from(taxiVehicles)
      .where(eq(taxiVehicles.adminApproved, false))
      .orderBy(desc(taxiVehicles.createdAt));
  }

  async approveTaxiVehicle(id: number, approved: boolean): Promise<any> {
    const [updatedVehicle] = await db
      .update(taxiVehicles)
      .set({
        adminApproved: approved,
        updatedAt: new Date()
      })
      .where(eq(taxiVehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async updateTaxiVehicleStatus(id: number, isActive: boolean): Promise<any> {
    const [updatedVehicle] = await db
      .update(taxiVehicles)
      .set({
        isActive: isActive,
        updatedAt: new Date()
      })
      .where(eq(taxiVehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  // Taxi booking operations
  async createTaxiBooking(booking: any): Promise<any> {
    const [newBooking] = await db
      .insert(taxiBookings)
      .values({
        ...booking,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newBooking;
  }

  async getTaxiBooking(id: number): Promise<any> {
    const [booking] = await db
      .select()
      .from(taxiBookings)
      .where(eq(taxiBookings.id, id));
    return booking;
  }

  async getTaxiBookingsByCustomer(customerId: number): Promise<any[]> {
    return await db
      .select()
      .from(taxiBookings)
      .where(eq(taxiBookings.customerId, customerId));
  }

  async getTaxiBookingsByProvider(providerId: number): Promise<any[]> {
    return await db
      .select()
      .from(taxiBookings)
      .where(eq(taxiBookings.providerId, providerId));
  }

  async updateTaxiBookingStatus(id: number, status: string, providerId: number): Promise<any> {
    const [updatedBooking] = await db
      .update(taxiBookings)
      .set({
        status,
        providerId,
        updatedAt: new Date()
      })
      .where(eq(taxiBookings.id, id))
      .returning();
    return updatedBooking;
  }

  async getAllTaxiBookings(): Promise<any[]> {
    return await db
      .select()
      .from(taxiBookings)
      .orderBy(desc(taxiBookings.createdAt));
  }

  // Taxi category operations implementation
  async createTaxiCategory(category: InsertTaxiCategory): Promise<TaxiCategory> {
    const [newCategory] = await db.insert(taxiCategories).values({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newCategory;
  }

  async getTaxiCategories(): Promise<TaxiCategory[]> {
    return await db.select().from(taxiCategories).orderBy(asc(taxiCategories.name));
  }

  async getTaxiCategory(id: number): Promise<TaxiCategory | undefined> {
    const [category] = await db.select().from(taxiCategories).where(eq(taxiCategories.id, id));
    return category;
  }

  async updateTaxiCategory(id: number, category: Partial<TaxiCategory>): Promise<TaxiCategory | undefined> {
    const [updatedCategory] = await db
      .update(taxiCategories)
      .set({
        ...category,
        updatedAt: new Date()
      })
      .where(eq(taxiCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteTaxiCategory(id: number): Promise<void> {
    await db.delete(taxiCategories).where(eq(taxiCategories.id, id));
  }

  // Taxi service provider operations implementation
  async getTaxiProviders(): Promise<ServiceProvider[]> {
    return await db.select().from(serviceProviders)
      .where(eq(serviceProviders.providerType, "taxi_service"))
      .orderBy(desc(serviceProviders.createdAt));
  }

  async updateServiceProviderStatus(id: number, status: string): Promise<ServiceProvider | undefined> {
    const [updatedProvider] = await db
      .update(serviceProviders)
      .set({
        status: status,
        updatedAt: new Date()
      })
      .where(eq(serviceProviders.id, id))
      .returning();
    return updatedProvider;
  }

  // Taxi vehicle operations implementation
  async getTaxiVehicles(): Promise<TaxiVehicle[]> {
    return await db.select().from(taxiVehicles).orderBy(desc(taxiVehicles.createdAt));
  }

  async createTaxiVehicle(vehicle: InsertTaxiVehicle): Promise<TaxiVehicle> {
    const [newVehicle] = await db.insert(taxiVehicles).values({
      ...vehicle,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newVehicle;
  }

  async approveTaxiVehicle(id: number): Promise<TaxiVehicle | undefined> {
    const [updatedVehicle] = await db
      .update(taxiVehicles)
      .set({
        adminApproved: true,
        updatedAt: new Date()
      })
      .where(eq(taxiVehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  // Taxi booking operations implementation
  async createTaxiBooking(booking: InsertTaxiBooking): Promise<TaxiBooking> {
    const [newBooking] = await db.insert(taxiBookings).values({
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newBooking;
  }

  // Service Request Management System Implementation
  async createServiceRequest(serviceRequest: InsertServiceRequest): Promise<ServiceRequest> {
    console.log("STORAGE DEBUG - Service request data received:", serviceRequest);
    console.log("STORAGE DEBUG - userId specifically:", serviceRequest.userId);
    console.log("STORAGE DEBUG - serviceRequest type:", typeof serviceRequest.userId);
    
    // Validate that userId is present and valid
    if (!serviceRequest.userId || serviceRequest.userId <= 0) {
      throw new Error(`Invalid userId provided: ${serviceRequest.userId}`);
    }
    
    // Ensure amount is a valid number string for database
    const amount = typeof serviceRequest.amount === 'string' 
      ? serviceRequest.amount 
      : String(serviceRequest.amount);
    
    const insertData = {
      srNumber: serviceRequest.srNumber,
      userId: Number(serviceRequest.userId),
      serviceType: serviceRequest.serviceType,
      amount: amount,
      status: serviceRequest.status || "new",
      paymentStatus: serviceRequest.paymentStatus || "pending",
      paymentMethod: serviceRequest.paymentMethod || "razorpay",
      serviceData: serviceRequest.serviceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("STORAGE DEBUG - Final insert data:", insertData);
    console.log("STORAGE DEBUG - Final insert userId type and value:", typeof insertData.userId, insertData.userId);
    
    const [newRequest] = await db.insert(serviceRequests).values(insertData).returning();
    console.log("STORAGE DEBUG - Created service request:", newRequest);
    return newRequest;
  }

  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
    return request;
  }

  async getServiceRequestByNumber(srNumber: string): Promise<ServiceRequest | undefined> {
    const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.srNumber, srNumber));
    return request;
  }

  async getServiceRequestsByCustomer(customerId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.userId, customerId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
  }

  async assignServiceRequestStakeholder(
    serviceRequestId: number, 
    stakeholderType: string, 
    stakeholderId: number
  ): Promise<ServiceRequest | undefined> {
    const updateData: any = {};
    
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

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(serviceRequests)
      .set(updateData)
      .where(eq(serviceRequests.id, serviceRequestId))
      .returning();

    return updated;
  }

  async getServiceRequestsByAgent(agentId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.pincodeAgentId, agentId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByManager(managerId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.talukManagerId, managerId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByBranchManager(branchManagerId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.branchManagerId, branchManagerId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByProvider(providerId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.assignedTo, providerId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByAgent(agentId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.assignedAgentId, agentId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByManager(managerId: number, managerType: 'taluk' | 'branch'): Promise<ServiceRequest[]> {
    const managerField = managerType === 'taluk' ? serviceRequests.talukManagerId : serviceRequests.branchManagerId;
    return await db.select().from(serviceRequests)
      .where(eq(managerField, managerId))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByDistrict(district: string): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.district, district))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestsByStatus(status: string): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests)
      .where(eq(serviceRequests.status, status))
      .orderBy(desc(serviceRequests.createdAt));
  }

  async updateServiceRequestStatus(id: number, newStatus: string, updatedBy: number, reason?: string, notes?: string): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({
        status: newStatus,
        updatedAt: new Date()
      })
      .where(eq(serviceRequests.id, id))
      .returning();

    if (updatedRequest) {
      // Create status update record
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

  async updateServiceRequestPayment(id: number, paymentId: string, paymentStatus: string): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({
        paymentId,
        paymentStatus,
        updatedAt: new Date()
      })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async assignServiceRequestToAgent(id: number, agentId: number): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({
        assignedAgentId: agentId,
        updatedAt: new Date()
      })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  // Service Request Status Updates
  async createServiceRequestStatusUpdate(update: InsertServiceRequestStatusUpdate): Promise<ServiceRequestStatusUpdate> {
    const [newUpdate] = await db.insert(serviceRequestStatusUpdates).values({
      ...update,
      createdAt: new Date()
    }).returning();
    return newUpdate;
  }

  async getServiceRequestStatusHistory(serviceRequestId: number): Promise<ServiceRequestStatusUpdate[]> {
    return await db.select().from(serviceRequestStatusUpdates)
      .where(eq(serviceRequestStatusUpdates.serviceRequestId, serviceRequestId))
      .orderBy(desc(serviceRequestStatusUpdates.createdAt));
  }

  // Service Request Commission Management
  async createServiceRequestCommissionTransaction(commission: InsertServiceRequestCommissionTransaction): Promise<ServiceRequestCommissionTransaction> {
    const [newCommission] = await db.insert(serviceRequestCommissionTransactions).values({
      ...commission,
      createdAt: new Date()
    }).returning();
    return newCommission;
  }

  async getServiceRequestCommissions(serviceRequestId: number): Promise<ServiceRequestCommissionTransaction[]> {
    return await db.select().from(serviceRequestCommissionTransactions)
      .where(eq(serviceRequestCommissionTransactions.serviceRequestId, serviceRequestId))
      .orderBy(desc(serviceRequestCommissionTransactions.createdAt));
  }

  async distributeServiceRequestCommissions(serviceRequestId: number): Promise<ServiceRequestCommissionTransaction[]> {
    // Implementation for commission distribution logic
    // This would calculate and distribute commissions to stakeholders
    const serviceRequest = await this.getServiceRequest(serviceRequestId);
    if (!serviceRequest) return [];

    const commissions: ServiceRequestCommissionTransaction[] = [];
    const totalAmount = serviceRequest.amount;
    
    // Calculate commission for each stakeholder (example rates)
    const commissionRates = {
      agent: 0.02, // 2%
      talukManager: 0.01, // 1%
      branchManager: 0.005, // 0.5%
      admin: 0.005 // 0.5%
    };

    // Create commission transactions for each stakeholder
    if (serviceRequest.assignedAgentId) {
      const agentCommission = await this.createServiceRequestCommissionTransaction({
        serviceRequestId,
        userId: serviceRequest.assignedAgentId,
        userType: 'agent',
        amount: totalAmount * commissionRates.agent,
        commissionRate: commissionRates.agent,
        status: 'pending'
      });
      commissions.push(agentCommission);
    }

    if (serviceRequest.talukManagerId) {
      const talukCommission = await this.createServiceRequestCommissionTransaction({
        serviceRequestId,
        userId: serviceRequest.talukManagerId,
        userType: 'taluk_manager',
        amount: totalAmount * commissionRates.talukManager,
        commissionRate: commissionRates.talukManager,
        status: 'pending'
      });
      commissions.push(talukCommission);
    }

    if (serviceRequest.branchManagerId) {
      const branchCommission = await this.createServiceRequestCommissionTransaction({
        serviceRequestId,
        userId: serviceRequest.branchManagerId,
        userType: 'branch_manager',
        amount: totalAmount * commissionRates.branchManager,
        commissionRate: commissionRates.branchManager,
        status: 'pending'
      });
      commissions.push(branchCommission);
    }

    return commissions;
  }

  // Service Request Notifications
  async createServiceRequestNotification(notification: InsertServiceRequestNotification): Promise<ServiceRequestNotification> {
    const [newNotification] = await db.insert(serviceRequestNotifications).values({
      ...notification,
      createdAt: new Date()
    }).returning();
    return newNotification;
  }

  async getServiceRequestNotificationsByUser(userId: number): Promise<ServiceRequestNotification[]> {
    return await db.select().from(serviceRequestNotifications)
      .where(eq(serviceRequestNotifications.userId, userId))
      .orderBy(desc(serviceRequestNotifications.createdAt));
  }

  async markServiceRequestNotificationAsRead(id: number): Promise<void> {
    await db.update(serviceRequestNotifications)
      .set({ isRead: true })
      .where(eq(serviceRequestNotifications.id, id));
  }

  // Auto-generate SR Number
  async generateServiceRequestNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Count requests created today
    const startOfDay = new Date(year, today.getMonth(), today.getDate());
    const endOfDay = new Date(year, today.getMonth(), today.getDate() + 1);
    
    const count = await db.select().from(serviceRequests)
      .where(and(
        sql`${serviceRequests.createdAt} >= ${startOfDay}`,
        sql`${serviceRequests.createdAt} < ${endOfDay}`
      ));
    
    const sequence = String(count.length + 1).padStart(4, '0');
    return `SR${year}${month}${day}${sequence}`;
  }

  // ===== VIDEO MANAGEMENT OPERATIONS =====
  
  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values({
      ...video,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0
    }).returning();
    return newVideo;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getVideosByUploader(uploaderId: number): Promise<Video[]> {
    return await db.select().from(videos)
      .where(eq(videos.uploadedBy, uploaderId))
      .orderBy(desc(videos.createdAt));
  }

  async getVideosByCategory(category: string): Promise<Video[]> {
    return await db.select().from(videos)
      .where(and(
        eq(videos.category, category),
        eq(videos.status, 'active')
      ))
      .orderBy(desc(videos.createdAt));
  }

  async getAllVideos(limit: number = 20, offset: number = 0): Promise<Video[]> {
    return await db.select().from(videos)
      .where(eq(videos.status, 'active'))
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getPublicVideos(limit: number = 20, offset: number = 0): Promise<Video[]> {
    return await db.select().from(videos)
      .where(and(
        eq(videos.isPublic, true),
        eq(videos.status, 'active')
      ))
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updateVideo(id: number, updates: Partial<Video>): Promise<Video | undefined> {
    const [updatedVideo] = await db.update(videos)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo || undefined;
  }

  async deleteVideo(id: number): Promise<void> {
    // First delete related video views
    await db.delete(videoViews).where(eq(videoViews.videoId, id));
    
    // Then delete the video
    await db.delete(videos).where(eq(videos.id, id));
  }

  async incrementVideoViews(id: number): Promise<void> {
    await db.update(videos)
      .set({ 
        viewCount: sql`${videos.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(videos.id, id));
  }

  // Video View operations
  async createVideoView(view: InsertVideoView): Promise<VideoView> {
    const [newView] = await db.insert(videoViews).values({
      ...view,
      viewedAt: new Date()
    }).returning();
    return newView;
  }

  async getVideoViews(videoId: number): Promise<VideoView[]> {
    return await db.select().from(videoViews)
      .where(eq(videoViews.videoId, videoId))
      .orderBy(desc(videoViews.viewedAt));
  }

  async getUserVideoViews(userId: number): Promise<VideoView[]> {
    return await db.select().from(videoViews)
      .where(eq(videoViews.userId, userId))
      .orderBy(desc(videoViews.viewedAt));
  }

  // Application Management Operations
  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByStatus(status: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.status, status))
      .orderBy(desc(applications.appliedAt));
  }

  async getAllApplications(): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .orderBy(desc(applications.appliedAt));
  }

  async updateApplication(id: number, updates: Partial<Application>): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async getApplicationsByRole(roleType: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.roleType, roleType))
      .orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByLocation(district: string, taluk?: string, pincode?: string): Promise<Application[]> {
    let whereConditions = [eq(applications.district, district)];
    
    if (taluk) {
      whereConditions.push(eq(applications.taluk, taluk));
    }
    
    if (pincode) {
      whereConditions.push(eq(applications.pincode, pincode));
    }

    return await db
      .select()
      .from(applications)
      .where(and(...whereConditions))
      .orderBy(desc(applications.appliedAt));
  }

  // Opportunities Forum Operations
  async getDistricts(): Promise<string[]> {
    // Get distinct districts from existing users data
    const result = await db
      .selectDistinct({ district: users.district })
      .from(users)
      .where(isNotNull(users.district))
      .orderBy(users.district);
    
    return result.map(r => r.district).filter(Boolean);
  }

  async getTaluksByDistrict(district: string): Promise<{name: string}[]> {
    // Get distinct taluks for the district from existing data
    const result = await db
      .selectDistinct({ taluk: users.taluk })
      .from(users)
      .where(and(
        eq(users.district, district),
        isNotNull(users.taluk)
      ))
      .orderBy(users.taluk);
    
    return result.map(r => ({ name: r.taluk })).filter(r => r.name);
  }

  async getPincodesByTaluk(taluk: string, district: string): Promise<string[]> {
    // Get distinct pincodes for the taluk and district from existing data
    const result = await db
      .selectDistinct({ pincode: users.pincode })
      .from(users)
      .where(and(
        eq(users.district, district),
        eq(users.taluk, taluk),
        isNotNull(users.pincode)
      ))
      .orderBy(users.pincode);
    
    return result.map(r => r.pincode).filter(Boolean);
  }

  async createNomination(nomination: InsertNomination): Promise<Nomination> {
    const [newNomination] = await db
      .insert(nominations)
      .values(nomination)
      .returning();
    
    return newNomination;
  }

  async getNominations(): Promise<Nomination[]> {
    return await db
      .select()
      .from(nominations)
      .orderBy(desc(nominations.createdAt));
  }

  async updateNominationStatus(id: number, status: string, adminResponse: string, reviewedBy: number): Promise<Nomination | undefined> {
    const [updatedNomination] = await db
      .update(nominations)
      .set({
        status,
        adminResponse,
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(nominations.id, id))
      .returning();
    
    return updatedNomination;
  }

  async getAllNominations(): Promise<Nomination[]> {
    return await db
      .select()
      .from(nominations)
      .orderBy(desc(nominations.submittedAt));
  }

  async getApprovedNominations(): Promise<Nomination[]> {
    return await db
      .select()
      .from(nominations)
      .where(eq(nominations.status, "approved"))
      .orderBy(desc(nominations.submittedAt));
  }

  async updateNominationOtpVerified(phoneNumber: string): Promise<void> {
    await db
      .update(nominations)
      .set({ otpVerified: true })
      .where(eq(nominations.phoneNumber, phoneNumber));
  }

  async linkNominationToUser(id: number, userId: number, profilePhoto: string): Promise<Nomination | undefined> {
    const [updatedNomination] = await db
      .update(nominations)
      .set({ userId, profilePhoto })
      .where(eq(nominations.id, id))
      .returning();
    
    return updatedNomination;
  }

  async createOtpVerification(otpData: InsertOtpVerification): Promise<OtpVerification> {
    const [newOtp] = await db
      .insert(otpVerifications)
      .values(otpData)
      .returning();
    
    return newOtp;
  }

  async verifyOtp(phoneNumber: string, otp: string, purpose: string): Promise<boolean> {
    const [verification] = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.phoneNumber, phoneNumber),
          eq(otpVerifications.otp, otp),
          eq(otpVerifications.purpose, purpose),
          eq(otpVerifications.verified, false)
        )
      )
      .orderBy(desc(otpVerifications.createdAt))
      .limit(1);

    if (!verification || verification.expiresAt < new Date()) {
      return false;
    }

    // Mark as verified
    await db
      .update(otpVerifications)
      .set({ verified: true })
      .where(eq(otpVerifications.id, verification.id));

    return true;
  }

  async createPublicMessage(messageData: InsertPublicMessage): Promise<PublicMessage> {
    const [newMessage] = await db
      .insert(publicMessages)
      .values(messageData)
      .returning();
    
    return newMessage;
  }

  async getPublicMessages(nominationId: number): Promise<PublicMessage[]> {
    return await db
      .select()
      .from(publicMessages)
      .where(eq(publicMessages.nominationId, nominationId))
      .orderBy(asc(publicMessages.createdAt));
  }

  // Bus Booking Operations
  async createBusBooking(booking: any): Promise<any> {
    const [newBooking] = await db
      .insert(busBookings)
      .values({
        ...booking,
        bookingDate: new Date()
      })
      .returning();
    return newBooking;
  }

  async getBusBooking(id: number): Promise<any> {
    const [booking] = await db
      .select()
      .from(busBookings)
      .where(eq(busBookings.id, id));
    return booking;
  }

  async getBusBookingsByUserId(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(busBookings)
      .where(eq(busBookings.userId, userId))
      .orderBy(desc(busBookings.bookingDate));
  }

  async getAllBusBookings(): Promise<any[]> {
    return await db
      .select()
      .from(busBookings)
      .orderBy(desc(busBookings.bookingDate));
  }

  async updateBusBooking(id: number, updates: any): Promise<any> {
    const [updatedBooking] = await db
      .update(busBookings)
      .set(updates)
      .where(eq(busBookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Flight Booking Operations
  async createFlightBooking(booking: any): Promise<any> {
    const [newBooking] = await db
      .insert(flightBookings)
      .values({
        ...booking,
        bookingDate: new Date()
      })
      .returning();
    return newBooking;
  }

  async getFlightBooking(id: number): Promise<any> {
    const [booking] = await db
      .select()
      .from(flightBookings)
      .where(eq(flightBookings.id, id));
    return booking;
  }

  async getFlightBookingsByUserId(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(flightBookings)
      .where(eq(flightBookings.userId, userId))
      .orderBy(desc(flightBookings.bookingDate));
  }

  async getAllFlightBookings(): Promise<any[]> {
    return await db
      .select()
      .from(flightBookings)
      .orderBy(desc(flightBookings.bookingDate));
  }

  async updateFlightBooking(id: number, updates: any): Promise<any> {
    const [updatedBooking] = await db
      .update(flightBookings)
      .set(updates)
      .where(eq(flightBookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Hotel Booking Operations
  async createHotelBooking(booking: any): Promise<any> {
    const [newBooking] = await db
      .insert(hotelBookings)
      .values({
        ...booking,
        bookingDate: new Date()
      })
      .returning();
    return newBooking;
  }

  async getHotelBooking(id: number): Promise<any> {
    const [booking] = await db
      .select()
      .from(hotelBookings)
      .where(eq(hotelBookings.id, id));
    return booking;
  }

  async getHotelBookingsByUserId(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(hotelBookings)
      .where(eq(hotelBookings.userId, userId))
      .orderBy(desc(hotelBookings.bookingDate));
  }

  async getAllHotelBookings(): Promise<any[]> {
    return await db
      .select()
      .from(hotelBookings)
      .orderBy(desc(hotelBookings.bookingDate));
  }

  async updateHotelBooking(id: number, updates: any): Promise<any> {
    const [updatedBooking] = await db
      .update(hotelBookings)
      .set(updates)
      .where(eq(hotelBookings.id, id))
      .returning();
    return updatedBooking;
  }

  async distributeBusCommissions(bookingId: number, userId: number, commissionStructure: any): Promise<void> {
    // Create commission records for each level
    for (const [role, amount] of Object.entries(commissionStructure)) {
      if (amount > 0) {
        await this.createCommission({
          userId: userId,
          amount: amount as number,
          type: 'bus_commission',
          description: `Bus booking commission - ${role}`,
          serviceType: 'bus_booking',
          serviceId: bookingId,
          status: 'pending'
        });
      }
    }
  }
}

export const storage = new DatabaseStorage();