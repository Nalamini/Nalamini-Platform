import { db } from "./db";
import { localProductBase, localProductDetails } from "@shared/schema";

export async function seedLocalProducts() {
  console.log("Starting to seed local products...");
  
  try {
    // Sample local products for manufacturers
    const sampleProducts = [
      {
        // Textiles
        name: "Handwoven Cotton Saree",
        category: "Textiles",
        subcategory: "Sarees",
        description: "Traditional handwoven cotton saree from Tamil Nadu artisans",
        price: 2500,
        stock: 50,
        district: "Kanchipuram",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
        deliveryOption: "both",
        availableAreas: "Chennai, Kanchipuram, Vellore",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Material": "100% Cotton", "Length": "6 meters", "Weight": "400g" }
      },
      {
        name: "Silk Dhoti",
        category: "Textiles", 
        subcategory: "Traditional Wear",
        description: "Premium silk dhoti for special occasions",
        price: 1800,
        stock: 30,
        district: "Thanjavur",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
        deliveryOption: "both",
        availableAreas: "Thanjavur, Trichy, Madurai",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Material": "Pure Silk", "Size": "Standard", "Color": "Cream" }
      },
      {
        // Handicrafts
        name: "Bronze Nataraja Statue",
        category: "Handicrafts",
        subcategory: "Metal Work",
        description: "Handcrafted bronze Nataraja statue by skilled artisans",
        price: 3500,
        stock: 15,
        district: "Thanjavur",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        deliveryOption: "both",
        availableAreas: "All Tamil Nadu",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Material": "Bronze", "Height": "12 inches", "Weight": "2kg" }
      },
      {
        name: "Tanjore Painting",
        category: "Handicrafts",
        subcategory: "Paintings",
        description: "Traditional Tanjore painting with gold foil work",
        price: 5000,
        stock: 8,
        district: "Thanjavur",
        imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400",
        deliveryOption: "both",
        availableAreas: "Chennai, Thanjavur, Madurai",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Size": "16x12 inches", "Frame": "Teak Wood", "Style": "Traditional" }
      },
      {
        // Food Products
        name: "Organic Jaggery",
        category: "Food Products",
        subcategory: "Sweeteners",
        description: "Pure organic jaggery made from sugarcane",
        price: 120,
        stock: 100,
        district: "Erode",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f73b2f22?w=400",
        deliveryOption: "both",
        availableAreas: "All Tamil Nadu",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Weight": "1kg", "Type": "Organic", "Source": "Sugarcane" }
      },
      {
        name: "Banana Chips",
        category: "Food Products",
        subcategory: "Snacks",
        description: "Crispy banana chips made from fresh bananas",
        price: 180,
        stock: 75,
        district: "Coimbatore",
        imageUrl: "https://images.unsplash.com/photo-1621367128-c68f30acb5a0?w=400",
        deliveryOption: "both",
        availableAreas: "Coimbatore, Chennai, Salem",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Weight": "500g", "Type": "Salted", "Shelf Life": "6 months" }
      },
      {
        // Spices
        name: "Sambar Powder",
        category: "Spices",
        subcategory: "Spice Mixes",
        description: "Traditional sambar powder blend",
        price: 150,
        stock: 60,
        district: "Madurai",
        imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
        deliveryOption: "both",
        availableAreas: "All Tamil Nadu",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Weight": "250g", "Spice Level": "Medium", "Ingredients": "All Natural" }
      },
      {
        name: "Turmeric Powder",
        category: "Spices",
        subcategory: "Single Spices",
        description: "Pure turmeric powder from Erode farms",
        price: 80,
        stock: 120,
        district: "Erode",
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400",
        deliveryOption: "both",
        availableAreas: "All Tamil Nadu",
        status: "active",
        adminApproved: true,
        isDraft: false,
        specifications: { "Weight": "200g", "Purity": "100%", "Color": "Golden Yellow" }
      }
    ];

    for (const product of sampleProducts) {
      // Create base product
      const [baseProduct] = await db.insert(localProductBase).values({
        name: product.name,
        category: product.category,
        manufacturerId: 1, // Admin user as manufacturer for demo
        adminApproved: product.adminApproved,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Create product details
      await db.insert(localProductDetails).values({
        baseProductId: baseProduct.id,
        description: product.description,
        subcategory: product.subcategory,
        specifications: product.specifications,
        price: product.price,
        discountedPrice: null,
        stock: product.stock,
        district: product.district,
        imageUrl: product.imageUrl,
        deliveryOption: product.deliveryOption,
        availableAreas: product.availableAreas,
        status: product.status,
        isDraft: product.isDraft,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log(`Successfully seeded ${sampleProducts.length} local products`);
  } catch (error) {
    console.error("Error seeding local products:", error);
  }
}