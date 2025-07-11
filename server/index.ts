import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerOilRoutes } from "./routes-oil";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import http from "http";
import { db } from "./db";
import { videoUploads } from "@shared/schema";
import { sql, eq, desc, and } from "drizzle-orm";
// import { migrate } from "drizzle-orm/node-postgres/migrator"; // Uncomment if you need it

// Set Node.js HTTP parser limits for large file uploads
http.globalAgent.maxSockets = Infinity;
process.env.UV_THREADPOOL_SIZE = "128";

const app = express();

// PUBLIC VIDEO ENDPOINT - NO AUTHENTICATION (must be first)
app.get("/api/videos/approved", async (req, res) => {
  try {
    const { district, taluk, pincode, category, limit = 20 } = req.query;

    console.log("PUBLIC: Fetching approved videos for video library...");

    let whereConditions = [eq(videoUploads.status, "approved")];

    if (district) {
      whereConditions.push(eq(videoUploads.targetArea, district as string));
    }
    if (category && category !== "all") {
      whereConditions.push(eq(videoUploads.category, category as string));
    }

    const videos = await db
      .select({
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
        updatedAt: videoUploads.updatedAt,
      })
      .from(videoUploads)
      .where(and(...whereConditions))
      .orderBy(desc(videoUploads.createdAt))
      .limit(parseInt(limit as string));

    console.log(`PUBLIC: Found ${videos.length} approved videos`);
    res.json(videos);
  } catch (error: any) {
    console.error("PUBLIC: Error fetching approved videos:", error);
    res.status(500).json({ message: "Error fetching approved videos" });
  }
});

// Skip body parsing for video upload routes
app.use(["/api/videos/upload", "/api/videos/upload-chunk"], (req, res, next) => {
  next();
});

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: false, limit: "150mb" }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// Multer/upload errors
app.use((err: any, req: any, res: any, next: any) => {
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

// API request logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// MAIN SERVER STARTUP
(async () => {
  try {
    // Run migrations if needed (optional)
    // await migrate(db, { migrationsFolder: "./drizzle" });

    // Seed data
    await seedDatabase();

    // Register routes
    registerOilRoutes(app);
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    // Setup Vite in dev, static files in prod
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Tuning
    server.maxHeadersCount = 0;
    server.timeout = 300000; // 5 minutes
    server.keepAliveTimeout = 0;
    server.headersTimeout = 0;

    // Start server
    const port = 5000;
server.listen(port, '0.0.0.0', () => {
  log(`serving on port ${port}`);
});
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
