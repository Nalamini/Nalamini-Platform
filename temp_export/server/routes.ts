import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertUserSchema, insertFeedbackSchema, insertRechargeSchema, insertBookingSchema, 
  insertRentalSchema, insertTaxiRideSchema, insertDeliverySchema, insertRecyclingRequestSchema, 
  insertGroceryProductSchema, insertLocalProductSchema, insertCommissionConfigSchema, 
  insertCommissionSchema, insertServiceProviderSchema, InsertServiceProvider,
  insertManagerApplicationSchema, ManagerApplication, insertGroceryCategorySchema,
  insertGrocerySubCategorySchema, insertFarmerProductListingSchema, insertDeliveryAreaSchema,
  insertProductRequestSchema, insertGroceryOrderSchema, insertGroceryOrderItemSchema,
  FarmerProductListing, ProductRequest,
  insertLocalProductBaseSchema, upsertLocalProductDetailsSchema
} from "@shared/schema";
import { randomUUID } from 'crypto';
import { rechargeService } from './services/rechargeService';
import { paymentService } from './services/paymentService';
import { walletService } from './services/walletService';
import { utilityService, UtilityType } from './services/utilityService';
import { travelService, BookingType } from './services/travelService';
import { commissionService } from './services/commissionService';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

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
      if (req.isAuthenticated() && roles.includes(req.user.userType)) {
        return next();
      }
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
      
      if (req.query.category) {
        filter.category = req.query.category as string;
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
      
      // Debug the storage object
      console.log("Storage methods:", Object.keys(storage));
      console.log("Storage keys in DatabaseStorage:", Object.getOwnPropertyNames(Object.getPrototypeOf(storage)));
      console.log("Type of getGroceryProducts:", typeof storage.getGroceryProducts);
      
      if (typeof storage.getGroceryProducts !== 'function') {
        throw new Error("getGroceryProducts method is not defined on the storage object");
      }
      
      const products = await storage.getGroceryProducts(filter);
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
      const products = await storage.getGroceryProducts({ farmerId: req.user.id });
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
  
  // Get all grocery categories
  app.get("/api/admin/grocery/categories", async (req, res) => {
    try {
      // Get isActive filter from query params, default to showing all categories
      const isActive = req.query.isActive === "true" ? true : 
                       req.query.isActive === "false" ? false : 
                       undefined;
      
      const filter = isActive !== undefined ? { isActive } : {};
      const categories = await storage.getGroceryCategories(filter);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching grocery categories:', error);
      res.status(500).json({ message: "Failed to fetch grocery categories" });
    }
  });
  
  // For backward compatibility
  app.get("/api/grocery/categories", async (req, res) => {
    try {
      // Get isActive filter from query params, default to true (active)
      const isActive = req.query.status === "inactive" ? false : true;
      
      const categories = await storage.getGroceryCategories({ isActive });
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
  
  // Get all grocery subcategories or filter by category
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
  
  // For backward compatibility
  app.get("/api/grocery/subcategories", async (req, res) => {
    try {
      // Get parentCategoryId and isActive filters from query params
      const parentCategoryId = req.query.parentCategoryId ? 
        parseInt(req.query.parentCategoryId as string) : 
        (req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined); // Supporting both new and old query param names
      
      // Default to active (isActive: true) when status is not specified or is "active"
      const isActive = req.query.status === "inactive" ? false : true;
      
      const filter: { parentCategoryId?: number, isActive?: boolean } = { isActive };
      if (parentCategoryId) {
        filter.parentCategoryId = parentCategoryId;
      }
      
      const subcategories = await storage.getGrocerySubCategories(filter);
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching grocery subcategories:', error);
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
      
      // If category or subcategory is specified, validate they exist
      if (validatedData.categoryId) {
        const category = await storage.getGroceryCategory(validatedData.categoryId);
        if (!category) {
          return res.status(400).json({ message: "Category not found" });
        }
      }
      
      if (validatedData.subcategoryId) {
        const subcategory = await storage.getGrocerySubCategory(validatedData.subcategoryId);
        if (!subcategory) {
          return res.status(400).json({ message: "Subcategory not found" });
        }
      }
      
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
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
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
  
  // ----- MANUFACTURER (PROVIDER) API ENDPOINTS -----
  
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
  
  // Get all published products for browsing
  app.get("/api/local/products", async (req, res) => {
    try {
      const { category, district, availableAreas, deliveryOption } = req.query;
      
      const filter: any = {
        status: 'active',   // Only active products
        isDraft: false,     // No drafts
        adminApproved: true // Only admin-approved products
      };
      
      if (category) {
        filter.category = category as string;
      }
      
      if (district) {
        filter.district = district as string;
      }
      
      if (availableAreas) {
        filter.availableAreas = availableAreas as string;
      }
      
      if (deliveryOption) {
        filter.deliveryOption = deliveryOption as string;
      }
      
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error: any) {
      console.error("Error fetching local products:", error);
      res.status(500).json({ 
        message: "Failed to fetch local products", 
        error: error.message || "Unknown error" 
      });
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
      const requestData = insertRecyclingRequestSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "pending" // Always start with pending status
      });
      
      const request = await storage.createRecyclingRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid recycling request data" });
    }
  });

  app.get("/api/recycling/requests", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
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

  app.put("/api/recycling/request/:id", isAuthenticated, hasRole(["admin", "service_agent"]), async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status, totalWeight, amount } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Update request
      const updatedRequest = await storage.updateRecyclingRequest(requestId, { 
        status, 
        totalWeight, 
        amount,
        agentId: req.user.id 
      });
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      // If status is "collected" and amount is provided, add to user's wallet using wallet service
      if (status === "collected" && amount && totalWeight) {
        try {
          await walletService.addFunds(
            updatedRequest.userId,
            amount,
            'recycling',
            `Recycling payment for ${totalWeight}kg of materials`
          );
        } catch (walletError) {
          console.error('Error adding funds to wallet:', walletError);
          // Even if wallet credit fails, the recycling request was updated successfully
          // Log the error but don't fail the entire request
        }
      }
      
      res.json(updatedRequest);
    } catch (error) {
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

  // Utility Bill Payment Routes
  
  // Get list of utility providers
  app.get("/api/utility/providers", async (req, res) => {
    try {
      const { type, state } = req.query;
      
      // Get providers based on optional filters
      const providers = utilityService.getProviders(
        type ? type as UtilityType : undefined,
        state ? state as string : undefined
      );
      
      res.json(providers);
    } catch (error) {
      console.error('Error fetching utility providers:', error);
      res.status(500).json({ message: "Failed to fetch utility providers" });
    }
  });
  
  // Fetch bill details for a particular provider and consumer number
  app.get("/api/utility/fetch-bill", isAuthenticated, async (req, res) => {
    try {
      const { providerId, consumerNumber } = req.query;
      
      if (!providerId || !consumerNumber) {
        return res.status(400).json({ message: "Provider ID and consumer number are required" });
      }
      
      const billDetails = await utilityService.fetchBill(
        providerId as string,
        consumerNumber as string
      );
      
      if (!billDetails) {
        return res.status(404).json({ message: "No bill found for this consumer number" });
      }
      
      res.json(billDetails);
    } catch (error) {
      console.error('Error fetching bill details:', error);
      res.status(500).json({ message: "Failed to fetch bill details" });
    }
  });
  
  // Pay a utility bill
  app.post("/api/utility/pay-bill", isAuthenticated, async (req, res) => {
    try {
      const { billId, providerId, consumerNumber, amount, processedById } = req.body;
      
      if (!billId || !providerId || !consumerNumber || !amount) {
        return res.status(400).json({ message: "Missing required bill payment fields" });
      }
      
      try {
        // Check if user has sufficient wallet balance
        const balance = await walletService.getBalance(req.user.id);
        if (balance < amount) {
          return res.status(400).json({ 
            message: "Insufficient wallet balance", 
            currentBalance: balance,
            requiredAmount: amount
          });
        }
      } catch (walletError) {
        console.error('Wallet error:', walletError);
        return res.status(400).json({ message: "Could not verify wallet balance" });
      }
      
      // If this is a service agent processing a payment for a customer
      let agentId = processedById;
      if (!agentId && req.user.userType === 'service_agent') {
        agentId = req.user.id;
      }
      
      // Process the bill payment with the utility service
      const paymentResult = await utilityService.payBill(
        req.user.id,
        billId,
        providerId,
        consumerNumber,
        amount,
        agentId
      );
      
      if (!paymentResult.success) {
        return res.status(400).json({ 
          message: paymentResult.message || "Payment failed"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Bill payment successful",
        transactionId: paymentResult.transactionId,
        receiptNumber: paymentResult.receiptNumber,
        paidAmount: paymentResult.paidAmount,
        paidDate: paymentResult.paidDate
      });
    } catch (error) {
      console.error('Error processing bill payment:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process bill payment"
      });
    }
  });

  // Travel Booking Routes
  
  // Get list of cities for origin/destination
  app.get("/api/travel/cities", async (req, res) => {
    try {
      // Import cities directly from travelService file
      const { cities } = await import('./services/travelService');
      res.json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ message: "Failed to fetch cities list" });
    }
  });
  
  // Search for available buses
  app.get("/api/travel/bus/search", async (req, res) => {
    try {
      const { origin, destination, departDate } = req.query;
      
      const searchParams: Record<string, any> = {
        bookingType: 'bus'
      };
      
      if (origin) searchParams.origin = origin;
      if (destination) searchParams.destination = destination;
      if (departDate) searchParams.departDate = departDate;
      
      const buses = travelService.searchBuses(searchParams);
      res.json(buses);
    } catch (error) {
      console.error('Error searching buses:', error);
      res.status(500).json({ message: "Failed to search for buses" });
    }
  });
  
  // Get bus details
  app.get("/api/travel/bus/:id", async (req, res) => {
    try {
      const bus = travelService.getBusDetails(req.params.id);
      
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }
      
      res.json(bus);
    } catch (error) {
      console.error('Error fetching bus details:', error);
      res.status(500).json({ message: "Failed to fetch bus details" });
    }
  });
  
  // Book a bus ticket
  app.post("/api/travel/bus/book", isAuthenticated, async (req, res) => {
    try {
      const { busId, passengers, seatNumbers } = req.body;
      
      if (!busId || !passengers || !seatNumbers || !Array.isArray(seatNumbers)) {
        return res.status(400).json({ message: "Missing required booking information" });
      }
      
      const booking = await travelService.bookBus(
        req.user.id,
        busId,
        passengers,
        seatNumbers
      );
      
      if (!booking.success) {
        return res.status(400).json({ 
          message: booking.message || "Booking failed"
        });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error booking bus:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process bus booking"
      });
    }
  });
  
  // Search for available flights
  app.get("/api/travel/flight/search", async (req, res) => {
    try {
      const { origin, destination, departDate } = req.query;
      
      const searchParams: Record<string, any> = {
        bookingType: 'flight'
      };
      
      if (origin) searchParams.origin = origin;
      if (destination) searchParams.destination = destination;
      if (departDate) searchParams.departDate = departDate;
      
      const flights = travelService.searchFlights(searchParams);
      res.json(flights);
    } catch (error) {
      console.error('Error searching flights:', error);
      res.status(500).json({ message: "Failed to search for flights" });
    }
  });
  
  // Get flight details
  app.get("/api/travel/flight/:id", async (req, res) => {
    try {
      const flight = travelService.getFlightDetails(req.params.id);
      
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      
      res.json(flight);
    } catch (error) {
      console.error('Error fetching flight details:', error);
      res.status(500).json({ message: "Failed to fetch flight details" });
    }
  });
  
  // Book a flight ticket
  app.post("/api/travel/flight/book", isAuthenticated, async (req, res) => {
    try {
      const { flightId, passengers, passengerDetails } = req.body;
      
      if (!flightId || !passengers || !passengerDetails || !Array.isArray(passengerDetails)) {
        return res.status(400).json({ message: "Missing required booking information" });
      }
      
      const booking = await travelService.bookFlight(
        req.user.id,
        flightId,
        passengers,
        passengerDetails
      );
      
      if (!booking.success) {
        return res.status(400).json({ 
          message: booking.message || "Booking failed"
        });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error booking flight:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process flight booking"
      });
    }
  });
  
  // Search for available hotels
  app.get("/api/travel/hotel/search", async (req, res) => {
    try {
      const { destination, checkIn, checkOut, guests } = req.query;
      
      const searchParams: Record<string, any> = {
        bookingType: 'hotel'
      };
      
      if (destination) searchParams.destination = destination;
      if (checkIn) searchParams.checkIn = checkIn;
      if (checkOut) searchParams.checkOut = checkOut;
      if (guests) searchParams.guests = guests;
      
      const hotels = travelService.searchHotels(searchParams);
      res.json(hotels);
    } catch (error) {
      console.error('Error searching hotels:', error);
      res.status(500).json({ message: "Failed to search for hotels" });
    }
  });
  
  // Get hotel details
  app.get("/api/travel/hotel/:id", async (req, res) => {
    try {
      const hotel = travelService.getHotelDetails(req.params.id);
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      res.json(hotel);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      res.status(500).json({ message: "Failed to fetch hotel details" });
    }
  });
  
  // Book a hotel room
  app.post("/api/travel/hotel/book", isAuthenticated, async (req, res) => {
    try {
      const { hotelId, roomTypeId, checkIn, checkOut, guests, rooms } = req.body;
      
      if (!hotelId || !roomTypeId || !checkIn || !checkOut || !guests || !rooms) {
        return res.status(400).json({ message: "Missing required booking information" });
      }
      
      const booking = await travelService.bookHotel(
        req.user.id,
        hotelId,
        roomTypeId,
        checkIn,
        checkOut,
        guests,
        rooms
      );
      
      if (!booking.success) {
        return res.status(400).json({ 
          message: booking.message || "Booking failed"
        });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error booking hotel:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process hotel booking"
      });
    }
  });
  
  // Get user's booking history
  app.get("/api/travel/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await travelService.getBookingHistory(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      res.status(500).json({ message: "Failed to fetch booking history" });
    }
  });
  
  // Get specific booking details
  app.get("/api/travel/booking/:id", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = await travelService.getBookingDetails(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Ensure user can only access their own bookings (unless admin)
      if (booking.userId !== req.user.id && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "You don't have permission to view this booking" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({ message: "Failed to fetch booking details" });
    }
  });
  
  // Cancel a booking
  app.post("/api/travel/booking/:id/cancel", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const result = await travelService.cancelBooking(req.user.id, bookingId);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: result.message || "Cancellation failed"
        });
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to cancel booking"
      });
    }
  });

  // Service Provider Routes
  // Create service provider
  app.post("/api/service-providers", isAuthenticated, async (req, res) => {
    try {
      ensureUserExists(req); // Add type guard to ensure req.user exists
      
      // Check if the user already has a service provider account
      const existingProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (existingProvider) {
        return res.status(400).json({ 
          message: "This user is already registered as a service provider",
          existingProvider
        });
      }
      
      // Validate provider data with the schema
      try {
        // Prepare the data with defaults for all optional fields and set userId automatically
        const inputData = {
          ...req.body,
          userId: req.user.id, // Set userId from the authenticated user
          operatingAreas: req.body.operatingAreas || [],
          website: req.body.website || "",
          documents: req.body.documents || [],
          verifiedBy: req.body.verifiedBy || null,
          verificationStatus: req.body.verificationStatus || "pending",
          businessName: req.body.name || req.body.businessName || "" // Support for 'name' field
        };
        
        console.log("Processing service provider data:", inputData);
        
        // Now validate with the schema
        const providerData = insertServiceProviderSchema.parse(inputData);
        const newServiceProvider = await storage.createServiceProvider(providerData);
        
        console.log("Service provider created successfully:", newServiceProvider.id);
        res.status(201).json(newServiceProvider);
      } catch (validationError: any) {
        console.error("Service provider validation error:", validationError);
        return res.status(400).json({ 
          message: "Invalid service provider data", 
          errors: validationError.errors || validationError.message
        });
      }
    } catch (error: any) {
      console.error("Error creating service provider:", error);
      
      // Handle unique constraint violation
      if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        return res.status(400).json({ 
          message: "This user is already registered as a service provider"
        });
      }
      
      res.status(500).json({ message: error.message });
    }
  });

  // Get all service providers (with filtering)
  app.get("/api/service-providers", isAuthenticated, async (req, res) => {
    try {
      const { providerType, status, district } = req.query;
      const filter: any = {};

      if (providerType) filter.providerType = providerType as string;
      if (status) filter.status = status as string;
      if (district) filter.district = district as string;

      const serviceProviders = await storage.listServiceProviders(filter);
      res.json(serviceProviders);
    } catch (error: any) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get service provider by ID
  app.get("/api/service-providers/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceProvider = await storage.getServiceProvider(id);

      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found" });
      }

      res.json(serviceProvider);
    } catch (error: any) {
      console.error("Error fetching service provider:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get service provider by user ID
  app.get("/api/service-providers/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const serviceProvider = await storage.getServiceProviderByUserId(userId);

      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found for this user" });
      }

      res.json(serviceProvider);
    } catch (error: any) {
      console.error("Error fetching service provider by user ID:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update service provider
  app.patch("/api/service-providers/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceProvider = await storage.getServiceProvider(id);

      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found" });
      }

      // Only allow updates by owner or admin/manager
      if (
        req.user?.id !== serviceProvider.userId &&
        !["admin", "branch_manager", "taluk_manager"].includes(req.user?.userType || "")
      ) {
        return res.status(403).json({ message: "Not authorized to update this service provider" });
      }

      const updatedServiceProvider = await storage.updateServiceProvider(id, req.body);
      res.json(updatedServiceProvider);
    } catch (error: any) {
      console.error("Error updating service provider:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Provider Details Routes
  // Farmer Details
  app.post("/api/farmer-details", isAuthenticated, async (req, res) => {
    try {
      // Skip the check for existing records - the constraint in the database will handle this
      // We'll just catch any error during creation
      
      console.log("Creating farmer details with data:", req.body);
      
      // Prepare the data with defaults for optional fields
      const primaryProducts = req.body.primaryProducts || [];
      
      const farmerData = {
        ...req.body,
        farmSize: req.body.farmSize || "0",
        farmType: req.body.farmType || "",
        // Convert array to string if needed
        primaryProducts: Array.isArray(primaryProducts) ? JSON.stringify(primaryProducts) : primaryProducts,
        cultivationSeason: req.body.cultivationSeason || "",
        operatingHours: req.body.operatingHours || "",
        supportsDelivery: req.body.supportsDelivery !== undefined ? req.body.supportsDelivery : false,
        bankDetails: req.body.bankDetails || {}
      };
      
      const newFarmerDetail = await storage.createFarmerDetail(farmerData);
      console.log("Farmer details created successfully:", newFarmerDetail.id);
      res.status(201).json(newFarmerDetail);
    } catch (error: any) {
      console.error("Error creating farmer details:", error);
      
      // Handle unique constraint violation
      if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        return res.status(400).json({ 
          message: "Farmer details already exist for this service provider"
        });
      }
      
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/farmer-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      let farmerDetail = await storage.getFarmerDetailByProviderId(providerId);

      if (!farmerDetail) {
        return res.status(404).json({ message: "Farmer details not found" });
      }

      res.json(farmerDetail);
    } catch (error: any) {
      console.error("Error fetching farmer details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Manufacturer Details
  app.post("/api/manufacturer-details", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating manufacturer details with data:", req.body);
      
      // Prepare the data with defaults for optional fields
      const manufacturerData = {
        ...req.body,
        businessType: req.body.businessType || "",
        productCategories: req.body.productCategories || [],
        establishmentYear: req.body.establishmentYear || new Date().getFullYear(),
        certifications: req.body.certifications || [],
        supportsDelivery: req.body.supportsDelivery !== undefined ? req.body.supportsDelivery : false,
        bankDetails: req.body.bankDetails || {}
      };
      
      const newManufacturerDetail = await storage.createManufacturerDetail(manufacturerData);
      console.log("Manufacturer details created successfully:", newManufacturerDetail.id);
      res.status(201).json(newManufacturerDetail);
    } catch (error: any) {
      console.error("Error creating manufacturer details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/manufacturer-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const manufacturerDetail = await storage.getManufacturerDetailByProviderId(providerId);

      if (!manufacturerDetail) {
        return res.status(404).json({ message: "Manufacturer details not found" });
      }

      res.json(manufacturerDetail);
    } catch (error: any) {
      console.error("Error fetching manufacturer details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Booking Agent Details
  app.post("/api/booking-agent-details", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating booking agent details with data:", req.body);
      
      // Prepare the data with defaults for optional fields
      const bookingAgentData = {
        ...req.body,
        serviceTypes: req.body.serviceTypes || [],
        operatingHours: req.body.operatingHours || "",
        yearsOfExperience: req.body.yearsOfExperience || 0,
        preferredProviders: req.body.preferredProviders || [],
        commissionRates: req.body.commissionRates || {},
        bankDetails: req.body.bankDetails || {}
      };
      
      const newBookingAgentDetail = await storage.createBookingAgentDetail(bookingAgentData);
      console.log("Booking agent details created successfully:", newBookingAgentDetail.id);
      res.status(201).json(newBookingAgentDetail);
    } catch (error: any) {
      console.error("Error creating booking agent details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/booking-agent-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const bookingAgentDetail = await storage.getBookingAgentDetailByProviderId(providerId);

      if (!bookingAgentDetail) {
        return res.status(404).json({ message: "Booking agent details not found" });
      }

      res.json(bookingAgentDetail);
    } catch (error: any) {
      console.error("Error fetching booking agent details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Taxi Provider Details
  app.post("/api/taxi-provider-details", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating taxi provider details with data:", req.body);
      
      // Prepare the data with defaults for optional fields to match the updated schema
      const taxiData = {
        ...req.body,
        vehicleTypes: req.body.vehicleTypes || "",
        operatingHours: req.body.operatingHours || "",
        driversCount: req.body.driversCount || "",
        fleetSize: req.body.fleetSize || "",
        bankDetails: req.body.bankDetails || {}
      };
      
      const newTaxiProviderDetail = await storage.createTaxiProviderDetail(taxiData);
      console.log("Taxi provider details created successfully:", newTaxiProviderDetail.id);
      res.status(201).json(newTaxiProviderDetail);
    } catch (error: any) {
      console.error("Error creating taxi provider details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/taxi-provider-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const taxiProviderDetail = await storage.getTaxiProviderDetailByProviderId(providerId);

      if (!taxiProviderDetail) {
        return res.status(404).json({ message: "Taxi provider details not found" });
      }

      res.json(taxiProviderDetail);
    } catch (error: any) {
      console.error("Error fetching taxi provider details:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Configure multer for document uploads
  const taxiDocsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Create directory if it doesn't exist
      const uploadDir = './uploads/taxi-provider-docs';
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Create a unique filename with timestamp and original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'taxi-doc-' + uniqueSuffix + ext);
    }
  });
  
  const uploadTaxiDocs = multer({ 
    storage: taxiDocsStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      // Only allow images and PDFs
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error("Only images and PDF files are allowed"));
      }
    }
  });
  
  // Upload single document for taxi provider
  app.post("/api/taxi-provider/upload/:docType", isAuthenticated, uploadTaxiDocs.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const docType = req.params.docType;
      const allowedDocTypes = [
        'photo', 'license', 'aadhar', 'pancard', 
        'vehicle_registration', 'vehicle_insurance', 'vehicle_permit'
      ];
      
      if (!allowedDocTypes.includes(docType)) {
        return res.status(400).json({ 
          message: `Invalid document type. Must be one of: ${allowedDocTypes.join(', ')}` 
        });
      }
      
      // Return the path to be saved in the database
      const filePath = '/uploads/taxi-provider-docs/' + req.file.filename;
      res.json({ 
        docType, 
        filePath,
        message: "Document uploaded successfully" 
      });
    } catch (error: any) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create taxi provider details
  app.post("/api/taxi-provider-details", isAuthenticated, async (req, res) => {
    try {
      // Validate the data with our schema
      const taxiProviderData = insertTaxiProviderDetailSchema.parse({
        ...req.body,
        approvalStatus: "pending" // Always start with pending status
      });
      
      // Verify service provider exists and belongs to the current user
      const serviceProvider = await storage.getServiceProvider(taxiProviderData.serviceProviderId);
      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      if (serviceProvider.userId !== req.user.id && req.user.userType !== "admin") {
        return res.status(403).json({ message: "Not authorized to create details for this service provider" });
      }
      
      // Create the taxi provider details
      const newTaxiProviderDetail = await storage.createTaxiProviderDetail(taxiProviderData);
      
      // Update the service provider record to reflect the new details
      await storage.updateServiceProvider(serviceProvider.id, { 
        status: "pending",
        verificationStatus: "pending"
      });
      
      // If registration is successful, log it
      console.log(`New taxi provider registered. Provider ID: ${serviceProvider.id}, Details ID: ${newTaxiProviderDetail.id}`);
      
      // In a real implementation, send notification to relevant service agents
      try {
        // Get agents for the pincode
        const agents = await storage.getUsersByPincode(serviceProvider.pincode, "service_agent");
        if (agents && agents.length > 0) {
          console.log(`Notifying ${agents.length} service agents about new taxi provider registration for pincode ${serviceProvider.pincode}`);
          // Send notifications here...
        }
      } catch (notifyError) {
        console.error("Failed to notify agents:", notifyError);
        // Don't fail registration if notification fails
      }
      
      res.status(201).json(newTaxiProviderDetail);
    } catch (error: any) {
      console.error("Error creating taxi provider details:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get pending taxi provider approvals based on user's role
  app.get("/api/taxi-provider-approvals", isAuthenticated, async (req, res) => {
    try {
      const { userType, id: userId, pincode } = req.user;
      let filter: any = {};
      
      // Filter based on user role and approval stage
      if (userType === "service_agent") {
        // Service agents only see registrations from their pincode with pending status
        filter = { 
          approvalStatus: "pending",
          pincode: pincode 
        };
      } else if (userType === "taluk_manager") {
        // Taluk managers see registrations approved by agents 
        // from taluks they manage
        const managedTaluks = await storage.getTaluksForManager(userId);
        if (managedTaluks.length > 0) {
          filter = { 
            approvalStatus: "approved_by_agent",
            taluk: { $in: managedTaluks }
          };
        } else {
          return res.json([]); // No taluks to manage
        }
      } else if (userType === "branch_manager") {
        // Branch managers see registrations approved by taluk managers
        // from districts they manage
        const managedDistricts = await storage.getDistrictsForManager(userId);
        if (managedDistricts.length > 0) {
          filter = { 
            approvalStatus: "approved_by_taluk",
            district: { $in: managedDistricts }
          };
        } else {
          return res.json([]); // No districts to manage
        }
      } else if (userType === "admin") {
        // Admins can see all registrations or filter by status
        filter = req.query.status ? { approvalStatus: req.query.status } : {};
      } else {
        return res.status(403).json({ message: "Not authorized to view approvals" });
      }
      
      // Get service providers with taxi provider details matching the filter
      const providers = await storage.getTaxiProvidersWithFilter(filter);
      res.json(providers);
    } catch (error: any) {
      console.error("Error fetching taxi provider approvals:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update taxi provider approval status
  app.patch("/api/taxi-provider-details/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userType, id: userId } = req.user;
      const { notes } = req.body;
      
      // Get the taxi provider detail
      const taxiProviderDetail = await storage.getTaxiProviderDetail(id);
      if (!taxiProviderDetail) {
        return res.status(404).json({ message: "Taxi provider details not found" });
      }
      
      // Get the service provider
      const serviceProvider = await storage.getServiceProvider(taxiProviderDetail.serviceProviderId);
      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      // Determine the new approval status based on current user role and existing status
      let newApprovalStatus: string;
      let updateData: any = {
        approvalNotes: notes || taxiProviderDetail.approvalNotes,
        approvedBy: userId
      };
      
      if (userType === "service_agent" && taxiProviderDetail.approvalStatus === "pending") {
        newApprovalStatus = "approved_by_agent";
      } else if (userType === "taluk_manager" && taxiProviderDetail.approvalStatus === "approved_by_agent") {
        newApprovalStatus = "approved_by_taluk";
      } else if (userType === "branch_manager" && taxiProviderDetail.approvalStatus === "approved_by_taluk") {
        newApprovalStatus = "approved_by_branch";
      } else if (userType === "admin" && taxiProviderDetail.approvalStatus === "approved_by_branch") {
        newApprovalStatus = "approved_by_admin";
        // Also update the service provider status to approved
        await storage.updateServiceProvider(serviceProvider.id, {
          status: "approved",
          verificationStatus: "verified",
          verifiedBy: userId
        });
      } else {
        return res.status(400).json({ 
          message: "Invalid approval workflow. Current status: " + taxiProviderDetail.approvalStatus 
        });
      }
      
      // Update the approval status
      updateData.approvalStatus = newApprovalStatus;
      
      const updatedDetail = await storage.updateTaxiProviderDetail(id, updateData);
      res.json(updatedDetail);
    } catch (error: any) {
      console.error("Error updating taxi provider approval:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Reject a taxi provider application
  app.patch("/api/taxi-provider-details/:id/reject", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      
      // Get the taxi provider detail
      const taxiProviderDetail = await storage.getTaxiProviderDetail(id);
      if (!taxiProviderDetail) {
        return res.status(404).json({ message: "Taxi provider details not found" });
      }
      
      // Get the service provider
      const serviceProvider = await storage.getServiceProvider(taxiProviderDetail.serviceProviderId);
      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      // Only managers, admins, or assigned service agents can reject
      const { userType, id: userId, pincode } = req.user;
      const canReject = 
        userType === "admin" || 
        userType === "branch_manager" || 
        userType === "taluk_manager" ||
        (userType === "service_agent" && serviceProvider.pincode === pincode);
        
      if (!canReject) {
        return res.status(403).json({ message: "Not authorized to reject this application" });
      }
      
      // Update both taxi provider details and service provider
      const updatedDetail = await storage.updateTaxiProviderDetail(id, {
        approvalStatus: "rejected",
        approvalNotes: notes || "Application rejected",
        approvedBy: userId
      });
      
      await storage.updateServiceProvider(serviceProvider.id, {
        status: "rejected",
        verificationStatus: "rejected",
        verifiedBy: userId
      });
      
      res.json(updatedDetail);
    } catch (error: any) {
      console.error("Error rejecting taxi provider:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Transportation Agent Details
  app.post("/api/transportation-agent-details", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating transportation agent details with data:", req.body);
      
      // Prepare the data with defaults for optional fields
      const transportationData = {
        ...req.body,
        vehicleTypes: req.body.vehicleTypes || [],
        vehicleCount: req.body.vehicleCount || 0,
        operatingHours: req.body.operatingHours || "",
        serviceAreas: req.body.serviceAreas || [],
        maxDistance: req.body.maxDistance || 0,
        maxWeight: req.body.maxWeight || 0,
        pricePerKg: req.body.pricePerKg || 0,
        pricePerKm: req.body.pricePerKm || 0,
        bankDetails: req.body.bankDetails || {}
      };
      
      const newTransportationAgentDetail = await storage.createTransportationAgentDetail(transportationData);
      console.log("Transportation agent details created successfully:", newTransportationAgentDetail.id);
      res.status(201).json(newTransportationAgentDetail);
    } catch (error: any) {
      console.error("Error creating transportation agent details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/transportation-agent-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const transportationAgentDetail = await storage.getTransportationAgentDetailByProviderId(providerId);

      if (!transportationAgentDetail) {
        return res.status(404).json({ message: "Transportation agent details not found" });
      }

      res.json(transportationAgentDetail);
    } catch (error: any) {
      console.error("Error fetching transportation agent details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Rental Provider Details
  app.post("/api/rental-provider-details", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating rental provider details with data:", req.body);
      
      // Prepare the data with defaults for optional fields
      const rentalData = {
        ...req.body,
        itemCategories: req.body.itemCategories || [],
        itemDetails: req.body.itemDetails || [],
        depositRequired: req.body.depositRequired !== undefined ? req.body.depositRequired : true,
        operatingHours: req.body.operatingHours || "",
        deliveryAvailable: req.body.deliveryAvailable !== undefined ? req.body.deliveryAvailable : false,
        deliveryCharge: req.body.deliveryCharge || 0,
        bankDetails: req.body.bankDetails || {}
      };
      
      const newRentalProviderDetail = await storage.createRentalProviderDetail(rentalData);
      console.log("Rental provider details created successfully:", newRentalProviderDetail.id);
      res.status(201).json(newRentalProviderDetail);
    } catch (error: any) {
      console.error("Error creating rental provider details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/rental-provider-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const rentalProviderDetail = await storage.getRentalProviderDetailByProviderId(providerId);

      if (!rentalProviderDetail) {
        return res.status(404).json({ message: "Rental provider details not found" });
      }

      res.json(rentalProviderDetail);
    } catch (error: any) {
      console.error("Error fetching rental provider details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Recycling Agent Details
  app.post("/api/recycling-agent-details", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating recycling agent details with data:", req.body);
      
      // Prepare the data with defaults for optional fields
      const recyclingData = {
        ...req.body,
        materialTypes: req.body.materialTypes || [],
        pricePerKg: req.body.pricePerKg || {},
        minQuantity: req.body.minQuantity || 0,
        providesPickup: req.body.providesPickup !== undefined ? req.body.providesPickup : true,
        operatingHours: req.body.operatingHours || "",
        purchaseProcess: req.body.purchaseProcess || "",
        bankDetails: req.body.bankDetails || {}
      };
      
      const newRecyclingAgentDetail = await storage.createRecyclingAgentDetail(recyclingData);
      console.log("Recycling agent details created successfully:", newRecyclingAgentDetail.id);
      res.status(201).json(newRecyclingAgentDetail);
    } catch (error: any) {
      console.error("Error creating recycling agent details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/recycling-agent-details/provider/:providerId", isAuthenticated, async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const recyclingAgentDetail = await storage.getRecyclingAgentDetailByProviderId(providerId);

      if (!recyclingAgentDetail) {
        return res.status(404).json({ message: "Recycling agent details not found" });
      }

      res.json(recyclingAgentDetail);
    } catch (error: any) {
      console.error("Error fetching recycling agent details:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Commission routes
  // Get commission statistics for a service agent
  app.get("/api/commissions/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await commissionService.getUserCommissionStats(req.user.id);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching commission stats:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Process commissions for a service agent
  app.post("/api/commissions/process", isAuthenticated, hasRole(["admin", "branch_manager", "taluk_manager"]), async (req, res) => {
    try {
      const { serviceAgentId, serviceType, amount, provider, description } = req.body;
      
      if (!serviceAgentId || !serviceType || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const result = await commissionService.processServiceAgentCommission(
        serviceAgentId,
        serviceType,
        amount,
        provider,
        description
      );
      
      res.json(result);
    } catch (error: any) {
      console.error("Error processing commissions:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Process customer transaction with commission distribution
  app.post("/api/commissions/customer-transaction", isAuthenticated, hasRole(["service_agent"]), async (req, res) => {
    try {
      const { customerId, serviceType, amount, provider } = req.body;
      
      if (!customerId || !serviceType || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const result = await commissionService.processCustomerTransaction(
        customerId,
        req.user.id, // Service agent ID
        serviceType,
        amount,
        provider
      );
      
      res.json(result);
    } catch (error: any) {
      console.error("Error processing customer transaction:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Add a manual distribute commissions endpoint for testing
  app.post("/api/commissions/distribute", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { rechargeId, serviceType = "recharge" } = req.body;
      
      if (!rechargeId) {
        return res.status(400).json({ message: "Missing required rechargeId" });
      }
      
      // Get the recharge
      const recharge = await storage.getRecharge(rechargeId);
      if (!recharge) {
        return res.status(404).json({ message: "Recharge not found" });
      }
      
      console.log(`[API] Manually distributing commissions for recharge ID ${rechargeId}`);
      console.log(`[API] Recharge details:`, recharge);
      
      // Call the distribution service
      const result = await commissionService.distributeCommissions(
        serviceType,
        rechargeId,
        recharge.amount,
        recharge.provider
      );
      
      res.json({ success: true, message: "Commissions distributed successfully", result });
    } catch (error: any) {
      console.error("Error distributing commissions:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // List pending commissions (for admin)
  app.get("/api/commissions/pending", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const userType = req.query.userType as string | undefined;
      const serviceType = req.query.serviceType as string | undefined;
      
      const pendingCommissions = await commissionService.getPendingCommissions({
        userType,
        serviceType
      });
      
      res.json(pendingCommissions);
    } catch (error: any) {
      console.error("Error fetching pending commissions:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Manually distribute commissions for a recharge
  app.post("/api/commissions/manual-distribute-recharge", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { rechargeId } = req.body;
      
      if (!rechargeId) {
        return res.status(400).json({ error: 'Recharge ID is required' });
      }
      
      const result = await commissionService.manuallyDistributeCommissionsForRecharge(Number(rechargeId));
      res.json(result);
    } catch (error: any) {
      console.error('Error manually distributing commissions:', error);
      res.status(500).json({ error: error.message || 'Failed to distribute commissions' });
    }
  });
  
  // Get all recharges for admin (useful for manual commission distribution)
  app.get("/api/recharges/admin", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const recharges = await storage.listRecharges();
      res.json(recharges);
    } catch (error: any) {
      console.error('Error fetching recharges:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch recharges' });
    }
  });

  // Mark commissions as paid
  app.post("/api/commissions/mark-as-paid", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { commissionIds } = req.body;
      
      for (const id of commissionIds) {
        await storage.updateCommissionTransaction(id, { status: "paid" });
      }
      
      res.json({ success: true, processedCount: commissionIds.length });
    } catch (error) {
      console.error("Error marking commissions as paid:", error);
      res.status(500).json({ message: "Failed to mark commissions as paid" });
    }
  });
  
  app.post("/api/commissions/mark-paid", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { commissionIds } = req.body;
      
      if (!commissionIds || !Array.isArray(commissionIds)) {
        return res.status(400).json({ message: "Invalid commission IDs" });
      }
      
      const paidCount = await commissionService.markCommissionsAsPaid(commissionIds);
      
      res.json({
        success: true,
        message: `Marked ${paidCount}/${commissionIds.length} commissions as paid`,
        paidCount
      });
    } catch (error: any) {
      console.error("Error marking commissions as paid:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Initialize default commission configs
  app.post("/api/commission-configs/initialize", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const result = await commissionService.initializeDefaultConfigs();
      res.json(result);
    } catch (error: any) {
      console.error("Error initializing commission configs:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Sync wallet balances (transfer from comm service for easier access)
  app.post("/api/commissions/sync-wallet-balances", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      // This will run a query to ensure all users have the correct wallet balance based on their commission transactions
      const users = await storage.listUsers();
      const results = [];
      
      for (const user of users) {
        // Get their total commissions
        const transactions = await storage.getCommissionTransactionsByUserId(user.id);
        const total = transactions.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
        
        // Set their wallet balance
        await storage.updateWalletBalance(user.id, total);
        results.push({ userId: user.id, username: user.username, newBalance: total });
      }
      
      res.json({ 
        success: true, 
        message: `Synchronized wallet balances for ${results.length} users`,
        users: results 
      });
    } catch (error: any) {
      console.error("Error syncing wallet balances:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get all commission configs
  app.get("/api/commission-configs", isAuthenticated, async (req, res) => {
    try {
      const configs = await storage.listCommissionConfigs();
      res.json(configs);
    } catch (error: any) {
      console.error("Error fetching commission configs:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new commission config
  app.post("/api/commission-configs", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const configData = insertCommissionConfigSchema.parse(req.body);
      const config = await storage.createCommissionConfig(configData);
      res.status(201).json(config);
    } catch (error: any) {
      console.error("Error creating commission config:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Update a commission config
  app.put("/api/commission-configs/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const configData = req.body;
      
      const updatedConfig = await storage.updateCommissionConfig(id, configData);
      
      if (!updatedConfig) {
        return res.status(404).json({ message: "Commission config not found" });
      }
      
      res.json(updatedConfig);
    } catch (error: any) {
      console.error("Error updating commission config:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // =====================================================================
  // Farmer Product Listing routes
  // =====================================================================
  
  // Get all farmer product listings (with filtering options)
  app.get("/api/farmer-products", async (req, res) => {
    try {
      const filter: any = {};
      
      if (req.query.farmerId) {
        filter.farmerId = parseInt(req.query.farmerId as string);
      }
      
      if (req.query.groceryProductId) {
        filter.groceryProductId = parseInt(req.query.groceryProductId as string);
      }
      
      if (req.query.status) {
        filter.status = req.query.status as string;
      }
      
      const listings = await storage.getFarmerProductListings(filter);
      
      // If grocery product details are needed, fetch them
      if (req.query.includeProduct === 'true') {
        const listingsWithProducts = await Promise.all(
          listings.map(async (listing) => {
            const product = await storage.getGroceryProductById(listing.groceryProductId);
            return {
              ...listing,
              product
            };
          })
        );
        return res.json(listingsWithProducts);
      }
      
      res.json(listings);
    } catch (error: any) {
      console.error("Error fetching farmer product listings:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get all product listings for the logged-in farmer (requires authentication)
  app.get("/api/farmer-products/my-listings", isAuthenticated, async (req, res) => {
    try {
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (!serviceProvider || serviceProvider.providerType !== 'farmer') {
        return res.status(403).json({ message: "Only farmers can view their product listings" });
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail) {
        return res.status(404).json({ message: "Farmer details not found" });
      }
      
      // Get all listings for this farmer
      const listings = await storage.getFarmerProductListings({ farmerId: farmerDetail.id });
      
      // If grocery product details are needed, fetch them
      if (req.query.includeProduct === 'true') {
        const listingsWithProducts = await Promise.all(
          listings.map(async (listing) => {
            const product = await storage.getGroceryProductById(listing.groceryProductId);
            return {
              ...listing,
              product,
              // Add farmer name for display
              farmerName: req.user.fullName || serviceProvider.name || req.user.username
            };
          })
        );
        return res.json(listingsWithProducts);
      }
      
      res.json(listings);
    } catch (error: any) {
      console.error("Error fetching farmer's product listings:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a single farmer product listing
  app.get("/api/farmer-products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getFarmerProductListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      // Include product details if requested
      if (req.query.includeProduct === 'true') {
        const product = await storage.getGroceryProductById(listing.groceryProductId);
        return res.json({
          ...listing,
          product
        });
      }
      
      res.json(listing);
    } catch (error: any) {
      console.error("Error fetching farmer product listing:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create a new farmer product listing (requires authentication as a farmer service provider)
  app.post("/api/farmer-products", isAuthenticated, async (req, res) => {
    try {
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("User ID:", req.user.id);
      console.log("User type:", req.user.userType);
      
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      console.log("Service provider:", serviceProvider);
      
      if (!serviceProvider) {
        console.error(`No service provider found for user ID: ${req.user.id}`);
        return res.status(403).json({ message: "You are not registered as a service provider. Please complete your registration." });
      }
      
      if (serviceProvider.providerType !== 'farmer') {
        console.error(`User is a ${serviceProvider.providerType}, not a farmer`);
        return res.status(403).json({ message: "Only farmers can create product listings" });
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail) {
        console.log(`Creating new farmer details for service provider ID: ${serviceProvider.id}`);
        
        try {
          // Create farmer details if they don't exist
          farmerDetail = await storage.createFarmerDetail({
            serviceProviderId: serviceProvider.id,
            primaryProducts: "Various",
            supportsDelivery: true
          });
          
          console.log(`Created new farmer detail with ID: ${farmerDetail.id}`);
        } catch (err) {
          console.error("Error creating farmer detail:", err);
          return res.status(500).json({ message: "Failed to create farmer details" });
        }
      }
      
      // Strict validation of required fields with type checking
      if (!req.body.groceryProductId || typeof req.body.groceryProductId !== 'number') {
        return res.status(400).json({ message: "Valid product ID is required (number)" });
      }
      
      if (!req.body.quantity || typeof req.body.quantity !== 'number' || req.body.quantity <= 0) {
        return res.status(400).json({ message: "Valid quantity is required (positive number)" });
      }
      
      if (req.body.price === undefined || req.body.price === null || typeof req.body.price !== 'number' || req.body.price <= 0) {
        return res.status(400).json({ message: "Valid price is required (positive number)" });
      }
      
      if (!req.body.unit || typeof req.body.unit !== 'string') {
        return res.status(400).json({ message: "Valid unit of measurement is required" });
      }
      
      // Verify that the grocery product exists
      const groceryProduct = await storage.getGroceryProductById(req.body.groceryProductId);
      
      if (!groceryProduct) {
        return res.status(404).json({ message: "Grocery product not found" });
      }
      
      // Prepare listing data with explicit defaults for all fields
      const listingData = {
        farmerId: farmerDetail.id,
        groceryProductId: req.body.groceryProductId,
        quantity: req.body.quantity,
        price: req.body.price,
        unit: req.body.unit,
        description: req.body.description || null,
        sourceDistrict: req.body.sourceDistrict || null,
        imageUrl: req.body.imageUrl || null,
        transportAgentRequired: req.body.transportAgentRequired === false ? false : true, // default to true
        selfDelivery: req.body.selfDelivery === true ? true : false, // default to false
        isOrganic: req.body.isOrganic === true ? true : false, // default to false
        status: 'pending', // all new listings require approval
        adminNotes: null
      };
      
      console.log("Creating farmer product listing with data:", listingData);
      
      try {
        // Create the listing with explicit error handling
        const listing = await storage.createFarmerProductListing(listingData);
        console.log("Successfully created listing with ID:", listing.id);
        
        // Process delivery areas if provided
        const deliveryAreasAdded = [];
        
        if (req.body.deliveryAreas && Array.isArray(req.body.deliveryAreas) && req.body.deliveryAreas.length > 0) {
          console.log("Processing delivery areas:", req.body.deliveryAreas);
          
          for (const area of req.body.deliveryAreas) {
            if (!area.district || !area.taluk || !area.pincode) {
              console.warn("Skipping invalid delivery area:", area);
              continue;
            }
            
            try {
              const deliveryArea = await storage.createDeliveryArea({
                listingId: listing.id,
                district: area.district,
                taluk: area.taluk,
                pincode: area.pincode,
                isActive: true
              });
              
              deliveryAreasAdded.push(deliveryArea);
              console.log(`Added delivery area ID ${deliveryArea.id} for listing ${listing.id}`);
            } catch (areaError) {
              console.error("Error adding delivery area:", areaError);
              // Continue with other areas even if one fails
            }
          }
        }
        
        // Return successful response with all data
        return res.status(201).json({
          success: true,
          message: "Product listing created successfully and pending approval",
          listing,
          deliveryAreas: deliveryAreasAdded
        });
      } catch (err) {
        console.error("Error in listing creation process:", err);
        throw err; // Re-throw to be caught by the outer catch block
      }
    } catch (error: any) {
      // Enhanced error logging with request data for troubleshooting
      console.error("=== FARMER PRODUCT LISTING ERROR ===");
      console.error("Error creating farmer product listing:", error);
      console.error("User ID:", req.user.id);
      console.error("Request body:", req.body);
      
      if (error.stack) {
        console.error("Error stack:", error.stack);
      }
      
      if (error.code) {
        console.error("SQL Error code:", error.code);
      }
      
      if (error.constraint) {
        console.error("SQL constraint violation:", error.constraint);
      }
      
      if (error.detail) {
        console.error("SQL error detail:", error.detail);
      }
      
      console.error("=== END ERROR ===");
      
      return res.status(400).json({ 
        message: error.message || "An error occurred creating the product listing",
        code: error.code,
        detail: error.detail,
        constraint: error.constraint
      });
    }
  });
  
  // Update a farmer product listing (farmer can only update their own listings)
  app.put("/api/farmer-products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getFarmerProductListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (!serviceProvider || serviceProvider.providerType !== 'farmer') {
        return res.status(403).json({ message: "Only farmers can update product listings" });
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail || farmerDetail.id !== listing.farmerId) {
        return res.status(403).json({ message: "You can only update your own listings" });
      }
      
      // Prepare update data
      const allowedFields = ['quantity', 'price', 'unit', 'imageUrl', 'transportAgentRequired', 'selfDelivery', 'isOrganic'];
      const updateData: any = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
      
      // Admin fields cannot be updated by the farmer
      if (req.user.userType === 'admin') {
        if (req.body.status !== undefined) {
          updateData.status = req.body.status;
        }
      } else {
        // When a farmer updates a listing, set status back to pending for review
        updateData.status = 'pending';
      }
      
      const updatedListing = await storage.updateFarmerProductListing(id, updateData);
      
      res.json({
        success: true,
        message: req.user.userType === 'admin' 
          ? "Product listing updated successfully" 
          : "Product listing updated successfully and pending approval",
        listing: updatedListing
      });
    } catch (error: any) {
      console.error("Error updating farmer product listing:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a farmer product listing (farmer can only delete their own listings)
  app.delete("/api/farmer-products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getFarmerProductListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      // Admin can delete any listing
      if (req.user.userType === 'admin') {
        await storage.deleteFarmerProductListing(id);
        return res.json({ success: true, message: "Product listing deleted successfully" });
      }
      
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (!serviceProvider || serviceProvider.providerType !== 'farmer') {
        return res.status(403).json({ message: "Only farmers can delete product listings" });
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail || farmerDetail.id !== listing.farmerId) {
        return res.status(403).json({ message: "You can only delete your own listings" });
      }
      
      await storage.deleteFarmerProductListing(id);
      
      res.json({
        success: true,
        message: "Product listing deleted successfully"
      });
    } catch (error: any) {
      console.error("Error deleting farmer product listing:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Admin approval of farmer product listings
  app.patch("/api/farmer-products/:id/approve", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getFarmerProductListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      const updatedListing = await storage.updateFarmerProductListing(id, { status: 'approved' });
      
      res.json({
        success: true,
        message: "Product listing approved successfully",
        listing: updatedListing
      });
    } catch (error: any) {
      console.error("Error approving farmer product listing:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Admin rejection of farmer product listings
  app.patch("/api/farmer-products/:id/reject", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getFarmerProductListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      const { reason } = req.body;
      const updatedListing = await storage.updateFarmerProductListing(id, { 
        status: 'rejected',
        adminNotes: reason || 'Rejected by admin'
      });
      
      res.json({
        success: true,
        message: "Product listing rejected",
        listing: updatedListing
      });
    } catch (error: any) {
      console.error("Error rejecting farmer product listing:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // =====================================================================
  // Delivery Area routes
  // =====================================================================
  
  // Get delivery areas for a listing
  app.get("/api/farmer-products/:listingId/delivery-areas", async (req, res) => {
    try {
      const listingId = parseInt(req.params.listingId);
      const areas = await storage.getDeliveryAreas(listingId);
      res.json(areas);
    } catch (error: any) {
      console.error("Error fetching delivery areas:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Add a delivery area to a listing (requires authentication as the farmer who owns the listing)
  app.post("/api/farmer-products/:listingId/delivery-areas", isAuthenticated, async (req, res) => {
    try {
      const listingId = parseInt(req.params.listingId);
      const listing = await storage.getFarmerProductListing(listingId);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (!serviceProvider || serviceProvider.providerType !== 'farmer') {
        return res.status(403).json({ message: "Only farmers can add delivery areas" });
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail || farmerDetail.id !== listing.farmerId) {
        return res.status(403).json({ message: "You can only add delivery areas to your own listings" });
      }
      
      // Validate required fields
      const { district, taluk, pincode } = req.body;
      
      if (!district || !taluk || !pincode) {
        return res.status(400).json({ message: "District, taluk, and pincode are required" });
      }
      
      const areaData = {
        listingId,
        district,
        taluk,
        pincode,
        isActive: true
      };
      
      const area = await storage.createDeliveryArea(areaData);
      
      res.status(201).json({
        success: true,
        message: "Delivery area added successfully",
        area
      });
    } catch (error: any) {
      console.error("Error adding delivery area:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a delivery area (requires authentication as the farmer who owns the listing)
  app.delete("/api/delivery-areas/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const area = await storage.getDeliveryArea(id);
      
      if (!area) {
        return res.status(404).json({ message: "Delivery area not found" });
      }
      
      // Get the listing this area belongs to
      const listing = await storage.getFarmerProductListing(area.listingId);
      
      if (!listing) {
        return res.status(404).json({ message: "Farmer product listing not found" });
      }
      
      // Admin can delete any delivery area
      if (req.user.userType === 'admin') {
        await storage.deleteDeliveryArea(id);
        return res.json({ success: true, message: "Delivery area deleted successfully" });
      }
      
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (!serviceProvider || serviceProvider.providerType !== 'farmer') {
        return res.status(403).json({ message: "Only farmers can delete delivery areas" });
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail || farmerDetail.id !== listing.farmerId) {
        return res.status(403).json({ message: "You can only delete delivery areas from your own listings" });
      }
      
      await storage.deleteDeliveryArea(id);
      
      res.json({
        success: true,
        message: "Delivery area deleted successfully"
      });
    } catch (error: any) {
      console.error("Error deleting delivery area:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // =====================================================================
  // Product Request routes
  // =====================================================================
  
  // Get all product requests (with filtering options)
  app.get("/api/product-requests", isAuthenticated, async (req, res) => {
    try {
      const filter: any = {};
      
      // Only admins can see all requests
      if (req.user.userType !== 'admin') {
        // Check if the user is a farmer
        const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
        
        if (!serviceProvider) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        // Check if the service provider is a farmer (all providers can access this endpoint)
        if (serviceProvider.providerType !== 'farmer') {
          console.log('Note: Provider with type ' + serviceProvider.providerType + ' accessing farmer endpoints');
        }
        
        // Get farmer details
        let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
        
        if (!farmerDetail) {
          return res.status(403).json({ message: "Farmer details not found" });
        }
        
        // Farmers can only see their own requests
        filter.farmerId = farmerDetail.id;
      } else {
        // Admin can filter by farmerId or status
        if (req.query.farmerId) {
          filter.farmerId = parseInt(req.query.farmerId as string);
        }
        
        if (req.query.status) {
          filter.status = req.query.status as string;
        }
      }
      
      const requests = await storage.getProductRequests(filter);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching product requests:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create a new product request (requires authentication as a farmer)
  app.post("/api/product-requests", isAuthenticated, async (req, res) => {
    try {
      // Check if the user is a farmer service provider
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      
      if (!serviceProvider) {
        return res.status(403).json({ message: "Only farmers can create product requests" });
      }
      
      // Check if the service provider is a farmer (all providers can access this endpoint)
      if (serviceProvider.providerType !== 'farmer') {
        console.log('Note: Provider with type ' + serviceProvider.providerType + ' creating product request');
      }
      
      // Get farmer details
      let farmerDetail = await storage.getFarmerDetailByProviderId(serviceProvider.id);
      
      if (!farmerDetail) {
        return res.status(403).json({ message: "Farmer details not found. Please complete your profile." });
      }
      
      // Validate required fields
      const { requestedProductName, description, category, unit, imageUrl } = req.body;
      
      if (!requestedProductName || !description || !category || !unit) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const requestData = {
        farmerId: farmerDetail.id,
        requestedProductName,
        description,
        category,
        unit,
        imageUrl: imageUrl || null,
        status: 'pending',
        adminNotes: null
      };
      
      const request = await storage.createProductRequest(requestData);
      
      res.status(201).json({
        success: true,
        message: "Product request submitted successfully",
        request
      });
    } catch (error: any) {
      console.error("Error creating product request:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  // Admin response to a product request (approve/reject)
  app.patch("/api/product-requests/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getProductRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Product request not found" });
      }
      
      const { status, adminNotes } = req.body;
      
      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Valid status (approved/rejected) is required" });
      }
      
      const updateData = {
        status,
        adminNotes: adminNotes || null
      };
      
      const updatedRequest = await storage.updateProductRequest(id, updateData);
      
      // If approved, create a new grocery product
      if (status === 'approved') {
        // The admin can include additional product details in the request
        const { subcategoryId, displayName, description, price, imageUrl, isOrganic } = req.body;
        
        if (subcategoryId) {
          try {
            const productData = {
              name: displayName || request.requestedProductName,
              description: description || request.description,
              price: price || 0, // Price is optional
              subcategoryId,
              unit: request.unit,
              imageUrl: imageUrl || request.imageUrl,
              isOrganic: isOrganic === true,
              isActive: true
            };
            
            const newProduct = await storage.createGroceryProduct(productData);
            
            return res.json({
              success: true,
              message: "Product request approved and new product created",
              request: updatedRequest,
              product: newProduct
            });
          } catch (productError: any) {
            console.error("Error creating product from request:", productError);
            return res.status(400).json({ 
              success: false,
              message: "Request approved but product creation failed",
              error: productError.message,
              request: updatedRequest
            });
          }
        }
      }
      
      res.json({
        success: true,
        message: `Product request ${status}`,
        request: updatedRequest
      });
    } catch (error: any) {
      console.error("Error processing product request:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================================
  // Commission Dashboard and Testing Routes
  // =====================================================================

  // Mock recharge endpoint for testing commission distribution
  app.post('/api/mock-recharge', isAuthenticated, async (req, res) => {
    try {
      // Import here to avoid circular dependencies
      const { mockRechargeService } = require('./services/mockRechargeService');
      
      const { userId, mobileNumber, amount, provider } = req.body;
      
      if (!userId || !mobileNumber || !amount || !provider) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const result = await mockRechargeService.processMockRecharge(
        userId,
        mobileNumber,
        amount,
        provider
      );
      
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error processing mock recharge:', error);
      res.status(500).json({ error: error.message || 'An error occurred while processing the recharge' });
    }
  });

  // Commission stats for the dashboard
  app.get('/api/commissions/stats', isAuthenticated, async (req, res) => {
    if (!req.user || req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    try {
      // Calculate total commissions earned
      const allCommissions = await storage.getCommissionsByServiceType('recharge');
      const totalCommissionsEarned = allCommissions.reduce((sum, commission) => 
        sum + (commission.commissionAmount || 0), 0);
      
      // Calculate service-specific totals
      const rechargeCommissions = allCommissions.filter(c => c.serviceType === 'recharge');
      const totalRecharges = rechargeCommissions.reduce((sum, commission) => 
        sum + (commission.commissionAmount || 0), 0);
      
      const bookingCommissions = allCommissions.filter(c => c.serviceType === 'booking');
      const totalBookings = bookingCommissions.reduce((sum, commission) => 
        sum + (commission.commissionAmount || 0), 0);
      
      // Get recent commissions
      const recentCommissions = await storage.getCommissionsByServiceType('recharge');
      recentCommissions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const limitedCommissions = recentCommissions.slice(0, 10);
      
      // Get username and user type for each commission
      const enrichedCommissions = await Promise.all(
        limitedCommissions.map(async (commission) => {
          const user = await storage.getUser(commission.userId);
          return {
            ...commission,
            username: user?.username || 'Unknown',
            userType: user?.userType || 'Unknown'
          };
        })
      );
      
      res.json({
        totalCommissionsEarned,
        totalRecharges,
        totalBookings,
        recentCommissions: enrichedCommissions,
        pendingCommissions: []
      });
    } catch (error: any) {
      console.error('Error fetching commission stats:', error);
      res.status(500).json({ error: error.message || 'An error occurred while fetching commission stats' });
    }
  });

  // Mock transaction route for commission testing
  app.post('/api/commissions/mock-transaction', isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const { amount, serviceType, provider } = req.body;
      
      // Create a mock transaction (using recharge as a stand-in for any transaction type)
      const mockTransaction = await storage.createRecharge({
        userId: req.user.id,
        amount,
        serviceType,
        provider,
        status: "success",
        mobileNumber: "1234567890", // Dummy value for test
        operatorCode: provider,
        planId: "mock-plan",
        circle: "TN"
      });
      
      // Process commissions
      const commissionResult = await commissionService.calculateAndDistributeCommissions(
        serviceType, 
        mockTransaction.id, 
        amount, 
        provider
      );
      
      res.status(200).json({
        transaction: mockTransaction,
        commissionResult
      });
    } catch (error) {
      console.error("Error creating mock transaction:", error);
      res.status(500).json({ message: "Failed to create mock transaction", error: (error as Error).message });
    }
  });

  // Wallet balances for all users in the hierarchy
  app.get('/api/commissions/hierarchy-wallet-balances', isAuthenticated, hasRole(["admin"]), async (req, res) => {
    if (!req.user || req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    try {
      // Get wallet balances for test user, service agent, taluk manager, branch manager, and admin
      const testUser = await storage.getUser(6); // Default test user
      
      const serviceAgent = await storage.getUserByPincodeAndType('600001', 'service_agent');
      const talukManager = await storage.getUserByTalukAndType('Chennai', 'Chennai North', 'taluk_manager');
      const branchManager = await storage.getUserByDistrictAndType('Chennai', 'branch_manager');
      const admin = await storage.getUserByType('admin');
      
      res.json({
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
        } : null,
      });
    } catch (error: any) {
      console.error('Error fetching wallet balances:', error);
      res.status(500).json({ error: error.message || 'An error occurred while fetching wallet balances' });
    }
  });

  // ===== Local Products (New Architecture) =====
  
  // === Base Products (Admin) ===
  // Create a new local product base (Step 1 of 2)
  app.post("/api/admin/local-product-bases", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const baseProductData = {
        ...req.body,
        manufacturerId: null, // Admin-created products have no manufacturer
      };
      
      const validatedData = insertLocalProductBaseSchema.parse(baseProductData);
      const baseProduct = await storage.createLocalProductBase(validatedData);
      
      res.status(201).json(baseProduct);
    } catch (error: any) {
      console.error("Error creating local product base:", error);
      res.status(400).json({ message: error.message || "Invalid product data" });
    }
  });
  
  // Get a specific local product base
  app.get("/api/admin/local-product-bases/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const baseProduct = await storage.getLocalProductBaseById(id);
      if (!baseProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(baseProduct);
    } catch (error) {
      console.error("Error fetching local product base:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // List all local product bases with optional filters
  app.get("/api/admin/local-product-bases", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { manufacturerId, adminApproved, category } = req.query;
      
      const filter: any = {};
      if (manufacturerId !== undefined) {
        filter.manufacturerId = parseInt(manufacturerId as string);
      }
      if (adminApproved !== undefined) {
        filter.adminApproved = adminApproved === 'true';
      }
      if (category) {
        filter.category = category as string;
      }
      
      const baseProducts = await storage.listLocalProductBases(filter);
      res.json(baseProducts);
    } catch (error) {
      console.error("Error listing local product bases:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // List all local product views (complete product info) with optional filters
  app.get("/api/admin/local-product-views", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const { category, district, status, adminApproved, isDraft, manufacturerId } = req.query;
      
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
      
      if (adminApproved !== undefined) {
        filter.adminApproved = adminApproved === 'true';
      }
      
      if (isDraft !== undefined) {
        filter.isDraft = isDraft === 'true';
      }
      
      if (manufacturerId !== undefined) {
        filter.manufacturerId = parseInt(manufacturerId as string);
      }
      
      console.log("Fetching local product views with filter:", filter);
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error("Error listing local product views:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Update a local product base
  app.put("/api/admin/local-product-bases/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const baseProduct = await storage.getLocalProductBaseById(id);
      if (!baseProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Validate and update
      const updateData = insertLocalProductBaseSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateLocalProductBase(id, updateData);
      
      res.json(updatedProduct);
    } catch (error: any) {
      console.error("Error updating local product base:", error);
      res.status(400).json({ message: error.message || "Invalid update data" });
    }
  });
  
  // === Product Details (Admin) ===
  // Create product details (Step 2 of 2)
  app.post("/api/admin/local-product-details", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const detailsData = {
        ...req.body,
        isDraft: req.body.isDraft ?? true,
        status: req.body.status || "pending"
      };
      
      const validatedData = upsertLocalProductDetailsSchema.parse(detailsData);
      const details = await storage.createLocalProductDetails(validatedData);
      
      res.status(201).json(details);
    } catch (error: any) {
      console.error("Error creating local product details:", error);
      res.status(400).json({ message: error.message || "Invalid product details" });
    }
  });
  
  // Get a specific product details by detail ID
  app.get("/api/admin/local-product-details/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const details = await storage.getLocalProductDetailsById(id);
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      
      res.json(details);
    } catch (error) {
      console.error("Error fetching local product details:", error);
      res.status(500).json({ message: "Failed to fetch product details" });
    }
  });
  
  // Get product details by product ID
  app.get("/api/admin/local-product-details/by-product/:productId", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const details = await storage.getLocalProductDetailsByProductId(productId);
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      
      res.json(details);
    } catch (error) {
      console.error("Error fetching local product details by product ID:", error);
      res.status(500).json({ message: "Failed to fetch product details" });
    }
  });
  
  // Update product details
  app.put("/api/admin/local-product-details/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const details = await storage.getLocalProductDetailsById(id);
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      
      // Validate and update
      const updateData = upsertLocalProductDetailsSchema.partial().parse(req.body);
      const updatedDetails = await storage.updateLocalProductDetails(id, updateData);
      
      res.json(updatedDetails);
    } catch (error: any) {
      console.error("Error updating local product details:", error);
      res.status(400).json({ message: error.message || "Invalid update data" });
    }
  });
  
  // === Composite Local Products View (Admin) ===
  // List all products (combined view of bases + details)
  app.get("/api/admin/local-products", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      console.log("GET /api/admin/local-products request received");
      console.log("User:", req.user);
      console.log("Query params:", req.query);
      
      const { category, district, manufacturerId, status, isDraft, adminApproved } = req.query;
      
      const filter: any = {};
      if (category) filter.category = category as string;
      if (district) filter.district = district as string;
      if (manufacturerId) filter.manufacturerId = parseInt(manufacturerId as string);
      if (status) filter.status = status as string;
      if (isDraft !== undefined) filter.isDraft = isDraft === 'true';
      if (adminApproved !== undefined) filter.adminApproved = adminApproved === 'true';
      
      console.log("Applying filter:", filter);
      
      try {
        const products = await storage.listLocalProductViews(filter);
        console.log(`Found ${products?.length || 0} local products`);
        res.json(products || []);
      } catch (storageError) {
        console.error("Storage error when listing local products:", storageError);
        res.status(500).json({ message: "Database error when fetching products", error: String(storageError) });
      }
    } catch (error) {
      console.error("Error listing local products:", error);
      res.status(500).json({ message: "Failed to fetch products", error: String(error) });
    }
  });
  
  // Get a specific product (combined view)
  app.get("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const product = await storage.getLocalProductView(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching local product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Delete a local product (soft delete by setting status to inactive)
  app.delete("/api/admin/local-products/:id", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Get the product details first
      const details = await storage.getLocalProductDetailsByProductId(id);
      if (!details) {
        return res.status(404).json({ message: "Product not found or has no details" });
      }
      
      // Update the status to inactive
      const updatedDetails = await storage.updateLocalProductDetails(details.id, { 
        status: "inactive"
      });
      
      res.json({ message: "Product deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating local product:", error);
      res.status(500).json({ message: "Failed to deactivate product" });
    }
  });
  
  // Approve a local product
  app.post("/api/admin/local-products/:id/approve", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // First update the base product to mark it as approved
      const baseProduct = await storage.updateLocalProductBase(id, { 
        adminApproved: true 
      });
      
      if (!baseProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Now get the details and update the status if needed
      const details = await storage.getLocalProductDetailsByProductId(id);
      if (details && details.status === "pending") {
        await storage.updateLocalProductDetails(details.id, { 
          status: "active" 
        });
      }
      
      res.json({ message: "Product approved successfully" });
    } catch (error) {
      console.error("Error approving local product:", error);
      res.status(500).json({ message: "Failed to approve product" });
    }
  });
  
  // Publish a product (set isDraft to false)
  app.post("/api/admin/local-products/:id/publish", isAuthenticated, hasRole(["admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const details = await storage.getLocalProductDetailsByProductId(id);
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      
      const updatedDetails = await storage.updateLocalProductDetails(details.id, { 
        isDraft: false 
      });
      
      res.json({ message: "Product published successfully" });
    } catch (error) {
      console.error("Error publishing local product:", error);
      res.status(500).json({ message: "Failed to publish product" });
    }
  });
  
  // === Manufacturer API Endpoints ===
  // Create a new product base (as manufacturer)
  app.post("/api/manufacturer/local-product-bases", isAuthenticated, async (req, res) => {
    try {
      // Verify the user is a manufacturer
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Only manufacturers can create products" });
      }
      
      const baseProductData = {
        ...req.body,
        manufacturerId: req.user.id
      };
      
      const validatedData = insertLocalProductBaseSchema.parse(baseProductData);
      const baseProduct = await storage.createLocalProductBase(validatedData);
      
      res.status(201).json(baseProduct);
    } catch (error: any) {
      console.error("Error creating manufacturer product base:", error);
      res.status(400).json({ message: error.message || "Invalid product data" });
    }
  });
  
  // List manufacturer's products
  app.get("/api/manufacturer/local-products", isAuthenticated, async (req, res) => {
    try {
      // Verify the user is a manufacturer
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Only manufacturers can access this endpoint" });
      }
      
      const filter = { manufacturerId: req.user.id };
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error("Error listing manufacturer's products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Add details to a product (as manufacturer)
  app.post("/api/manufacturer/local-product-details", isAuthenticated, async (req, res) => {
    try {
      // Verify the user is a manufacturer
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Only manufacturers can add product details" });
      }
      
      // Verify they own the base product
      const productId = req.body.productId;
      const baseProduct = await storage.getLocalProductBaseById(productId);
      
      if (!baseProduct) {
        return res.status(404).json({ message: "Base product not found" });
      }
      
      if (baseProduct.manufacturerId !== req.user.id) {
        return res.status(403).json({ message: "You can only add details to your own products" });
      }
      
      const detailsData = {
        ...req.body,
        isDraft: req.body.isDraft ?? true,
        status: "pending" // Manufacturer submissions always start as pending
      };
      
      const validatedData = upsertLocalProductDetailsSchema.parse(detailsData);
      const details = await storage.createLocalProductDetails(validatedData);
      
      res.status(201).json(details);
    } catch (error: any) {
      console.error("Error creating product details as manufacturer:", error);
      res.status(400).json({ message: error.message || "Invalid product details" });
    }
  });
  
  // Update product details (as manufacturer)
  app.put("/api/manufacturer/local-product-details/:id", isAuthenticated, async (req, res) => {
    try {
      // Verify the user is a manufacturer
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Only manufacturers can update product details" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Get the details and verify ownership
      const details = await storage.getLocalProductDetailsById(id);
      if (!details) {
        return res.status(404).json({ message: "Product details not found" });
      }
      
      const baseProduct = await storage.getLocalProductBaseById(details.productId);
      if (!baseProduct || baseProduct.manufacturerId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own products" });
      }
      
      // Don't allow changing status or approval
      const updateData = {
        ...req.body,
        status: details.status, // Preserve original status
      };
      
      const validatedData = upsertLocalProductDetailsSchema.partial().parse(updateData);
      const updatedDetails = await storage.updateLocalProductDetails(id, validatedData);
      
      res.json(updatedDetails);
    } catch (error: any) {
      console.error("Error updating product details as manufacturer:", error);
      res.status(400).json({ message: error.message || "Invalid update data" });
    }
  });
  
  // Publish a product (as manufacturer)
  app.post("/api/manufacturer/local-products/:id/publish", isAuthenticated, async (req, res) => {
    try {
      // Verify the user is a manufacturer
      const serviceProvider = await storage.getServiceProviderByUserId(req.user.id);
      if (!serviceProvider || serviceProvider.providerType !== "manufacturer") {
        return res.status(403).json({ message: "Only manufacturers can publish products" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Verify they own the product
      const baseProduct = await storage.getLocalProductBaseById(id);
      if (!baseProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (baseProduct.manufacturerId !== req.user.id) {
        return res.status(403).json({ message: "You can only publish your own products" });
      }
      
      const details = await storage.getLocalProductDetailsByProductId(id);
      if (!details) {
        return res.status(400).json({ message: "Product has no details, cannot publish" });
      }
      
      // Update to not a draft, but keep status as pending for admin review
      const updatedDetails = await storage.updateLocalProductDetails(details.id, { 
        isDraft: false,
        status: "pending"
      });
      
      res.json({ message: "Product submitted for approval" });
    } catch (error) {
      console.error("Error publishing product as manufacturer:", error);
      res.status(500).json({ message: "Failed to publish product" });
    }
  });
  
  // === Public Endpoints ===
  // List active, approved, published products
  app.get("/api/local-products", async (req, res) => {
    try {
      const { category, district } = req.query;
      
      const filter: any = {
        status: "active",
        adminApproved: true,
        isDraft: false
      };
      
      if (category) filter.category = category as string;
      if (district) filter.district = district as string;
      
      const products = await storage.listLocalProductViews(filter);
      res.json(products);
    } catch (error) {
      console.error("Error listing public local products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Get a specific public product
  app.get("/api/local-products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const product = await storage.getLocalProductView(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Only allow access to active, approved, published products
      if (product.status !== "active" || !product.adminApproved || product.isDraft) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching public local product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  const httpServer = createServer(app);
  
  // Log that the server is ready
  httpServer.on('listening', () => {
    console.log('Server is listening and ready for deployment');
  });
  
  return httpServer;
}
