import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Migration to add video management tables
 */
async function migrateVideoTables() {
  console.log("Starting video tables migration...");

  try {
    // Create videos table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size INTEGER NOT NULL,
        duration INTEGER NOT NULL DEFAULT 0,
        thumbnail_url VARCHAR(500),
        uploaded_by INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'general',
        is_public BOOLEAN NOT NULL DEFAULT false,
        tags TEXT[] DEFAULT '{}',
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        view_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✓ Videos table created successfully");

    // Create video_views table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS video_views (
        id SERIAL PRIMARY KEY,
        video_id INTEGER NOT NULL,
        user_id INTEGER,
        ip_address VARCHAR(45),
        watch_time INTEGER DEFAULT 0,
        completion_percentage INTEGER DEFAULT 0,
        viewed_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log("✓ Video views table created successfully");

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_videos_is_public ON videos(is_public);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON video_views(user_id);
    `);

    console.log("✓ Database indexes created successfully");

    console.log("Video tables migration completed successfully!");

  } catch (error) {
    console.error("Error during video tables migration:", error);
    throw error;
  }
}

/**
 * Main function to run the migration
 */
async function main() {
  try {
    await migrateVideoTables();
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { migrateVideoTables };