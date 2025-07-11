import { db } from '../db';
import { eq } from 'drizzle-orm';
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { 
  groceryCategories, 
  grocerySubCategories, 
  groceryProducts, 
  serviceProviders, 
  users 
} from '@shared/schema';
import bcrypt from "bcrypt";

/**
 * Service to manage dummy data for testing and development
 */
class DummyDataService {
  /**
   * Check if dummy data is already loaded into the database
   */
  async isDummyDataLoaded(): Promise<boolean> {
    try {
      const categories = await db.select().from(groceryCategories);
      const subcategories = await db.select().from(grocerySubCategories);
      const products = await db.select().from(groceryProducts);
      return (
        categories.length > 0 &&
        subcategories.length > 0 &&
        products.length > 0
      );
    } catch (error) {
      console.error('Error checking dummy data:', error);
      return false;
    }
  }

  /**
   * Load dummy data into the database
   */
  async loadDummyData(): Promise<void> {
    try {
      const isLoaded = await this.isDummyDataLoaded();
      if (isLoaded) {
        console.log('Dummy data already loaded, skipping...');
        return;
      }

      await this.loadDummyCategories();
      await this.loadDummySubcategories();
      await this.loadDummyProducts();

      console.log('All dummy data loaded successfully');
    } catch (error) {
      console.error('Error loading dummy data:', error);
      throw error;
    }
  }

  /**
   * Clear all dummy data from the database
   */
  async clearDummyData(): Promise<void> {
    try {
      await db.delete(groceryProducts);
      await db.delete(grocerySubCategories);
      await db.delete(groceryCategories);
      console.log('All dummy data cleared successfully');
    } catch (error) {
      console.error('Error clearing dummy data:', error);
      throw error;
    }
  }

  /**
   * Load dummy categories
   */
  private async loadDummyCategories(): Promise<void> {
    const existingCategories = await db.select().from(groceryCategories);
    if (existingCategories.length > 0) {
      console.log('Categories already exist, skipping category creation');
      return;
    }

    const categories = [
      { name: 'Fruits', description: 'Fresh fruits from local farmers', icon: '🍎', color: '#FF5733', isActive: true, displayOrder: 1, status: 'active' },
      { name: 'Vegetables', description: 'Fresh vegetables from local farmers', icon: '🥦', color: '#1E8449', isActive: true, displayOrder: 2, status: 'active' },
      { name: 'Dairy', description: 'Milk, cheese, and other dairy products', icon: '🥛', color: '#F7F4E9', isActive: true, displayOrder: 3, status: 'active' },
      { name: 'Oils', description: 'Cooking oils and ghee', icon: '🫒', color: '#F4D03F', isActive: true, displayOrder: 4, status: 'active' },
      { name: 'Grains', description: 'Rice, wheat, and other grains', icon: '🌾', color: '#D4AC0D', isActive: true, displayOrder: 5, status: 'active' },
      { name: 'Spices', description: 'Spices and condiments', icon: '🌶️', color: '#E74C3C', isActive: true, displayOrder: 6, status: 'active' }
    ];

    for (const category of categories) {
      await db.insert(groceryCategories).values(category);
    }

    console.log(`${categories.length} categories loaded successfully`);
  }

  /**
   * Load dummy subcategories
   */
  private async loadDummySubcategories(): Promise<void> {
    const existingSubcategories = await db.select().from(grocerySubCategories);
    if (existingSubcategories.length > 0) {
      console.log('Subcategories already exist, skipping subcategory creation');
      return;
    }

    const categories = await db.select().from(groceryCategories);
    const categoryMap = new Map(categories.map(c => [c.name, c.id]));

    const subcategories = [
      { name: 'Apples', description: 'Different varieties of apples', parentCategoryId: categoryMap.get('Fruits'), isActive: true },
      { name: 'Bananas', description: 'Fresh bananas', parentCategoryId: categoryMap.get('Fruits'), isActive: true },
      { name: 'Oranges', description: 'Sweet juicy oranges', parentCategoryId: categoryMap.get('Fruits'), isActive: true },
      { name: 'Berries', description: 'Various berries', parentCategoryId: categoryMap.get('Fruits'), isActive: true },
      { name: 'Stone Fruits', description: 'Peaches, plums, etc.', parentCategoryId: categoryMap.get('Fruits'), isActive: true },
      { name: 'Leafy Greens', description: 'Spinach, kale, etc.', parentCategoryId: categoryMap.get('Vegetables'), isActive: true },
      { name: 'Root Vegetables', description: 'Carrots, potatoes, etc.', parentCategoryId: categoryMap.get('Vegetables'), isActive: true },
      { name: 'Cruciferous', description: 'Broccoli, cauliflower, etc.', parentCategoryId: categoryMap.get('Vegetables'), isActive: true },
      { name: 'Gourds', description: 'Pumpkins, squash, etc.', parentCategoryId: categoryMap.get('Vegetables'), isActive: true },
      { name: 'Alliums', description: 'Onions, garlic, etc.', parentCategoryId: categoryMap.get('Vegetables'), isActive: true },
      { name: 'Milk', description: 'Fresh milk', parentCategoryId: categoryMap.get('Dairy'), isActive: true },
      { name: 'Cheese', description: 'Various cheeses', parentCategoryId: categoryMap.get('Dairy'), isActive: true },
      { name: 'Yogurt', description: 'Traditional and flavored yogurts', parentCategoryId: categoryMap.get('Dairy'), isActive: true },
      { name: 'Butter', description: 'Butter and ghee', parentCategoryId: categoryMap.get('Dairy'), isActive: true },
      { name: 'Olive Oil', description: 'Extra virgin and regular olive oils', parentCategoryId: categoryMap.get('Oils'), isActive: true },
      { name: 'Coconut Oil', description: 'Cold pressed coconut oils', parentCategoryId: categoryMap.get('Oils'), isActive: true },
      { name: 'Groundnut Oil', description: 'Peanut/groundnut oils', parentCategoryId: categoryMap.get('Oils'), isActive: true },
      { name: 'Sesame Oil', description: 'Traditional sesame oils', parentCategoryId: categoryMap.get('Oils'), isActive: true },
      { name: 'Rice', description: 'Various types of rice', parentCategoryId: categoryMap.get('Grains'), isActive: true },
      { name: 'Wheat', description: 'Wheat products', parentCategoryId: categoryMap.get('Grains'), isActive: true },
      { name: 'Oats', description: 'Oats and oatmeal', parentCategoryId: categoryMap.get('Grains'), isActive: true },
      { name: 'Millets', description: 'Various millet grains', parentCategoryId: categoryMap.get('Grains'), isActive: true },
      { name: 'Chili Powders', description: 'Various chili powders', parentCategoryId: categoryMap.get('Spices'), isActive: true },
      { name: 'Whole Spices', description: 'Whole spices like cardamom, cloves', parentCategoryId: categoryMap.get('Spices'), isActive: true },
      { name: 'Spice Blends', description: 'Pre-mixed spice blends', parentCategoryId: categoryMap.get('Spices'), isActive: true },
      { name: 'Turmeric', description: 'Ground turmeric powder', parentCategoryId: categoryMap.get('Spices'), isActive: true }
    ];

    for (const subcategory of subcategories) {
      if (subcategory.parentCategoryId) {
        await db.insert(grocerySubCategories).values(subcategory);
      } else {
        console.warn(`Skipping subcategory ${subcategory.name} - parent category not found`);
      }
    }

    console.log(`${subcategories.length} subcategories loaded successfully`);
  }

  /**
   * Load dummy products
   */
  private async loadDummyProducts(): Promise<void> {
    const existingProducts = await db.select().from(groceryProducts);
    if (existingProducts.length > 0) {
      console.log('Products already exist, skipping product creation');
      return;
    }

    const subcategories = await db.select().from(grocerySubCategories);
    const subcategoryMap = new Map(subcategories.map(sc => [sc.name, { id: sc.id, categoryId: sc.parentCategoryId }]));

    let provider = await db.select().from(serviceProviders).limit(1);
    let providerId = provider[0]?.id;

 if (!providerId) {
  console.warn("No provider found. Creating dummy provider...");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, "dummy_provider"))
    .limit(1);

  let userId: number;

  if (existingUser.length > 0) {
    console.log("Dummy provider user already exists");
    userId = existingUser[0].id;
  } else {
    const hashedPassword = await bcrypt.hash("dummy@123", 10);

    const [user] = await db
      .insert(users)
      .values({
        username: "dummy_provider",
        fullName: "Dummy Provider",
        email: "dummy@provider.com",
        phone: "9999999999",
        password: hashedPassword,
        userType: "provider",
        createdAt: new Date(),
      })
      .returning({ id: users.id });

    userId = user.id;
  }

  const existingProvider = await db
    .select()
    .from(serviceProviders)
    .where(eq(serviceProviders.userId, userId))
    .limit(1);

  if (existingProvider.length > 0) {
    console.log("Dummy service provider already exists");
    providerId = existingProvider[0].id;
  } else {
    const [newProvider] = await db
  .insert(serviceProviders)
  .values({
    userId,
    name: "Farmer",
    providerType: "farmer",
    district: "Chennai",
    taluk: "Guindy",
    pincode: "600032", // ✅ Add a valid dummy pincode
    address: "Somewhere in Tamil Nadu",
    phone: "9999999999",
    email: "dummy@provider.com",
    status: "active",
  })
  .returning({ id: serviceProviders.id });

  providerId = newProvider.id;
  }
}

    const products = [
      { name: 'Red Delicious Apples', description: 'Sweet and crunchy red apples', price: 120, discountedPrice: 110, stock: 50, unit: 'kg', isOrganic: true, district: 'Chennai', categoryId: subcategoryMap.get('Apples')?.categoryId, subcategoryId: subcategoryMap.get('Apples')?.id, status: 'active' },
      { name: 'Green Granny Smith Apples', description: 'Tart green apples perfect for cooking', price: 140, stock: 35, unit: 'kg', isOrganic: false, district: 'Coimbatore', categoryId: subcategoryMap.get('Apples')?.categoryId, subcategoryId: subcategoryMap.get('Apples')?.id, status: 'active' },
      { name: 'Organic Bananas', description: 'Locally grown organic bananas', price: 60, stock: 100, unit: 'dozen', isOrganic: true, district: 'Madurai', categoryId: subcategoryMap.get('Bananas')?.categoryId, subcategoryId: subcategoryMap.get('Bananas')?.id, status: 'active' },
      { name: 'Fresh Spinach Bundle', description: 'Organically grown spinach leaves', price: 40, discountedPrice: 35, stock: 30, unit: 'bundle', isOrganic: true, district: 'Trichy', categoryId: subcategoryMap.get('Leafy Greens')?.categoryId, subcategoryId: subcategoryMap.get('Leafy Greens')?.id, status: 'active' },
      { name: 'Organic Carrots', description: 'Fresh orange carrots', price: 50, stock: 45, unit: 'kg', isOrganic: true, district: 'Salem', categoryId: subcategoryMap.get('Root Vegetables')?.categoryId, subcategoryId: subcategoryMap.get('Root Vegetables')?.id, status: 'active' },
      { name: 'Potatoes', description: 'Fresh potatoes', price: 30, stock: 100, unit: 'kg', isOrganic: false, district: 'Coimbatore', categoryId: subcategoryMap.get('Root Vegetables')?.categoryId, subcategoryId: subcategoryMap.get('Root Vegetables')?.id, status: 'active' },
      { name: 'Extra Virgin Olive Oil', description: 'Premium quality olive oil', price: 450, discountedPrice: 430, stock: 20, unit: 'liter', isOrganic: true, district: 'Chennai', categoryId: subcategoryMap.get('Olive Oil')?.categoryId, subcategoryId: subcategoryMap.get('Olive Oil')?.id, status: 'active' },
      { name: 'Cold Pressed Coconut Oil', description: 'Traditional cold pressed coconut oil', price: 280, stock: 25, unit: 'liter', isOrganic: true, district: 'Kanyakumari', categoryId: subcategoryMap.get('Coconut Oil')?.categoryId, subcategoryId: subcategoryMap.get('Coconut Oil')?.id, status: 'active' },
      { name: 'Organic Brown Rice', description: 'Nutritious brown rice', price: 95, stock: 50, unit: 'kg', isOrganic: true, district: 'Thanjavur', categoryId: subcategoryMap.get('Rice')?.categoryId, subcategoryId: subcategoryMap.get('Rice')?.id, status: 'active' },
      { name: 'Basmati Rice', description: 'Aromatic basmati rice', price: 120, discountedPrice: 110, stock: 40, unit: 'kg', isOrganic: false, district: 'Thanjavur', categoryId: subcategoryMap.get('Rice')?.categoryId, subcategoryId: subcategoryMap.get('Rice')?.id, status: 'active' },
      { name: 'Organic Turmeric Powder', description: 'High quality turmeric powder', price: 85, stock: 30, unit: '100g', isOrganic: true, district: 'Erode', categoryId: subcategoryMap.get('Turmeric')?.categoryId, subcategoryId: subcategoryMap.get('Turmeric')?.id, status: 'active' }
    ];

    let insertedCount = 0;

    for (const product of products) {
      if (product.categoryId && product.subcategoryId) {
        await db.insert(groceryProducts).values({
          ...product,
          providerId
        });
        insertedCount++;
      } else {
        console.warn(`Skipping product ${product.name} - category or subcategory not found`);
      }
    }

    console.log(`${insertedCount} products loaded successfully`);
  }
}

export const dummyDataService = new DummyDataService();