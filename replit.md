# Nalamini Service Platform - Replit Development Guide

## Overview

Nalamini Service Platform is a comprehensive digital service ecosystem designed for Tamil Nadu, connecting communities through 7 integrated services including taxi, delivery, farmer's market, local products, grocery, recharge, and recycling. The platform features a hierarchical management structure with role-based access control and native mobile app capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router with protected routes
- **Mobile Support**: Capacitor for native Android functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Authentication**: Passport.js with session-based authentication
- **File Handling**: Multer for multipart/form-data uploads
- **Security**: Helmet, CORS, and session management

### Database & ORM
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: Drizzle ORM with TypeScript support
- **Schema**: Centralized schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### User Management System
- **Hierarchical Roles**: Admin → Branch Manager → Taluk Manager → Service Agent → Provider/Customer
- **Geographic Structure**: 38 districts with 261 taluks across Tamil Nadu
- **Authentication**: Secure login with role-based dashboard redirection
- **Commission System**: 6% total commission distributed across management levels

### Service Modules
1. **Travel Services**: Comprehensive booking platform
   - **Bus Booking**: RedBus API integration with seat selection and route management
   - **Flight Booking**: Amadeus API integration for domestic and international flights
   - **Hotel Booking**: Amadeus API integration for accommodation reservations
2. **Taxi Services**: Booking, GPS tracking, driver management
3. **Delivery Services**: Package delivery with real-time tracking
4. **Farmer's Market**: Direct farm-to-consumer product listings
5. **Local Products**: Tamil Nadu artisan and manufacturer marketplace
6. **Grocery Platform**: Category-based grocery ordering system
7. **Recharge Services**: Mobile and utility payment processing
8. **Recycling Platform**: Waste management and buyback services

### Mobile Integration
- **Capacitor Framework**: Native Android app wrapper
- **Native Plugins**: Camera, Geolocation, Push Notifications, Local Storage
- **Progressive Web App**: PWA capabilities for browser-based installation
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces

## Data Flow

### Request Lifecycle
1. **Client Request**: React frontend makes API calls via fetch/axios
2. **Authentication**: Passport.js validates session and user permissions
3. **Route Handling**: Express routes process business logic
4. **Database Operations**: Drizzle ORM handles database interactions
5. **Response**: JSON data returned to frontend for state updates

### File Upload Flow
1. **Frontend**: File selection via React components
2. **Multer Middleware**: Processes multipart uploads
3. **Storage**: Files saved to `/uploads` directory with organized structure
4. **Database**: File metadata stored in PostgreSQL
5. **Serving**: Static files served via Express middleware

### Commission Distribution
1. **Transaction Processing**: Service bookings trigger commission calculations
2. **Hierarchical Distribution**: 6% total split across management levels
3. **Database Updates**: Commission records stored with transaction references
4. **Dashboard Analytics**: Real-time commission tracking and reporting

## External Dependencies

### Payment Integration
- **Razorpay**: Primary payment gateway for all transactions
- **Environment Variables**: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- **Webhook Handling**: Payment confirmation and failure processing

### YouTube Integration
- **YouTube Data API v3**: Video content management
- **Channel Management**: Automated video uploads and playlist organization
- **Environment Variables**: `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID`

### Geographic Data
- **Tamil Nadu Administrative Data**: Hardcoded district and taluk mappings
- **Location Services**: GPS coordinates for service delivery
- **Address Validation**: District/taluk verification for user registration

### Database Providers
- **Neon Database**: Serverless PostgreSQL for production
- **Local SQLite**: Development database with automatic fallback
- **Connection Pooling**: Optimized for serverless deployments

## Deployment Strategy

### Development Environment
- **Replit Integration**: Native development environment with hot reload
- **Local Database**: SQLite with automatic schema synchronization
- **Environment Variables**: `.env` file for local configuration
- **Port Configuration**: Default port 5000 with automatic binding

### Production Deployment
- **Vercel**: Primary deployment target with serverless functions
- **Custom Domain**: Configured for www.nalamini.com
- **Environment Variables**: Production secrets managed via platform
- **Database**: PostgreSQL connection via `DATABASE_URL`

### Mobile App Deployment
- **Android Studio**: Native Android app building via Capacitor
- **Google Play Store**: AAB/APK generation for store submission
- **Progressive Web App**: Browser-based installation fallback
- **Code Push**: OTA updates via Capacitor Live Updates

### Build Process
- **Vite**: Frontend bundling with optimized production builds
- **ESBuild**: Server-side TypeScript compilation
- **Static Assets**: Automatic optimization and compression
- **Environment Detection**: Automatic development/production mode switching

## Recent Changes
- July 2, 2025: Implemented Dual Language Sequential Playlist Feature
  - Added automatic video classification by language (Tamil/English) based on content analysis
  - Created sequential playlist that alternates between Tamil and English videos
  - Implemented auto-play functionality with automatic video transitions
  - Added comprehensive video controls: language indicators, playlist position, manual navigation
  - Enhanced video player with overlay controls for previous/next video navigation
  - Integrated language-specific video counts and separate playlist management
  - Added real-time language switching and manual playback mode toggle

- July 2, 2025: Enhanced Travel Services with comprehensive Travelomatix API integration
  - Implemented robust error handling and demo data fallback system
  - Added API connection test endpoint at /api/bus/test-connection
  - Fixed navigation structure to show unified "Travel Services" option
  - Created demo bus data showing "South India Travels" and "Tamil Nadu Express"
  - Resolved server connectivity issues and improved user experience

## Changelog
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.