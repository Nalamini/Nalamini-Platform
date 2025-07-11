import * as path from 'path';
import * as fs from 'fs';

// Base directory for file uploads
export const uploadsDir = path.join(process.cwd(), 'uploads');

// Create the uploads directory if it doesn't exist
fs.mkdirSync(uploadsDir, { recursive: true });

// Category-specific upload directories
export const categoryImagesDir = path.join(uploadsDir, 'grocery-categories');
export const subcategoryImagesDir = path.join(uploadsDir, 'grocery-subcategories');

// Create category-specific directories
fs.mkdirSync(categoryImagesDir, { recursive: true });
fs.mkdirSync(subcategoryImagesDir, { recursive: true });

// Sample fallback images for various categories
export const fallbackImages = {
  // Default fallback image for any missing image
  default: '/uploads/fallback/default.svg',
  
  // Category-specific fallbacks
  category: {
    fruits: '/uploads/fallback/fruits.svg',
    vegetables: '/uploads/fallback/vegetables.svg',
    oils: '/uploads/fallback/oils.svg',
    grains: '/uploads/fallback/grains.svg',
    organic: '/uploads/fallback/organic.svg'
  },
  
  // Subcategory-specific fallbacks
  subcategory: {
    'coconut oil': '/uploads/fallback/coconut-oil.svg',
    'groundnut oil': '/uploads/fallback/groundnut-oil.svg', 
    'olive oil': '/uploads/fallback/olive-oil.svg',
    'palm oil': '/uploads/fallback/palm-oil.svg'
  }
};

// Create default fallback images directory
const fallbackDir = path.join(uploadsDir, 'fallback');
fs.mkdirSync(fallbackDir, { recursive: true });

/**
 * Check if an image file exists at the specified path
 */
export function imageExists(imagePath: string): boolean {
  // If path doesn't start with /uploads, prepend it
  if (!imagePath.startsWith('/uploads')) {
    imagePath = path.join(uploadsDir, imagePath);
  } else {
    // Remove the /uploads prefix to get the actual file path
    imagePath = path.join(process.cwd(), imagePath);
  }
  
  try {
    return fs.existsSync(imagePath);
  } catch (error) {
    console.error(`Error checking if image exists at ${imagePath}:`, error);
    return false;
  }
}

/**
 * Get the appropriate image URL with fallback
 */
export function getImageUrlWithFallback(
  imageUrl: string | null | undefined, 
  type: 'category' | 'subcategory',
  name: string
): string {
  // If imageUrl is null/undefined or empty, use fallback
  if (!imageUrl) {
    // Try to find a specific fallback for this name
    const nameLower = name.toLowerCase();
    
    // Special case for oil subcategories - use API endpoint for SVG for better reliability
    if (type === 'subcategory' && (
      nameLower === 'coconut oil' || 
      nameLower === 'groundnut oil' || 
      nameLower === 'olive oil' || 
      nameLower === 'palm oil'
    )) {
      // Convert spaces to hyphens for the API endpoint
      const formattedName = nameLower.replace(/\s+/g, '-');
      return `/api/svg/fallback/${formattedName}`;
    }
    
    // Try the static file approach for other categories
    const specificFallback = fallbackImages[type][nameLower];
    
    if (specificFallback) {
      return specificFallback;
    }
    
    // If no specific fallback, use default
    return fallbackImages.default;
  }
  
  // Check if the image actually exists
  if (imageExists(imageUrl)) {
    return imageUrl;
  }
  
  // Image doesn't exist, use fallback
  const nameLower = name.toLowerCase();
  
  // Special case for oil subcategories - use API endpoint for SVG for better reliability
  if (type === 'subcategory' && (
    nameLower === 'coconut oil' || 
    nameLower === 'groundnut oil' || 
    nameLower === 'olive oil' || 
    nameLower === 'palm oil'
  )) {
    // Convert spaces to hyphens for the API endpoint
    const formattedName = nameLower.replace(/\s+/g, '-');
    return `/api/svg/fallback/${formattedName}`;
  }
  
  // Try the static file approach for other categories
  const specificFallback = fallbackImages[type][nameLower];
  
  if (specificFallback) {
    return specificFallback;
  }
  
  // If no specific fallback, use default
  return fallbackImages.default;
}

/**
 * Update image if needed and return the URL
 */
export function updateImageIfNeeded(
  currentImageUrl: string | null | undefined, 
  newImagePath: string | null,
  type: 'category' | 'subcategory',
  id: number
): string {
  // If no new image, keep the current one
  if (!newImagePath) {
    return currentImageUrl || '';
  }
  
  // Delete the old image if it exists
  if (currentImageUrl && imageExists(currentImageUrl)) {
    try {
      fs.unlinkSync(path.join(process.cwd(), currentImageUrl));
    } catch (error) {
      console.error(`Error deleting old image at ${currentImageUrl}:`, error);
      // Continue with the update even if delete fails
    }
  }
  
  // Return the new image URL
  return newImagePath;
}

/**
 * Generate fallback images for common categories and subcategories
 * This creates solid colored SVG images as fallbacks
 */
export function generateFallbackImages(): void {
  const createFallbackSvg = (filename: string, color: string) => {
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${filename.split('.')[0].replace(/-/g, ' ')}
      </text>
    </svg>`;
    
    fs.writeFileSync(path.join(fallbackDir, filename), svg);
  };
  
  // Default fallback
  createFallbackSvg('default.svg', '#888888');
  
  // Category fallbacks
  createFallbackSvg('fruits.svg', '#ff7f50');
  createFallbackSvg('vegetables.svg', '#32cd32');
  createFallbackSvg('oils.svg', '#ffd700');
  createFallbackSvg('grains.svg', '#deb887');
  createFallbackSvg('organic.svg', '#228b22');
  
  // Subcategory fallbacks
  createFallbackSvg('coconut-oil.svg', '#f5deb3');
  createFallbackSvg('groundnut-oil.svg', '#d2b48c');
  createFallbackSvg('olive-oil.svg', '#556b2f');
  createFallbackSvg('palm-oil.svg', '#8b4513');
  
  console.log('Generated fallback images successfully');
}

// Initialize fallback images
try {
  generateFallbackImages();
} catch (error) {
  console.error('Error generating fallback images:', error);
}