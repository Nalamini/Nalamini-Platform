# Nalamini Service Platform Architecture

## 1. Overview

The Nalamini Service Platform is a comprehensive multi-service platform designed for Tamil Nadu, India. It connects service providers with customers through a hierarchical management structure that includes admins, branch managers, taluk managers, service agents, service providers, and customers.

The platform offers various services:
- Mobile recharges and bill payments
- Travel and accommodation bookings
- Equipment rentals
- Taxi services
- Delivery management
- Grocery shopping (B2B & B2C with direct farmer connections)
- Local product marketplace
- Recycling services
- Integrated wallet system for transactions
- Commission management for the service hierarchy
- WhatsApp integration for notifications

## 2. System Architecture

The Nalamini Service Platform follows a monolithic architecture with clear separation between frontend and backend components. It is designed as a full-stack JavaScript/TypeScript application.

### 2.1 Frontend Architecture

- **Technology Stack**: React with TypeScript
- **UI Framework**: TailwindCSS with Shadcn UI components
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Form Handling**: React Hook Form with Zod validation (@hookform/resolvers)
- **Build Tool**: Vite with various plugins for bundling and optimization

### 2.2 Backend Architecture

- **Technology Stack**: Node.js with Express, built with TypeScript
- **API Style**: RESTful API endpoints organized by service domain
- **Authentication**: Session-based authentication with Passport.js
- **Session Storage**: Both memory store and PostgreSQL-based session storage
- **File Upload**: Multer for handling multipart/form-data and file uploads

### 2.3 Database Architecture

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM for type-safe database interactions
- **Connection**: Uses @neondatabase/serverless for PostgreSQL connection
- **Schema Management**: Drizzle Kit for schema migrations and management
- **Data Validation**: Zod for schema validation of database entities

### 2.4 Service Layer Architecture

The platform implements a service-oriented pattern within the monolith:

- Each domain (recharge, wallet, travel, etc.) has its own service module
- Services encapsulate business logic and interact with the database layer
- Commission distribution follows a hierarchical model through dedicated services
- Notification services abstract communication channels like WhatsApp

## 3. Key Components

### 3.1 User Management

The platform implements a hierarchical user model:
- **Admin**: Top-level system administrators
- **Branch Managers**: District-level managers
- **Taluk Managers**: Sub-district level managers
- **Service Agents**: Pincode-level service representatives
- **Service Providers**: Businesses offering various services including farmers
- **Customers**: End users consuming services

### 3.2 Authentication & Authorization

- Session-based authentication using Passport.js with local strategy
- Password security using scrypt with salt for hashing
- Role-based access control for different user types
- Authorization middleware to protect API endpoints

### 3.3 Wallet & Transaction System

- Integrated wallet for all users with balance tracking
- Transaction logging for all financial operations
- Support for credit/debit operations across services

### 3.4 Commission Management

- Configurable commission rates for different service types
- Hierarchical commission distribution (Admin → Branch Manager → Taluk Manager → Service Agent)
- Commission tracking and reporting capabilities

### 3.5 Service Provider Management

- Registration and verification workflow for service providers
- Specialized support for farmer listings and product management
- Delivery area management for service coverage

### 3.6 Grocery & Local Product Marketplace

- Hierarchical product categorization (categories → subcategories → products)
- Support for both B2B and B2C channels
- Direct farmer-to-consumer connections
- Product listing management with approval workflows

### 3.7 Notification System

- Integration with WhatsApp for transactional notifications
- Template-based message generation for different event types
- Support for transaction updates and commission notifications

## 4. Data Flow

### 4.1 User Registration & Authentication

1. User registers with username, password, and role information
2. Password is hashed using scrypt with salt before storage
3. User logs in with credentials, authenticated through Passport.js
4. Session is established and stored in session storage
5. Authorization middleware checks user role for protected routes

### 4.2 Service Request Flow

1. Authenticated user initiates a service request (recharge, booking, etc.)
2. Frontend validates request data using Zod schemas
3. Backend receives request and performs additional validation
4. Service layer processes the request, interacting with the database
5. Transaction records are created and wallet balances updated
6. Commissions are calculated and distributed to the user hierarchy
7. Notifications are sent to relevant parties
8. Response is returned to the client

### 4.3 Product Listing Flow (Farmer/Local Products)

1. Service provider/farmer creates a product listing
2. Listing is validated and stored in the database
3. Admin approval workflow is triggered if required
4. Once approved, product becomes available in the marketplace
5. Customers can browse, search, and purchase products
6. Orders are tracked and processed by the system

## 5. External Dependencies

### 5.1 Payment Processing

- **Razorpay**: Integrated for payment processing
- **Stripe**: Used for additional payment options

### 5.2 Communications

- **WhatsApp API**: Used for sending notifications and updates
- **SendGrid**: Email service for notifications and communications

### 5.3 Cloud Services

- **Neon Database**: Serverless PostgreSQL for data storage
- **Upload Storage**: Local file system for uploads with fallback SVGs

## 6. Deployment Strategy

The platform supports multiple deployment options, each with its own configuration:

### 6.1 Vercel Deployment

- **Configuration**: vercel.json and API-specific setup
- **Challenges**: Package path issues addressed through specialized deployment scripts
- **Approach**: Simplified API deployment to bypass build complexities

### 6.2 Render.com Deployment

- **Configuration**: render.yaml defines the service configuration
- **Build Process**: npm ci && npm run build
- **Environment**: Node.js with health check endpoint

### 6.3 Heroku Deployment

- **Configuration**: Procfile and app.json
- **Buildpacks**: Heroku's Node.js buildpack

### 6.4 Docker Deployment

- **Configuration**: Dockerfile and docker-compose.yml
- **Base Image**: node:20-slim
- **Runtime**: Configured for production with proper environment variables
- **Volumes**: Persistent storage for uploads

### 6.5 Development Environment

- **Configuration**: .replit for Replit-based development
- **Build Tools**: npm scripts for development, building, and starting
- **Environment Variables**: Database URL, Razorpay credentials, etc.

## 7. Database Schema

The database schema is defined using Drizzle ORM with the following main entities:

### 7.1 Core Entities

- **users**: Store user information with role-based attributes
- **transactions**: Record all financial transactions
- **service_providers**: Store information about businesses offering services
- **farmer_details**: Extended information for farmers as service providers

### 7.2 Service-Specific Entities

- **recharges**: Mobile and utility recharge transactions
- **bookings**: Travel and accommodation bookings
- **rentals**: Equipment rental records
- **taxi_rides**: Taxi service bookings
- **deliveries**: Delivery service records
- **recycling_requests**: Recycling service requests

### 7.3 Product-Related Entities

- **grocery_categories**, **grocery_subcategories**, **grocery_products**: Hierarchy for grocery items
- **farmer_product_listings**: Farmer-specific product listings
- **delivery_areas**: Geographic coverage for product delivery
- **local_product_base**, **local_product_details**: Local product marketplace listings

### 7.4 Financial Entities

- **commission_configs**: Commission rate configurations
- **commission_transactions**: Commission distribution records

## 8. Performance Considerations

- **Database Queries**: Optimized using Drizzle ORM
- **Static Files**: Served with proper caching headers
- **API Responses**: Logging for monitoring response times
- **Uploads**: Managed through dedicated directories with permissions

## 9. Security Considerations

- **Password Security**: Secure hashing with scrypt and salt
- **Session Management**: Secure session configuration
- **Input Validation**: Consistent validation with Zod schemas
- **File Upload Security**: Controlled through Multer configuration
- **Environment Variables**: Sensitive configuration stored in environment variables

## 10. Future Considerations

- **Microservices Split**: Potential for splitting the monolith into microservices by domain
- **Additional Payment Gateways**: Support for more payment options
- **Enhanced Analytics**: Advanced reporting and analytics features
- **Mobile App Integration**: API endpoints designed for potential mobile applications