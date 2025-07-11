import { z } from "zod";

// Environment variables for Hotel API
const HOTEL_API_BASE_URL = process.env.HOTEL_API_BASE_URL || "https://api.amadeus.com";
const HOTEL_API_KEY = process.env.HOTEL_API_KEY;
const HOTEL_API_SECRET = process.env.HOTEL_API_SECRET;

// Validation schemas
const HotelSearchSchema = z.object({
  cityCode: z.string().length(3), // IATA city code
  checkInDate: z.string(), // YYYY-MM-DD format
  checkOutDate: z.string(), // YYYY-MM-DD format
  roomQuantity: z.number().min(1).max(9).default(1),
  adults: z.number().min(1).max(9).default(2),
  children: z.number().min(0).max(8).default(0),
  currency: z.string().default("INR"),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional(),
  amenities: z.array(z.string()).optional(),
  ratings: z.array(z.number()).optional(),
  hotelSource: z.string().default("ALL")
});

const BookHotelSchema = z.object({
  hotelId: z.string(),
  offerId: z.string(),
  guests: z.array(z.object({
    title: z.enum(["MR", "MRS", "MS"]),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    dateOfBirth: z.string().optional()
  })),
  payments: z.array(z.object({
    method: z.enum(["CREDIT_CARD", "AGENCY_ACCOUNT"]),
    card: z.object({
      vendorCode: z.string(),
      cardNumber: z.string(),
      expiryDate: z.string(),
      holderName: z.string()
    }).optional()
  })),
  rooms: z.array(z.object({
    guestIds: z.array(z.number()),
    specialRequest: z.string().optional()
  }))
});

// Hotel API request helper
async function makeHotelApiRequest(endpoint: string, data?: any, method: string = 'POST') {
  try {
    if (!HOTEL_API_KEY || !HOTEL_API_SECRET) {
      throw new Error('Hotel API credentials not configured. Please contact support to set up hotel booking integration.');
    }

    // Get access token first
    const tokenResponse = await fetch(`${HOTEL_API_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: HOTEL_API_KEY,
        client_secret: HOTEL_API_SECRET
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Make API request
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${HOTEL_API_BASE_URL}${endpoint}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Hotel API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Hotel API error:', error);
    throw error;
  }
}

export class HotelService {
  // Search for available hotels
  static async searchHotels(searchParams: z.infer<typeof HotelSearchSchema>) {
    const validatedParams = HotelSearchSchema.parse(searchParams);
    
    // Check if API credentials are configured
    if (!HOTEL_API_KEY || !HOTEL_API_SECRET) {
      throw new Error('Hotel booking API credentials not configured. Please contact support to set up hotel integration.');
    }
    
    // First get hotel list for the city
    const hotelListEndpoint = `/v1/reference-data/locations/hotels/by-city?cityCode=${validatedParams.cityCode}`;
    const hotelListResponse = await makeHotelApiRequest(hotelListEndpoint, null, 'GET');
    
    const hotelIds = hotelListResponse.data.slice(0, 20).map((hotel: any) => hotel.hotelId);
    
    // Then search for offers
    const searchEndpoint = '/v3/shopping/hotel-offers';
    const payload = {
      hotelIds: hotelIds.join(','),
      checkInDate: validatedParams.checkInDate,
      checkOutDate: validatedParams.checkOutDate,
      roomQuantity: validatedParams.roomQuantity,
      adults: validatedParams.adults,
      children: validatedParams.children,
      currency: validatedParams.currency
    };

    const response = await makeHotelApiRequest(searchEndpoint, payload, 'GET');
    
    return {
      searchId: Date.now(),
      hotels: response.data || [],
      searchParams: validatedParams
    };
  }

  // Get hotel details
  static async getHotelDetails(hotelId: string) {
    const endpoint = `/v1/reference-data/locations/hotels/${hotelId}`;
    const response = await makeHotelApiRequest(endpoint, null, 'GET');
    
    return response.data;
  }

  // Book selected hotel
  static async bookHotel(params: z.infer<typeof BookHotelSchema>) {
    const validatedParams = BookHotelSchema.parse(params);
    
    const response = await makeHotelApiRequest('/v1/booking/hotel-bookings', {
      data: {
        offerId: validatedParams.offerId,
        guests: validatedParams.guests,
        payments: validatedParams.payments,
        rooms: validatedParams.rooms
      }
    });
    
    return {
      bookingReference: response.data[0].associatedRecords[0].reference,
      confirmationNumber: response.data[0].id,
      status: response.data[0].bookingStatus,
      totalPrice: response.data[0].hotelOffer.price.total
    };
  }

  // Get popular Indian cities
  static getPopularCities() {
    return [
      { code: "MAA", name: "Chennai", state: "Tamil Nadu" },
      { code: "BLR", name: "Bangalore", state: "Karnataka" },
      { code: "BOM", name: "Mumbai", state: "Maharashtra" },
      { code: "DEL", name: "New Delhi", state: "Delhi" },
      { code: "HYD", name: "Hyderabad", state: "Telangana" },
      { code: "CCU", name: "Kolkata", state: "West Bengal" },
      { code: "COK", name: "Kochi", state: "Kerala" },
      { code: "GOI", name: "Goa", state: "Goa" },
      { code: "PNQ", name: "Pune", state: "Maharashtra" },
      { code: "JAI", name: "Jaipur", state: "Rajasthan" },
      { code: "AMD", name: "Ahmedabad", state: "Gujarat" },
      { code: "TRV", name: "Thiruvananthapuram", state: "Kerala" }
    ];
  }

  // Calculate commission distribution for hotel booking
  static calculateCommissionDistribution(totalCommission: number) {
    const commissionStructure = {
      admin: { percent: 1, amount: 0 },
      branch_manager: { percent: 1.5, amount: 0 },
      taluk_manager: { percent: 1.5, amount: 0 },
      service_agent: { percent: 2, amount: 0 }
    };

    // Calculate amounts
    commissionStructure.admin.amount = (totalCommission * commissionStructure.admin.percent) / 100;
    commissionStructure.branch_manager.amount = (totalCommission * commissionStructure.branch_manager.percent) / 100;
    commissionStructure.taluk_manager.amount = (totalCommission * commissionStructure.taluk_manager.percent) / 100;
    commissionStructure.service_agent.amount = (totalCommission * commissionStructure.service_agent.percent) / 100;

    return commissionStructure;
  }

  // Format hotel results for display
  static formatHotelResults(hotels: any[]) {
    return hotels.map(hotel => ({
      id: hotel.hotel.hotelId,
      name: hotel.hotel.name,
      rating: hotel.hotel.rating,
      address: hotel.hotel.address,
      amenities: hotel.hotel.amenities || [],
      images: hotel.hotel.media || [],
      offers: hotel.offers.map((offer: any) => ({
        id: offer.id,
        checkInDate: offer.checkInDate,
        checkOutDate: offer.checkOutDate,
        roomQuantity: offer.roomQuantity,
        rateCode: offer.rateCode,
        room: {
          type: offer.room.type,
          typeEstimated: offer.room.typeEstimated,
          description: offer.room.description
        },
        guests: offer.guests,
        price: {
          currency: offer.price.currency,
          base: offer.price.base,
          total: offer.price.total,
          taxes: offer.price.taxes,
          markups: offer.price.markups
        },
        policies: offer.policies,
        self: offer.self
      })),
      available: hotel.available,
      self: hotel.self
    }));
  }
}

export type {
  HotelSearchSchema,
  BookHotelSchema
};