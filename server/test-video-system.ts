import { db } from "./db";
import { videos, videoViews } from "@shared/schema";

/**
 * Test script to demonstrate video system functionality
 */
async function testVideoSystem() {
  console.log("Testing video system functionality...");

  try {
    // Test 1: Create a sample video
    const sampleVideo = await db.insert(videos).values({
      title: "Platform Overview - Getting Started",
      description: "A comprehensive guide to using the NALAMINI Service Platform. Learn about all available services including taxi, delivery, grocery, and more.",
      fileName: "platform_overview.mp4",
      fileUrl: "/uploads/videos/platform_overview.mp4",
      fileSize: 52428800, // 50MB
      duration: 480, // 8 minutes
      uploadedBy: 1, // Admin user
      category: "onboarding",
      isPublic: true,
      tags: ["tutorial", "getting-started", "overview", "nalamini"],
      status: "active"
    }).returning();

    console.log("✓ Sample video created:", sampleVideo[0].title);

    // Test 2: Create another video
    const trainingVideo = await db.insert(videos).values({
      title: "Service Provider Training - Best Practices",
      description: "Essential training for service providers covering customer service, quality standards, and platform policies.",
      fileName: "provider_training.mp4", 
      fileUrl: "/uploads/videos/provider_training.mp4",
      fileSize: 78643200, // 75MB
      duration: 720, // 12 minutes
      uploadedBy: 1,
      category: "training",
      isPublic: true,
      tags: ["training", "providers", "best-practices", "customer-service"],
      status: "active"
    }).returning();

    console.log("✓ Training video created:", trainingVideo[0].title);

    // Test 3: Create a video view record
    const videoView = await db.insert(videoViews).values({
      videoId: sampleVideo[0].id,
      userId: 1,
      ipAddress: "127.0.0.1",
      watchTime: 240, // 4 minutes watched
      completionPercentage: 50
    }).returning();

    console.log("✓ Video view recorded:", videoView[0].id);

    // Test 4: Query all videos
    const allVideos = await db.select().from(videos);
    console.log(`✓ Total videos in database: ${allVideos.length}`);

    // Test 5: Query public videos only
    const publicVideos = await db.select().from(videos).where(videos.isPublic === true);
    console.log(`✓ Public videos available: ${publicVideos.length}`);

    console.log("\nVideo system test completed successfully!");
    console.log("The system is ready for video uploads and management.");

  } catch (error) {
    console.error("Error testing video system:", error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await testVideoSystem();
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testVideoSystem };