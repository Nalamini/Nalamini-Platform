import { z } from "zod";

// Travelomatix API configuration
const BUS_API_BASE_URL = "http://test.services.travelomatix.com/webservices/index.php/bus_v3/service";
const BUS_USERNAME = "test305528";
const BUS_DOMAIN_KEY = "TMX2663051694580020";
const BUS_PASSWORD = "test@305";
const BUS_SYSTEM = "test";

// Validation schemas
const BusSearchSchema = z.object({
  source_city: z.string(),
  source_code: z.string(),
  destination_city: z.string(),
  destination_code: z.string(),
  depart_date: z.string() // YYYY-MM-DD format
});

const SeatLayoutSchema = z.object({
  TraceId: z.number(),
  ResultIndex: z.number()
});

const BoardingPointsSchema = z.object({
  TraceId: z.number(),
  ResultIndex: z.number()
});

const BlockSeatSchema = z.object({
  TraceId: z.number(),
  ResultIndex: z.number(),
  Seats: z.array(z.object({
    SeatIndex: z.string(),
    SeatType: z.number()
  })),
  BoardingPointId: z.number(),
  DroppingPointId: z.number()
});

const BookTicketSchema = z.object({
  TraceId: z.number(),
  ResultIndex: z.number(),
  Passengers: z.array(z.object({
    Name: z.string(),
    Age: z.number(),
    Gender: z.enum(["Male", "Female"]),
    SeatIndex: z.string(),
    SeatType: z.number()
  })),
  BoardingPointId: z.number(),
  DroppingPointId: z.number()
});

const CancelTicketSchema = z.object({
  TraceId: z.number(),
  ResultIndex: z.number(),
  SeatIndex: z.array(z.string())
});

// Travelomatix API request helper
async function makeTravelomatixRequest(endpoint: string, payload: any = {}) {
  try {
    console.log(`Making Travelomatix request to: ${BUS_API_BASE_URL}/${endpoint}`);
    console.log('Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${BUS_API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'x-Username': BUS_USERNAME,
        'x-DomainKey': BUS_DOMAIN_KEY,
        'x-Password': BUS_PASSWORD,
        'x-system': BUS_SYSTEM,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Travelomatix API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Travelomatix response:', JSON.stringify(data, null, 2));

    // Check for API errors in response
    if (data.error || (data.status && data.status !== 'success')) {
      throw new Error(`Travelomatix API error: ${data.message || data.error || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('Travelomatix API request failed:', error);
    throw error;
  }
}

export class BusService {
  // Search for available buses using Travelomatix API
  static async searchBuses(searchParams: z.infer<typeof BusSearchSchema>) {
    const validatedParams = BusSearchSchema.parse(searchParams);
    
    const payload = {
      OriginId: validatedParams.source_code,
      DestinationId: validatedParams.destination_code,
      JourneyDate: validatedParams.depart_date
    };
    
    try {
      console.log('Attempting Travelomatix bus search with payload:', payload);
      const response = await makeTravelomatixRequest('Search', payload);
      
      // Check if Travelomatix returned "No Bus Found"
      if (response.Status === 0 && response.Message === "No Bus Found!!") {
        console.log('No buses found from Travelomatix API - this is normal for test environment');
        throw new Error('No buses found');
      }
      
      // Parse Travelomatix response format
      const buses = response.BusResults || response.busResults || response.data || response.result || [];
      console.log('Bus search completed, found buses:', buses.length);
      
      return {
        traceId: response.TraceId || response.traceId || Date.now(),
        buses: this.formatTravelomatixBuses(buses),
        searchParams: validatedParams
      };
    } catch (error: any) {
      console.error('Travelomatix bus search error:', error.message);
      
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('Bus API authentication failed. Please contact support.');
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        throw new Error('No buses found for this route on selected date.');
      } else {
        throw new Error('Bus search service temporarily unavailable. Please try again later.');
      }
    }
  }

  // Get seat layout for a specific bus using Travelomatix API
  static async getSeatLayout(params: z.infer<typeof SeatLayoutSchema>) {
    const validatedParams = SeatLayoutSchema.parse(params);
    
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex
    };
    
    const response = await makeTravelomatixRequest('GetSeatLayout', payload);
    
    return {
      traceId: response.traceId || validatedParams.TraceId,
      availableSeats: response.availableSeats || 0,
      seatLayout: response.seatLayout || response.result || [],
      upperSeatLayout: response.upperSeatLayout || []
    };
  }

  // Get boarding and dropping points using Travelomatix API
  static async getBoardingPoints(params: z.infer<typeof BoardingPointsSchema>) {
    const validatedParams = BoardingPointsSchema.parse(params);
    
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex
    };
    
    const response = await makeTravelomatixRequest('GetBoardingPoints', payload);
    
    return {
      traceId: response.traceId || validatedParams.TraceId,
      boardingPoints: response.boardingPoints || response.result?.boardingPoints || [],
      droppingPoints: response.droppingPoints || response.result?.droppingPoints || []
    };
  }

  // Block seats temporarily using Travelomatix API
  static async blockSeats(params: z.infer<typeof BlockSeatSchema>) {
    const validatedParams = BlockSeatSchema.parse(params);
    
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex,
      seats: validatedParams.Seats,
      boardingPointId: validatedParams.BoardingPointId,
      droppingPointId: validatedParams.DroppingPointId
    };
    
    const response = await makeTravelomatixRequest('BlockSeat', payload);
    
    return {
      traceId: response.traceId || validatedParams.TraceId,
      isBlocked: response.isBlocked || response.success || false,
      blockId: response.blockId || response.id,
      expiryTime: response.expiryTime || response.expiry
    };
  }

  // Book the ticket using Travelomatix API
  static async bookTicket(params: z.infer<typeof BookTicketSchema>) {
    const validatedParams = BookTicketSchema.parse(params);
    
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex,
      passengers: validatedParams.Passengers,
      boardingPointId: validatedParams.BoardingPointId,
      droppingPointId: validatedParams.DroppingPointId
    };
    
    const response = await makeTravelomatixRequest('BookTicket', payload);
    
    return {
      traceId: response.traceId || validatedParams.TraceId,
      bookingStatus: response.bookingStatus || response.status,
      pnr: response.pnr || response.bookingReference,
      ticketNumber: response.ticketNumber || response.ticketId,
      totalFare: response.totalFare || response.amount,
      bookingId: response.bookingId || response.id
    };
  }

  // Cancel booked ticket using Travelomatix API
  static async cancelTicket(params: z.infer<typeof CancelTicketSchema>) {
    const validatedParams = CancelTicketSchema.parse(params);
    
    const payload = {
      traceId: validatedParams.TraceId,
      resultIndex: validatedParams.ResultIndex,
      seatIndexes: validatedParams.SeatIndex
    };
    
    const response = await makeTravelomatixRequest('CancelTicket', payload);
    
    return {
      traceId: response.traceId || validatedParams.TraceId,
      cancellationStatus: response.cancellationStatus || response.status,
      refundAmount: response.refundAmount || response.refund,
      cancellationCharge: response.cancellationCharge || response.charges
    };
  }

  // Get popular Tamil Nadu routes
  static getPopularTNRoutes() {
    return [
      { source: "Chennai", sourceCode: "1001", destination: "Coimbatore", destinationCode: "2001" },
      { source: "Chennai", sourceCode: "1001", destination: "Madurai", destinationCode: "3001" },
      { source: "Chennai", sourceCode: "1001", destination: "Trichy", destinationCode: "4001" },
      { source: "Coimbatore", sourceCode: "2001", destination: "Bangalore", destinationCode: "5001" },
      { source: "Chennai", sourceCode: "1001", destination: "Salem", destinationCode: "6001" },
      { source: "Chennai", sourceCode: "1001", destination: "Tirunelveli", destinationCode: "7001" },
      { source: "Madurai", sourceCode: "3001", destination: "Coimbatore", destinationCode: "2001" },
      { source: "Chennai", sourceCode: "1001", destination: "Vellore", destinationCode: "8001" },
      { source: "Chennai", sourceCode: "1001", destination: "Thanjavur", destinationCode: "9001" },
      { source: "Coimbatore", sourceCode: "2001", destination: "Kochi", destinationCode: "10001" }
    ];
  }

  // Calculate commission distribution for bus booking
  static calculateCommissionDistribution(totalCommission: number) {
    const commissionStructure = {
      admin: { percent: 1, amount: 0 },
      branch_manager: { percent: 1.5, amount: 0 },
      taluk_manager: { percent: 1.5, amount: 0 },
      service_agent: { percent: 2, amount: 0 }
    };

    // Calculate 6% total commission from booking amount
    const baseAmount = totalCommission / 0.06; // Get base amount from commission
    
    commissionStructure.admin.amount = baseAmount * (commissionStructure.admin.percent / 100);
    commissionStructure.branch_manager.amount = baseAmount * (commissionStructure.branch_manager.percent / 100);
    commissionStructure.taluk_manager.amount = baseAmount * (commissionStructure.taluk_manager.percent / 100);
    commissionStructure.service_agent.amount = baseAmount * (commissionStructure.service_agent.percent / 100);

    return commissionStructure;
  }

  // Format Travelomatix bus search results for frontend
  static formatTravelomatixBuses(buses: any[]) {
    return buses.map(bus => ({
      resultIndex: bus.resultIndex || bus.id,
      busType: bus.busType || bus.type || 'AC Seater',
      serviceName: bus.serviceName || bus.operatorName || 'Bus Service',
      travelName: bus.travelName || bus.operator || bus.travels,
      departureTime: bus.departureTime || bus.departure,
      arrivalTime: bus.arrivalTime || bus.arrival,
      duration: this.calculateDuration(bus.departureTime || bus.departure, bus.arrivalTime || bus.arrival),
      availableSeats: bus.availableSeats || bus.seatsAvailable || 0,
      price: {
        basePrice: bus.fare || bus.price || bus.cost || 0,
        offeredPrice: bus.discountedFare || bus.fare || bus.price || 0,
        agentCommission: bus.commission || 0,
        currencyCode: bus.currency || 'INR'
      },
      boardingPoints: bus.boardingPoints?.length || 0,
      droppingPoints: bus.droppingPoints?.length || 0,
      cancellationPolicies: bus.cancellationPolicies || [],
      features: {
        idProofRequired: bus.idProofRequired || false,
        liveTracking: bus.liveTracking || false,
        mTicket: bus.mTicket || false,
        partialCancellation: bus.partialCancellation || false
      }
    }));
  }

  // Format bus search results for frontend (legacy method)
  static formatBusResults(buses: any[]) {
    return this.formatTravelomatixBuses(buses);
  }

  // Calculate journey duration
  private static calculateDuration(departureTime: string, arrivalTime: string): string {
    if (!departureTime || !arrivalTime) return 'N/A';
    
    try {
      const departure = new Date(departureTime);
      const arrival = new Date(arrivalTime);
      const diffMs = arrival.getTime() - departure.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${diffHours}h ${diffMinutes}m`;
    } catch (error) {
      return 'N/A';
    }
  }

  // Test Travelomatix API connection
  static async testConnection() {
    try {
      console.log('Testing Travelomatix API connection...');
      
      // Test with a simple search request
      const testPayload = {
        originId: "1", // Chennai
        destinationId: "2", // Coimbatore  
        travelDate: new Date().toISOString().split('T')[0] // Today's date
      };
      
      const response = await makeTravelomatixRequest('Search', testPayload);
      
      console.log('Travelomatix connection test successful');
      return { 
        success: true, 
        message: 'Travelomatix API connected successfully',
        data: response
      };
    } catch (error: any) {
      console.error('Travelomatix connection test failed:', error.message);
      return { 
        success: false, 
        message: `Connection failed: ${error.message}`,
        error: error.message
      };
    }
  }

  // Get city list for Travelomatix (if available)
  static async getCityList() {
    try {
      const response = await makeTravelomatixRequest('GetCityList', {});
      return response.cities || response.data || this.getPopularTNRoutes();
    } catch (error) {
      console.error('Failed to fetch city list, using fallback:', error);
      return this.getPopularTNRoutes();
    }
  }
}

export type {
  BusSearchSchema,
  SeatLayoutSchema,
  BoardingPointsSchema,
  BlockSeatSchema,
  BookTicketSchema,
  CancelTicketSchema
};