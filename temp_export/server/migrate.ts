import { db } from './db';
import * as schema from '../shared/schema';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

// Simple script to push the schema to the database
async function main() {
  console.log('Pushing schema to database...');
  
  try {
    // Create service_providers table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS service_providers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        provider_type TEXT NOT NULL,
        business_name TEXT,
        address TEXT NOT NULL,
        district TEXT NOT NULL,
        taluk TEXT NOT NULL,
        pincode TEXT NOT NULL,
        operating_areas JSONB,
        phone TEXT NOT NULL,
        email TEXT,
        website TEXT,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        verification_status TEXT NOT NULL DEFAULT 'pending',
        verified_by INTEGER,
        documents JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created service_providers table');

    // Create farmer_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS farmer_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        farm_size TEXT,
        farm_type TEXT,
        primary_products TEXT NOT NULL,
        cultivation_season TEXT,
        supports_delivery BOOLEAN DEFAULT FALSE,
        bank_details JSONB,
        operating_hours TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created farmer_details table');

    // Create manufacturer_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS manufacturer_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        product_categories TEXT NOT NULL,
        business_type TEXT NOT NULL,
        establishment_year TEXT,
        supports_delivery BOOLEAN DEFAULT FALSE,
        bank_details JSONB,
        operating_hours TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created manufacturer_details table');

    // Create booking_agent_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS booking_agent_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        service_types TEXT NOT NULL,
        operating_hours TEXT,
        years_of_experience TEXT,
        preferred_providers TEXT,
        bank_details JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created booking_agent_details table');

    // Create taxi_provider_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS taxi_provider_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        vehicle_types TEXT NOT NULL,
        operating_hours TEXT,
        fleet_size TEXT,
        drivers_count TEXT,
        bank_details JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created taxi_provider_details table');

    // Create transportation_agent_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transportation_agent_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        vehicle_types TEXT NOT NULL,
        operating_hours TEXT,
        services_offered TEXT NOT NULL,
        coverage_areas TEXT NOT NULL,
        max_capacity TEXT,
        bank_details JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created transportation_agent_details table');

    // Create rental_provider_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS rental_provider_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        item_categories TEXT NOT NULL,
        operating_hours TEXT,
        rental_terms TEXT NOT NULL,
        security_deposit_terms TEXT,
        bank_details JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created rental_provider_details table');

    // Create recycling_agent_details table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS recycling_agent_details (
        id SERIAL PRIMARY KEY,
        service_provider_id INTEGER NOT NULL UNIQUE,
        material_types TEXT NOT NULL,
        operating_hours TEXT,
        pricing_policy TEXT NOT NULL,
        processing_capacity TEXT,
        bank_details JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created recycling_agent_details table');
    
    // Check if tables exist
    const tables = await db.execute(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\''
    );
    console.log('Existing tables:', tables.rows.map((r: any) => r.table_name).join(', '));
    
    console.log('Schema push completed successfully');
  } catch (error) {
    console.error('Schema push failed:', error);
  } finally {
    process.exit(0);
  }
}

main();