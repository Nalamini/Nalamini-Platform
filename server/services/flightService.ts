import { z } from "zod";

// Environment variables for Flight API
const FLIGHT_API_BASE_URL = process.env.FLIGHT_API_BASE_URL || "https://api.amadeus.com";
const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;
const FLIGHT_API_SECRET = process.env.FLIGHT_API_SECRET;

// Validation schemas
const FlightSearchSchema = z.object({
  origin: z.string().length(3), // IATA airport code
  destination: z.string().length(3),
  departureDate: z.string(), // YYYY-MM-DD format
  returnDate: z.string().optional(),
  adults: z.number().min(1).max(9).default(1),
  children: z.number().min(0).max(8).default(0),
  infants: z.number().min(0).max(8).default(0),
  travelClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).default("ECONOMY"),
  nonStop: z.boolean().default(false)
});

const BookFlightSchema = z.object({
  flightOfferId: z.string(),
  passengers: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
    email: z.string().email(),
    phone: z.string(),
    passportNumber: z.string().optional(),
    passportExpiry: z.string().optional(),
    nationality: z.string().optional()
  })),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string(),
    address: z.object({
      lines: z.array(z.string()),
      postalCode: z.string(),
      cityName: z.string(),
      countryCode: z.string()
    })
  })
});

// Flight API request helper
async function makeFlightApiRequest(endpoint: string, data: any) {
  try {
    if (!FLIGHT_API_KEY || !FLIGHT_API_SECRET) {
      throw new Error('Flight API credentials not configured. Please contact support to set up flight booking integration.');
    }

    // Get access token first
    const tokenResponse = await fetch(`${FLIGHT_API_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: FLIGHT_API_KEY,
        client_secret: FLIGHT_API_SECRET
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Make API request
    const response = await fetch(`${FLIGHT_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Flight API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Flight API error:', error);
    throw error;
  }
}

export class FlightService {
  // Search for available flights
  static async searchFlights(searchParams: z.infer<typeof FlightSearchSchema>) {
    const validatedParams = FlightSearchSchema.parse(searchParams);
    
    // Check if API credentials are configured
    if (!FLIGHT_API_KEY || !FLIGHT_API_SECRET) {
      throw new Error('Flight booking API credentials not configured. Please contact support to set up flight integration.');
    }
    
    const payload = {
      currencyCode: "INR",
      originDestinations: [
        {
          id: "1",
          originLocationCode: validatedParams.origin,
          destinationLocationCode: validatedParams.destination,
          departureDateTimeRange: {
            date: validatedParams.departureDate
          }
        }
      ],
      travelers: [
        ...Array(validatedParams.adults).fill(null).map((_, i) => ({
          id: `${i + 1}`,
          travelerType: "ADULT"
        })),
        ...Array(validatedParams.children).fill(null).map((_, i) => ({
          id: `${validatedParams.adults + i + 1}`,
          travelerType: "CHILD"
        })),
        ...Array(validatedParams.infants).fill(null).map((_, i) => ({
          id: `${validatedParams.adults + validatedParams.children + i + 1}`,
          travelerType: "INFANT"
        }))
      ],
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers: 50,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: validatedParams.travelClass,
              coverage: "MOST_SEGMENTS",
              originDestinationIds: ["1"]
            }
          ]
        }
      }
    };

    // Add return flight for round trip
    if (validatedParams.returnDate) {
      payload.originDestinations.push({
        id: "2",
        originLocationCode: validatedParams.destination,
        destinationLocationCode: validatedParams.origin,
        departureDateTimeRange: {
          date: validatedParams.returnDate
        }
      });
    }

    const response = await makeFlightApiRequest('/v2/shopping/flight-offers', payload);
    
    return {
      searchId: Date.now(),
      flights: response.data || [],
      searchParams: validatedParams
    };
  }

  // Book selected flight
  static async bookFlight(params: z.infer<typeof BookFlightSchema>) {
    const validatedParams = BookFlightSchema.parse(params);
    
    const response = await makeFlightApiRequest('/v1/booking/flight-orders', {
      data: {
        type: "flight-order",
        flightOffers: [validatedParams.flightOfferId],
        travelers: validatedParams.passengers,
        remarks: {
          general: [
            {
              subType: "GENERAL_MISCELLANEOUS",
              text: "ONLINE BOOKING DEF"
            }
          ]
        },
        ticketingAgreement: {
          option: "DELAY_TO_QUEUE",
          delay: "6D"
        },
        contacts: [
          {
            addresseeName: {
              firstName: validatedParams.passengers[0].firstName,
              lastName: validatedParams.passengers[0].lastName
            },
            companyName: "NALAMINI SERVICES",
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "91",
                number: validatedParams.contactInfo.phone
              }
            ],
            emailAddress: validatedParams.contactInfo.email,
            address: validatedParams.contactInfo.address
          }
        ]
      }
    });
    
    return {
      bookingReference: response.data.associatedRecords[0].reference,
      pnr: response.data.associatedRecords[0].reference,
      status: response.data.flightOffers[0].source,
      totalPrice: response.data.flightOffers[0].price.total
    };
  }

  // Get popular Indian airports
  static getPopularAirports() {
    return [
      { code: "MAA", city: "Chennai", name: "Chennai International Airport" },
      { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport" },
      { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji International Airport" },
      { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport" },
      { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport" },
      { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport" },
      { code: "COK", city: "Kochi", name: "Cochin International Airport" },
      { code: "CJB", city: "Coimbatore", name: "Coimbatore International Airport" },
      { code: "TRZ", city: "Trichy", name: "Tiruchirappalli International Airport" },
      { code: "MDU", city: "Madurai", name: "Madurai Airport" }
    ];
  }

  // Calculate commission distribution for flight booking
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

  // Format flight results for display
  static formatFlightResults(flights: any[]) {
    return flights.map(flight => ({
      id: flight.id,
      airline: flight.validatingAirlineCodes[0],
      flightNumber: flight.itineraries[0].segments[0].carrierCode + flight.itineraries[0].segments[0].number,
      departure: {
        airport: flight.itineraries[0].segments[0].departure.iataCode,
        time: flight.itineraries[0].segments[0].departure.at,
        terminal: flight.itineraries[0].segments[0].departure.terminal
      },
      arrival: {
        airport: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode,
        time: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at,
        terminal: flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.terminal
      },
      duration: flight.itineraries[0].duration,
      stops: flight.itineraries[0].segments.length - 1,
      price: {
        total: flight.price.total,
        base: flight.price.base,
        currency: flight.price.currency
      },
      travelerPricings: flight.travelerPricings,
      lastTicketingDate: flight.lastTicketingDate,
      numberOfBookableSeats: flight.numberOfBookableSeats
    }));
  }
}

export type {
  FlightSearchSchema,
  BookFlightSchema
};