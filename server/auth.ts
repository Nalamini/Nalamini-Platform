import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "tamilnadu-services-platform-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[AUTH DEBUG] Login attempt for username: ${username}`);
        const user = await storage.getUserByUsername(username);
        console.log(`[AUTH DEBUG] User found:`, user ? `ID: ${user.id}, Username: ${user.username}` : 'No user found');
        
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
    }),
  );

  passport.serializeUser((user, done) => {
    console.log(`[AUTH DEBUG] Serializing user:`, user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log(`[AUTH DEBUG] Deserializing user ID:`, id);
      const user = await storage.getUser(id);
      console.log(`[AUTH DEBUG] Deserialized user:`, user ? `ID: ${user.id}, Username: ${user.username}` : 'No user found');
      done(null, user);
    } catch (error) {
      console.error(`[AUTH DEBUG] Deserialization error:`, error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    console.log(`[AUTH DEBUG] Registration attempt:`, req.body.username);
    try {
      const registerSchema = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
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
        password: await hashPassword(userData.password),
      });

      console.log(`[AUTH DEBUG] Registration successful: User ${user.username} created with ID ${user.id}`);

      // If user is registering as a service provider, create service provider record
      if (userData.userType === "service_provider" && req.body.providerType) {
        console.log(`[AUTH DEBUG] Creating service provider record for user ${user.id}`);
        try {
          const serviceProviderData = {
            userId: user.id,
            providerType: req.body.providerType,
            businessName: req.body.businessName || "",
            address: `${userData.district}, ${userData.taluk}`, // Use location info from user registration
            district: userData.district,
            taluk: userData.taluk,
            pincode: userData.pincode,
            phone: "", // We'll collect this later if needed
            email: "", // We'll collect this later if needed
            description: req.body.businessDescription || "",
            status: "pending",
            verificationStatus: "pending"
          };
          
          await storage.createServiceProvider(serviceProviderData);
          console.log(`[AUTH DEBUG] Service provider record created successfully`);
        } catch (error) {
          console.error(`[AUTH DEBUG] Failed to create service provider record:`, error);
          // Don't fail the registration if service provider creation fails
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

  app.post("/api/login", (req, res, next) => {
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
      
      req.login(user, (err) => {
        if (err) {
          console.error(`[AUTH DEBUG] Session creation error:`, err);
          return next(err);
        }
        console.log(`[AUTH DEBUG] Login successful for user ${user.username}`);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
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

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      console.log(`[AUTH DEBUG] Unauthenticated user check`);
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(`[AUTH DEBUG] User check for:`, req.user.username);
    res.json(req.user);
  });
}