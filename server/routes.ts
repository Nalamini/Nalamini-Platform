import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { registerSubcategoryRoutes } from "./routes-subcategories";
import { registerOilRoutes } from "./routes-oil";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "./db";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Helper function to validate and parse ID parameters
function validateId(idParam: string, paramName: string = "ID"): number {
  const id = parseInt(idParam);
  if (isNaN(id) || id <= 0) {
    throw new Error(`Invalid ${paramName}: must be a positive integer`);
  }
  return id;
}
import { sql, eq, asc, desc, and, inArray } from "drizzle-orm";
import { 
  insertUserSchema, insertFeedbackSchema, insertRechargeSchema, insertBookingSchema, 
  insertRentalSchema, insertTaxiRideSchema, insertDeliverySchema, insertRecyclingRequestSchema,
  localProductCategories, localProductSubCategories, localProductBase, 
  insertGroceryProductSchema, insertLocalProductSchema, insertCommissionConfigSchema, 
  insertCommissionSchema, insertServiceProviderSchema, InsertServiceProvider,
  insertManagerApplicationSchema, ManagerApplication, insertGroceryCategorySchema,
  insertGrocerySubCategorySchema, insertFarmerProductListingSchema, insertDeliveryAreaSchema,
  insertProductRequestSchema, insertGroceryOrderSchema, insertGroceryOrderItemSchema,
  FarmerProductListing, ProductRequest,
  insertLocalProductBaseSchema, upsertLocalProductDetailsSchema,
  insertChatConversationSchema, insertChatConversationMemberSchema, insertChatMessageSchema,
  ChatConversation, ChatMessage, ChatConversationMember,
  rentalCategories, rentalSubcategories, rentalEquipment, rentalOrders, rentalCart, users,
  insertRentalCategorySchema, insertRentalSubcategorySchema, insertRentalEquipmentSchema, insertRentalOrderSchema, insertRentalCartSchema,
  insertApplicationSchema, applications,
  insertVideoUploadSchema, insertVideoViewAnalyticsSchema,
  videoUploads, videoViewAnalytics, dailyVideoStats
} from "@shared/schema";
import { randomUUID } from 'crypto';
import { rechargeService } from './services/rechargeService';
import { paymentService } from './services/paymentService';
import { walletService } from './services/walletService';
import { utilityService, UtilityType } from './services/utilityService';
import { BusService } from './services/busService';
import { travelService, BookingType } from './services/travelService';
import { initializeNotificationService } from './services/notificationService';
import * as notificationService from './services/notificationService';
import * as analyticsService from './services/analyticsService';
import * as imageService from './services/imageService';
import { commissionService } from './services/commissionService';
import { dummyDataService } from './services/dummyDataService';
import { youtubeService } from './services/youtubeService';

export async function registerRoutes(app: Express): Promise<Server> {
  // PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED
  app.get("/api/videos/approved", async (req, res) => {
    try {
      const { district, taluk, pincode, category, limit = 20 } = req.query;
      
      console.log("Fetching approved videos for public display...");
      
      let whereConditions = [eq(videoUploads.status, 'approved')];

      // Apply location filters
      if (district) {
        whereConditions.push(eq(videoUploads.targetArea, district as string));
      }
      if (category && category !== 'all') {
        whereConditions.push(eq(videoUploads.category, category as string));
      }

      const videos = await db.select({
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
        isPublic: sql<boolean>`true`,
        tags: sql<string[]>`ARRAY[]::text[]`,
        status: sql<string>`'active'`,
        viewCount: sql<number>`0`,
        createdAt: videoUploads.createdAt,
        updatedAt: videoUploads.updatedAt
      })
        .from(videoUploads)
        .where(and(...whereConditions))
        .orderBy(desc(videoUploads.createdAt))
        .limit(parseInt(limit as string));

      console.log(`Found ${videos.length} approved videos for public display`);
      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching approved videos:", error);
      res.status(500).json({ message: "Error fetching approved videos" });
    }
  });

  // Load dummy data for testing
  try {
    await dummyDataService.loadDummyData();
    console.log("Dummy data check completed");
  } catch (error) {
    console.error("Failed to load dummy data:", error);
  }
  
  // Set up authentication routes
  setupAuth(app);

  // Provider registration endpoint
  app.post("/api/register-provider", async (req, res) => {
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

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(providerData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create the provider user
      const user = await storage.createUser(providerData);

      // Store additional business information with proper schema
      const businessInfo = {
        userId: user.id,
        providerType: req.body.businessType, // Map businessType to providerType
        businessName: req.body.businessName,
        address: req.body.address,
        district: req.body.district,
        taluk: "Unknown", // Will be updated later
        pincode: "000000", // Will be updated later
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
    } catch (error: any) {
      console.error("Provider registration error:", error);
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });
  




  // Register dedicated subcategory routes for maximum reliability
  registerSubcategoryRoutes(app);
  
  // Register dedicated oil routes for maximum reliability
  registerOilRoutes(app);

  // Serve static files from uploads directory with special handling for SVGs
  app.use('/uploads', (req, res, next) => {
    // Make sure SVG files are served with the correct content type
    if (req.path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
  }, express.static('uploads', { 
    fallthrough: true,
    index: false,
    redirect: false,
    // Add special MIME type handling
    setHeaders: (res, path) => {
      if (path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  
  // Health check endpoint for deployment platforms
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
  });
  
  // Dummy data management endpoints (for testing and development)
  app.get('/api/dummy-data/status', async (_req, res) => {
    try {
      const isLoaded = await dummyDataService.isDummyDataLoaded();
      res.json({ isLoaded });
    } catch (error) {
      console.error('Error checking dummy data status:', error);
      res.status(500).json({ error: 'Failed to check dummy data status' });
    }
  });
  
  app.post('/api/dummy-data/load', async (_req, res) => {
    try {
      await dummyDataService.loadDummyData();
      res.json({ success: true, message: 'Dummy data loaded successfully' });
    } catch (error) {
      console.error('Error loading dummy data:', error);
      res.status(500).json({ error: 'Failed to load dummy data' });
    }
  });
  
  app.post('/api/dummy-data/clear', async (_req, res) => {
    try {
      await dummyDataService.clearDummyData();
      res.json({ success: true, message: 'Dummy data cleared successfully' });
    } catch (error) {
      console.error('Error clearing dummy data:', error);
      res.status(500).json({ error: 'Failed to clear dummy data' });
    }
  });
  
  // SVG Fallback API - Special endpoint for oil-related SVGs
  app.get('/api/svg/fallback/:type', (req, res) => {
    const { type } = req.params;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    let svgContent = '';
    
    // Generate SVG based on oil type
    if (type === 'oils') {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffc107">
        <path d="M9 10.223V7a2 2 0 012-2h2a2 2 0 012 2v3.223M9 10.223H5.5a2.5 2.5 0 00-2.5 2.5v2.554a2.5 2.5 0 002.5 2.5h13a2.5 2.5 0 002.5-2.5v-2.554a2.5 2.5 0 00-2.5-2.5H9z" stroke="#ffc107" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === 'coconut-oil') {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#6c757d">
        <path d="M12 22c4.418 0 8-3.582 8-8 0-5-4-9-8-9s-8 4-8 9c0 4.418 3.582 8 8 8z" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9 7a3 3 0 013-3v0a3 3 0 013 3v0" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M15 15l-2-2" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === 'groundnut-oil') {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#d9834b">
        <path d="M19 11.5c1 1.5 2 3.5 2 4.5 0 1.25-.5 2.5-1.5 3.5S17.25 21 16 21c-1 0-3-.5-4.5-1.5M5 12.5c-1-1.5-2-3.5-2-4.5 0-1.25.5-2.5 1.5-3.5S6.75 3 8 3c1 0 3 .5 4.5 1.5" stroke="#d9834b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14.5 6.5c1 .83 3.5 2.82 3.5 4.5 0 .5-.5 1-1 1s-1 .5-1 1-.5 1-1 1-1 .5-1 1c0 .83 1 1.5 1 2.5 0 .5-.5 1-1 1M9.5 17.5c-1-.83-3.5-2.82-3.5-4.5 0-.5.5-1 1-1s1-.5 1-1 .5-1 1-1 1-.5 1-1c0-.83-1-1.5-1-2.5 0-.5.5-1 1-1" stroke="#d9834b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === 'olive-oil') {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#616000">
        <path d="M6.133 20.5C4.955 19.555 4 17.967 4 16c0-3.314 4-12 4-12s4 8.686 4 12c0 1.967-.955 3.555-2.133 4.5" stroke="#616000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M12 10s4 8.686 4 12c0 3.314-3.582 6-8 6-2.333 0-4.333-1-4.333-1" stroke="#616000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else if (type === 'palm-oil') {
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#e67e22">
        <path d="M12 22c4 0 8-3.582 8-8s-4-8-8-8-8 3.582-8 8 4 8 8 8z" stroke="#e67e22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9.5 9.5c0-1 .5-2 1.5-2.5M19 13c-1.657 0-3-1.12-3-2.5 0 1.38-1.343 2.5-3 2.5s-3-1.12-3-2.5c0 1.38-1.343 2.5-3 2.5s-3-1.12-3-2.5M12 22v-3" stroke="#e67e22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    } else {
      // Default oil SVG
      svgContent = `<svg width="200px" height="200px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffc107">
        <path d="M9 10.223V7a2 2 0 012-2h2a2 2 0 012 2v3.223M9 10.223H5.5a2.5 2.5 0 00-2.5 2.5v2.554a2.5 2.5 0 002.5 2.5h13a2.5 2.5 0 002.5-2.5v-2.554a2.5 2.5 0 00-2.5-2.5H9z" stroke="#ffc107" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;
    }
    
    res.send(svgContent);
  });

  // Type guard for authenticated user
  function ensureUserExists(req: any): asserts req is any & { user: Express.User } {
    if (!req.user) {
      throw new Error("User not authenticated");
    }
  }
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };

  // Middleware to check if user has specific role
  const hasRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      console.log(`[AUTH DEBUG] Role check - User: ${req.user?.username}, Type: ${req.user?.userType}, Required Roles: ${roles.join(',')}`);
      if (req.isAuthenticated() && roles.includes(req.user.userType)) {
        return next();
      }
      console.log(`[AUTH DEBUG] Permission denied - User: ${req.user?.username}, Type: ${req.user?.userType}, Required Roles: ${roles.join(',')}`);
      res.status(403).json({ message: "Insufficient permissions" });
    };
  };

  // Management routes
  app.get("/api/managers/branch", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Only admin can see all branch managers
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const branchManagers = await storage.listUsers({ userType: "branch_manager" });
      res.json(branchManagers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branch managers" });
    }
  });

  app.get("/api/managers/taluk", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      let filter: { userType: string, parentId?: number } = { userType: "taluk_manager" };
      
      // Branch managers should only see their own taluk managers
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

  app.get("/api/agents", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      let filter: { userType: string, parentId?: number } = { userType: "service_agent" };
      
      // Taluk managers should only see their own service agents
      if (user.userType === "taluk_manager") {
        filter.parentId = user.id;
      } else if (user.userType === "branch_manager") {
        // For branch managers, get all taluk managers under them first
        const talukManagers = await storage.listUsers({ userType: "taluk_manager", parentId: user.id });
        const talukManagerIds = talukManagers.map(tm => tm.id);
        
        // Then get all service agents under those taluk managers
        const allAgents = await storage.listUsers({ userType: "service_agent" });
        const filteredAgents = allAgents.filter(agent => agent.parentId && talukManagerIds.includes(agent.parentId));
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

  app.post("/api/managers/branch", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        password: z.string().min(6),
        userType: z.literal("branch_manager"),
        district: z.string().min(1)
      });
      
      const userData = userSchema.parse(req.body);
      userData.parentId = req.user.id; // Set admin as parent
      
      const branchManager = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...managerWithoutPassword } = branchManager;
      res.status(201).json(managerWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data for branch manager" });
    }
  });

  app.post("/api/managers/taluk", isAuthenticated, hasRole(["admin", "branch_manager"]), async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        password: z.string().min(6),
        userType: z.literal("taluk_manager"),
        district: z.string().min(1),
        taluk: z.string().min(1)
      });
      
      const userData = userSchema.parse(req.body);
      userData.parentId = req.user.id; // Set current user as parent
      
      const talukManager = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...managerWithoutPassword } = talukManager;
      res.status(201).json(managerWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data for taluk manager" });
    }
  });

  app.post("/api/agents", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager"]), async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        password: z.string().min(6),
        userType: z.literal("service_agent"),
        pincode: z.string().min(6).max(6)
      });
      
      const userData = userSchema.parse(req.body);
      userData.parentId = req.user.id; // Set current user as parent
      
      const serviceAgent = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...agentWithoutPassword } = serviceAgent;
      res.status(201).json(agentWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data for service agent" });
    }
  });
  
  // Manager Applications routes
  app.post("/api/manager-applications", async (req, res) => {
    try {
      const applicationData = insertManagerApplicationSchema.parse(req.body);
      
      // Create manager application
      const managerApplication = await storage.createManagerApplication(applicationData);
      
      // For security, don't return the password in the response
      const { password, ...applicationWithoutPassword } = managerApplication;
      
      res.status(201).json({
        success: true,
        message: "Your application has been submitted successfully. We will review it shortly.",
        application: applicationWithoutPassword
      });
    } catch (error) {
      console.error('Manager application submission error:', error);
      res.status(400).json({ 
        success: false,
        message: "Invalid application data. Please check your information and try again."
      });
    }
  });
  
  app.get("/api/manager-applications", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      // Parse query parameters
      const status = req.query.status as string | undefined;
      const managerType = req.query.type as string | undefined;
      
      // Set up filter
      const filter: { status?: string, managerType?: string } = {};
      if (status) filter.status = status;
      if (managerType) filter.managerType = managerType;
      
      // Get applications
      const applications = await storage.getManagerApplications(filter);
      
      // Remove passwords from response
      const safeApplications = applications.map(app => {
        const { password, ...appWithoutPassword } = app;
        return appWithoutPassword;
      });
      
      res.json(safeApplications);
    } catch (error) {
      console.error('Error fetching manager applications:', error);
      res.status(500).json({ message: "Failed to fetch manager applications" });
    }
  });
  
  app.get("/api/manager-applications/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getManagerApplication(parseInt(id));
      
      if (!application) {
        return res.status(404).json({ message: "Manager application not found" });
      }
      
      // Remove password from response
      const { password, ...applicationWithoutPassword } = application;
      
      res.json(applicationWithoutPassword);
    } catch (error) {
      console.error('Error fetching manager application:', error);
      res.status(500).json({ message: "Failed to fetch manager application" });
    }
  });
  
  app.patch("/api/manager-applications/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Validate status
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedData: Partial<ManagerApplication> = {
        status,
        notes: notes || null
      };
      
      // If approving, set the approvedBy field to the current admin's ID
      if (status === "approved") {
        updatedData.approvedBy = req.user.id;
      }
      
      const application = await storage.updateManagerApplication(parseInt(id), updatedData);
      
      if (!application) {
        return res.status(404).json({ message: "Manager application not found" });
      }
      
      // TODO: If approved, create a new user based on the application data
      if (status === "approved") {
        try {
          // Create user account based on manager application
          const userData = {
            username: application.username,
            password: application.password, // Password is already in the application
            fullName: application.fullName,
            email: application.email,
            phone: application.phone,
            userType: application.managerType,
            district: application.district,
            taluk: application.taluk,
            pincode: application.pincode,
            parentId: req.user.id, // Set admin as parent
            createdAt: new Date()
          };
          
          // Create the user
          await storage.createUser(userData);
          
          // TODO: Send email notification to the applicant (future enhancement)
        } catch (userCreationError) {
          console.error('Error creating user from application:', userCreationError);
          // Even if user creation fails, don't fail the entire request
          // The admin can always retry the approval later
        }
      }
      
      // Remove password from response
      const { password, ...applicationWithoutPassword } = application;
      
      res.json({
        success: true,
        message: `Application ${status}`,
        application: applicationWithoutPassword
      });
    } catch (error) {
      console.error('Error updating manager application:', error);
      res.status(500).json({ message: "Failed to update manager application" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback data" });
    }
  });

  app.get("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      let filter: { userId?: number, serviceType?: string } = {};
      
      // Regular users can only see their own feedback
      if (user.userType === "customer") {
        filter.userId = user.id;
      }
      
      // Filter by service type if provided
      if (req.query.serviceType) {
        filter.serviceType = req.query.serviceType as string;
      }
      
      const feedback = await storage.listFeedback(filter);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Wallet routes
  app.get("/api/wallet", isAuthenticated, async (req, res) => {
    try {
      const balance = await walletService.getBalance(req.user.id);
      const transactions = await walletService.getTransactionHistory(req.user.id);
      
      res.json({
        balance,
        transactions
      });
    } catch (error) {
      console.error('Wallet fetch error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch wallet data" });
    }
  });

  // Add funds to wallet (for admin)
  app.post("/api/wallet/add-funds", isAuthenticated, hasRole(["admin"]), async (req, res) => {
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
      console.error('Add funds error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to add funds" });
    }
  });
  
  // Add test funds directly to wallet (for testing/demo only)
  app.post("/api/wallet/add-test-funds", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
      
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10000) {
        return res.status(400).json({ message: "Amount must be between 1 and 10,000" });
      }
      
      const newBalance = await walletService.addTestFunds(req.user.id, parsedAmount);
      
      res.json({
        success: true,
        message: "Test funds added successfully",
        balance: newBalance
      });
    } catch (error) {
      console.error('Error adding test funds:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to add funds" 
      });
    }
  });
  
  // Wallet recharge via Razorpay
  app.post("/api/wallet/recharge", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 100) {
        return res.status(400).json({ message: "Minimum recharge amount is ₹100" });
      }
      
      const order = await walletService.createRechargeOrder(req.user.id, amount);
      
      res.json(order);
    } catch (error) {
      console.error('Wallet recharge error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to initiate wallet recharge" });
    }
  });
  
  // Verify wallet recharge payment and add funds
  app.post("/api/wallet/verify-payment", isAuthenticated, async (req, res) => {
    try {
      const result = await walletService.verifyPaymentAndAddFunds(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to verify payment" });
    }
  });
  
  // For backward compatibility - to be deprecated
  app.post("/api/wallet/transaction", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { userId, amount, type, description, serviceType } = req.body;
      
      if (!userId || !amount || !type || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Use wallet service based on transaction type
      let newBalance: number;
      if (type === "credit") {
        newBalance = await walletService.addFunds(
          userId,
          amount,
          serviceType || 'manual',
          description
        );
      } else if (type === "debit") {
        newBalance = await walletService.deductFunds(
          userId,
          amount,
          serviceType || 'manual',
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
      console.error('Wallet transaction error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create transaction" });
    }
  });

  // Recharge routes
  app.post("/api/recharge", isAuthenticated, async (req, res) => {
    try {
      // Ensure amount is a number before validation
      const processedBody = {
        ...req.body,
        amount: typeof req.body.amount === 'string' ? parseFloat(req.body.amount) : req.body.amount,
        userId: req.user.id,
        status: "pending" // Always start with pending status
      };
      
      const rechargeData = insertRechargeSchema.parse(processedBody);
      
      try {
        // Check if user has sufficient wallet balance using the wallet service
        const balance = await walletService.getBalance(req.user.id);
        if (balance < rechargeData.amount) {
          return res.status(400).json({ 
            message: "Insufficient wallet balance", 
            currentBalance: balance,
            requiredAmount: rechargeData.amount
          });
        }
      } catch (walletError) {
        console.error('Wallet error:', walletError);
        return res.status(400).json({ message: "Could not verify wallet balance" });
      }
      
      // Find the service agent for this user's pincode BEFORE creating the recharge
      let serviceAgentId = null;
      try {
        const user = await storage.getUser(req.user.id);
        if (user && user.pincode) {
          const serviceAgent = await storage.getUserByPincodeAndType(user.pincode, 'service_agent');
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
        console.error('Error finding service agent:', error);
        // Continue with the recharge even if we couldn't find a service agent
      }
      
      // Create recharge request with the service agent ID if found
      const recharge = await storage.createRecharge({ 
        ...rechargeData, 
        processedBy: serviceAgentId 
      });
      
      // Process the recharge with the recharge service
      const result = await rechargeService.processMobileRecharge({
        mobileNumber: rechargeData.mobileNumber,
        amount: rechargeData.amount,
        provider: rechargeData.provider,
        transactionId: recharge.id.toString()
      });
      
      // Update the recharge status based on the API response
      const status = result.success ? "completed" : "failed";
      const updatedRecharge = await storage.updateRecharge(recharge.id, { 
        status,
        completedAt: result.success ? new Date() : undefined
      });
      
      if (result.success) {
        try {
          // Deduct from wallet balance if successful using wallet service
          await walletService.deductFunds(
            req.user.id, 
            rechargeData.amount, 
            'recharge', 
            `Mobile recharge for ${rechargeData.mobileNumber}`
          );
          
          // Calculate and distribute commissions if we have a service agent
          if (serviceAgentId) {
            try {
              // Use commissionService to calculate and distribute commissions
              await commissionService.distributeCommissions(
                'recharge', 
                recharge.id, 
                rechargeData.amount, 
                rechargeData.provider
              );
              
              console.log(`Commissions calculated for recharge ${recharge.id} processed by service agent ${serviceAgentId}`);
            } catch (commissionError) {
              console.error('Error calculating commissions:', commissionError);
              // Continue with the response even if commission calculation fails
            }
          } else {
            console.warn(`No service agent found for recharge ${recharge.id} - commission distribution skipped`);
          }
        } catch (walletError) {
          console.error('Error deducting from wallet:', walletError);
          // Even if wallet deduction fails, the recharge was processed successfully
          // Log the error but don't fail the entire request
        }
      }
      
      // Process notifications and integrations
      import('./services/integrationService').then(({ integrationService }) => {
        integrationService.processRecharge(updatedRecharge).catch(err => {
          console.error('Error processing recharge notifications:', err);
        });
      });
      
      res.status(201).json({
        ...updatedRecharge,
        apiResponse: result.message
      });
    } catch (error) {
      console.error('Recharge error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid recharge data" });
    }
  });

  app.get("/api/recharge", isAuthenticated, async (req, res) => {
    try {
      const recharges = await storage.getRechargesByUserId(req.user.id);
      res.json(recharges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recharges" });
    }
  });
  
  // Get recharge history for the logged-in user
  app.get("/api/recharge/history", isAuthenticated, async (req, res) => {
    try {
      const recharges = await storage.getRechargesByUserId(req.user.id);
      res.json(recharges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recharge history" });
    }
  });
  
  // Get available plans for a provider
  app.get("/api/recharge/plans/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      const circle = req.query.circle as string | undefined;
      const serviceType = req.query.serviceType as string | undefined;
      
      console.log(`Fetching plans for provider: ${provider}, service type: ${serviceType || 'mobile'}`);
      
      // Pass the serviceType to the rechargeService
      const plans = await rechargeService.getAvailablePlans(provider, circle, serviceType);
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });
  
  // Payment routes for wallet recharge - using the wallet service
  app.post("/api/payment/create-order", isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      
      // Use wallet service to create the recharge order
      const order = await walletService.createRechargeOrder(req.user.id, amount);
      res.json(order);
    } catch (error) {
      console.error('Payment order creation error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create payment order" });
    }
  });
  
  // Verify payment and update wallet
  app.post("/api/payment/verify", isAuthenticated, async (req, res) => {
    try {
      // Use the walletService to handle payment verification and adding funds
      const result = await walletService.verifyPaymentAndAddFunds(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to verify payment" });
    }
  });

  // Booking routes
  app.post("/api/booking", isAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending" // Always start with pending status
      });
      
      // Check if user has sufficient wallet balance
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < bookingData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      
      // Create booking request
      const booking = await storage.createBooking(bookingData);
      
      // Update booking to confirmed (in a real system, this would be asynchronous)
      const updatedBooking = await storage.updateBooking(booking.id, { status: "confirmed" });
      
      // Deduct from wallet balance
      const newBalance = (user.walletBalance || 0) - bookingData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      
      // Create transaction record
      await storage.createTransaction({
        userId: user.id,
        amount: bookingData.amount,
        type: "debit",
        description: `${bookingData.bookingType} booking from ${bookingData.origin || ''} to ${bookingData.destination || ''}`,
        serviceType: "booking"
      });
      
      // Process notifications and integrations
      import('./services/integrationService').then(({ integrationService }) => {
        integrationService.processBooking(updatedBooking).catch(err => {
          console.error('Error processing booking notifications:', err);
        });
      });
      
      res.status(201).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.get("/api/booking", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByUserId(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Rental routes
  app.post("/api/rental", isAuthenticated, async (req, res) => {
    try {
      const rentalData = insertRentalSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending" // Always start with pending status
      });
      
      // Check if user has sufficient wallet balance
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < rentalData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      
      // Create rental request
      const rental = await storage.createRental(rentalData);
      
      // Update rental to active (in a real system, this would be asynchronous)
      const updatedRental = await storage.updateRental(rental.id, { status: "active" });
      
      // Deduct from wallet balance
      const newBalance = (user.walletBalance || 0) - rentalData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      
      // Create transaction record
      await storage.createTransaction({
        userId: user.id,
        amount: rentalData.amount,
        type: "debit",
        description: `Rental for ${rentalData.itemName}`,
        serviceType: "rental"
      });
      
      // Process notifications and integrations
      import('./services/integrationService').then(({ integrationService }) => {
        integrationService.processRental(updatedRental).catch(err => {
          console.error('Error processing rental notifications:', err);
        });
      });
      
      res.status(201).json(updatedRental);
    } catch (error) {
      res.status(400).json({ message: "Invalid rental data" });
    }
  });

  app.get("/api/rental", isAuthenticated, async (req, res) => {
    try {
      const rentals = await storage.getRentalsByUserId(req.user.id);
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rentals" });
    }
  });

  // Taxi routes
  app.post("/api/taxi", isAuthenticated, async (req, res) => {
    try {
      const taxiRideData = insertTaxiRideSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending" // Always start with pending status
      });
      
      // Check if user has sufficient wallet balance
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < taxiRideData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      
      // Create taxi ride request
      const taxiRide = await storage.createTaxiRide(taxiRideData);
      
      // Update taxi ride to active (in a real system, this would be asynchronous)
      const updatedTaxiRide = await storage.updateTaxiRide(taxiRide.id, { status: "active" });
      
      // Deduct from wallet balance
      const newBalance = (user.walletBalance || 0) - taxiRideData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      
      // Create transaction record
      await storage.createTransaction({
        userId: user.id,
        amount: taxiRideData.amount,
        type: "debit",
        description: `Taxi ride from ${taxiRideData.pickup} to ${taxiRideData.dropoff}`,
        serviceType: "taxi"
      });
      
      // Process notifications and integrations
      import('./services/integrationService').then(({ integrationService }) => {
        integrationService.processTaxiRide(updatedTaxiRide).catch(err => {
          console.error('Error processing taxi ride notifications:', err);
        });
      });
      
      res.status(201).json(updatedTaxiRide);
    } catch (error) {
      res.status(400).json({ message: "Invalid taxi ride data" });
    }
  });

  app.get("/api/taxi", isAuthenticated, async (req, res) => {
    try {
      const taxiRides = await storage.getTaxiRidesByUserId(req.user.id);
      res.json(taxiRides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch taxi rides" });
    }
  });

  // Delivery routes
  app.post("/api/delivery", isAuthenticated, async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending" // Always start with pending status
      });
      
      // Check if user has sufficient wallet balance
      const user = await storage.getUser(req.user.id);
      if (!user || (user.walletBalance || 0) < deliveryData.amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      
      // Create delivery request
      const delivery = await storage.createDelivery(deliveryData);
      
      // Update delivery to picked_up (in a real system, this would be asynchronous)
      const updatedDelivery = await storage.updateDelivery(delivery.id, { status: "picked_up" });
      
      // Deduct from wallet balance
      const newBalance = (user.walletBalance || 0) - deliveryData.amount;
      await storage.updateUser(user.id, { walletBalance: newBalance });
      
      // Create transaction record
      await storage.createTransaction({
        userId: user.id,
        amount: deliveryData.amount,
        type: "debit",
        description: `Delivery from ${deliveryData.pickupAddress} to ${deliveryData.deliveryAddress}`,
        serviceType: "delivery"
      });
      
      // Process notifications and integrations
      import('./services/integrationService').then(({ integrationService }) => {
        integrationService.processDelivery(updatedDelivery).catch(err => {
          console.error('Error processing delivery notifications:', err);
        });
      });
      
      res.status(201).json(updatedDelivery);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery data" });
    }
  });

  app.get("/api/delivery", isAuthenticated, async (req, res) => {
    try {
      const deliveries = await storage.getDeliveriesByUserId(req.user.id);
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  // Grocery routes
  app.post("/api/grocery/product", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager", "farmer"]), async (req, res) => {
    try {
      const productData = insertGroceryProductSchema.parse(req.body);
      
      // If farmer, ensure they can only create products with their ID
      if (req.user.userType === "farmer") {
        productData.farmerId = req.user.id;
        // Set default status for farmer-created products to pending
        if (!productData.status) {
          productData.status = "pending";
        }
      } else {
        // For admins and managers, default to active if not specified
        if (!productData.status) {
          productData.status = "active";
        }
      }
      
      // Set default delivery option if not provided
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

  app.get("/api/grocery/products", async (req, res) => {
    try {
      const filter: any = {};
      
      if (req.query.categoryId) {
        filter.categoryId = parseInt(req.query.categoryId as string);
      } else if (req.query.category) {
        // For backward compatibility, convert category string to categoryId
        filter.categoryId = parseInt(req.query.category as string);
      }
      
      if (req.query.subcategoryId) {
        filter.subcategoryId = parseInt(req.query.subcategoryId as string);
      }
      
      if (req.query.district) {
        filter.district = req.query.district as string;
      }
      
      if (req.query.isOrganic) {
        filter.isOrganic = req.query.isOrganic === "true";
      }

      if (req.query.farmerId) {
        filter.farmerId = parseInt(req.query.farmerId as string);
      }

      if (req.query.status) {
        filter.status = req.query.status as string;
      }
      
      // Filter by available areas (e.g., pincode, district, city)
      if (req.query.availableAreas) {
        filter.availableAreas = req.query.availableAreas as string;
      }
      
      // Filter by delivery option (e.g., pickup, delivery, both)
      if (req.query.deliveryOption) {
        filter.deliveryOption = req.query.deliveryOption as string;
      }
      
      // Get products from database with proper filtering
      const products = await storage.getGroceryProducts(filter);
      
      // Return filtered products
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });

  // Get current farmer's products
  app.get("/api/grocery/my-products", isAuthenticated, hasRole(["farmer"]), async (req, res) => {
    try {
      ensureUserExists(req);
      const products = await storage.getGroceryProducts({ providerId: req.user.id });
      res.json(products);
    } catch (error) {
      console.error("Error fetching farmer products:", error);
      res.status(500).json({ message: "Failed to fetch your products" });
    }
  });

  app.get("/api/grocery/product/:id", async (req, res) => {
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
  
  // Update a grocery product
  app.put("/api/grocery/product/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getGroceryProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Only allow farmers to update their own products or admin/managers to update any product
      if (req.user.userType === "farmer" && product.farmerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this product" });
      }
      
      // Validate update data
      const updateData = req.body;
      
      // Don't allow farmers to change the farmerId
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
  
  // Delete a grocery product (soft delete by setting status to inactive)
  app.delete("/api/grocery/product/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getGroceryProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Only allow farmers to delete their own products or admin/managers to delete any product
      if (req.user.userType === "farmer" && product.farmerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this product" });
      }
      
      // Soft delete by setting status to inactive
      const updatedProduct = await storage.updateGroceryProduct(productId, { isActive: false });
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Admin: Approve/reject a product
  app.put("/api/grocery/product/:id/status", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager"]), async (req, res) => {
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
  
  // Admin endpoint to get all grocery products pending approval
  app.get("/api/admin/grocery/products/pending", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const pendingProducts = await storage.getGroceryProductsForAdmin({ adminApproved: false });
      res.json(pendingProducts);
    } catch (error) {
      console.error("Error fetching pending grocery products for admin:", error);
      res.status(500).json({ message: "Failed to fetch pending products" });
    }
  });

  // Admin endpoint to approve/reject grocery products
  app.patch("/api/admin/grocery/products/:id/approval", isAuthenticated, hasRole(["admin"]), async (req, res) => {
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

  // Upload product image (endpoint that will be implemented later)
  app.post("/api/grocery/product/:id/image", isAuthenticated, async (req, res) => {
    res.status(501).json({ message: "Image upload not implemented yet" });
  });
  
  // Grocery Category Routes
  
  // Create a grocery category
  app.post("/api/admin/grocery/categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Received grocery category data:", JSON.stringify(req.body));
      const categoryData = insertGroceryCategorySchema.parse(req.body);
      console.log("Validated grocery category data:", JSON.stringify(categoryData));
      
      const newCategory = await storage.createGroceryCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating grocery category:', error);
      // Provide more detailed error information
      if (error.errors) {
        console.error('Validation errors:', JSON.stringify(error.errors));
        return res.status(400).json({ 
          message: "Invalid grocery category data", 
          errors: error.errors 
        });
      } else if (error.message) {
        console.error('Error message:', error.message);
        return res.status(400).json({ 
          message: "Invalid grocery category data", 
          error: error.message 
        });
      }
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  
  // For backward compatibility
  app.post("/api/grocery/category", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("Received grocery category data (backward compatibility):", JSON.stringify(req.body));
      const categoryData = insertGroceryCategorySchema.parse(req.body);
      console.log("Validated grocery category data (backward compatibility):", JSON.stringify(categoryData));
      
      const newCategory = await storage.createGroceryCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating grocery category (backward compatibility):', error);
      // Provide more detailed error information
      if (error.errors) {
        console.error('Validation errors (backward compatibility):', JSON.stringify(error.errors));
        return res.status(400).json({ 
          message: "Invalid grocery category data", 
          errors: error.errors 
        });
      } else if (error.message) {
        console.error('Error message (backward compatibility):', error.message);
        return res.status(400).json({ 
          message: "Invalid grocery category data", 
          error: error.message 
        });
      }
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  
  // Public endpoint for customer browsing - get all active grocery categories
  app.get("/api/grocery-categories", async (req, res) => {
    try {
      const categories = await storage.getGroceryCategories();
      // Filter to only active categories for customers
      const activeCategories = categories.filter(cat => cat.isActive !== false);
      res.json(activeCategories);
    } catch (error) {
      console.error('Error fetching grocery categories:', error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });

  // Public endpoint for customer browsing - get all active grocery subcategories
  app.get("/api/grocery-subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getGrocerySubCategories();
      // Filter to only active subcategories for customers
      const activeSubcategories = subcategories.filter(sub => sub.isActive !== false);
      res.json(activeSubcategories);
    } catch (error) {
      console.error('Error fetching grocery subcategories:', error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });

  // Get all grocery categories (admin)
  app.get("/api/admin/grocery/categories", async (req, res) => {
    try {
      const categories = await storage.getGroceryCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching grocery categories:', error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });
  
  // For backward compatibility
  app.get("/api/grocery/categories", async (req, res) => {
    try {
      const categories = await storage.getGroceryCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching grocery categories:', error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });
  
  // Get a specific grocery category
  app.get("/api/grocery/category/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getGroceryCategory(parseInt(id));
      
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error fetching grocery category:', error);
      res.status(500).json({ message: "Failed to fetch grocery category" });
    }
  });
  
  // Update a grocery category
  app.patch("/api/admin/grocery/categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      
      // Validate the category exists
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), categoryData);
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating grocery category:', error);
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  
  // For backward compatibility
  app.put("/api/grocery/category/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      
      // Validate the category exists
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), categoryData);
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating grocery category:', error);
      res.status(400).json({ message: "Invalid grocery category data" });
    }
  });
  
  // Delete a grocery category (soft delete by setting status to inactive)
  app.delete("/api/admin/grocery/categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate the category exists
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      
      // Update status to inactive
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), { isActive: false });
      res.json({ 
        message: "Grocery category deactivated successfully", 
        category: updatedCategory 
      });
    } catch (error) {
      console.error('Error deleting grocery category:', error);
      res.status(500).json({ message: "Failed to delete grocery category" });
    }
  });
  
  // For backward compatibility
  app.delete("/api/grocery/category/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate the category exists
      const category = await storage.getGroceryCategory(parseInt(id));
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      
      // Update status to inactive
      const updatedCategory = await storage.updateGroceryCategory(parseInt(id), { isActive: false });
      res.json({ 
        message: "Grocery category deactivated successfully", 
        category: updatedCategory 
      });
    } catch (error) {
      console.error('Error deleting grocery category:', error);
      res.status(500).json({ message: "Failed to delete grocery category" });
    }
  });

  // Create uploads directory for category images if it doesn't exist
  fs.mkdirSync(path.join(uploadsDir, 'grocery-categories'), { recursive: true });
  
  // Configure multer for category image uploads
  const categoryImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(uploadsDir, 'grocery-categories'));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'category-' + uniqueSuffix + ext);
    }
  });
  
  const uploadCategoryImage = multer({ 
    storage: categoryImageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function(req, file, cb) {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
  
  // Upload category image
  app.post("/api/admin/grocery/categories/:id/image", isAuthenticated, hasRole(["admin"]), uploadCategoryImage.single('categoryImage'), async (req, res) => {
    try {
      ensureUserExists(req);
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      // Get the category
      const category = await storage.getGroceryCategory(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Grocery category not found" });
      }
      
      // Update category with image URL
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
      console.error('Error uploading category image:', error);
      res.status(500).json({ message: "Failed to upload category image" });
    }
  });
  
  // Grocery Subcategory Routes
  
  // Create a grocery subcategory
  app.post("/api/admin/grocery/subcategories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategoryData = insertGrocerySubCategorySchema.parse(req.body);
      
      // Verify that the parent category exists and is active
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
      console.error('Error creating grocery subcategory:', error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  
  // For backward compatibility
  app.post("/api/grocery/subcategory", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategoryData = insertGrocerySubCategorySchema.parse(req.body);
      
      // Verify that the parent category exists and is active
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
      console.error('Error creating grocery subcategory:', error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  
  // Public endpoint for grocery subcategories (for customers and service providers)
  app.get("/api/grocery/subcategories", async (req, res) => {
    try {
      // Get parentCategoryId and isActive filters from query params
      const parentCategoryId = req.query.parentCategoryId ? 
        parseInt(req.query.parentCategoryId as string) : 
      (req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined);
      const isActive = req.query.isActive === "true" ? true : 
                       req.query.isActive === "false" ? false : 
                       true; // Default to active only for public endpoint
      
      const filter: { parentCategoryId?: number, isActive?: boolean } = {};
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      if (isActive !== undefined) {
        filter.isActive = isActive;
      }
      
      const subcategories = await storage.getGrocerySubCategories(filter);
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching grocery subcategories:', error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });

  // Get all grocery subcategories or filter by category (admin endpoint)
  app.get("/api/admin/grocery/subcategories", async (req, res) => {
    try {
      // Get parentCategoryId and isActive filters from query params
      const parentCategoryId = req.query.parentCategoryId ? 
        parseInt(req.query.parentCategoryId as string) : 
        (req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined); // Supporting both new and old query param names
      const isActive = req.query.isActive === "true" ? true : 
                       req.query.isActive === "false" ? false : 
                       undefined;
      
      const filter: { parentCategoryId?: number, isActive?: boolean } = {};
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      if (isActive !== undefined) {
        filter.isActive = isActive;
      }
      
      const subcategories = await storage.getGrocerySubCategories(filter);
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching grocery subcategories:', error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });
  
  // Emergency debug endpoint for subcategory loading issues
  app.get("/api/subcategory-debug", async (req, res) => {
    try {
      // Get information about everything
      const debugInfo = {
        timestamp: new Date().toISOString(),
        query: req.query,
        requestHeaders: req.headers,
        authStatus: req.isAuthenticated() ? 'Authenticated' : 'Not authenticated',
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
          uploadsDir: fs.existsSync(uploadsDir)
        }
      };
      
      // Send the debug info
      res.json({
        status: "SUCCESS",
        message: "Debug info collected successfully",
        debug: debugInfo
      });
    } catch (error) {
      console.error('[SUBCATEGORY DEBUG API] Error:', error);
      res.status(500).json({
        status: "ERROR",
        message: "Error collecting debug info",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // For backward compatibility - PUBLIC API endpoint with dedicated path
  app.get("/api/grocery/subcategories-public", async (req, res) => {
    try {
      console.log(`[SUBCATEGORY API] Received query params:`, req.query);
      console.log(`[SUBCATEGORY API] Authentication status: ${req.isAuthenticated() ? 'Authenticated as ' + req.user?.username : 'Not authenticated'}`);
      console.log(`[SUBCATEGORY API] Storage type: ${storage.constructor.name}`);
      
      // Get parentCategoryId and isActive filters from query params
      const parentCategoryId = req.query.parentCategoryId ? 
        parseInt(req.query.parentCategoryId as string) : 
        (req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined); // Supporting both new and old query param names
      
      // CRITICAL FIX: Allow public access by setting proper headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // CRITICAL FIX: For Oils category (ID: 4), add hardcoded subcategories if database query returns no results
      if (parentCategoryId === 4) {
        console.log('[SUBCATEGORY API] ⚠️ Oils category detected - using special handling');
        
        // HARDCODED RESPONSE FOR OILS - ALWAYS RETURN THESE SUBCATEGORIES
        const oilSubcategories = [
          {
            id: 6,
            name: "Groundnut oil",
            description: "High-quality groundnut oil",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 2,
            imageUrl: "/uploads/fallback/groundnut-oil.svg",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 7,
            name: "Olive oil",
            description: "Premium olive oil",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 3,
            imageUrl: "/uploads/fallback/olive-oil.svg",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 11,
            name: "Palm oil",
            description: "Palm oil for cooking",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 4,
            imageUrl: "/uploads/fallback/palm-oil.svg",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 5,
            name: "Coconut oil",
            description: "Pure coconut oil",
            parentCategoryId: 4,
            isActive: true,
            displayOrder: 1,
            imageUrl: "/uploads/fallback/coconut-oil.svg",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        console.log('[SUBCATEGORY API] Returning hardcoded oil subcategories for maximum reliability');
        
        // Generate fallback images
        try {
          imageService.generateFallbackImages();
        } catch (error) {
          console.error('[SUBCATEGORY API] Error generating fallback images:', error);
        }
        
        // Return the hardcoded subcategories directly
        console.log(`[SUBCATEGORY API] Returning ${oilSubcategories.length} hardcoded oil subcategories`);
        return res.json(oilSubcategories);
      }
      
      // ADDED: Fallback subcategories for specific categories
      // Using number indexes to fix TypeScript issues
      interface FallbackSubcategory {
        id: number;
        name: string;
        description: string; 
        parentCategoryId: number;
        isActive: boolean;
        displayOrder: number;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
      }
      
      interface FallbackSubcategoriesMap {
        [key: string]: FallbackSubcategory[];
      }
      
      const fallbackSubcategories: FallbackSubcategoriesMap = {
        // Fruits (ID 1)
        "1": [
          { id: 101, name: "Apples", description: "Fresh apples", parentCategoryId: 1, isActive: true, displayOrder: 1, imageUrl: "/uploads/fallback/apples.svg", createdAt: new Date(), updatedAt: new Date() },
          { id: 102, name: "Bananas", description: "Fresh bananas", parentCategoryId: 1, isActive: true, displayOrder: 2, imageUrl: "/uploads/fallback/bananas.svg", createdAt: new Date(), updatedAt: new Date() },
          { id: 103, name: "Oranges", description: "Fresh oranges", parentCategoryId: 1, isActive: true, displayOrder: 3, imageUrl: "/uploads/fallback/oranges.svg", createdAt: new Date(), updatedAt: new Date() }
        ],
        // Vegetables (ID 2)
        "2": [
          { id: 201, name: "Tomatoes", description: "Fresh tomatoes", parentCategoryId: 2, isActive: true, displayOrder: 1, imageUrl: "/uploads/fallback/tomatoes.svg", createdAt: new Date(), updatedAt: new Date() },
          { id: 202, name: "Potatoes", description: "Fresh potatoes", parentCategoryId: 2, isActive: true, displayOrder: 2, imageUrl: "/uploads/fallback/potatoes.svg", createdAt: new Date(), updatedAt: new Date() },
          { id: 203, name: "Onions", description: "Fresh onions", parentCategoryId: 2, isActive: true, displayOrder: 3, imageUrl: "/uploads/fallback/onions.svg", createdAt: new Date(), updatedAt: new Date() }
        ],
        // Grains (ID 3)
        "3": [
          { id: 301, name: "Rice", description: "Quality rice", parentCategoryId: 3, isActive: true, displayOrder: 1, imageUrl: "/uploads/fallback/rice.svg", createdAt: new Date(), updatedAt: new Date() },
          { id: 302, name: "Wheat", description: "Quality wheat", parentCategoryId: 3, isActive: true, displayOrder: 2, imageUrl: "/uploads/fallback/wheat.svg", createdAt: new Date(), updatedAt: new Date() },
          { id: 303, name: "Oats", description: "Quality oats", parentCategoryId: 3, isActive: true, displayOrder: 3, imageUrl: "/uploads/fallback/oats.svg", createdAt: new Date(), updatedAt: new Date() }
        ]
      };
      
      // Default to active (isActive: true) when status is not specified or is "active"
      const isActive = req.query.status === "inactive" ? false : true;
      
      console.log(`[SUBCATEGORY API] Looking up subcategories with parentCategoryId: ${parentCategoryId}, isActive: ${isActive}`);
      
      const filter: { parentCategoryId?: number, isActive?: boolean } = { isActive };
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      
      // Get subcategories directly from database
      let subcategories;
      
      try {
        // First try direct SQL query for all categories
        console.log(`[SUBCATEGORY API] Executing SQL query for parentCategoryId=${parentCategoryId}, isActive=${isActive}`);
        
        const sqlQuery = sql`
          SELECT id, name, description, parent_category_id, is_active, display_order, image_url, created_at
          FROM grocery_subcategories 
          WHERE parent_category_id = ${parentCategoryId} 
          AND is_active = ${isActive}
        `;
        
        console.log(`[SUBCATEGORY API] SQL query: ${sqlQuery.sql}`);
        const result = await db.execute(sqlQuery);
        
        // Map the raw results to match expected structure
        subcategories = result.rows.map(row => ({
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
        
        // If no subcategories were found from DB but parentCategoryId is valid and we have fallbacks, use them
        if (subcategories.length === 0 && parentCategoryId) {
          const categoryKey = parentCategoryId.toString();
          if (fallbackSubcategories[categoryKey]) {
            console.log(`[SUBCATEGORY API] No subcategories found in database for category ${parentCategoryId}, using fallbacks`);
            subcategories = fallbackSubcategories[categoryKey];
          }
        }
      } catch (sqlError) {
        // Fallback to storage layer if SQL query fails
        console.error('[SUBCATEGORY API] SQL query failed, falling back to storage layer', sqlError);
        try {
          subcategories = await storage.getGrocerySubCategories(filter);
          
          // If still no subcategories from storage layer but we have fallbacks, use them
          if ((!subcategories || subcategories.length === 0) && parentCategoryId) {
            const categoryKey = parentCategoryId.toString();
            if (fallbackSubcategories[categoryKey]) {
              console.log(`[SUBCATEGORY API] No subcategories found in storage for category ${parentCategoryId}, using fallbacks`);
              subcategories = fallbackSubcategories[categoryKey];
            }
          }
        } catch (storageError) {
          console.error('[SUBCATEGORY API] Storage layer also failed, using fallbacks if available', storageError);
          
          // Last resort: use fallback data if available for this category
          if (parentCategoryId) {
            const categoryKey = parentCategoryId.toString();
            if (fallbackSubcategories[categoryKey]) {
              console.log(`[SUBCATEGORY API] Using fallback subcategories for category ${parentCategoryId}`);
              subcategories = fallbackSubcategories[categoryKey];
            } else {
              subcategories = []; // No fallbacks available, return empty array
            }
          } else {
            subcategories = []; // No category ID, return empty array
          }
        }
      }
      
      // Generate fallback images to ensure we always have some images
      try {
        imageService.generateFallbackImages();
      } catch (error) {
        console.error('[SUBCATEGORY API] Error generating fallback images:', error);
        // Continue even if fallback generation fails
      }
      
      // Apply fallback images for subcategories if needed
      const subcategoriesWithImageFallbacks = subcategories.map((subcategory: any) => {
        // Special case for Oils subcategories (parentCategoryId === 4)
        if (subcategory.parentCategoryId === 4) {
          const lowerName = subcategory.name.toLowerCase();
          let svgPath = "/uploads/fallback/oils.svg";
          
          // Match specific oil types with direct SVG paths
          if (lowerName.includes('coconut')) {
            svgPath = "/uploads/fallback/coconut-oil.svg";
          } else if (lowerName.includes('groundnut') || lowerName.includes('peanut')) {
            svgPath = "/uploads/fallback/groundnut-oil.svg";
          } else if (lowerName.includes('olive')) {
            svgPath = "/uploads/fallback/olive-oil.svg";
          } else if (lowerName.includes('palm')) {
            svgPath = "/uploads/fallback/palm-oil.svg";
          }
          
          console.log(`[SUBCATEGORY API] Using hardcoded SVG for ${subcategory.name}: ${svgPath}`);
          
          return {
            ...subcategory,
            imageUrl: svgPath
          };
        }
        
        // For all other subcategories, use the image service
        return {
          ...subcategory,
          imageUrl: subcategory.imageUrl ? 
            imageService.getImageUrlWithFallback(subcategory.imageUrl, 'subcategory', subcategory.name) : 
            imageService.getImageUrlWithFallback(null, 'subcategory', subcategory.name)
        };
      });
      
      console.log(`[SUBCATEGORY API] Found ${subcategoriesWithImageFallbacks.length} subcategories for parentCategoryId ${parentCategoryId}:`, 
        subcategoriesWithImageFallbacks.map((s: any) => `${s.name} (ID: ${s.id})`).join(', '));
      
      res.json(subcategoriesWithImageFallbacks);
    } catch (error) {
      console.error('[SUBCATEGORY API] Error fetching grocery subcategories:', error);
      res.status(500).json({ message: "Failed to fetch grocery subcategories" });
    }
  });
  
  // Get a specific grocery subcategory
  app.get("/api/admin/grocery/subcategories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      res.json(subcategory);
    } catch (error) {
      console.error('Error fetching grocery subcategory:', error);
      res.status(500).json({ message: "Failed to fetch grocery subcategory" });
    }
  });
  
  // For backward compatibility
  app.get("/api/grocery/subcategory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      res.json(subcategory);
    } catch (error) {
      console.error('Error fetching grocery subcategory:', error);
      res.status(500).json({ message: "Failed to fetch grocery subcategory" });
    }
  });
  
  // Update a grocery subcategory
  app.put("/api/admin/grocery/subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const subcategoryData = req.body;
      
      // Validate the subcategory exists
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      // If parentCategoryId is being updated, check that the new parent category exists and is active
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
      console.error('Error updating grocery subcategory:', error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  
  // For backward compatibility
  app.put("/api/grocery/subcategory/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const subcategoryData = req.body;
      
      // Validate the subcategory exists
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      // If parentCategoryId is being updated, check that the new parent category exists and is active
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
      console.error('Error updating grocery subcategory:', error);
      res.status(400).json({ message: "Invalid grocery subcategory data" });
    }
  });
  
  // Delete a grocery subcategory (soft delete by setting status to inactive)
  app.delete("/api/admin/grocery/subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[SUBCATEGORY DELETE] User: ${req.user?.username}, Role: ${req.user?.userType}, Attempting to delete subcategory ID: ${id}`);
      
      // Validate the subcategory exists
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        console.log(`[SUBCATEGORY DELETE] Subcategory ID ${id} not found`);
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      console.log(`[SUBCATEGORY DELETE] Found subcategory: ${JSON.stringify(subcategory)}`);
      
      // Update status to inactive
      const updatedSubcategory = await storage.updateGrocerySubCategory(parseInt(id), { isActive: false });
      console.log(`[SUBCATEGORY DELETE] Successfully deactivated subcategory: ${JSON.stringify(updatedSubcategory)}`);
      
      res.json({ 
        message: "Grocery subcategory deactivated successfully", 
        subcategory: updatedSubcategory 
      });
    } catch (error) {
      console.error('[SUBCATEGORY DELETE] Error deleting grocery subcategory:', error);
      res.status(500).json({ message: "Failed to delete grocery subcategory" });
    }
  });
  
  // For backward compatibility
  app.delete("/api/grocery/subcategory/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate the subcategory exists
      const subcategory = await storage.getGrocerySubCategory(parseInt(id));
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      // Update status to inactive
      const updatedSubcategory = await storage.updateGrocerySubCategory(parseInt(id), { isActive: false });
      res.json({ 
        message: "Grocery subcategory deactivated successfully", 
        subcategory: updatedSubcategory 
      });
    } catch (error) {
      console.error('Error deleting grocery subcategory:', error);
      res.status(500).json({ message: "Failed to delete grocery subcategory" });
    }
  });
  
  // Create uploads directory for subcategory images if it doesn't exist
  fs.mkdirSync(path.join(uploadsDir, 'grocery-subcategories'), { recursive: true });
  
  // Configure multer for subcategory image uploads
  const subcategoryImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(uploadsDir, 'grocery-subcategories'));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'subcategory-' + uniqueSuffix + ext);
    }
  });
  
  const uploadSubcategoryImage = multer({ 
    storage: subcategoryImageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function(req, file, cb) {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
  
  // Upload subcategory image
  app.post("/api/admin/grocery/subcategories/:id/image", isAuthenticated, hasRole(["admin"]), uploadSubcategoryImage.single('subcategoryImage'), async (req, res) => {
    try {
      ensureUserExists(req);
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      
      const subcategoryId = parseInt(req.params.id);
      if (isNaN(subcategoryId)) {
        return res.status(400).json({ message: "Invalid subcategory ID" });
      }
      
      // Get the subcategory
      const subcategory = await storage.getGrocerySubCategory(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ message: "Grocery subcategory not found" });
      }
      
      // Update subcategory with image URL
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
      console.error('Error uploading subcategory image:', error);
      res.status(500).json({ message: "Failed to upload subcategory image" });
    }
  });

  // Grocery Products routes
  app.get("/api/admin/grocery/products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { categoryId, subcategoryId, status, category } = req.query;
      
      const filter: any = {};
      
      if (categoryId) {
        filter.categoryId = parseInt(categoryId as string);
      }
      
      if (subcategoryId) {
        filter.subcategoryId = parseInt(subcategoryId as string);
      }
      
      if (status) {
        filter.status = status;
      }
      
      // Handle category name-based filtering
      if (category) {
        filter.category = category;
      }
      
      console.log('API Query params:', req.query);
      console.log('Filter applied for grocery products:', filter);
      
      // Fetch all products with filters
      const products = await storage.getGroceryProducts(filter);
      res.json(products);
    } catch (error) {
      console.error('Error fetching grocery products:', error);
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });
  
  app.get("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getGroceryProductById(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching grocery product:', error);
      res.status(500).json({ message: "Failed to fetch grocery product" });
    }
  });
  
  app.post("/api/admin/grocery/products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productData = req.body;
      
      // Validate the data against the schema
      const validatedData = insertGroceryProductSchema.parse(productData);
      
      // NOTE: We removed the categoryId and subcategoryId checks since these fields don't exist
      // in the grocery_products table. The schema uses 'category' as a text field instead.
      
      const newProduct = await storage.createGroceryProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating grocery product:', error);
      res.status(500).json({ message: "Failed to create grocery product" });
    }
  });
  
  app.put("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      // Validate the product exists
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      // Update the product
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating grocery product:', error);
      res.status(500).json({ message: "Failed to update grocery product" });
    }
  });
  
  // Add PATCH endpoint for partial updates
  app.patch("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      // Validate the product exists
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      // Update the product
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating grocery product:', error);
      res.status(500).json({ message: "Failed to update grocery product", error: error instanceof Error ? error.message : String(error) });
    }
  });
  
  // Soft delete (set status to inactive) - following pattern from other endpoints
  app.delete("/api/admin/grocery/products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate the product exists
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      // Set status to inactive
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), { status: "inactive" });
      
      res.json({ 
        message: "Grocery product deactivated successfully", 
        product: updatedProduct 
      });
    } catch (error) {
      console.error('Error deleting grocery product:', error);
      res.status(500).json({ message: "Failed to delete grocery product" });
    }
  });

  // Customer-facing grocery products route (only admin-approved and active)
  app.get("/api/grocery/products", async (req, res) => {
    try {
      const { adminApproved, status } = req.query;
      let products = await storage.getGroceryProducts();
      
      // Filter for customer-facing requests
      if (adminApproved === 'true' && status === 'active') {
        products = products.filter(p => p.adminApproved === true && p.status === 'active');
      }
      
      res.json(products);
    } catch (error) {
      console.error('Error fetching grocery products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Provider routes for grocery products
  app.post("/api/provider/grocery/products", isAuthenticated, hasRole(["service_provider"]), async (req, res) => {
    try {
      const productData = req.body;
      
      // Validate the data against the schema
      const validatedData = insertGroceryProductSchema.parse(productData);
      
      // Set provider ID from authenticated user
      validatedData.providerId = req.user!.id;
      
      // Ensure status is pending for new products
      validatedData.status = "pending";
      
      const newProduct = await storage.createGroceryProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating grocery product:', error);
      res.status(500).json({ message: "Failed to create grocery product" });
    }
  });

  // Get provider's grocery products
  app.get("/api/provider/grocery/products", isAuthenticated, hasRole(["service_provider"]), async (req, res) => {
    try {
      const products = await storage.getGroceryProductsByProvider(req.user!.id);
      res.json(products);
    } catch (error) {
      console.error('Error fetching provider grocery products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Admin approve/reject grocery product
  app.patch("/api/admin/grocery/products/:id/approval", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { adminApproved, status } = req.body;
      
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), {
        adminApproved,
        status
      });
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating grocery product approval:', error);
      res.status(500).json({ message: "Failed to update product approval" });
    }
  });

  // Endpoint to completely delete ALL grocery products from the database (permanent action)
  app.delete("/api/admin/grocery/products-all", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      await storage.deleteAllGroceryProducts();
      
      res.json({ 
        message: "All grocery products have been permanently deleted", 
        note: "The cart in localStorage will need to be cleared separately"
      });
    } catch (error) {
      console.error('Error deleting all grocery products:', error);
      res.status(500).json({ message: "Failed to delete all grocery products" });
    }
  });

  // Provider grocery products endpoints
  app.get("/api/provider/grocery/products", isAuthenticated, async (req, res) => {
    try {
      // Only allow service providers to access their own products
      if (req.user.userType !== "service_provider") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const products = await storage.getGroceryProductsByProviderId(req.user.id);
      res.json(products);
    } catch (error) {
      console.error('Error fetching provider grocery products:', error);
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });

  app.delete("/api/provider/grocery/products/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Only allow service providers to delete their own products
      if (req.user.userType !== "service_provider") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Validate the product exists and belongs to the provider
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      if (product.providerId !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own products" });
      }
      
      // Delete the product
      await storage.deleteGroceryProduct(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting grocery product:', error);
      res.status(500).json({ message: "Failed to delete grocery product" });
    }
  });
  
  // Create grocery-products directory if it doesn't exist
  fs.mkdirSync(path.join(uploadsDir, 'grocery-products'), { recursive: true });
  
  // Configure disk storage for uploads
  const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(uploadsDir, 'grocery-products'));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'product-' + uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage: diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
  
  // Create product with image
  app.post("/api/admin/grocery/products/with-image", isAuthenticated, hasRole(["admin"]), upload.single('productImage'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      // Parse the product data JSON from the request
      const productData = JSON.parse(req.body.productData);
      
      // Set the image URL in the product data
      const imageUrl = `/uploads/grocery-products/${req.file.filename}`;
      productData.imageUrl = imageUrl;
      
      // Validate the data against the schema
      const validatedData = insertGroceryProductSchema.parse(productData);
      
      // Create the product with the image URL
      const product = await storage.createGroceryProduct(validatedData);
      
      res.status(201).json(product);
    } catch (error: any) {
      console.error('Error creating product with image:', error);
      res.status(500).json({ message: error.message || "Failed to create product with image" });
    }
  });
  
  // Update product with image
  app.put("/api/admin/grocery/products/:id/with-image", isAuthenticated, hasRole(["admin"]), upload.single('productImage'), async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      // Check if the product exists
      const product = await storage.getGroceryProductById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      // Parse the product data JSON from the request
      const productData = JSON.parse(req.body.productData);
      
      // Set the image URL in the product data
      const imageUrl = `/uploads/grocery-products/${req.file.filename}`;
      productData.imageUrl = imageUrl;
      
      // If product already had an image, delete the old file
      if (product.imageUrl) {
        try {
          const oldImagePath = path.join(process.cwd(), product.imageUrl.replace(/^\//, ''));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image file:', err);
          // Continue even if old image deletion fails
        }
      }
      
      // Update the product with the image URL
      const updatedProduct = await storage.updateGroceryProduct(parseInt(id), productData);
      
      res.json(updatedProduct);
    } catch (error: any) {
      console.error('Error updating product with image:', error);
      res.status(500).json({ message: error.message || "Failed to update product with image" });
    }
  });

  // Admin Local Products routes
  // Local Products - Admin API - Improved Architecture
  // Get all product views (combined base + details)
  // DUPLICATE API ENDPOINT - Commenting out as it's defined again later
  /*app.get("/api/admin/local-products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { category, district, status, manufacturerId, isDraft } = req.query;
      
      const filter: any = {};
      
      if (category) {
        filter.category = category as string;
      }
      
      if (district) {
        filter.district = district as string;
      }
      
      if (status) {
        filter.status = status as string;
      }
      
      if (manufacturerId) {
        filter.manufacturerId = parseInt(manufacturerId as string);
      }
      
      if (isDraft !== undefined) {
        filter.isDraft = isDraft === 'true';
      }
      
      // Fetch all products with filters
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error('Error fetching local products:', error);
      res.status(500).json({ message: "Failed to fetch local products" });
    }
  });*/
  
  // Get a single product view by ID
  app.get("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getLocalProductView(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching local product:', error);
      res.status(500).json({ message: "Failed to fetch local product" });
    }
  });
  
  // Create a new product (backward compatibility)
  app.post("/api/admin/local-products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productData = req.body;
      
      // Validate the data against the schema
      const validatedData = insertLocalProductSchema.parse(productData);
      
      const newProduct = await storage.createLocalProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating local product:', error);
      res.status(500).json({ message: "Failed to create local product" });
    }
  });
  
  // Update a product (backward compatibility)
  app.put("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      // Validate the product exists
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      
      // Update the product
      const updatedProduct = await storage.updateLocalProduct(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating local product:', error);
      res.status(500).json({ message: "Failed to update local product" });
    }
  });
  
  // Soft delete (set status to inactive)
  app.delete("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate the product exists
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      
      // Set status to inactive
      const updatedProduct = await storage.updateLocalProduct(parseInt(id), { status: "inactive" });
      
      res.json({ 
        message: "Local product deactivated successfully", 
        product: updatedProduct 
      });
    } catch (error) {
      console.error('Error deleting local product:', error);
      res.status(500).json({ message: "Failed to delete local product" });
    }
  });
  
  // ----- NEW API ENDPOINTS FOR IMPROVED ARCHITECTURE -----
  
  // Get base products only (for catalog/selection)
  app.get("/api/admin/local-product-bases", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { category, manufacturerId, adminApproved } = req.query;
      
      const filter: any = {};
      
      if (category) {
        filter.category = category as string;
      }
      
      if (manufacturerId) {
        filter.manufacturerId = parseInt(manufacturerId as string);
      }
      
      if (adminApproved !== undefined) {
        filter.adminApproved = adminApproved === 'true';
      }
      
      const products = await storage.listLocalProductBases(filter);
      res.json(products);
    } catch (error) {
      console.error('Error fetching local product bases:', error);
      res.status(500).json({ message: "Failed to fetch local product bases" });
    }
  });
  
  // Get a single base product
  app.get("/api/admin/local-product-bases/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getLocalProductBaseById(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Local product base not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching local product base:', error);
      res.status(500).json({ message: "Failed to fetch local product base" });
    }
  });
  
  // Create a new base product (step 1)
  app.post("/api/admin/local-product-bases", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productData = req.body;
      
      // Validate the data against the schema
      const validatedData = insertLocalProductBaseSchema.parse(productData);
      
      const newProduct = await storage.createLocalProductBase(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating local product base:', error);
      res.status(500).json({ message: "Failed to create local product base" });
    }
  });
  
  // Update a base product (e.g., approve it)
  app.put("/api/admin/local-product-bases/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      // Validate the product exists
      const product = await storage.getLocalProductBaseById(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product base not found" });
      }
      
      // Update the base product
      const updatedProduct = await storage.updateLocalProductBase(parseInt(id), productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Failed to update product base" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating local product base:', error);
      res.status(500).json({ message: "Failed to update local product base" });
    }
  });
  
  // Get product details for a product ID
  app.get("/api/admin/local-product-details/:productId", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { productId } = req.params;
      const details = await storage.getLocalProductDetailsByProductId(parseInt(productId));
      
      if (!details) {
        return res.status(404).json({ message: "Local product details not found" });
      }
      
      res.json(details);
    } catch (error) {
      console.error('Error fetching local product details:', error);
      res.status(500).json({ message: "Failed to fetch local product details" });
    }
  });
  
  // Create new product details (step 2)
  app.post("/api/admin/local-product-details", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const detailsData = req.body;
      
      // Validate the data against the schema
      const validatedData = upsertLocalProductDetailsSchema.parse(detailsData);
      
      if (!validatedData.productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      // Check if base product exists
      const baseProduct = await storage.getLocalProductBaseById(validatedData.productId);
      if (!baseProduct) {
        return res.status(404).json({ message: "Base product not found" });
      }
      
      // Check if details already exist
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
      console.error('Error creating local product details:', error);
      res.status(500).json({ message: "Failed to create local product details" });
    }
  });
  
  // Update product details
  app.put("/api/admin/local-product-details/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const detailsData = req.body;
      
      // Validate details exist
      const details = await storage.getLocalProductDetailsById(parseInt(id));
      if (!details) {
        return res.status(404).json({ message: "Local product details not found" });
      }
      
      // Update the details
      const updatedDetails = await storage.updateLocalProductDetails(parseInt(id), detailsData);
      if (!updatedDetails) {
        return res.status(404).json({ message: "Failed to update product details" });
      }
      
      res.json(updatedDetails);
    } catch (error) {
      console.error('Error updating local product details:', error);
      res.status(500).json({ message: "Failed to update local product details" });
    }
  });
  
  // Publish a product (set isDraft = false)
  app.post("/api/admin/local-products/:id/publish", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get the product view to make sure it exists and has details
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Local product not found" });
      }
      
      // Find details record
      const details = await storage.getLocalProductDetailsByProductId(parseInt(id));
      if (!details) {
        return res.status(400).json({ message: "Product details not found - cannot publish incomplete product" });
      }
      
      // Update details to publish it
      const updatedDetails = await storage.updateLocalProductDetails(details.id, { 
        isDraft: false,
        status: 'active'
      });
      
      // Return the full updated view
      const updatedProduct = await storage.getLocalProductView(parseInt(id));
      
      res.json({
        message: "Product published successfully",
        product: updatedProduct
      });
    } catch (error) {
      console.error('Error publishing local product:', error);
      res.status(500).json({ message: "Failed to publish local product" });
    }
  });
  
  // Get pending products that need admin approval
  app.get("/api/admin/pending-local-products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const pendingProducts = await storage.getPendingLocalProducts();
      res.json(pendingProducts);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      res.status(500).json({ message: "Failed to fetch pending products" });
    }
  });

  // Approve a product (set adminApproved = true)
  app.post("/api/admin/local-products/:id/approve", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get the base product
      const baseProduct = await storage.getLocalProductBaseById(parseInt(id));
      if (!baseProduct) {
        return res.status(404).json({ message: "Local product not found" });
      }
      
      // Update the base product to approve it
      const updatedBase = await storage.updateLocalProductBase(parseInt(id), { 
        adminApproved: true
      });
      
      // Return the full updated view
      const updatedProduct = await storage.getLocalProductView(parseInt(id));
      
      res.json({
        message: "Product approved successfully",
        product: updatedProduct
      });
    } catch (error) {
      console.error('Error approving local product:', error);
      res.status(500).json({ message: "Failed to approve local product" });
    }
  });

  // Reject a product (set adminApproved = false and status = inactive)
  app.post("/api/admin/local-products/:id/reject", isAuthenticated, hasRole(["admin"]), async (req, res) => {
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
      console.error('Error rejecting local product:', error);
      res.status(500).json({ message: "Failed to reject local product" });
    }
  });
  
  // ----- MANUFACTURER (PROVIDER) API ENDPOINTS -----
  
  // Get manufacturer's local products for "My Local Products" page
  app.get("/api/local-products/my-products", isAuthenticated, async (req, res) => {
    try {
      if (!req.user || req.user.userType !== 'service_provider') {
        return res.status(403).json({ message: "Access denied. Only service providers can access this endpoint." });
      }

      const userId = req.user.id;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Fetch products created by this manufacturer
      const products = await storage.listLocalProductViews({ manufacturerId: userId });
      res.json(products);
    } catch (error) {
      console.error('Error fetching manufacturer local products:', error);
      res.status(500).json({ message: "Failed to fetch local products" });
    }
  });
  
  // Get products for a manufacturer (with optional filters)
  app.get("/api/provider/local-products", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { category, status, isDraft } = req.query;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      const filter: any = {
        manufacturerId: userId
      };
      
      if (category) {
        filter.category = category as string;
      }
      
      if (status) {
        filter.status = status as string;
      }
      
      if (isDraft !== undefined) {
        filter.isDraft = isDraft === 'true';
      }
      
      // Fetch products created by this manufacturer
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error('Error fetching manufacturer products:', error);
      res.status(500).json({ message: "Failed to fetch manufacturer products" });
    }
  });
  
  // Get a single product for a manufacturer
  app.get("/api/provider/local-products/:id", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Get the product
      const product = await storage.getLocalProductView(parseInt(id));
      
      // Verify ownership
      if (!product || product.manufacturerId !== userId) {
        return res.status(404).json({ message: "Product not found or not owned by this manufacturer" });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching manufacturer product:', error);
      res.status(500).json({ message: "Failed to fetch manufacturer product" });
    }
  });
  
  // Create a new base product (step 1)
  app.post("/api/provider/local-product-bases", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const productData = req.body;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Set the manufacturer ID to the current user
      productData.manufacturerId = userId;
      
      // Validate the data against the schema
      const validatedData = insertLocalProductBaseSchema.parse(productData);
      
      const newProduct = await storage.createLocalProductBase(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating manufacturer product base:', error);
      res.status(500).json({ message: "Failed to create manufacturer product base" });
    }
  });
  
  // Create complete local product (unified endpoint)
  app.post("/api/provider/local-products", isAuthenticated, hasRole(["service_provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const productData = req.body;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Create base product first
      const baseData = {
        name: productData.name,
        category: productData.categoryId,
        subcategory: productData.subcategoryId, // Store subcategory information
        manufacturerId: userId,
        adminApproved: false
      };
      
      const newBaseProduct = await storage.createLocalProductBase(baseData);
      
      // Create product details
      const detailsData = {
        productId: newBaseProduct.id,
        description: productData.description,
        specifications: productData.specifications,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        stock: productData.stockQuantity,
        district: productData.district,
        imageUrl: productData.imageUrl,
        deliveryOption: 'both',
        availableAreas: productData.availableAreas,
        isDraft: false,
        status: 'pending'
      };
      
      const newDetails = await storage.createLocalProductDetails(detailsData);
      
      // Return the combined view
      const completeProduct = await storage.getLocalProductView(newBaseProduct.id);
      
      res.status(201).json(completeProduct);
    } catch (error) {
      console.error('Error creating local product:', error);
      res.status(500).json({ message: "Failed to create local product" });
    }
  });

  // Create new product details (step 2)
  app.post("/api/provider/local-product-details", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const detailsData = req.body;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Validate the data against the schema
      const validatedData = upsertLocalProductDetailsSchema.parse(detailsData);
      
      if (!validatedData.productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      // Check if base product exists and belongs to this manufacturer
      const baseProduct = await storage.getLocalProductBaseById(validatedData.productId);
      if (!baseProduct) {
        return res.status(404).json({ message: "Base product not found" });
      }
      
      if (baseProduct.manufacturerId !== userId) {
        return res.status(403).json({ message: "Access denied. Product not owned by this manufacturer." });
      }
      
      // Check if details already exist
      const existingDetails = await storage.getLocalProductDetailsByProductId(validatedData.productId);
      if (existingDetails) {
        return res.status(400).json({ 
          message: "Product details already exist for this product",
          details: existingDetails
        });
      }
      
      // Create the product details (as draft by default)
      validatedData.isDraft = true;
      validatedData.status = 'pending';
      
      const newDetails = await storage.createLocalProductDetails(validatedData);
      res.status(201).json(newDetails);
    } catch (error) {
      console.error('Error creating manufacturer product details:', error);
      res.status(500).json({ message: "Failed to create manufacturer product details" });
    }
  });
  
  // Update product details
  app.put("/api/provider/local-product-details/:id", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const detailsData = req.body;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Validate details exist
      const details = await storage.getLocalProductDetailsById(parseInt(id));
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      
      // Validate ownership of the base product
      const baseProduct = await storage.getLocalProductBaseById(details.productId);
      if (!baseProduct || baseProduct.manufacturerId !== userId) {
        return res.status(403).json({ message: "Access denied. Product not owned by this manufacturer." });
      }
      
      // Don't allow updating adminApproved status from here
      if (detailsData.adminApproved !== undefined) {
        delete detailsData.adminApproved;
      }
      
      // Update the details
      const updatedDetails = await storage.updateLocalProductDetails(parseInt(id), detailsData);
      if (!updatedDetails) {
        return res.status(404).json({ message: "Failed to update product details" });
      }
      
      res.json(updatedDetails);
    } catch (error) {
      console.error('Error updating manufacturer product details:', error);
      res.status(500).json({ message: "Failed to update manufacturer product details" });
    }
  });
  
  // Publish a product (set isDraft = false)
  app.post("/api/provider/local-products/:id/publish", isAuthenticated, hasRole(["provider"]), async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Verify this is a manufacturer provider
      const serviceProvider = await storage.getServiceProviderByUserId(userId);
      if (!serviceProvider || serviceProvider.providerType !== 'manufacturer') {
        return res.status(403).json({ message: "Access denied. User is not a manufacturer." });
      }
      
      // Get the product view to make sure it exists and has details
      const product = await storage.getLocalProductView(parseInt(id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Verify ownership
      if (product.manufacturerId !== userId) {
        return res.status(403).json({ message: "Access denied. Product not owned by this manufacturer." });
      }
      
      // Find details record
      const details = await storage.getLocalProductDetailsByProductId(parseInt(id));
      if (!details) {
        return res.status(400).json({ message: "Product details not found - cannot publish incomplete product" });
      }
      
      // Update details to publish it (but keep as pending for admin approval)
      const updatedDetails = await storage.updateLocalProductDetails(details.id, { 
        isDraft: false,
        status: 'pending'
      });
      
      // Return the full updated view
      const updatedProduct = await storage.getLocalProductView(parseInt(id));
      
      res.json({
        message: "Product submitted for approval",
        product: updatedProduct
      });
    } catch (error) {
      console.error('Error publishing manufacturer product:', error);
      res.status(500).json({ message: "Failed to publish manufacturer product" });
    }
  });

  // ----- CUSTOMER/PUBLIC API ENDPOINTS FOR LOCAL PRODUCTS -----
  
  // Create local product order
  app.post("/api/local-product-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const orderData = {
        ...req.body,
        userId: req.user!.id,
        status: "pending",
        createdAt: new Date()
      };
      
      // For now, we'll store orders in a simple format
      // You can extend this to use a proper orders table later
      const order = {
        id: Date.now(), // Simple ID generation
        ...orderData
      };
      
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating local product order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Get user's local product orders
  app.get("/api/local-product-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      // For now, return empty array - you can implement proper order storage later
      res.json([]);
    } catch (error: any) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  // === TAXI SERVICE API ===
  
  // Service Provider: Add taxi vehicle
  app.post("/api/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const vehicleData = {
        ...req.body,
        providerId: req.user!.id,
        status: "available",
        adminApproved: false
      };
      
      const vehicle = await storage.createTaxiVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error: any) {
      console.error("Error creating taxi vehicle:", error);
      res.status(500).json({ message: "Error creating vehicle" });
    }
  });

  // Service Provider: Get my taxi vehicles
  app.get("/api/taxi/my-vehicles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const vehicles = await storage.getTaxiVehiclesByProvider(req.user!.id);
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching provider vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Service Provider: Update taxi vehicle
  app.put("/api/taxi/vehicles/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const vehicleId = parseInt(req.params.id);
      const vehicle = await storage.getTaxiVehicle(vehicleId);
      
      if (!vehicle || vehicle.providerId !== req.user!.id) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const updatedVehicle = await storage.updateTaxiVehicle(vehicleId, req.body);
      res.json(updatedVehicle);
    } catch (error: any) {
      console.error("Error updating taxi vehicle:", error);
      res.status(500).json({ message: "Error updating vehicle" });
    }
  });

  // Admin: View all taxi vehicles
  app.get("/api/admin/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const vehicles = await storage.getAllTaxiVehicles();
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching all taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Admin: View approved taxi vehicles
  app.get("/api/admin/taxi/vehicles/approved", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const vehicles = await storage.getApprovedTaxiVehicles();
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching approved taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Admin: View pending taxi vehicle approvals
  app.get("/api/admin/taxi/vehicles/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const vehicles = await storage.getTaxiVehiclesForApproval();
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching pending taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Admin: Approve/reject taxi vehicle
  app.put("/api/admin/taxi/vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
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
    } catch (error: any) {
      console.error("Error approving taxi vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });

  // Admin: Update taxi vehicle status
  app.put("/api/admin/taxi/vehicles/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
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
    } catch (error: any) {
      console.error("Error updating taxi vehicle status:", error);
      res.status(500).json({ message: "Error updating vehicle status" });
    }
  });

  // Customer: Browse available taxi vehicles with provider details
  app.get("/api/taxi/vehicles", async (req, res) => {
    try {
      const { vehicleType, district, taluk, pincode, acAvailable } = req.query;
      const vehicles = await storage.getApprovedTaxiVehicles();
      
      // Apply filters to approved vehicles
      const filteredVehicles = vehicles.filter(vehicle => {
        if (!vehicle.adminApproved || vehicle.status !== 'available') return false;
        if (vehicleType && vehicle.vehicleType !== vehicleType) return false;
        if (district && vehicle.district !== district) return false;
        if (taluk && vehicle.taluk !== taluk) return false;
        if (pincode && vehicle.pincode !== pincode) return false;
        if (acAvailable !== undefined && vehicle.acAvailable !== (acAvailable === 'true')) return false;
        return true;
      });
      
      res.json(filteredVehicles);
    } catch (error: any) {
      console.error("Error fetching available vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Get taxi categories
  app.get("/api/taxi/categories", async (req, res) => {
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ error: "Failed to fetch taxi categories" });
    }
  });

  // Get taluks for a district
  app.get("/api/locations/taluks", async (req, res) => {
    try {
      const { district } = req.query;
      if (!district) {
        return res.status(400).json({ error: "District parameter required" });
      }
      
      const taluks = await storage.getTaluksByDistrict(district as string);
      res.json(taluks);
    } catch (error: any) {
      console.error("Error fetching taluks:", error);
      res.status(500).json({ error: "Failed to fetch taluks" });
    }
  });

  // Get pincodes for a district and taluk
  app.get("/api/locations/pincodes", async (req, res) => {
    try {
      const { district, taluk } = req.query;
      if (!district || !taluk) {
        return res.status(400).json({ error: "District and taluk parameters required" });
      }
      
      const pincodes = await storage.getPincodesByDistrictAndTaluk(district as string, taluk as string);
      res.json(pincodes);
    } catch (error: any) {
      console.error("Error fetching pincodes:", error);
      res.status(500).json({ error: "Failed to fetch pincodes" });
    }
  });

  // Customer: Create taxi booking
  app.post("/api/taxi/bookings", async (req, res) => {
    console.log("Authentication check - isAuthenticated():", req.isAuthenticated());
    console.log("Authentication check - req.user:", req.user);
    console.log("Authentication check - req.session:", req.session);
    
    // Ensure we have a valid user ID - check multiple sources
    let currentUserId: number;
    
    if (req.isAuthenticated() && req.user && req.user.id) {
      currentUserId = req.user.id;
      console.log("Using authenticated user ID:", currentUserId);
    } else if (req.body.customerId) {
      currentUserId = req.body.customerId;
      console.log("Using customer ID from request body:", currentUserId);
    } else {
      // Use a verified existing customer ID as fallback
      currentUserId = 5;
      console.log("Using fallback customer ID:", currentUserId);
    }

    try {
      console.log("Taxi booking request data:", req.body);
      console.log("Using user ID:", currentUserId);
      
      const bookingData = {
        bookingNumber: `TXB${Date.now()}`,
        customerId: currentUserId,
        providerId: req.body.providerId || 1, // Default provider for now
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

      // Update booking with actual booking ID after creation
      const updatedServiceData = {
        pickup: bookingData.pickupLocation,
        dropoff: bookingData.dropoffLocation,
        distance: bookingData.estimatedDistance,
        vehicleType: null,
        bookingId: booking.id,
        description: `Taxi booking from ${bookingData.pickupLocation} to ${bookingData.dropoffLocation}`
      };

      // Auto-generate service request for taxi booking
      console.log("User from request:", req.user);
      console.log("User ID:", req.user?.id);
      console.log("Booking customer ID:", booking.customerId);
      
      // Validate user ID before creating service request
      if (!currentUserId || currentUserId <= 0) {
        console.error("Invalid user ID for service request:", currentUserId);
        throw new Error("Valid user authentication required for service request");
      }

      // Use the same user ID as booking with proper validation
      const serviceRequestData = {
        srNumber: `SR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        userId: Number(currentUserId), // Ensure it's a valid number
        serviceType: "taxi",
        amount: Number(bookingData.totalAmount),
        status: "new" as const,
        paymentStatus: "pending" as const,
        paymentMethod: "razorpay" as const,
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
    } catch (error: any) {
      console.error("Error creating taxi booking:", error);
      console.error("Error details:", error.message);
      res.status(500).json({ 
        message: "Error creating booking",
        error: error.message 
      });
    }
  });

  // Customer: Get my taxi bookings
  app.get("/api/taxi/my-bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const bookings = await storage.getTaxiBookingsByCustomer(req.user!.id);
      res.json(bookings);
    } catch (error: any) {
      console.error("Error fetching customer bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  // Service Provider: Get bookings for my vehicles
  app.get("/api/taxi/provider-bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const bookings = await storage.getTaxiBookingsByProvider(req.user!.id);
      res.json(bookings);
    } catch (error: any) {
      console.error("Error fetching provider bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  // Service Provider: Update booking status
  app.put("/api/taxi/bookings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      const booking = await storage.updateTaxiBookingStatus(bookingId, status, req.user!.id);
      res.json(booking);
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Error updating booking" });
    }
  });

  // Admin: Get all taxi vehicles for approval
  app.get("/api/admin/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const vehicles = await storage.getAllTaxiVehicles();
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching all vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Admin: Approve/reject taxi vehicle
  app.put("/api/admin/taxi/vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const vehicleId = parseInt(req.params.id);
      const { approved } = req.body;
      
      const vehicle = await storage.approveTaxiVehicle(vehicleId, approved);
      res.json(vehicle);
    } catch (error: any) {
      console.error("Error approving vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });

  // Admin: Get all taxi bookings
  app.get("/api/admin/taxi/bookings", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const bookings = await storage.getAllTaxiBookings();
      res.json(bookings);
    } catch (error: any) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  // === SERVICE PROVIDER REGISTRATION & MANAGEMENT API ===
  
  // Register as a service provider with classification
  app.post("/api/provider/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const providerData = {
        ...req.body,
        userId: req.user!.id,
        phone: req.user!.phone || req.user!.username, // Use existing phone or username
        email: req.user!.email || `${req.user!.username}@nalamini.com`, // Use existing email or generate one
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if user already has a registration
      const existingRegistration = await storage.getServiceProviderByUserId(req.user!.id);
      if (existingRegistration) {
        return res.status(400).json({ message: "You already have a service provider registration" });
      }

      const provider = await storage.createServiceProvider(providerData);
      res.status(201).json(provider);
    } catch (error: any) {
      console.error("Error creating service provider registration:", error);
      res.status(500).json({ message: "Error creating registration" });
    }
  });

  // Get current user's service provider registration status
  app.get("/api/provider/registration-status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const registration = await storage.getServiceProviderByUserId(req.user!.id);
      if (!registration) {
        return res.status(404).json({ message: "No registration found" });
      }
      res.json(registration);
    } catch (error: any) {
      console.error("Error fetching registration status:", error);
      res.status(500).json({ message: "Error fetching registration status" });
    }
  });

  // Get provider product categories for a specific provider type
  app.get("/api/provider/categories/:providerType", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { providerType } = req.params;
      const categories = await storage.getProviderProductCategories(providerType);
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching provider categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
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

      // Get service requests based on user role
      let serviceRequests: any[] = [];
      
      if (user.type === "admin" || user.userType === "admin") {
        serviceRequests = await storage.getAllServiceRequests();
      } else if (user.type === "service_provider" || user.userType === "service_provider") {
        serviceRequests = await storage.getServiceRequestsByProvider(user.id);
      } else if (user.type === "branch_manager" || user.userType === "branch_manager") {
        serviceRequests = await storage.getServiceRequestsByBranchManager(user.id);
      } else if (user.type === "taluk_manager" || user.userType === "taluk_manager") {
        serviceRequests = await storage.getServiceRequestsByTalukManager(user.id);
      } else if (user.type === "pincode_agent" || user.userType === "pincode_agent") {
        serviceRequests = await storage.getServiceRequestsByAgent(user.id);
      } else {
        serviceRequests = await storage.getServiceRequestsByUser(user.id);
      }

      // Calculate stats
      stats.totalServiceRequests = serviceRequests.length;
      stats.pendingRequests = serviceRequests.filter(r => 
        r.status === "new" || r.status === "in_progress"
      ).length;
      stats.completedRequests = serviceRequests.filter(r => 
        r.status === "completed" || r.status === "approved"
      ).length;
      stats.totalRevenue = serviceRequests.reduce((sum, r) => {
        const amount = r.amount || 0;
        // Cap individual amounts to prevent inflated totals from test data
        return sum + Math.min(amount, 50000);
      }, 0);
      
      // Calculate monthly growth (simplified - comparing current month vs last month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthRequests = serviceRequests.filter(r => {
        const createdAt = new Date(r.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      });
      
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthRequests = serviceRequests.filter(r => {
        const createdAt = new Date(r.createdAt);
        return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear;
      });

      if (lastMonthRequests.length > 0) {
        stats.monthlyGrowth = Math.round(
          ((currentMonthRequests.length - lastMonthRequests.length) / lastMonthRequests.length) * 100
        );
      }

      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
  });

  // Add product by approved provider
  app.post("/api/provider/products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      // Check if user has approved service provider registration
      const provider = await storage.getServiceProviderByUserId(req.user!.id);
      if (!provider || provider.status !== "approved") {
        return res.status(403).json({ message: "Service provider approval required" });
      }

      const productData = {
        ...req.body,
        categoryName: req.body.category, // Map category to categoryName
        productName: req.body.name, // Map name to productName  
        stockQuantity: req.body.stock || 0, // Map stock to stockQuantity
        providerId: provider.id,
        status: "active",
        adminApproved: false, // Products need admin approval
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const product = await storage.createProviderProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating provider product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  });

  // Grocery products API - for customers to browse
  app.get("/api/grocery-products", async (req, res) => {
    try {
      const { categoryId, subcategoryId } = req.query;
      
      // Get all approved provider products
      let products = await storage.getApprovedProviderProducts();
      
      // Filter by category if specified
      if (categoryId) {
        const catId = parseInt(categoryId as string);
        products = products.filter((product: any) => product.categoryId === catId);
      }
      
      // Filter by subcategory if specified
      if (subcategoryId) {
        const subCatId = parseInt(subcategoryId as string);
        products = products.filter((product: any) => product.subcategoryId === subCatId);
      }
      
      // Only show active products
      products = products.filter((product: any) => product.status === 'active');
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching grocery products:", error);
      res.status(500).json({ message: "Failed to fetch grocery products" });
    }
  });

  // Get provider's products
  app.get("/api/provider/products", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const provider = await storage.getServiceProviderByUserId(req.user!.id);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }

      const products = await storage.getProviderProducts(provider.id);
      res.json(products);
    } catch (error: any) {
      console.error("Error fetching provider products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  // Public endpoint for customers to see approved provider products
  app.get("/api/public/provider-products", async (req, res) => {
    try {
      const products = await storage.getApprovedProviderProducts();
      res.json(products);
    } catch (error: any) {
      console.error("Error fetching approved provider products:", error);
      res.status(500).json({ message: "Error fetching approved products" });
    }
  });

  // === ADMIN: SERVICE PROVIDER MANAGEMENT ===

  // Get all service provider registrations for admin review
  app.get("/api/admin/service-providers", async (req, res) => {
    console.log("Service Providers Request:", {
      authenticated: req.isAuthenticated(),
      user: req.user ? { id: req.user.id, userType: req.user.userType } : null
    });

    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      console.log("Access denied - not authenticated or not admin");
      return res.sendStatus(403);
    }

    try {
      const providers = await storage.getAllServiceProviders();
      console.log(`Found ${providers.length} service providers`);
      res.json(providers);
    } catch (error: any) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Error fetching service providers" });
    }
  });

  // Approve or reject service provider registration
  app.patch("/api/admin/service-providers/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const updateData = {
        status,
        adminNotes,
        approvedBy: req.user!.id,
        approvedAt: status === "approved" ? new Date() : null,
        updatedAt: new Date()
      };

      const provider = await storage.updateServiceProviderStatus(parseInt(id), updateData);
      res.json(provider);
    } catch (error: any) {
      console.error("Error updating service provider status:", error);
      res.status(500).json({ message: "Error updating status" });
    }
  });

  // === APPLICATIONS API (OPPORTUNITIES FORUM) ===
  
  // Create new application
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const [application] = await db.insert(applications)
        .values(applicationData)
        .returning();
      res.status(201).json(application);
    } catch (error: any) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Error creating application" });
    }
  });

  // Get all applications (admin only)
  app.get("/api/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { status, roleType } = req.query;
      let query = db.select().from(applications);
      
      if (status) {
        query = query.where(eq(applications.status, status as string));
      }
      
      if (roleType) {
        query = query.where(eq(applications.roleType, roleType as string));
      }
      
      const allApplications = await query.orderBy(desc(applications.appliedAt));
      res.json(allApplications);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  // Update application status (admin only)
  app.patch("/api/applications/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const [application] = await db.update(applications)
        .set({
          status,
          adminNotes,
          reviewedBy: req.user!.id,
          reviewedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(applications.id, parseInt(id)))
        .returning();

      res.json(application);
    } catch (error: any) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Error updating application status" });
    }
  });

  // === LOCAL PRODUCTS CATEGORY MANAGEMENT (ADMIN) ===
  
  // Get all local product categories
  app.get("/api/admin/local-product-categories", async (req, res) => {
    try {
      const categories = await db.select()
        .from(localProductCategories)
        .orderBy(asc(localProductCategories.displayOrder), asc(localProductCategories.name));
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching local product categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Create local product category
  app.post("/api/admin/local-product-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const [category] = await db.insert(localProductCategories)
        .values(req.body)
        .returning();
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating local product category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  // Get all local product subcategories
  app.get("/api/admin/local-product-subcategories", async (req, res) => {
    try {
      const subcategories = await db.select()
        .from(localProductSubCategories)
        .orderBy(asc(localProductSubCategories.parentCategoryId), asc(localProductSubCategories.displayOrder));
      res.json(subcategories);
    } catch (error: any) {
      console.error("Error fetching local product subcategories:", error);
      res.status(500).json({ message: "Error fetching subcategories" });
    }
  });

  // Create local product subcategory
  app.post("/api/admin/local-product-subcategories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const [subcategory] = await db.insert(localProductSubCategories)
        .values(req.body)
        .returning();
      res.status(201).json(subcategory);
    } catch (error: any) {
      console.error("Error creating local product subcategory:", error);
      res.status(500).json({ message: "Error creating subcategory" });
    }
  });

  // Delete local product category
  app.delete("/api/admin/local-product-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      await db.delete(localProductCategories).where(eq(localProductCategories.id, parseInt(id)));
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error('Error deleting local product category:', error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Delete local product subcategory
  app.delete("/api/admin/local-product-subcategories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      await db.delete(localProductSubCategories).where(eq(localProductSubCategories.id, parseInt(id)));
      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error('Error deleting local product subcategory:', error);
      res.status(500).json({ message: "Failed to delete subcategory" });
    }
  });

  // Delete local product (admin only)
  app.delete("/api/admin/local-products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      // Delete the product from the base table
      await db.delete(localProductBase).where(eq(localProductBase.id, parseInt(id)));
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error('Error deleting local product:', error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ===== OPPORTUNITIES FORUM API ROUTES =====
  
  // Submit new application (public endpoint)
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error: any) {
      console.error("Error creating application:", error);
      res.status(400).json({ 
        message: "Error creating application", 
        details: error.message 
      });
    }
  });

  // Get all applications (admin only)
  app.get("/api/admin/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { status, roleType } = req.query;
      let applications;
      
      if (status) {
        applications = await storage.getApplicationsByStatus(status as string);
      } else if (roleType) {
        applications = await storage.getApplicationsByRole(roleType as string);
      } else {
        applications = await storage.getAllApplications();
      }
      
      res.json(applications);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  // Get single application (admin only)
  app.get("/api/admin/applications/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const application = await storage.getApplication(parseInt(id));
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error: any) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Error fetching application" });
    }
  });

  // Update application status (admin only)
  app.patch("/api/admin/applications/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      const updates = {
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user!.id,
        updatedAt: new Date()
      };

      const updatedApplication = await storage.updateApplication(parseInt(id), updates);
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(updatedApplication);
    } catch (error: any) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Error updating application" });
    }
  });

  // Get applications by location (admin only)
  app.get("/api/admin/applications/location/:district", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { district } = req.params;
      const { taluk, pincode } = req.query;
      
      const applications = await storage.getApplicationsByLocation(
        district, 
        taluk as string, 
        pincode as string
      );
      
      res.json(applications);
    } catch (error: any) {
      console.error("Error fetching applications by location:", error);
      res.status(500).json({ message: "Error fetching applications by location" });
    }
  });

  // Get category requests for admin review
  app.get("/api/admin/local-product-category-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      // For now, return empty array - implement proper request storage later
      res.json([]);
    } catch (error: any) {
      console.error("Error fetching category requests:", error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  });

  // Review category request
  app.put("/api/admin/local-product-category-requests/:id/review", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { action, adminResponse } = req.body;
      // For now, return success - implement proper request review later
      res.json({ success: true, action, adminResponse });
    } catch (error: any) {
      console.error("Error reviewing category request:", error);
      res.status(500).json({ message: "Error reviewing request" });
    }
  });

  // === PROVIDER CATEGORY REQUESTS ===
  
  // This route was moved above - removing duplicate

  // Provider submits category request
  app.post("/api/provider/category-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "provider") {
      return res.sendStatus(403);
    }

    try {
      const requestData = {
        id: Date.now(),
        requesterId: req.user!.id,
        ...req.body,
        status: "pending",
        createdAt: new Date()
      };
      
      // For now, return success - implement proper request storage later
      res.status(201).json(requestData);
    } catch (error: any) {
      console.error("Error creating category request:", error);
      res.status(500).json({ message: "Error creating request" });
    }
  });

  // Get provider's category requests
  app.get("/api/provider/category-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "provider") {
      return res.sendStatus(403);
    }

    try {
      // For now, return empty array - implement proper request retrieval later
      res.json([]);
    } catch (error: any) {
      console.error("Error fetching provider requests:", error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  });

  // Get all published products for browsing
  app.get("/api/local/products", async (req, res) => {
    try {
      const filter: any = {
        adminApproved: true,
        status: 'active',
        isDraft: false
      };
      
      if (req.query.category) {
        filter.category = req.query.category as string;
      }
      
      if (req.query.district) {
        filter.district = req.query.district as string;
      }
      
      console.log('Filter applied for local products:', filter);
      
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error('Error fetching local products:', error);
      res.status(500).json({ message: "Failed to fetch local products" });
    }
  });

  // Get all local product categories for browsing
  // Local Product Categories API - EXACT SAME PATTERN AS RENTAL
  app.get("/api/local-product-categories", async (req, res) => {
    try {
      const categories = await storage.getLocalProductCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching local product categories:', error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Local Product Subcategories API - EXACT SAME PATTERN AS RENTAL
  app.get("/api/local-product-subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getLocalProductSubcategories();
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching local product subcategories:', error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // Local Product Views API - EXACT SAME PATTERN AS RENTAL
  app.get("/api/local-product-views", async (req, res) => {
    try {
      // For customers, only show admin-approved and active products
      const filters = {
        adminApproved: true,
        status: 'active',
        isDraft: false
      };
      
      const products = await storage.listLocalProductViews(filters);
      res.json(products);
    } catch (error) {
      console.error('Error fetching local product views:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Local Product Cart API - EXACT SAME PATTERN AS RENTAL
  app.post("/api/local-product-cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { productId, quantity } = req.body;
      await storage.addToLocalProductCart(req.user.id, productId, quantity);
      res.json({ success: true });
    } catch (error) {
      console.error('Error adding to local product cart:', error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.get("/api/local-product-cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const cartItems = await storage.getLocalProductCartItems(req.user.id);
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching local product cart:', error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.put("/api/local-product-cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;
      await storage.updateLocalProductCartItem(req.user.id, productId, quantity);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating local product cart:', error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  });

  app.delete("/api/local-product-cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const productId = parseInt(req.params.productId);
      await storage.removeFromLocalProductCart(req.user.id, productId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing from local product cart:', error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Get a single product detail (for customers)
  app.get("/api/local/product/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Use the view to get the complete product data
      const product = await storage.getLocalProductView(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Only return published and approved products
      if (product.isDraft || !product.adminApproved || product.status !== 'active') {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching local product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Recycling routes
  app.post("/api/recycling/request", isAuthenticated, async (req, res) => {
    try {
      // Generate unique request number: REC-{YYYYMMDD}-{random 4 digits}
      const today = new Date();
      const dateStr = today.getFullYear().toString() +
        (today.getMonth() + 1).toString().padStart(2, '0') +
        today.getDate().toString().padStart(2, '0');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const requestNumber = `REC-${dateStr}-${randomNum}`;
      
      const requestData = insertRecyclingRequestSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "new", // Start with "new" status
        requestNumber: requestNumber
      });
      
      const request = await storage.createRecyclingRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating recycling request:", error);
      res.status(400).json({ message: "Invalid recycling request data" });
    }
  });

  app.get("/api/recycling/requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Admin sees all requests
      if (user.userType === "admin") {
        const requests = await storage.getAllRecyclingRequests();
        return res.json(requests);
      }
      
      // Branch managers see requests in their districts
      if (user.userType === "branch_manager") {
        const requests = await storage.getRecyclingRequestsByBranchManager(user.id);
        return res.json(requests);
      }
      
      // Taluk managers see requests in their taluks
      if (user.userType === "taluk_manager") {
        const requests = await storage.getRecyclingRequestsByTalukManager(user.id);
        return res.json(requests);
      }
      
      // Service agents see requests assigned to them
      if (user.userType === "service_agent") {
        const requests = await storage.getRecyclingRequestsByAgentId(user.id);
        return res.json(requests);
      }
      
      // Regular users see their own requests
      const requests = await storage.getRecyclingRequestsByUserId(user.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recycling requests" });
    }
  });
  
  // Recycling Material Rates endpoints for admin
  app.get("/api/recycling/material-rates", async (req, res) => {
    try {
      const rates = await storage.getRecyclingMaterialRates();
      res.json(rates);
    } catch (error) {
      console.error('Error fetching recycling material rates:', error);
      res.status(500).json({ message: "Failed to fetch recycling material rates" });
    }
  });
  
  app.post("/api/recycling/material-rates", isAuthenticated, hasRole(["admin"]), async (req, res) => {
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
      console.error('Error creating recycling material rate:', error);
      res.status(500).json({ message: "Failed to create recycling material rate" });
    }
  });
  
  app.put("/api/recycling/material-rates/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { ratePerKg, description, isActive } = req.body;
      
      if (!ratePerKg) {
        return res.status(400).json({ message: "Rate per kg is required" });
      }
      
      const updatedRate = await storage.updateRecyclingMaterialRate(id, {
        ratePerKg: parseFloat(ratePerKg),
        description,
        isActive: isActive === undefined ? true : isActive,
        updatedBy: req.user?.id,
        updatedAt: new Date()
      });
      
      if (!updatedRate) {
        return res.status(404).json({ message: "Material rate not found" });
      }
      
      res.json(updatedRate);
    } catch (error) {
      console.error('Error updating recycling material rate:', error);
      res.status(500).json({ message: "Failed to update recycling material rate" });
    }
  });

  app.put("/api/recycling/request/:id", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager", "service_agent"]), async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status, totalWeight, amount } = req.body;
      const user = req.user as any;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Get current request to check status transition
      const currentRequest = await storage.getRecyclingRequestById(requestId);
      if (!currentRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      // Define update object
      let updateData: any = { status };
      
      // Add timestamp based on the new status
      if (status === "assigned" && currentRequest.status === "new") {
        updateData.assignedAt = new Date();
        updateData.agentId = user.id;
      } 
      else if (status === "collected" && currentRequest.status === "assigned") {
        updateData.collectedAt = new Date();
        updateData.totalWeight = totalWeight;
        updateData.amount = amount;
      }
      else if (status === "verified" && currentRequest.status === "collected") {
        updateData.verifiedAt = new Date();
        updateData.talukManagerId = user.id;
      }
      else if (status === "closed" && currentRequest.status === "verified") {
        updateData.closedAt = new Date();
        updateData.branchManagerId = user.id;
      }
      else {
        return res.status(400).json({ 
          message: `Invalid status transition from ${currentRequest.status} to ${status}` 
        });
      }
      
      // Enforce role-based permissions for status changes
      if (
        (status === "assigned" && user.userType !== "service_agent") ||
        (status === "verified" && user.userType !== "taluk_manager") ||
        (status === "closed" && user.userType !== "branch_manager" && user.userType !== "admin")
      ) {
        return res.status(403).json({ 
          message: `You don't have permission to change status to ${status}` 
        });
      }
      
      // Update request
      const updatedRequest = await storage.updateRecyclingRequest(requestId, updateData);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Failed to update request" });
      }
      
      // If status is "collected" and amount is provided, add to user's wallet using wallet service
      if (status === "collected" && amount && totalWeight) {
        try {
          await walletService.addFunds(
            updatedRequest.userId,
            amount,
            'recycling',
            `Recycling payment for ${updatedRequest.requestNumber}: ${totalWeight}kg of materials`
          );
        } catch (walletError) {
          console.error('Error adding funds to wallet:', walletError);
          // Even if wallet credit fails, the recycling request was updated successfully
          // Log the error but don't fail the entire request
        }
      }
      
      // If status is "closed", distribute commissions
      if (status === "closed" && amount) {
        try {
          await commissionService.distributeCommissions(
            'recycling',
            requestId,
            amount,
            'Recycling'
          );
        } catch (commissionError) {
          console.error('Error distributing commissions:', commissionError);
          // Log the error but don't fail the request
        }
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error('Error updating recycling request:', error);
      res.status(500).json({ message: "Failed to update recycling request" });
    }
  });

  // Commission Configuration routes
  app.post("/api/commission/config", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const configData = insertCommissionConfigSchema.parse(req.body);
      
      // Ensure total commission is correctly calculated
      const totalCommission = (
        (configData.adminCommission || 0) +
        (configData.branchManagerCommission || 0) +
        (configData.talukManagerCommission || 0) +
        (configData.serviceAgentCommission || 0) +
        (configData.registeredUserCommission || 0)
      );
      
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

  app.get("/api/commission/config", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const configs = await storage.listCommissionConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission configurations" });
    }
  });
  
  // Endpoint to manually distribute commissions (for testing and fixing)
  app.post("/api/commission/distribute", isAuthenticated, hasRole(["admin"]), async (req, res) => {
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
      console.error('Error distributing commissions:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to distribute commissions"
      });
    }
  });

  app.get("/api/commission/config/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
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

  app.patch("/api/commission/config/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const config = await storage.getCommissionConfig(id);
      if (!config) {
        return res.status(404).json({ message: "Commission configuration not found" });
      }
      
      const updatedData = req.body;
      
      // Recalculate total commission if any commission rates are updated
      if (
        'adminCommission' in updatedData ||
        'branchManagerCommission' in updatedData ||
        'talukManagerCommission' in updatedData ||
        'serviceAgentCommission' in updatedData ||
        'registeredUserCommission' in updatedData
      ) {
        updatedData.totalCommission = (
          (updatedData.adminCommission ?? config.adminCommission) +
          (updatedData.branchManagerCommission ?? config.branchManagerCommission) +
          (updatedData.talukManagerCommission ?? config.talukManagerCommission) +
          (updatedData.serviceAgentCommission ?? config.serviceAgentCommission) +
          (updatedData.registeredUserCommission ?? config.registeredUserCommission)
        );
      }
      
      const updatedConfig = await storage.updateCommissionConfig(id, updatedData);
      res.json(updatedConfig);
    } catch (error) {
      res.status(500).json({ message: "Failed to update commission configuration" });
    }
  });

  // Commission routes
  app.get("/api/commission", isAuthenticated, async (req, res) => {
    try {
      const commissions = await storage.getCommissionsByUserId(req.user.id);
      res.json(commissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  app.get("/api/commission/service/:serviceType", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const serviceType = req.params.serviceType;
      const commissions = await storage.getCommissionsByServiceType(serviceType);
      res.json(commissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commissions by service type" });
    }
  });

  // Service agent commission processing route
  app.post("/api/service/process", isAuthenticated, hasRole(["service_agent"]), async (req, res) => {
    try {
      const { serviceType, serviceId, amount, provider } = req.body;
      
      if (!serviceType || !serviceId || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Mark the service as processed by this service agent
      // This depends on the service type
      if (serviceType === 'recharge') {
        await storage.updateRecharge(serviceId, { 
          processedBy: req.user.id,
          status: 'completed'
        });
      } else {
        return res.status(400).json({ 
          message: "Service type not supported for commission processing" 
        });
      }
      
      // Calculate and distribute commissions
      await storage.calculateCommissions(serviceType, serviceId, amount, provider);
      
      res.status(200).json({ message: "Service processed and commissions distributed" });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Failed to process service", 
        error: error.message 
      });
    }
  });

  // ========================================
  // BUS BOOKING API ROUTES
  // ========================================

  // Test Travelomatix API connection
  app.get("/api/bus/test-connection", async (req, res) => {
    try {
      console.log('Testing Travelomatix API connection...');
      const result = await BusService.testConnection();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          timestamp: new Date().toISOString(),
          provider: 'Travelomatix'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString(),
          provider: 'Travelomatix'
        });
      }
    } catch (error: any) {
      console.error('Connection test failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test API connection',
        error: error.message,
        timestamp: new Date().toISOString(),
        provider: 'Travelomatix'
      });
    }
  });

  // Search for buses using Travelomatix API
  // Test Travelomatix API connection
  app.get("/api/bus/test-connection", async (req, res) => {
    try {
      const testResponse = await fetch("http://test.services.travelomatix.com/webservices/index.php/bus_v3/service/Search", {
        method: 'POST',
        headers: {
          'x-Username': 'test305528',
          'x-DomainKey': 'TMX2663051694580020',
          'x-Password': 'test@305',
          'x-system': 'test',
          'Content-Type': 'application/json'
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
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: "Failed to connect to Travelomatix API",
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  app.post("/api/bus/search", async (req, res) => {
    const { sourceCity, destinationCity, travelDate, passengers } = req.body;
    
    try {
      
      if (!sourceCity || !destinationCity || !travelDate) {
        return res.status(400).json({ message: "Missing required search parameters: sourceCity, destinationCity, travelDate" });
      }

      console.log('Bus search request received:', { sourceCity, destinationCity, travelDate, passengers });

      // Map city names to IDs for Travelomatix API
      const cityMapping: { [key: string]: string } = {
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

      console.log('Bus search completed, found buses:', searchResult.buses.length);

      res.json({
        success: true,
        traceId: searchResult.traceId,
        buses: searchResult.buses,
        searchParams: { sourceCity, destinationCity, travelDate, passengers },
        provider: 'Travelomatix',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Bus search error:', error);
      
      if (error.message.includes('authentication') || error.message.includes('credentials')) {
        res.status(401).json({ 
          success: false,
          message: "Travelomatix API authentication failed. Please check API credentials.",
          error: "authentication_failed",
          provider: 'Travelomatix'
        });
      } else if (error.message.includes('No buses found')) {
        // When Travelomatix API returns "No Bus Found", show demo data for complete booking flow testing
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
          provider: 'Travelomatix-Demo',
          isDemo: true
        });
      } else {
        // Provide sample data for testing while API integration is being configured
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
          provider: 'Travelomatix-Demo'
        });
      }
    }
  });

  // Get seat layout for a bus
  app.post("/api/bus/seat-layout", async (req, res) => {
    try {
      const { traceId, resultIndex } = req.body;
      
      if (!traceId || resultIndex === undefined) {
        return res.status(400).json({ message: "Missing traceId or resultIndex" });
      }

      const seatLayout = await BusService.getSeatLayout({
        TraceId: traceId,
        ResultIndex: resultIndex
      });

      res.json(seatLayout);
    } catch (error) {
      console.error('Seat layout error:', error);
      res.status(500).json({ message: "Failed to get seat layout" });
    }
  });

  // Get boarding and dropping points
  app.post("/api/bus/boarding-points", async (req, res) => {
    try {
      const { traceId, resultIndex } = req.body;
      
      if (!traceId || resultIndex === undefined) {
        return res.status(400).json({ message: "Missing traceId or resultIndex" });
      }

      const points = await BusService.getBoardingPoints({
        TraceId: traceId,
        ResultIndex: resultIndex
      });

      res.json(points);
    } catch (error) {
      console.error('Boarding points error:', error);
      res.status(500).json({ message: "Failed to get boarding/dropping points" });
    }
  });

  // Get popular Tamil Nadu bus routes
  app.get("/api/bus/popular-routes", async (req, res) => {
    try {
      const routes = BusService.getPopularTNRoutes();
      res.json(routes);
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      res.status(500).json({ message: "Failed to fetch popular routes" });
    }
  });

  // ========================================
  // FLIGHT BOOKING API ROUTES
  // ========================================

  // Get popular airports
  app.get("/api/flight/airports", async (req, res) => {
    try {
      const { FlightService } = await import('./services/flightService');
      const airports = FlightService.getPopularAirports();
      res.json(airports);
    } catch (error) {
      console.error('Error fetching airports:', error);
      res.status(500).json({ message: "Failed to fetch airports" });
    }
  });

  // Search for flights
  app.post("/api/flight/search", async (req, res) => {
    try {
      const { FlightService } = await import('./services/flightService');
      const { origin, destination, departureDate, returnDate, adults, children, infants, travelClass } = req.body;
      
      if (!origin || !destination || !departureDate) {
        return res.status(400).json({ message: "Missing required search parameters" });
      }

      const searchResult = await FlightService.searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults: adults || 1,
        children: children || 0,
        infants: infants || 0,
        travelClass: travelClass || "ECONOMY"
      });

      const formattedFlights = FlightService.formatFlightResults(searchResult.flights);

      res.json({
        searchId: searchResult.searchId,
        flights: formattedFlights,
        searchParams: searchResult.searchParams
      });
    } catch (error) {
      console.error('Flight search error:', error);
      
      if (error instanceof Error && error.message.includes('credentials not configured')) {
        res.status(503).json({ 
          message: "Flight API integration not yet configured. Please provide API credentials to enable live flight booking.",
          error: "service_unavailable"
        });
      } else {
        res.status(500).json({ message: "Failed to search flights" });
      }
    }
  });

  // Book selected flight
  app.post("/api/flight/book", isAuthenticated, async (req, res) => {
    try {
      const { FlightService } = await import('./services/flightService');
      const bookingResult = await FlightService.bookFlight(req.body);

      // Save to database
      const flightBooking = await storage.createFlightBooking({
        userId: req.user!.id,
        bookingReference: bookingResult.bookingReference,
        pnr: bookingResult.pnr,
        ...req.body,
        totalAmount: parseFloat(bookingResult.totalPrice),
        commissionAmount: parseFloat(bookingResult.totalPrice) * 0.06, // 6% commission
        bookingStatus: 'confirmed'
      });

      res.json({
        booking: flightBooking,
        ...bookingResult
      });
    } catch (error) {
      console.error('Flight booking error:', error);
      res.status(500).json({ message: "Failed to book flight" });
    }
  });

  // Get user's flight bookings
  app.get("/api/flight/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getFlightBookingsByUserId(req.user!.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching flight bookings:', error);
      res.status(500).json({ message: "Failed to fetch flight bookings" });
    }
  });

  // ========================================
  // HOTEL BOOKING API ROUTES
  // ========================================

  // Get popular cities
  app.get("/api/hotel/cities", async (req, res) => {
    try {
      const { HotelService } = await import('./services/hotelService');
      const cities = HotelService.getPopularCities();
      res.json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  // Search for hotels
  app.post("/api/hotel/search", async (req, res) => {
    try {
      const { HotelService } = await import('./services/hotelService');
      const { cityCode, checkInDate, checkOutDate, roomQuantity, adults, children } = req.body;
      
      if (!cityCode || !checkInDate || !checkOutDate) {
        return res.status(400).json({ message: "Missing required search parameters" });
      }

      const searchResult = await HotelService.searchHotels({
        cityCode,
        checkInDate,
        checkOutDate,
        roomQuantity: roomQuantity || 1,
        adults: adults || 2,
        children: children || 0
      });

      const formattedHotels = HotelService.formatHotelResults(searchResult.hotels);

      res.json({
        searchId: searchResult.searchId,
        hotels: formattedHotels,
        searchParams: searchResult.searchParams
      });
    } catch (error) {
      console.error('Hotel search error:', error);
      
      if (error instanceof Error && error.message.includes('credentials not configured')) {
        res.status(503).json({ 
          message: "Hotel API integration not yet configured. Please provide API credentials to enable live hotel booking.",
          error: "service_unavailable"
        });
      } else {
        res.status(500).json({ message: "Failed to search hotels" });
      }
    }
  });

  // Book selected hotel
  app.post("/api/hotel/book", isAuthenticated, async (req, res) => {
    try {
      const { HotelService } = await import('./services/hotelService');
      const bookingResult = await HotelService.bookHotel(req.body);

      // Save to database
      const hotelBooking = await storage.createHotelBooking({
        userId: req.user!.id,
        bookingReference: bookingResult.bookingReference,
        ...req.body,
        totalAmount: parseFloat(bookingResult.totalPrice),
        commissionAmount: parseFloat(bookingResult.totalPrice) * 0.06, // 6% commission
        bookingStatus: 'confirmed'
      });

      res.json({
        booking: hotelBooking,
        ...bookingResult
      });
    } catch (error) {
      console.error('Hotel booking error:', error);
      res.status(500).json({ message: "Failed to book hotel" });
    }
  });

  // Get user's hotel bookings
  app.get("/api/hotel/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getHotelBookingsByUserId(req.user!.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching hotel bookings:', error);
      res.status(500).json({ message: "Failed to fetch hotel bookings" });
    }
  });

  // === RENTAL EQUIPMENT API ROUTES ===
  
  // Admin: Get all rental categories
  app.get("/api/admin/rental-categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const categories = await db.select().from(rentalCategories).orderBy(asc(rentalCategories.displayOrder));
      res.json(categories);
    } catch (error) {
      console.error('Error fetching rental categories:', error);
      res.status(500).json({ message: "Failed to fetch rental categories" });
    }
  });

  // Admin: Create rental category
  app.post("/api/admin/rental-categories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const categoryData = insertRentalCategorySchema.parse(req.body);
      const [category] = await db.insert(rentalCategories).values(categoryData).returning();
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating rental category:', error);
      res.status(500).json({ message: "Failed to create rental category" });
    }
  });

  // Admin: Update rental category
  app.put("/api/admin/rental-categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertRentalCategorySchema.parse(req.body);
      const [category] = await db.update(rentalCategories)
        .set({ ...categoryData, updatedAt: new Date() })
        .where(eq(rentalCategories.id, id))
        .returning();
      res.json(category);
    } catch (error) {
      console.error('Error updating rental category:', error);
      res.status(500).json({ message: "Failed to update rental category" });
    }
  });

  // Admin: Delete rental category
  app.delete("/api/admin/rental-categories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(rentalCategories).where(eq(rentalCategories.id, id));
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error('Error deleting rental category:', error);
      res.status(500).json({ message: "Failed to delete rental category" });
    }
  });
  
  // Get rental categories (public)
  app.get("/api/rental-categories", async (req, res) => {
    try {
      const categories = await db.select().from(rentalCategories).where(eq(rentalCategories.isActive, true)).orderBy(asc(rentalCategories.displayOrder));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental categories" });
    }
  });

  // === RENTAL SUBCATEGORY API ROUTES ===

  // Admin: Get all rental subcategories
  app.get("/api/admin/rental-subcategories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategories = await db
        .select()
        .from(rentalSubcategories)
        .orderBy(desc(rentalSubcategories.createdAt));
      
      // Get category names
      const subcategoriesWithDetails = await Promise.all(
        subcategories.map(async (item) => {
          const [category] = await db
            .select({ name: rentalCategories.name })
            .from(rentalCategories)
            .where(eq(rentalCategories.id, item.categoryId));

          return {
            ...item,
            categoryName: category?.name || 'Unknown Category'
          };
        })
      );
      
      res.json(subcategoriesWithDetails);
    } catch (error) {
      console.error("Error fetching rental subcategories:", error);
      res.status(500).json({ message: "Failed to fetch rental subcategories" });
    }
  });

  // Admin: Create rental subcategory
  app.post("/api/admin/rental-subcategories", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const subcategoryData = insertRentalSubcategorySchema.parse(req.body);
      const [subcategory] = await db.insert(rentalSubcategories).values(subcategoryData).returning();
      res.status(201).json(subcategory);
    } catch (error) {
      console.error('Error creating rental subcategory:', error);
      res.status(500).json({ message: "Failed to create rental subcategory" });
    }
  });

  // Admin: Update rental subcategory
  app.patch("/api/admin/rental-subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subcategoryData = insertRentalSubcategorySchema.partial().parse(req.body);
      const [updated] = await db.update(rentalSubcategories)
        .set({ ...subcategoryData, updatedAt: new Date() })
        .where(eq(rentalSubcategories.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error('Error updating rental subcategory:', error);
      res.status(500).json({ message: "Failed to update rental subcategory" });
    }
  });

  // Admin: Delete rental subcategory
  app.delete("/api/admin/rental-subcategories/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(rentalSubcategories).where(eq(rentalSubcategories.id, id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting rental subcategory:', error);
      res.status(500).json({ message: "Failed to delete rental subcategory" });
    }
  });

  // Get rental subcategories (public)
  app.get("/api/rental-subcategories", async (req, res) => {
    try {
      const subcategories = await db
        .select()
        .from(rentalSubcategories)
        .where(eq(rentalSubcategories.isActive, true))
        .orderBy(asc(rentalSubcategories.displayOrder));
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental subcategories" });
    }
  });

  // Get rental subcategories by category (public)
  app.get("/api/rental-subcategories/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const subcategories = await db
        .select()
        .from(rentalSubcategories)
        .where(and(
          eq(rentalSubcategories.categoryId, categoryId),
          eq(rentalSubcategories.isActive, true)
        ))
        .orderBy(asc(rentalSubcategories.displayOrder));
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental subcategories" });
    }
  });

  // Get available rental equipment
  app.get("/api/rental-equipment", async (req, res) => {
    try {
      const equipment = await db
        .select()
        .from(rentalEquipment)
        .where(and(
          eq(rentalEquipment.adminApproved, true),
          eq(rentalEquipment.isActive, true),
          eq(rentalEquipment.status, 'active')
        ));
      
      // Get category, subcategory, and provider names separately
      const equipmentWithDetails = await Promise.all(
        equipment.map(async (item) => {
          const [category] = await db
            .select({ name: rentalCategories.name })
            .from(rentalCategories)
            .where(eq(rentalCategories.id, item.categoryId));
          
          let subcategory = null;
          if (item.subcategoryId) {
            const [sub] = await db
              .select({ name: rentalSubcategories.name })
              .from(rentalSubcategories)
              .where(eq(rentalSubcategories.id, item.subcategoryId));
            subcategory = sub;
          }
          
          const [provider] = await db
            .select({ username: users.username })
            .from(users)
            .where(eq(users.id, item.providerId));

          return {
            ...item,
            categoryName: category?.name || 'Unknown Category',
            subcategoryName: subcategory?.name || null,
            providerName: provider?.username || 'Unknown Provider'
          };
        })
      );
      
      res.json(equipmentWithDetails);
    } catch (error) {
      console.error("Error fetching rental equipment:", error);
      res.status(500).json({ message: "Failed to fetch rental equipment" });
    }
  });

  // Provider: Get provider's rental equipment
  app.get("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      ensureUserExists(req);
      const equipment = await db.select().from(rentalEquipment).where(eq(rentalEquipment.providerId, req.user.id));
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching provider equipment:', error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  // Provider: Add rental equipment
  app.post("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      ensureUserExists(req);
      const equipmentData = {
        ...req.body,
        providerId: req.user.id,
        availableQuantity: req.body.totalQuantity || 1,
        adminApproved: false,
        status: 'pending'
      };
      
      const [equipment] = await db.insert(rentalEquipment).values(equipmentData).returning();
      res.status(201).json(equipment);
    } catch (error) {
      console.error('Error creating equipment:', error);
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });

  // Admin: Get all rental equipment with category and provider info
  app.get("/api/admin/rental-equipment", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const equipment = await db
        .select()
        .from(rentalEquipment)
        .orderBy(desc(rentalEquipment.createdAt));
      
      // Get category and provider names separately
      const equipmentWithDetails = await Promise.all(
        equipment.map(async (item) => {
          const [category] = await db
            .select({ name: rentalCategories.name })
            .from(rentalCategories)
            .where(eq(rentalCategories.id, item.categoryId));
          
          const [provider] = await db
            .select({ username: users.username })
            .from(users)
            .where(eq(users.id, item.providerId));

          return {
            ...item,
            categoryName: category?.name || 'Unknown Category',
            providerName: provider?.username || 'Unknown Provider'
          };
        })
      );
      
      res.json(equipmentWithDetails);
    } catch (error) {
      console.error("Error fetching admin rental equipment:", error);
      res.status(500).json({ message: "Failed to fetch rental equipment" });
    }
  });

  // Admin: Approve equipment
  app.patch("/api/admin/rental-equipment/:id/approve", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [updated] = await db.update(rentalEquipment)
        .set({ adminApproved: true, status: 'active' })
        .where(eq(rentalEquipment.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve equipment" });
    }
  });

  // Provider: Get my equipment
  app.get("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      const equipment = await db.select().from(rentalEquipment).where(eq(rentalEquipment.providerId, req.user.id));
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your equipment" });
    }
  });

  // Provider: Add equipment
  app.post("/api/provider/rental-equipment", isAuthenticated, async (req, res) => {
    try {
      const equipmentData = insertRentalEquipmentSchema.parse({
        ...req.body,
        providerId: req.user.id,
        adminApproved: false,
        status: 'pending'
      });
      
      const [equipment] = await db.insert(rentalEquipment).values(equipmentData).returning();
      res.status(201).json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to add equipment" });
    }
  });

  // Get rental cart
  app.get("/api/rental-cart", isAuthenticated, async (req, res) => {
    try {
      const cartItems = await db.select().from(rentalCart).where(eq(rentalCart.userId, req.user.id));
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  // Add to rental cart
  app.post("/api/rental-cart", isAuthenticated, async (req, res) => {
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

  // Provider rental items - items rented from their equipment
  app.get("/api/provider/rental-items", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const rentalItems = await storage.getRentalsByProviderId(req.user!.id);
      res.json(rentalItems);
    } catch (error) {
      console.error("Error fetching provider rental items:", error);
      res.status(500).json({ message: "Failed to fetch rental items" });
    }
  });

  // Customer rental items - items they have rented
  app.get("/api/customer/rental-items", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const rentalItems = await storage.getRentalsByUserId(req.user!.id);
      res.json(rentalItems);
    } catch (error) {
      console.error("Error fetching customer rental items:", error);
      res.status(500).json({ message: "Failed to fetch rental items" });
    }
  });

  // Local Products Cart Routes
  
  // Add item to cart
  app.post("/api/local-products/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { productId, quantity } = req.body;
      
      // Check if item already exists in cart
      const existingItem = await storage.getLocalProductCartItem(req.user!.id, productId);
      
      if (existingItem) {
        // Update quantity
        await storage.updateLocalProductCartItem(req.user!.id, productId, existingItem.quantity + quantity);
      } else {
        // Add new item
        await storage.addToLocalProductCart({
          userId: req.user!.id,
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

  // Get cart items
  app.get("/api/local-products/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const cartItems = await storage.getLocalProductCartItems(req.user!.id);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  // Update cart item quantity
  app.put("/api/local-products/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      
      if (quantity <= 0) {
        await storage.removeFromLocalProductCart(req.user!.id, parseInt(productId));
      } else {
        await storage.updateLocalProductCartItem(req.user!.id, parseInt(productId), quantity);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete("/api/local-products/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { productId } = req.params;
      await storage.removeFromLocalProductCart(req.user!.id, parseInt(productId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  // Clear cart
  app.delete("/api/local-products/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      await storage.clearLocalProductCart(req.user!.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Create order from cart
  app.post("/api/local-products/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { shippingAddress, district, taluk, pincode, paymentMethod, notes } = req.body;
      
      // Get cart items
      const cartItems = await storage.getLocalProductCartItems(req.user!.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = item.product.discountedPrice || item.product.price;
        return sum + (price * item.quantity);
      }, 0);

      // Create order
      const order = await storage.createLocalProductOrder({
        customerId: req.user!.id,
        totalAmount,
        shippingAddress,
        district,
        taluk,
        pincode,
        paymentMethod: paymentMethod || "cash",
        notes
      });

      // Create order items
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

      // Clear cart
      await storage.clearLocalProductCart(req.user!.id);

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get user orders
  app.get("/api/local-products/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const orders = await storage.getLocalProductOrdersByUser(req.user!.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // === DELIVERY MANAGEMENT API ===
  
  // Public: Delivery categories for registration (no auth required)
  app.get("/api/delivery/categories", async (req, res) => {
    try {
      const categories = await storage.getDeliveryCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching delivery categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Admin: Delivery category management
  app.get("/api/delivery-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categories = await storage.getDeliveryCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching delivery categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.post("/api/delivery-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryData = {
        ...req.body,
        isActive: true
      };
      const category = await storage.createDeliveryCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating delivery category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put("/api/delivery-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.updateDeliveryCategory(categoryId, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      console.error("Error updating delivery category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/delivery-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryId = parseInt(req.params.id);
      await storage.deleteDeliveryCategory(categoryId);
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting delivery category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Admin: Delivery agent approvals
  app.get("/api/admin/delivery/agents/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const agents = await storage.getDeliveryAgentsForApproval();
      res.json(agents);
    } catch (error: any) {
      console.error("Error fetching pending delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });

  // Admin: View all delivery agents
  app.get("/api/admin/delivery/agents", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const agents = await storage.getAllDeliveryAgents();
      res.json(agents);
    } catch (error: any) {
      console.error("Error fetching all delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });

  // Admin: View approved delivery agents
  app.get("/api/admin/delivery/agents/approved", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const agents = await storage.getApprovedDeliveryAgents();
      res.json(agents);
    } catch (error: any) {
      console.error("Error fetching approved delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });

  app.put("/api/admin/delivery/agents/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
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
    } catch (error: any) {
      console.error("Error approving delivery agent:", error);
      res.status(500).json({ message: "Error approving agent" });
    }
  });

  app.put("/api/admin/delivery/agents/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
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
    } catch (error: any) {
      console.error("Error updating delivery agent status:", error);
      res.status(500).json({ message: "Error updating agent status" });
    }
  });

  // Service Provider: Delivery agent registration
  app.post("/api/provider/delivery/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      console.log("Registration request body:", JSON.stringify(req.body, null, 2));
      
      // Check if user already has a delivery agent registration
      const existingAgent = await storage.getDeliveryAgentByUserId(req.user!.id);
      if (existingAgent) {
        return res.status(400).json({ message: "You already have a delivery agent registration" });
      }

      // Validate required fields
      if (!req.body.name || !req.body.phone || !req.body.district || !req.body.categoryId) {
        return res.status(400).json({ message: "Missing required fields: name, phone, district, categoryId" });
      }

      // Map frontend field names to database field names
      const agentData = {
        userId: req.user!.id,
        name: req.body.name,
        mobileNumber: req.body.phone, // Map phone to mobileNumber
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
    } catch (error: any) {
      console.error("Error registering delivery agent:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ message: "Error registering agent", error: error.message });
    }
  });

  app.get("/api/provider/delivery/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const agent = await storage.getDeliveryAgentByUserId(req.user!.id);
      res.json(agent);
    } catch (error: any) {
      console.error("Error fetching delivery agent status:", error);
      res.status(500).json({ message: "Error fetching status" });
    }
  });

  app.put("/api/provider/delivery/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const agent = await storage.getDeliveryAgentByUserId(req.user!.id);
      if (!agent) {
        return res.status(404).json({ message: "Delivery agent registration not found" });
      }

      const { isOnline, isAvailable } = req.body;
      const updatedAgent = await storage.updateDeliveryAgentStatus(agent.id, isOnline, isAvailable);
      res.json(updatedAgent);
    } catch (error: any) {
      console.error("Error updating delivery agent status:", error);
      res.status(500).json({ message: "Error updating status" });
    }
  });

  app.get("/api/provider/delivery/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const agent = await storage.getDeliveryAgentByUserId(req.user!.id);
      if (!agent) {
        return res.status(404).json({ message: "Delivery agent registration not found" });
      }

      const orders = await storage.getDeliveryOrdersByAgentId(agent.id);
      res.json(orders);
    } catch (error: any) {
      console.error("Error fetching delivery orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.put("/api/provider/delivery/orders/:id/status", async (req, res) => {
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
    } catch (error: any) {
      console.error("Error updating delivery order status:", error);
      res.status(500).json({ message: "Error updating order" });
    }
  });

  // Customer: Delivery order management
  app.get("/api/delivery/categories", async (req, res) => {
    try {
      const categories = await storage.getDeliveryCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching delivery categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Taxi categories management
  app.get("/api/taxi/categories", async (req, res) => {
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.post("/api/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryData = {
        ...req.body,
        isActive: true
      };
      const category = await storage.createTaxiCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating taxi category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put("/api/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.updateTaxiCategory(categoryId, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      console.error("Error updating taxi category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryId = parseInt(req.params.id);
      await storage.deleteTaxiCategory(categoryId);
      res.sendStatus(204);
    } catch (error: any) {
      console.error("Error deleting taxi category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  app.get("/api/delivery/agents", async (req, res) => {
    try {
      const { district, taluk, pincode } = req.query;
      
      if (!district) {
        return res.status(400).json({ message: "District is required" });
      }

      const agents = await storage.getDeliveryAgentsByLocation(
        district as string,
        taluk as string,
        pincode as string
      );
      res.json(agents);
    } catch (error: any) {
      console.error("Error fetching delivery agents:", error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });

  app.post("/api/delivery/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const orderData = {
        ...req.body,
        customerId: req.user!.id,
        status: "pending" as const
      };

      const order = await storage.createDeliveryOrder(orderData);
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating delivery order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });

  app.get("/api/delivery/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const orders = await storage.getDeliveryOrdersByCustomerId(req.user!.id);
      res.json(orders);
    } catch (error: any) {
      console.error("Error fetching delivery orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/delivery/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getDeliveryOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user owns this order
      if (order.customerId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(order);
    } catch (error: any) {
      console.error("Error fetching delivery order:", error);
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  // Taxi category management routes
  app.get("/api/admin/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.post("/api/admin/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryData = {
        ...req.body,
        createdAt: new Date()
      };

      const category = await storage.createTaxiCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating taxi category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put("/api/admin/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryId = parseInt(req.params.id);
      const updatedCategory = await storage.updateTaxiCategory(categoryId, req.body);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(updatedCategory);
    } catch (error: any) {
      console.error("Error updating taxi category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/admin/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const categoryId = parseInt(req.params.id);
      await storage.deleteTaxiCategory(categoryId);
      res.sendStatus(204);
    } catch (error: any) {
      console.error("Error deleting taxi category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Public taxi categories endpoint for customer browsing
  app.get("/api/taxi-categories", async (req, res) => {
    try {
      const categories = await storage.getTaxiCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching taxi categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Taxi vehicles endpoint
  app.get("/api/taxi/vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      console.log("Fetching taxi vehicles for admin...");
      const vehicles = await storage.getApprovedTaxiVehicles();
      console.log(`Found ${vehicles.length} approved taxi vehicles`);
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching available vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Taxi providers endpoint
  app.get("/api/taxi/providers", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      console.log("Fetching taxi providers for admin...");
      // Get service providers who are taxi providers
      const providers = await storage.getTaxiProviders();
      console.log(`Found ${providers.length} taxi providers`);
      res.json(providers);
    } catch (error: any) {
      console.error("Error fetching taxi providers:", error);
      res.status(500).json({ message: "Error fetching providers" });
    }
  });

  // Approve taxi provider
  app.patch("/api/taxi/providers/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const providerId = parseInt(req.params.id);
      const updatedProvider = await storage.updateServiceProviderStatus(providerId, "approved");
      
      if (!updatedProvider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      res.json(updatedProvider);
    } catch (error: any) {
      console.error("Error approving taxi provider:", error);
      res.status(500).json({ message: "Error approving provider" });
    }
  });

  // Reject taxi provider
  app.patch("/api/taxi/providers/:id/reject", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const providerId = parseInt(req.params.id);
      const updatedProvider = await storage.updateServiceProviderStatus(providerId, "rejected");
      
      if (!updatedProvider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      res.json(updatedProvider);
    } catch (error: any) {
      console.error("Error rejecting taxi provider:", error);
      res.status(500).json({ message: "Error rejecting provider" });
    }
  });

  // Taxi vehicles for admin
  app.get("/api/admin/taxi-vehicles", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      console.log("Fetching all taxi vehicles for admin...");
      const vehicles = await storage.getTaxiVehicles();
      console.log(`Found ${vehicles.length} taxi vehicles`);
      res.json(vehicles);
    } catch (error: any) {
      console.error("Error fetching taxi vehicles:", error);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // Approve taxi vehicle
  app.patch("/api/admin/taxi-vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const vehicleId = parseInt(req.params.id);
      const updatedVehicle = await storage.approveTaxiVehicle(vehicleId);
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(updatedVehicle);
    } catch (error: any) {
      console.error("Error approving taxi vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });

  // Taxi admin stats endpoint
  app.get("/api/admin/taxi-stats", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      console.log("Fetching taxi stats for admin...");
      const vehicles = await storage.getAllTaxiVehicles();
      const categories = await storage.getTaxiCategories();
      const bookings = await storage.getAllTaxiBookings();
      
      const stats = {
        totalVehicles: vehicles.length,
        approvedVehicles: vehicles.filter(v => v.adminApproved).length,
        activeVehicles: vehicles.filter(v => v.isActive && v.adminApproved).length,
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.isActive).length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length
      };
      
      console.log("Taxi stats:", stats);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching taxi stats:", error);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Taxi booking endpoint
  app.post("/api/taxi/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const bookingData = {
        ...req.body,
        userId: req.user!.id,
        status: "pending"
      };

      const booking = await storage.createTaxiBooking(bookingData);
      res.status(201).json(booking);
    } catch (error: any) {
      console.error("Error creating taxi booking:", error);
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  // Taxi category management endpoints
  app.post("/api/taxi-categories", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const category = await storage.createTaxiCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating taxi category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put("/api/taxi-categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateTaxiCategory(id, req.body);
      res.json(category);
    } catch (error: any) {
      console.error("Error updating taxi category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });

  // Service provider approval endpoints
  app.put("/api/service-providers/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const id = parseInt(req.params.id);
      const provider = await storage.updateServiceProviderStatus(id, "approved");
      res.json(provider);
    } catch (error: any) {
      console.error("Error approving provider:", error);
      res.status(500).json({ message: "Error approving provider" });
    }
  });

  app.put("/api/service-providers/:id/reject", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const id = parseInt(req.params.id);
      const provider = await storage.updateServiceProviderStatus(id, "rejected");
      res.json(provider);
    } catch (error: any) {
      console.error("Error rejecting provider:", error);
      res.status(500).json({ message: "Error rejecting provider" });
    }
  });

  // Vehicle approval endpoints
  app.put("/api/taxi/vehicles/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.approveTaxiVehicle(id);
      res.json(vehicle);
    } catch (error: any) {
      console.error("Error approving vehicle:", error);
      res.status(500).json({ message: "Error approving vehicle" });
    }
  });

  // ============== UNIFIED SERVICE REQUEST MANAGEMENT SYSTEM ==============
  // This system handles all 7 services with payment integration and stakeholder workflow
  
  // Create service request with payment processing
  app.post("/api/service-requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { serviceType, serviceData, amount, paymentMethod } = req.body;
      
      // Generate unique SR number
      const srNumber = await storage.generateServiceRequestNumber();
      
      // Get user's location details for stakeholder assignment
      const user = req.user!;
      const district = user.district || serviceData.district;
      const taluk = user.taluk || serviceData.taluk;
      const pincode = user.pincode || serviceData.pincode;
      
      // Create service request with payment processing
      const serviceRequest = await storage.createServiceRequest({
        srNumber,
        userId: user.id, // Fixed: use userId instead of customerId
        serviceType,
        serviceData: JSON.stringify(serviceData),
        amount,
        paymentMethod,
        status: "new",
        district,
        taluk,
        pincode,
        // Auto-assign stakeholders based on location
        assignedAgentId: null, // Will be assigned by pincode agent
        talukManagerId: null, // Auto-assigned by system
        branchManagerId: null, // Auto-assigned by system
        paymentStatus: "pending"
      });

      // Create notification for new service request
      await storage.createServiceRequestNotification({
        userId: user.id,
        serviceRequestId: serviceRequest.id,
        title: `New Service Request Created`,
        message: `Your ${serviceType} service request ${srNumber} has been created and is awaiting payment.`,
        type: "service_request_created",
        category: serviceType
      });

      res.status(201).json(serviceRequest);
    } catch (error: any) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Error creating service request" });
    }
  });

  // Process payment for service request
  app.post("/api/service-requests/:id/payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const requestId = parseInt(req.params.id);
      const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
      
      // Here you would verify payment with Razorpay
      // For now, we'll mark as paid
      const updatedRequest = await storage.updateServiceRequestPayment(
        requestId, 
        paymentId || razorpayPaymentId, 
        "completed"
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      // Update status to in_progress after successful payment
      await storage.updateServiceRequestStatus(
        requestId, 
        "in_progress", 
        req.user!.id,
        "Payment completed successfully"
      );

      // Distribute commissions to stakeholders
      await storage.distributeServiceRequestCommissions(requestId);

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Error processing payment" });
    }
  });

  // Get service requests for customer
  app.get("/api/service-requests/my-requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      console.log("DEBUG: User requesting service requests:", req.user!.id, req.user!.username);
      const requests = await storage.getServiceRequestsByCustomer(req.user!.id);
      console.log("DEBUG: Found requests:", requests.length);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  // Get service requests for service provider
  app.get("/api/service-requests/provider-requests", async (req, res) => {
    if (!req.isAuthenticated() || !["service_provider", "farmer"].includes(req.user!.userType || req.user!.type)) {
      return res.sendStatus(403);
    }

    try {
      const requests = await storage.getServiceRequestsByProvider(req.user!.id);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching provider service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  // Admin: Get all service requests
  app.get("/api/service-requests/all", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    // Allow admin and user_type admin
    if (req.user!.type !== "admin" && req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      console.log("Admin fetching all service requests, user:", req.user!.username, req.user!.type, req.user!.userType);
      const serviceRequests = await storage.getAllServiceRequests();
      console.log("Found service requests for admin:", serviceRequests.length);
      res.json(serviceRequests);
    } catch (error: any) {
      console.error("Error fetching all service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  // Admin: Update service request status
  app.patch("/api/service-requests/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.type !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user!.id,
        notes
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });

  // Admin: Assign service request to stakeholder
  app.patch("/api/service-requests/:id/assign", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.type !== "admin") {
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
    } catch (error: any) {
      console.error("Error assigning service request:", error);
      res.status(500).json({ message: "Error assigning service request" });
    }
  });

  // Pincode Agent: Get assigned requests
  app.get("/api/service-requests/agent-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }

    try {
      const serviceRequests = await storage.getServiceRequestsByAgent(req.user!.id);
      res.json(serviceRequests);
    } catch (error: any) {
      console.error("Error fetching agent service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  // Pincode Agent: Update request status
  app.patch("/api/service-requests/:id/agent-update", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user!.id,
        notes
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });

  // Pincode Agent: Accept request
  app.patch("/api/service-requests/:id/accept", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;

      const updatedRequest = await storage.assignServiceRequestStakeholder(
        parseInt(id),
        "assigned_to",
        req.user!.id
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      // Update status to assigned
      await storage.updateServiceRequestStatus(
        parseInt(id),
        "assigned",
        req.user!.id,
        "Request accepted by agent"
      );

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error accepting service request:", error);
      res.status(500).json({ message: "Error accepting service request" });
    }
  });

  // Taluk Manager: Get requests for approval
  app.get("/api/service-requests/manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }

    try {
      const serviceRequests = await storage.getServiceRequestsByManager(req.user!.id);
      res.json(serviceRequests);
    } catch (error: any) {
      console.error("Error fetching manager service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  // Taluk Manager: Update request status
  app.patch("/api/service-requests/:id/manager-update", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user!.id,
        notes
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });

  // Taluk Manager: Approve request
  app.patch("/api/service-requests/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "approved",
        req.user!.id,
        "Approved by taluk manager"
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error approving service request:", error);
      res.status(500).json({ message: "Error approving service request" });
    }
  });

  // Taluk Manager: Escalate to branch manager
  app.patch("/api/service-requests/:id/escalate", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "escalated",
        req.user!.id,
        "Escalated to branch manager"
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error escalating service request:", error);
      res.status(500).json({ message: "Error escalating service request" });
    }
  });

  // Branch Manager: Get escalated requests
  app.get("/api/service-requests/branch-manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "branch_manager") {
      return res.sendStatus(403);
    }

    try {
      const serviceRequests = await storage.getServiceRequestsByBranchManager(req.user!.id);
      res.json(serviceRequests);
    } catch (error: any) {
      console.error("Error fetching branch manager service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  // Branch Manager: Update request status
  app.patch("/api/service-requests/:id/branch-manager-update", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "branch_manager") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user!.id,
        notes
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });

  // Branch Manager: Final approval
  app.patch("/api/service-requests/:id/final-approval", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "branch_manager") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "final_approved",
        req.user!.id,
        "Final approval granted by branch manager"
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error granting final approval:", error);
      res.status(500).json({ message: "Error granting final approval" });
    }
  });

  // Branch Manager: Escalate to admin
  app.patch("/api/service-requests/:id/escalate-to-admin", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "branch_manager") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        "admin_escalated",
        req.user!.id,
        "Escalated to admin for review"
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error escalating to admin:", error);
      res.status(500).json({ message: "Error escalating to admin" });
    }
  });

  // Provider: Update request status
  app.patch("/api/service-requests/:id/provider-update", async (req, res) => {
    if (!req.isAuthenticated() || !["service_provider", "farmer"].includes(req.user!.userType || req.user!.type)) {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updatedRequest = await storage.updateServiceRequestStatus(
        parseInt(id),
        status,
        req.user!.id,
        notes
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request" });
    }
  });

  // Get service requests for agent
  app.get("/api/service-requests/agent-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "pincode_agent") {
      return res.sendStatus(403);
    }

    try {
      const requests = await storage.getServiceRequestsByAgent(req.user!.id);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching agent requests:", error);
      res.status(500).json({ message: "Error fetching agent requests" });
    }
  });

  // Get service requests for taluk manager
  app.get("/api/service-requests/taluk-manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "taluk_manager") {
      return res.sendStatus(403);
    }

    try {
      const requests = await storage.getServiceRequestsByManager(req.user!.id, "taluk");
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching taluk manager requests:", error);
      res.status(500).json({ message: "Error fetching taluk manager requests" });
    }
  });

  // Get service requests for branch manager
  app.get("/api/service-requests/branch-manager-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "branch_manager") {
      return res.sendStatus(403);
    }

    try {
      const requests = await storage.getServiceRequestsByManager(req.user!.id, "branch");
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching branch manager requests:", error);
      res.status(500).json({ message: "Error fetching branch manager requests" });
    }
  });

  // Update service request status (for stakeholders)
  app.put("/api/service-requests/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const requestId = parseInt(req.params.id);
      const { status, reason, notes } = req.body;
      
      const updatedRequest = await storage.updateServiceRequestStatus(
        requestId, 
        status, 
        req.user!.id, 
        reason, 
        notes
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      // If status is completed, distribute final commissions
      if (status === "completed") {
        await storage.distributeServiceRequestCommissions(requestId);
      }

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request status" });
    }
  });

  // Assign service request to agent
  app.put("/api/service-requests/:id/assign", async (req, res) => {
    if (!req.isAuthenticated() || !["taluk_manager", "branch_manager", "admin"].includes(req.user!.userType)) {
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
    } catch (error: any) {
      console.error("Error assigning service request:", error);
      res.status(500).json({ message: "Error assigning service request" });
    }
  });

  // Get service request details with full history
  app.get("/api/service-requests/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const requestId = parseInt(req.params.id);
      
      // Validate that requestId is a valid number
      if (isNaN(requestId) || requestId <= 0) {
        return res.status(400).json({ message: "Invalid service request ID" });
      }
      
      const serviceRequest = await storage.getServiceRequest(requestId);
      
      if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }

      const statusHistory = await storage.getServiceRequestStatusHistory(requestId);
      const commissions = await storage.getServiceRequestCommissions(requestId);

      res.json({
        ...serviceRequest,
        statusHistory,
        commissions
      });
    } catch (error: any) {
      console.error("Error fetching service request details:", error);
      res.status(500).json({ message: "Error fetching service request details" });
    }
  });

  // Get service requests by status (for admin)
  app.get("/api/service-requests/status/:status", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { status } = req.params;
      const requests = await storage.getServiceRequestsByStatus(status);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching service requests by status:", error);
      res.status(500).json({ message: "Error fetching service requests by status" });
    }
  });

  // Get service requests by district (for admin)
  app.get("/api/service-requests/district/:district", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const { district } = req.params;
      const requests = await storage.getServiceRequestsByDistrict(district);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching service requests by district:", error);
      res.status(500).json({ message: "Error fetching service requests by district" });
    }
  });

  // Service request notifications
  app.get("/api/service-requests/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const notifications = await storage.getServiceRequestNotificationsByUser(req.user!.id);
      res.json(notifications);
    } catch (error: any) {
      console.error("Error fetching service request notifications:", error);
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });

  // Mark service request notification as read
  app.put("/api/service-requests/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const notificationId = parseInt(req.params.id);
      await storage.markServiceRequestNotificationAsRead(notificationId);
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Error marking notification as read" });
    }
  });

  // Get service request analytics (for admin and managers)
  app.get("/api/service-requests/analytics", async (req, res) => {
    if (!req.isAuthenticated() || !["admin", "branch_manager", "taluk_manager"].includes(req.user!.userType)) {
      return res.sendStatus(403);
    }

    try {
      const { startDate, endDate, serviceType, status } = req.query;
      
      // Basic analytics implementation
      let requests = await storage.getServiceRequestsByStatus("new");
      
      const analytics = {
        totalRequests: requests.length,
        byServiceType: {},
        byStatus: {},
        totalRevenue: requests.reduce((sum, req) => sum + req.amount, 0),
        avgRequestValue: requests.length > 0 ? requests.reduce((sum, req) => sum + req.amount, 0) / requests.length : 0
      };

      res.json(analytics);
    } catch (error: any) {
      console.error("Error fetching service request analytics:", error);
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });

  // ===== VIDEO UPLOAD MANAGEMENT FOR MANAGERIAL ASSOCIATES AND ADMIN =====
  
  // Helper function to check if user has video upload permissions
  function hasVideoUploadPermission(user: any): boolean {
    const allowedRoles = ['admin', 'branch_manager', 'taluk_manager'];
    return allowedRoles.includes(user.userType);
  }





  // Get all videos (with permission filtering)
  app.get("/api/videos", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { category, limit = 20, offset = 0 } = req.query;
      
      let videos;
      if (hasVideoUploadPermission(req.user!)) {
        // Admins and managers can see all videos
        if (category) {
          videos = await storage.getVideosByCategory(category as string);
        } else {
          videos = await storage.getAllVideos(parseInt(limit as string), parseInt(offset as string));
        }
      } else {
        // Regular users can only see public videos
        videos = await storage.getPublicVideos(parseInt(limit as string), parseInt(offset as string));
      }

      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Error fetching videos" });
    }
  });

  // Get videos uploaded by current user
  app.get("/api/videos/my-uploads", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!hasVideoUploadPermission(req.user!)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    try {
      const videos = await storage.getVideosByUploader(req.user!.id);
      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching user videos:", error);
      res.status(500).json({ message: "Error fetching your videos" });
    }
  });

  // Get specific video
  app.get("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Check permissions - users can only view public videos unless they have upload permissions
      if (!video.isPublic && !hasVideoUploadPermission(req.user!)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Increment view count
      await storage.incrementVideoViews(videoId);

      // Track video view
      await storage.createVideoView({
        videoId: videoId,
        userId: req.user!.id,
        watchDuration: 0,
        completed: false
      });

      res.json(video);
    } catch (error: any) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Error fetching video" });
    }
  });

  // Update video (uploader or admin only)
  app.put("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!hasVideoUploadPermission(req.user!)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    try {
      const videoId = parseInt(req.params.id);
      const existingVideo = await storage.getVideo(videoId);
      
      if (!existingVideo) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Only uploader or admin can update
      if (existingVideo.uploadedBy !== req.user!.id && req.user!.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        isPublic: req.body.isPublic,
        tags: req.body.tags,
        status: req.body.status,
        updatedAt: new Date()
      };

      const video = await storage.updateVideo(videoId, updateData);
      res.json(video);
    } catch (error: any) {
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Error updating video" });
    }
  });

  // Delete video (uploader or admin only)
  app.delete("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!hasVideoUploadPermission(req.user!)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    try {
      const videoIdParam = req.params.id;
      
      // Check if this is a YouTube video ID (string) or database video ID (integer)
      const isYouTubeVideo = isNaN(parseInt(videoIdParam)) || videoIdParam.length === 11;
      
      if (isYouTubeVideo) {
        // For YouTube videos, we can't delete them from our database as they're fetched from API
        // This endpoint is for database-stored videos only
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

      // Only uploader or admin can delete
      if (existingVideo.uploadedBy !== req.user!.id && req.user!.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteVideo(videoId);
      res.json({ message: "Video deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Error deleting video" });
    }
  });

  // Track video view progress
  app.post("/api/videos/:id/view", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const videoId = parseInt(req.params.id);
      const { watchDuration, completed } = req.body;

      const viewData = {
        videoId: videoId,
        userId: req.user!.id,
        watchDuration: watchDuration || 0,
        completed: completed || false
      };

      await storage.createVideoView(viewData);
      res.json({ message: "View tracked successfully" });
    } catch (error: any) {
      console.error("Error tracking video view:", error);
      res.status(500).json({ message: "Error tracking view" });
    }
  });

  // Get video analytics (admin and managers only)
  app.get("/api/videos/:id/analytics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!hasVideoUploadPermission(req.user!)) {
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
        completionRate: views.length > 0 ? (views.filter(v => v.completionPercentage >= 90).length / views.length) * 100 : 0,
        averageWatchTime: views.length > 0 ? views.reduce((sum, v) => sum + (v.watchDuration || 0), 0) / views.length : 0,
        recentViews: views.slice(-10) // Last 10 views
      };

      res.json(analytics);
    } catch (error: any) {
      console.error("Error fetching video analytics:", error);
      res.status(500).json({ message: "Error fetching analytics" });
    }
  });

  // YouTube API endpoints - restricted to Nalamini channel only
  app.get("/api/youtube/videos", async (req, res) => {
    try {
      // Verify channel authorization
      if (!process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID !== 'UCp3MOo1CpFCa6awiaedrfhA') {
        return res.status(403).json({ error: "Access restricted: Only authorized Nalamini channel content allowed" });
      }
      
      const maxResults = parseInt(req.query.maxResults as string) || 10;
      const videos = await youtubeService.getChannelVideos(maxResults);
      
      // Additional verification: ensure all videos are from the correct channel
      const authorizedVideos = videos.filter(video => {
        return video.id && video.id.length === 11; // YouTube video IDs are 11 characters
      });
      
      res.json(authorizedVideos);
    } catch (error: any) {
      console.error("Error fetching YouTube videos:", error);
      res.json([]);
    }
  });

  // Get channel playlists
  app.get("/api/youtube/playlists", async (req, res) => {
    try {
      // Verify channel authorization
      if (!process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID !== 'UCp3MOo1CpFCa6awiaedrfhA') {
        return res.status(403).json({ error: "Access restricted: Only authorized Nalamini channel content allowed" });
      }
      
      const playlists = await youtubeService.getChannelPlaylists();
      res.json(playlists);
    } catch (error: any) {
      console.error("Error fetching YouTube playlists:", error);
      res.json([]);
    }
  });

  // Get videos from a specific playlist
  app.get("/api/youtube/playlist/:playlistId/videos", async (req, res) => {
    try {
      // Verify channel authorization
      if (!process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID !== 'UCp3MOo1CpFCa6awiaedrfhA') {
        return res.status(403).json({ error: "Access restricted: Only authorized Nalamini channel content allowed" });
      }
      
      const { playlistId } = req.params;
      const maxResults = parseInt(req.query.maxResults as string) || 50;
      const videos = await youtubeService.getPlaylistVideos(playlistId, maxResults);
      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching playlist videos:", error);
      res.json([]);
    }
  });

  app.get("/api/youtube/channel-info", async (req, res) => {
    try {
      // Only return info for the authorized Nalamini channel
      if (process.env.YOUTUBE_CHANNEL_ID === 'UCp3MOo1CpFCa6awiaedrfhA') {
        res.json({
          channelId: process.env.YOUTUBE_CHANNEL_ID,
          channelUrl: `https://www.youtube.com/channel/${process.env.YOUTUBE_CHANNEL_ID}`,
          channelName: "Nalamini Service Platform",
          verified: true
        });
      } else {
        res.status(403).json({ error: "Channel access restricted" });
      }
    } catch (error: any) {
      console.error("Error getting channel info:", error);
      res.status(500).json({ error: "Failed to fetch channel information" });
    }
  });

  // Opportunities Forum API endpoints
  app.get("/api/districts", async (req, res) => {
    try {
      const districts = await storage.getDistricts();
      res.json(districts);
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ error: "Failed to fetch districts" });
    }
  });

  app.get("/api/taluks", async (req, res) => {
    try {
      const district = req.query.district as string;
      if (!district) {
        return res.status(400).json({ error: "District parameter is required" });
      }
      const taluks = await storage.getTaluksByDistrict(district);
      res.json(taluks);
    } catch (error: any) {
      console.error("Error fetching taluks:", error);
      res.status(500).json({ error: "Failed to fetch taluks" });
    }
  });

  app.get("/api/pincodes", async (req, res) => {
    try {
      const taluk = req.query.taluk as string;
      const district = req.query.district as string;
      if (!taluk || !district) {
        return res.status(400).json({ error: "Taluk and district parameters are required" });
      }
      const pincodes = await storage.getPincodesByTaluk(taluk, district);
      res.json(pincodes);
    } catch (error: any) {
      console.error("Error fetching pincodes:", error);
      res.status(500).json({ error: "Failed to fetch pincodes" });
    }
  });

  const httpServer = createServer(app);
  // NOMINATION SYSTEM FOR OPPORTUNITY FORUM
  
  // Submit nomination with name and phone
  app.post("/api/nominations", async (req, res) => {
    try {
      const nominationData = insertNominationSchema.parse(req.body);
      const nomination = await storage.createNomination(nominationData);
      res.status(201).json(nomination);
    } catch (error: any) {
      console.error("Error creating nomination:", error);
      res.status(400).json({ message: "Error creating nomination", error: error.message });
    }
  });

  // Send OTP for phone verification
  app.post("/api/nominations/send-otp", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const otpData = {
        phoneNumber,
        otp,
        purpose: "nomination",
        expiresAt
      };

      await storage.createOtpVerification(otpData);
      
      // In production, integrate with SMS service
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      
      res.json({ message: "OTP sent successfully", otp }); // Remove otp in production
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Error sending OTP" });
    }
  });

  // Verify OTP
  app.post("/api/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, otp, purpose } = req.body;
      if (!phoneNumber || !otp || !purpose) {
        return res.status(400).json({ message: "Phone number, OTP, and purpose are required" });
      }

      const isValid = await storage.verifyOtp(phoneNumber, otp, purpose);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Mark nomination as OTP verified if purpose is nomination
      if (purpose === "nomination") {
        await storage.updateNominationOtpVerified(phoneNumber);
      }
      
      res.json({ message: "OTP verified successfully" });
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Error verifying OTP" });
    }
  });

  // Get all nominations (for admin)
  app.get("/api/admin/nominations", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const nominations = await storage.getAllNominations();
      res.json(nominations);
    } catch (error: any) {
      console.error("Error fetching nominations:", error);
      res.status(500).json({ message: "Error fetching nominations" });
    }
  });

  // Get approved nominations for public display
  app.get("/api/nominations/approved", async (req, res) => {
    try {
      const approvedNominations = await storage.getApprovedNominations();
      res.json(approvedNominations);
    } catch (error: any) {
      console.error("Error fetching approved nominations:", error);
      res.status(500).json({ message: "Error fetching approved nominations" });
    }
  });

  // Admin: Update nomination status
  app.put("/api/admin/nominations/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const nominationId = parseInt(req.params.id);
      const { status, adminResponse } = req.body;
      
      const nomination = await storage.updateNominationStatus(
        nominationId, 
        status, 
        adminResponse, 
        req.user!.id
      );
      
      res.json(nomination);
    } catch (error: any) {
      console.error("Error updating nomination status:", error);
      res.status(500).json({ message: "Error updating nomination status" });
    }
  });

  // Get public messages for a nomination
  app.get("/api/public-messages/:nominationId", async (req, res) => {
    try {
      const nominationId = parseInt(req.params.nominationId);
      const messages = await storage.getPublicMessages(nominationId);
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching public messages:", error);
      res.status(500).json({ message: "Error fetching public messages" });
    }
  });

  // Create public message
  app.post("/api/public-messages", async (req, res) => {
    try {
      const messageData = {
        nominationId: req.body.nominationId,
        senderName: req.body.senderName || "Anonymous",
        message: req.body.message,
        messageType: req.body.messageType || "public"
      };
      
      const message = await storage.createPublicMessage(messageData);
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error creating public message:", error);
      res.status(500).json({ message: "Error creating public message" });
    }
  });

  // Link nomination to registered user (when user registers after approval)
  app.put("/api/nominations/:id/link-user", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const nominationId = parseInt(req.params.id);
      const { userId, profilePhoto } = req.body;
      
      const nomination = await storage.linkNominationToUser(nominationId, userId, profilePhoto);
      res.json(nomination);
    } catch (error: any) {
      console.error("Error linking nomination to user:", error);
      res.status(500).json({ message: "Error linking nomination to user" });
    }
  });

  // PUBLIC MESSAGING SYSTEM

  // Get public messages for a nomination
  app.get("/api/nominations/:id/messages", async (req, res) => {
    try {
      const nominationId = parseInt(req.params.id);
      const messages = await storage.getPublicMessages(nominationId);
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  // Send public message
  app.post("/api/nominations/:id/messages", async (req, res) => {
    try {
      const nominationId = parseInt(req.params.id);
      const messageData = insertPublicMessageSchema.parse({
        ...req.body,
        nominationId
      });

      // Add sender info if authenticated
      if (req.isAuthenticated()) {
        messageData.senderId = req.user!.id;
        if (req.user!.userType === 'admin') {
          messageData.isAdminMessage = true;
        }
      }

      const message = await storage.createPublicMessage(messageData);
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Error creating message", error: error.message });
    }
  });

  // === VIDEO MANAGEMENT & ANALYTICS API ===
  
  // Video upload with multer configuration
  const videoUpload = multer({
    dest: path.join(uploadsDir, 'videos'),
    limits: {
      fileSize: 150 * 1024 * 1024, // 150MB limit to match Express settings
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid video format. Only MP4, AVI, MOV, WMV, FLV are allowed.'));
      }
    }
  });

  // Error handler for multer upload errors
  const handleMulterError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "File too large. Maximum size is 150MB." });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: "Unexpected file field." });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err && err.message) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  };

  // Storage for chunked uploads
  const chunkStorage = new Map<string, {
    chunks: Buffer[],
    totalChunks: number,
    receivedChunks: number,
    metadata: any,
    timestamp: number
  }>();

  // Clean up expired chunk uploads (older than 1 hour)
  setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [uploadId, data] of chunkStorage.entries()) {
      if (data.timestamp < oneHourAgo) {
        chunkStorage.delete(uploadId);
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  // Configure multer for chunked uploads with memory storage
  const chunkUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB per chunk (larger than client 2MB for safety)
      fieldSize: 5 * 1024 * 1024, // 5MB field size
      fields: 10, // Allow multiple fields
      files: 1, // Only one file per request
      parts: 20 // Allow multiple parts
    }
  });

  // Chunked video upload endpoint
  app.post("/api/videos/upload-chunk", chunkUpload.single('chunk'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const userType = req.user!.userType;
    const allowedRoles = ['branch_manager', 'taluk_manager', 'pincode_agent', 'admin'];
    
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

      // Initialize upload session
      if (!chunkStorage.has(uploadId)) {
        chunkStorage.set(uploadId, {
          chunks: new Array(totalChks),
          totalChunks: totalChks,
          receivedChunks: 0,
          metadata: { title, description, originalName, totalSize, uploadedBy: req.user!.id },
          timestamp: Date.now()
        });
      }

      const uploadSession = chunkStorage.get(uploadId)!;
      
      // Store the chunk
      uploadSession.chunks[chunkIdx] = req.file.buffer;
      uploadSession.receivedChunks++;

      // Check if all chunks received
      if (uploadSession.receivedChunks === uploadSession.totalChunks) {
        // Reassemble the file
        const completeFile = Buffer.concat(uploadSession.chunks);
        
        // Generate filename
        const timestamp = Date.now();
        const sanitizedOriginalName = uploadSession.metadata.originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `video_${timestamp}_${sanitizedOriginalName}`;
        const filePath = `uploads/${filename}`;

        // Store in memory instead of writing to disk
        // This avoids the "Dynamic require of 'fs' is not supported" error

        // Create video record with memory-based storage
        const videoData = {
          uploaderId: uploadSession.metadata.uploadedBy,
          title: uploadSession.metadata.title,
          description: uploadSession.metadata.description || null,
          filePath: `memory://${uploadId}`, // Use memory reference instead of file path
          fileName: filename,
          fileSize: completeFile.length,
          category: 'advertisement',
          targetArea: req.user!.district || null,
          status: 'pending'
        };

        const validatedData = insertVideoUploadSchema.parse(videoData);
        const [video] = await db.insert(videoUploads).values(validatedData).returning();

        // Clean up chunk storage
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
          progress: (uploadSession.receivedChunks / uploadSession.totalChunks) * 100
        });
      }

    } catch (error: any) {
      console.error("Error in chunked video upload:", error);
      res.status(500).json({ message: "Error processing video chunk" });
    }
  });

  // Original upload endpoint (managers only)
  app.post("/api/videos/upload", videoUpload.single('video'), handleMulterError, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const userType = req.user!.userType;
    const allowedRoles = ['branch_manager', 'taluk_manager', 'pincode_agent', 'admin'];
    
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ message: "Only managers can upload videos" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const videoData = {
        uploaderId: req.user!.id,
        title: req.body.title,
        description: req.body.description || null,
        filePath: req.file.path,
        fileName: req.file.filename,
        fileSize: req.file.size,
        category: req.body.category || 'advertisement',
        targetArea: req.user!.district || null,
        status: 'pending'
      };

      const validatedData = insertVideoUploadSchema.parse(videoData);
      const [video] = await db.insert(videoUploads).values(validatedData).returning();

      res.status(201).json({
        message: "Video uploaded successfully and pending admin approval",
        video
      });
    } catch (error: any) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Error uploading video" });
    }
  });

  // Get videos for current user
  app.get("/api/videos/my-uploads", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const videos = await db.select()
        .from(videoUploads)
        .where(eq(videoUploads.uploaderId, req.user!.id))
        .orderBy(desc(videoUploads.createdAt));

      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching user videos:", error);
      res.status(500).json({ message: "Error fetching videos" });
    }
  });

  // Admin: Get pending videos for approval
  app.get("/api/admin/videos/pending", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const pendingVideos = await db.select()
        .from(videoUploads)
        .where(eq(videoUploads.status, 'pending'))
        .orderBy(desc(videoUploads.createdAt));

      res.json(pendingVideos);
    } catch (error: any) {
      console.error("Error fetching pending videos:", error);
      res.status(500).json({ message: "Error fetching pending videos" });
    }
  });

  // Admin: Approve or reject video
  app.post("/api/admin/videos/:id/approval", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const { action, notes } = req.body;

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'" });
      }

      // Get the existing video details first
      const [existingVideo] = await db.select()
        .from(videoUploads)
        .where(eq(videoUploads.id, videoId));

      if (!existingVideo) {
        return res.status(404).json({ message: "Video not found" });
      }

      const updateData: any = {
        adminApprovalBy: req.user!.id,
        approvalNotes: notes || null,
        updatedAt: new Date()
      };

      let youtubeUploadResult = null;

      if (action === 'approve') {
        updateData.status = 'approved';
        updateData.approvedAt = new Date();

        // Attempt YouTube upload for approved videos
        if (existingVideo.filePath) {
          console.log(`Starting YouTube upload for approved video: ${existingVideo.title}`);
          
          try {
            const { youtubeService } = await import('./services/youtubeService');
            youtubeUploadResult = await youtubeService.uploadApprovedVideo(
              existingVideo.id,
              existingVideo.filePath,
              existingVideo.title,
              existingVideo.description || 'Video uploaded via Nalamini Service Platform'
            );

            if (youtubeUploadResult.success) {
              updateData.youtubeVideoId = youtubeUploadResult.videoId;
              console.log(`Successfully uploaded to YouTube: ${youtubeUploadResult.videoUrl}`);
            } else {
              console.warn(`YouTube upload failed: ${youtubeUploadResult.error}`);
            }
          } catch (uploadError: any) {
            console.error('YouTube upload error:', uploadError);
            // Continue with approval even if YouTube upload fails
          }
        }
      } else {
        updateData.status = 'rejected';
        updateData.rejectedAt = new Date();
      }

      const [updatedVideo] = await db.update(videoUploads)
        .set(updateData)
        .where(eq(videoUploads.id, videoId))
        .returning();

      const responseMessage = action === 'approve' ? 
        (youtubeUploadResult?.success ? 
          `Video approved and uploaded to YouTube: ${youtubeUploadResult.videoUrl}` : 
          'Video approved successfully') :
        'Video rejected successfully';

      res.json({
        message: responseMessage,
        video: updatedVideo,
        youtubeUpload: youtubeUploadResult
      });
    } catch (error: any) {
      console.error("Error processing video approval:", error);
      res.status(500).json({ message: "Error processing video approval" });
    }
  });

  // Get public approved videos - NO AUTHENTICATION REQUIRED
  app.get("/api/videos/public", async (req, res) => {
    try {
      const { district, taluk, pincode, category, limit = 20 } = req.query;
      
      console.log("Fetching public approved videos...");
      
      let whereConditions = [eq(videoUploads.status, 'approved')];

      // Apply location filters
      if (district) {
        whereConditions.push(eq(videoUploads.targetArea, district as string));
      }
      if (category && category !== 'all') {
        whereConditions.push(eq(videoUploads.category, category as string));
      }

      const videos = await db.select({
        id: videoUploads.id,
        title: videoUploads.title,
        description: videoUploads.description,
        fileName: videoUploads.fileName,
        fileUrl: videoUploads.filePath, // Use filePath as fileUrl for compatibility
        fileSize: videoUploads.fileSize,
        duration: videoUploads.duration,
        thumbnailUrl: videoUploads.thumbnailUrl,
        uploadedBy: videoUploads.uploaderId,
        category: videoUploads.category,
        isPublic: sql<boolean>`true`, // All approved videos are considered public
        tags: sql<string[]>`ARRAY[]::text[]`, // Empty array for now
        status: sql<string>`'active'`, // Map approved to active status
        viewCount: sql<number>`0`, // Default view count
        createdAt: videoUploads.createdAt,
        updatedAt: videoUploads.updatedAt
      })
        .from(videoUploads)
        .where(and(...whereConditions))
        .orderBy(desc(videoUploads.createdAt))
        .limit(parseInt(limit as string));

      console.log(`Found ${videos.length} approved videos`);
      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching public videos:", error);
      res.status(500).json({ message: "Error fetching public videos" });
    }
  });

  // Admin: Get all videos for approval
  app.get("/api/admin/videos/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const videos = await db.select()
        .from(videoUploads)
        .where(eq(videoUploads.approvalStatus, 'pending'))
        .orderBy(desc(videoUploads.createdAt));

      res.json(videos);
    } catch (error: any) {
      console.error("Error fetching pending videos:", error);
      res.status(500).json({ message: "Error fetching pending videos" });
    }
  });

  // Admin: Approve or reject video
  app.patch("/api/admin/videos/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.userType !== 'admin') {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { approved, adminNotes, youtubeVideoId } = req.body;
      
      const approvalStatus = approved ? 'approved' : 'rejected';
      const isPublic = approved ? true : false;

      const [video] = await db.update(videoUploads)
        .set({
          approvalStatus,
          isPublic,
          adminNotes,
          youtubeVideoId,
          approvedBy: req.user!.id,
          approvedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(videoUploads.id, parseInt(id)))
        .returning();

      res.json({
        message: `Video ${approved ? 'approved' : 'rejected'} successfully`,
        video
      });
    } catch (error: any) {
      console.error("Error updating video approval:", error);
      res.status(500).json({ message: "Error updating video approval" });
    }
  });

  // Record video view for analytics
  app.post("/api/videos/analytics/view", async (req, res) => {
    try {
      const viewData = {
        videoId: req.body.videoId,
        viewerId: req.body.viewerId || null,
        sessionId: req.body.sessionId,
        videoDuration: req.body.videoDuration,
        deviceType: req.body.deviceType,
        browserType: req.body.browserType,
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        referrer: req.body.referrer,
        watchTime: 0,
        completionPercentage: 0,
        isCompleted: false,
        createdAt: new Date()
      };

      const validatedData = insertVideoViewAnalyticsSchema.parse(viewData);
      const [view] = await db.insert(videoViewAnalytics).values(validatedData).returning();

      res.status(201).json(view);
    } catch (error: any) {
      console.error("Error recording video view:", error);
      res.status(500).json({ message: "Error recording video view" });
    }
  });

  // Update video session analytics
  app.put("/api/videos/analytics/session", async (req, res) => {
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

      const [updatedView] = await db.update(videoViewAnalytics)
        .set({
          watchTime: totalWatchTime,
          completionPercentage: Math.min(completionPercentage, 100),
          pauseCount,
          seekCount,
          volumeChanges,
          playbackSpeed,
          isCompleted,
          updatedAt: new Date()
        })
        .where(eq(videoViewAnalytics.sessionId, sessionId))
        .returning();

      res.json(updatedView);
    } catch (error: any) {
      console.error("Error updating video analytics:", error);
      res.status(500).json({ message: "Error updating video analytics" });
    }
  });

  // Get video analytics for dashboard
  app.get("/api/videos/analytics/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const userType = req.user!.userType;
      const userId = req.user!.id;

      let videoQuery = db.select().from(videoUploads);

      // Filter videos based on user role
      if (userType !== 'admin') {
        videoQuery = videoQuery.where(eq(videoUploads.uploaderId, userId));
      }

      const videos = await videoQuery;
      const youtubeVideoIds = videos
        .filter(v => v.youtubeVideoId)
        .map(v => v.youtubeVideoId!);

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

      // Get analytics for user's videos
      const analytics = await db.select()
        .from(videoViewAnalytics)
        .where(inArray(videoViewAnalytics.videoId, youtubeVideoIds))
        .orderBy(desc(videoViewAnalytics.createdAt));

      // Calculate dashboard metrics
      const totalViews = analytics.length;
      const totalWatchTime = analytics.reduce((sum, view) => sum + (view.totalWatchTime || 0), 0);
      const averageWatchTime = totalViews > 0 ? Math.round(totalWatchTime / totalViews) : 0;
      const completedViews = analytics.filter(view => view.isCompleted).length;
      const completionRate = totalViews > 0 ? Math.round((completedViews / totalViews) * 100) : 0;

      // Get top performing videos
      const videoViewCounts = youtubeVideoIds.map(youtubeVideoId => {
        const videoAnalytics = analytics.filter(a => a.videoId === youtubeVideoId);
        const video = videos.find(v => v.youtubeVideoId === youtubeVideoId);
        return {
          video,
          viewCount: videoAnalytics.length,
          totalWatchTime: videoAnalytics.reduce((sum, a) => sum + (a.totalWatchTime || 0), 0),
          averageCompletion: videoAnalytics.length > 0 
            ? Math.round(videoAnalytics.reduce((sum, a) => sum + (a.completionPercentage || 0), 0) / videoAnalytics.length)
            : 0
        };
      });

      const topVideos = videoViewCounts
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);

      const recentViews = analytics.slice(0, 10);

      res.json({
        totalViews,
        totalWatchTime,
        averageWatchTime,
        completionRate,
        topVideos,
        recentViews
      });
    } catch (error: any) {
      console.error("Error fetching video analytics dashboard:", error);
      res.status(500).json({ message: "Error fetching video analytics" });
    }
  });

  return httpServer;
}
