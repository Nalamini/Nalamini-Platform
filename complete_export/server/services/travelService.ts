import { storage } from '../storage';
import { walletService } from './walletService';
import { v4 as uuidv4 } from 'uuid';

// Define booking types
export type BookingType = 'bus' | 'flight' | 'hotel';

// Interface for common search params across booking types
export interface BookingSearchParams {
  bookingType: BookingType;
  origin?: string;
  destination?: string;
  departDate: string;
  returnDate?: string;
  passengers?: number;
  rooms?: number;
}

// Bus route and schedule
export interface BusRoute {
  id: string;
  busOperator: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  availableSeats: number;
  amenities: string[];
  busNumber: string;
  logo?: string;
}

// Flight route and schedule
export interface FlightRoute {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  cabinClass: string;
  availableSeats: number;
  stops: number;
  logo?: string;
}

// Hotel listing
export interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  price: number;
  amenities: string[];
  roomTypes: HotelRoomType[];
  images: string[];
  description: string;
}

// Hotel room type
export interface HotelRoomType {
  id: string;
  name: string;
  capacity: number;
  price: number;
  amenities: string[];
  available: number;
}

// Booking response
export interface BookingResponse {
  success: boolean;
  bookingId?: number;
  pnr?: string;
  message?: string;
  amount?: number;
}

// Mock data for bus routes
const busList: BusRoute[] = [
  {
    id: 'bus_1',
    busOperator: 'Tamil Nadu State Transport',
    busType: 'Super Deluxe',
    origin: 'Chennai',
    destination: 'Coimbatore',
    departureTime: '22:00',
    arrivalTime: '06:00',
    duration: '8h',
    fare: 750,
    availableSeats: 32,
    amenities: ['Air Conditioned', 'Charging Point', 'Water Bottle'],
    busNumber: 'TN-01-X-1234',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tamil_Nadu_State_Transport_Corporation_Logo.svg/120px-Tamil_Nadu_State_Transport_Corporation_Logo.svg.png'
  },
  {
    id: 'bus_2',
    busOperator: 'SETC',
    busType: 'Sleeper',
    origin: 'Chennai',
    destination: 'Madurai',
    departureTime: '21:30',
    arrivalTime: '06:00',
    duration: '8h 30m',
    fare: 820,
    availableSeats: 24,
    amenities: ['Air Conditioned', 'Sleeper Berths', 'Charging Point', 'Water Bottle', 'Blanket'],
    busNumber: 'TN-01-X-5678',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tamil_Nadu_State_Transport_Corporation_Logo.svg/120px-Tamil_Nadu_State_Transport_Corporation_Logo.svg.png'
  },
  {
    id: 'bus_3',
    busOperator: 'KPN Travels',
    busType: 'Volvo Multi-Axle Sleeper',
    origin: 'Chennai',
    destination: 'Bangalore',
    departureTime: '23:00',
    arrivalTime: '06:00',
    duration: '7h',
    fare: 950,
    availableSeats: 36,
    amenities: ['Air Conditioned', 'Sleeper Berths', 'Charging Point', 'Water Bottle', 'Blanket', 'WiFi'],
    busNumber: 'KA-01-XX-7890',
    logo: 'https://kpntravels.in/images/kpn-logo.png'
  },
  {
    id: 'bus_4',
    busOperator: 'SRS Travels',
    busType: 'Volvo A/C Seater',
    origin: 'Chennai',
    destination: 'Tirupati',
    departureTime: '08:00',
    arrivalTime: '13:00',
    duration: '5h',
    fare: 550,
    availableSeats: 40,
    amenities: ['Air Conditioned', 'Charging Point', 'Water Bottle', 'Entertainment System'],
    busNumber: 'AP-03-XY-4567',
    logo: 'https://srstravels.com/images/logo.png'
  },
  {
    id: 'bus_5',
    busOperator: 'Parveen Travels',
    busType: 'A/C Sleeper',
    origin: 'Chennai',
    destination: 'Trichy',
    departureTime: '22:30',
    arrivalTime: '05:30',
    duration: '7h',
    fare: 700,
    availableSeats: 30,
    amenities: ['Air Conditioned', 'Sleeper Berths', 'Charging Point', 'Water Bottle', 'Blanket'],
    busNumber: 'TN-05-XZ-9876',
    logo: 'https://parveentravels.com/images/logo.png'
  }
];

// Mock data for flight routes
const flightList: FlightRoute[] = [
  {
    id: 'flight_1',
    airline: 'IndiGo',
    flightNumber: '6E-302',
    origin: 'Chennai',
    destination: 'Delhi',
    departureTime: '06:15',
    arrivalTime: '09:05',
    duration: '2h 50m',
    fare: 4550,
    cabinClass: 'Economy',
    availableSeats: 80,
    stops: 0,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/IndiGo_Airlines_logo.svg/180px-IndiGo_Airlines_logo.svg.png'
  },
  {
    id: 'flight_2',
    airline: 'Air India',
    flightNumber: 'AI-439',
    origin: 'Chennai',
    destination: 'Mumbai',
    departureTime: '10:30',
    arrivalTime: '12:25',
    duration: '1h 55m',
    fare: 5200,
    cabinClass: 'Economy',
    availableSeats: 120,
    stops: 0,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Air_India_Logo.svg/220px-Air_India_Logo.svg.png'
  },
  {
    id: 'flight_3',
    airline: 'SpiceJet',
    flightNumber: 'SG-123',
    origin: 'Chennai',
    destination: 'Kolkata',
    departureTime: '14:25',
    arrivalTime: '16:55',
    duration: '2h 30m',
    fare: 3950,
    cabinClass: 'Economy',
    availableSeats: 68,
    stops: 0,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/SpiceJet_logo.svg/180px-SpiceJet_logo.svg.png'
  },
  {
    id: 'flight_4',
    airline: 'Vistara',
    flightNumber: 'UK-846',
    origin: 'Chennai',
    destination: 'Bangalore',
    departureTime: '07:20',
    arrivalTime: '08:20',
    duration: '1h',
    fare: 2800,
    cabinClass: 'Economy',
    availableSeats: 92,
    stops: 0,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Vistara-Logo.svg/200px-Vistara-Logo.svg.png'
  },
  {
    id: 'flight_5',
    airline: 'AirAsia India',
    flightNumber: 'I5-764',
    origin: 'Chennai',
    destination: 'Hyderabad',
    departureTime: '16:40',
    arrivalTime: '18:00',
    duration: '1h 20m',
    fare: 3250,
    cabinClass: 'Economy',
    availableSeats: 74,
    stops: 0,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png'
  }
];

// Mock data for hotels
const hotelList: Hotel[] = [
  {
    id: 'hotel_1',
    name: 'The Leela Palace',
    location: 'Chennai',
    address: 'Adyar Seaface, MRC Nagar, Chennai',
    rating: 5,
    price: 12500,
    amenities: ['Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Conference Room', 'Room Service', 'WiFi'],
    roomTypes: [
      {
        id: 'leela_deluxe',
        name: 'Deluxe Room',
        capacity: 2,
        price: 12500,
        amenities: ['King Bed', 'City View', 'Free Breakfast', 'Mini Bar'],
        available: 10
      },
      {
        id: 'leela_exec',
        name: 'Executive Suite',
        capacity: 2,
        price: 18500,
        amenities: ['King Bed', 'Sea View', 'Free Breakfast', 'Mini Bar', 'Bathtub', 'Butler Service'],
        available: 5
      }
    ],
    images: [
      'https://www.theleela.com/assets/webpage/images/leela-palace-chennai.jpg',
      'https://www.theleela.com/assets/webpage/images/chennai-room.jpg'
    ],
    description: 'The Leela Palace Chennai is a 5-star luxury hotel located on the seafront in Chennai. With stunning views of the Bay of Bengal, this opulent hotel offers world-class amenities and service.'
  },
  {
    id: 'hotel_2',
    name: 'ITC Grand Chola',
    location: 'Chennai',
    address: 'Mount Road, Guindy, Chennai',
    rating: 5,
    price: 11000,
    amenities: ['Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Conference Room', 'Room Service', 'WiFi'],
    roomTypes: [
      {
        id: 'itc_tower',
        name: 'Tower Room',
        capacity: 2,
        price: 11000,
        amenities: ['King Bed', 'City View', 'Free Breakfast', 'Mini Bar'],
        available: 15
      },
      {
        id: 'itc_exec',
        name: 'Executive Club',
        capacity: 2,
        price: 14500,
        amenities: ['King Bed', 'Club Access', 'Free Breakfast', 'Mini Bar', 'Airport Transfer'],
        available: 8
      }
    ],
    images: [
      'https://www.itchotels.com/content/dam/itchotels/in/umbrella/images/brands/luxury-collection/itc-grand-chola.jpg',
      'https://www.itchotels.com/content/dam/itchotels/in/umbrella/images/brands/luxury-collection/itc-grand-chola-room.jpg'
    ],
    description: 'ITC Grand Chola is a luxury hotel in Chennai, inspired by the architecture of the Chola dynasty. It features stunning design, world-class dining options, and exceptional service.'
  },
  {
    id: 'hotel_3',
    name: 'Taj Coromandel',
    location: 'Chennai',
    address: 'Nungambakkam, Chennai',
    rating: 5,
    price: 9500,
    amenities: ['Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Conference Room', 'Room Service', 'WiFi'],
    roomTypes: [
      {
        id: 'taj_superior',
        name: 'Superior Room',
        capacity: 2,
        price: 9500,
        amenities: ['King/Twin Bed', 'City View', 'Free Breakfast', 'Tea/Coffee Maker'],
        available: 12
      },
      {
        id: 'taj_exec',
        name: 'Executive Room',
        capacity: 2,
        price: 12000,
        amenities: ['King Bed', 'Club Access', 'Free Breakfast', 'Mini Bar', 'Evening Cocktails'],
        available: 7
      }
    ],
    images: [
      'https://www.tajhotels.com/content/dam/luxury/hotels/taj-coromandel/images/gallery/exterior_night.jpg',
      'https://www.tajhotels.com/content/dam/luxury/hotels/taj-coromandel/images/gallery/deluxe_room.jpg'
    ],
    description: 'Taj Coromandel is a luxury hotel located in the heart of Chennai. It offers a perfect blend of old-world charm and contemporary luxury, with excellent dining options and impeccable service.'
  },
  {
    id: 'hotel_4',
    name: 'Hyatt Regency',
    location: 'Chennai',
    address: 'Mount Road, Teynampet, Chennai',
    rating: 4.5,
    price: 7800,
    amenities: ['Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Conference Room', 'Room Service', 'WiFi'],
    roomTypes: [
      {
        id: 'hyatt_standard',
        name: 'Standard Room',
        capacity: 2,
        price: 7800,
        amenities: ['King/Twin Bed', 'City View', 'Free Breakfast', 'Tea/Coffee Maker'],
        available: 20
      },
      {
        id: 'hyatt_regency',
        name: 'Regency Club',
        capacity: 2,
        price: 10500,
        amenities: ['King Bed', 'Club Access', 'Free Breakfast', 'Mini Bar', 'Lounge Access'],
        available: 10
      }
    ],
    images: [
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2019/04/23/1257/Hyatt-Regency-Chennai-P165-Exterior.jpg/Hyatt-Regency-Chennai-P165-Exterior.16x9.jpg',
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2019/04/23/1257/Hyatt-Regency-Chennai-P101-King-Bedroom.jpg/Hyatt-Regency-Chennai-P101-King-Bedroom.16x9.jpg'
    ],
    description: 'Hyatt Regency Chennai is a modern luxury hotel with spacious rooms and contemporary design. Located in the commercial center of the city, it offers excellent amenities for both business and leisure travelers.'
  },
  {
    id: 'hotel_5',
    name: 'Radisson Blu',
    location: 'Chennai',
    address: 'GST Road, St. Thomas Mount, Chennai',
    rating: 4,
    price: 6500,
    amenities: ['Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Conference Room', 'Room Service', 'WiFi'],
    roomTypes: [
      {
        id: 'rad_superior',
        name: 'Superior Room',
        capacity: 2,
        price: 6500,
        amenities: ['King/Twin Bed', 'City View', 'Tea/Coffee Maker'],
        available: 18
      },
      {
        id: 'rad_business',
        name: 'Business Class',
        capacity: 2,
        price: 8800,
        amenities: ['King Bed', 'Free Breakfast', 'Mini Bar', 'Bathrobe'],
        available: 12
      }
    ],
    images: [
      'https://www.radissonblu.com/en/hotel-chennai/rooms',
      'https://www.radissonblu.com/en/hotel-chennai/rooms/standard'
    ],
    description: 'Radisson Blu Hotel Chennai is conveniently located near Chennai International Airport. It offers comfortable accommodation, excellent dining options, and a rooftop swimming pool with panoramic views of the city.'
  }
];

// Cities for origin/destination selection
export const cities = [
  'Chennai', 'Mumbai', 'Delhi', 'Kolkata', 'Bangalore', 'Hyderabad', 
  'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirupati', 'Pondicherry',
  'Kochi', 'Thiruvananthapuram', 'Vijayawada', 'Visakhapatnam', 'Tirunelveli'
];

// Travel providers with their commission ranges
export const travelProviders = {
  hotel: [
    { name: 'MakeMyTrip', commissionRange: '10-12%' },
    { name: 'Cleartrip', commissionRange: '8-10%' },
    { name: 'Goibibo', commissionRange: '9-11%' },
    { name: 'EaseMyTrip', commissionRange: '7-9%' }
  ],
  flight: [
    { name: 'MakeMyTrip', commissionRange: '6-8%' },
    { name: 'Cleartrip', commissionRange: '5-7%' },
    { name: 'Goibibo', commissionRange: '5-8%' },
    { name: 'EaseMyTrip', commissionRange: '5-7%' }
  ],
  bus: [
    { name: 'RedBus', commissionRange: '8-10%' },
    { name: 'AbhiBus', commissionRange: '7-9%' }
  ],
  train: [
    { name: 'IRCTC', commissionRange: '3-5%' }
  ]
};

/**
 * Travel Service for handling all travel-related bookings
 */
class TravelService {
  /**
   * Search for available buses based on search criteria
   */
  searchBuses(params: Partial<BookingSearchParams>): BusRoute[] {
    const { origin, destination } = params;
    
    let results = [...busList];
    
    if (origin) {
      results = results.filter(bus => 
        bus.origin.toLowerCase() === origin.toLowerCase()
      );
    }
    
    if (destination) {
      results = results.filter(bus => 
        bus.destination.toLowerCase() === destination.toLowerCase()
      );
    }
    
    return results;
  }
  
  /**
   * Search for available flights based on search criteria
   */
  searchFlights(params: Partial<BookingSearchParams>): FlightRoute[] {
    const { origin, destination } = params;
    
    let results = [...flightList];
    
    if (origin) {
      results = results.filter(flight => 
        flight.origin.toLowerCase() === origin.toLowerCase()
      );
    }
    
    if (destination) {
      results = results.filter(flight => 
        flight.destination.toLowerCase() === destination.toLowerCase()
      );
    }
    
    return results;
  }
  
  /**
   * Search for available hotels based on search criteria
   */
  searchHotels(params: Partial<BookingSearchParams>): Hotel[] {
    const { destination } = params;
    
    let results = [...hotelList];
    
    if (destination) {
      results = results.filter(hotel => 
        hotel.location.toLowerCase() === destination.toLowerCase()
      );
    }
    
    return results;
  }
  
  /**
   * Get detailed information for a specific bus
   */
  getBusDetails(busId: string): BusRoute | undefined {
    return busList.find(bus => bus.id === busId);
  }
  
  /**
   * Get detailed information for a specific flight
   */
  getFlightDetails(flightId: string): FlightRoute | undefined {
    return flightList.find(flight => flight.id === flightId);
  }
  
  /**
   * Get detailed information for a specific hotel
   */
  getHotelDetails(hotelId: string): Hotel | undefined {
    return hotelList.find(hotel => hotel.id === hotelId);
  }
  
  /**
   * Book a bus ticket
   */
  async bookBus(
    userId: number,
    busId: string,
    passengers: number,
    seatNumbers: string[]
  ): Promise<BookingResponse> {
    try {
      const bus = this.getBusDetails(busId);
      
      if (!bus) {
        return {
          success: false,
          message: "Bus not found"
        };
      }
      
      if (bus.availableSeats < passengers) {
        return {
          success: false,
          message: "Not enough seats available"
        };
      }
      
      // Calculate total amount
      const amount = bus.fare * passengers;
      
      // Deduct from wallet
      try {
        await walletService.deductFunds(
          userId, 
          amount, 
          'bus', 
          `Bus booking: ${bus.busOperator} - ${bus.origin} to ${bus.destination}`
        );
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Failed to process payment from wallet"
        };
      }
      
      // Create booking record
      const booking = await storage.createBooking({
        userId,
        bookingType: 'bus',
        status: 'confirmed',
        amount,
        origin: bus.origin,
        destination: bus.destination,
        checkIn: new Date().toISOString(), // Use departure date in real implementation
        passengers
      });
      
      // Generate PNR
      const pnr = `B${Math.floor(100000 + Math.random() * 900000)}`;
      
      return {
        success: true,
        bookingId: booking.id,
        pnr,
        amount,
        message: "Bus booking confirmed"
      };
    } catch (error) {
      console.error("Bus booking error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process bus booking"
      };
    }
  }
  
  /**
   * Book a flight ticket
   */
  async bookFlight(
    userId: number,
    flightId: string,
    passengers: number,
    passengerDetails: any[]
  ): Promise<BookingResponse> {
    try {
      const flight = this.getFlightDetails(flightId);
      
      if (!flight) {
        return {
          success: false,
          message: "Flight not found"
        };
      }
      
      if (flight.availableSeats < passengers) {
        return {
          success: false,
          message: "Not enough seats available"
        };
      }
      
      // Calculate total amount
      const amount = flight.fare * passengers;
      
      // Deduct from wallet
      try {
        await walletService.deductFunds(
          userId, 
          amount, 
          'flight', 
          `Flight booking: ${flight.airline} ${flight.flightNumber} - ${flight.origin} to ${flight.destination}`
        );
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Failed to process payment from wallet"
        };
      }
      
      // Create booking record
      const booking = await storage.createBooking({
        userId,
        bookingType: 'flight',
        status: 'confirmed',
        amount,
        origin: flight.origin,
        destination: flight.destination,
        checkIn: new Date().toISOString(), // Use departure date in real implementation
        passengers
      });
      
      // Generate PNR
      const pnr = `F${Math.floor(100000 + Math.random() * 900000)}`;
      
      return {
        success: true,
        bookingId: booking.id,
        pnr,
        amount,
        message: "Flight booking confirmed"
      };
    } catch (error) {
      console.error("Flight booking error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process flight booking"
      };
    }
  }
  
  /**
   * Book a hotel room
   */
  async bookHotel(
    userId: number,
    hotelId: string,
    roomTypeId: string,
    checkIn: string,
    checkOut: string,
    guests: number,
    rooms: number
  ): Promise<BookingResponse> {
    try {
      const hotel = this.getHotelDetails(hotelId);
      
      if (!hotel) {
        return {
          success: false,
          message: "Hotel not found"
        };
      }
      
      const roomType = hotel.roomTypes.find(room => room.id === roomTypeId);
      
      if (!roomType) {
        return {
          success: false,
          message: "Room type not found"
        };
      }
      
      if (roomType.available < rooms) {
        return {
          success: false,
          message: "Not enough rooms available"
        };
      }
      
      // Calculate number of nights
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (nights <= 0) {
        return {
          success: false,
          message: "Invalid check-in/check-out dates"
        };
      }
      
      // Calculate total amount
      const amount = roomType.price * rooms * nights;
      
      // Deduct from wallet
      try {
        await walletService.deductFunds(
          userId, 
          amount, 
          'hotel', 
          `Hotel booking: ${hotel.name} - ${roomType.name} (${nights} nights)`
        );
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Failed to process payment from wallet"
        };
      }
      
      // Create booking record
      const booking = await storage.createBooking({
        userId,
        bookingType: 'hotel',
        status: 'confirmed',
        amount,
        destination: hotel.location,
        checkIn,
        checkOut,
        passengers: guests
      });
      
      // Generate booking reference
      const bookingRef = `H${Math.floor(100000 + Math.random() * 900000)}`;
      
      return {
        success: true,
        bookingId: booking.id,
        pnr: bookingRef,
        amount,
        message: "Hotel booking confirmed"
      };
    } catch (error) {
      console.error("Hotel booking error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process hotel booking"
      };
    }
  }
  
  /**
   * Get booking history for a user
   */
  async getBookingHistory(userId: number) {
    return await storage.getBookingsByUserId(userId);
  }
  
  /**
   * Get detailed information for a specific booking
   */
  async getBookingDetails(bookingId: number) {
    return await storage.getBooking(bookingId);
  }
  
  /**
   * Cancel a booking
   */
  async cancelBooking(userId: number, bookingId: number): Promise<BookingResponse> {
    try {
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return {
          success: false,
          message: "Booking not found"
        };
      }
      
      if (booking.userId !== userId) {
        return {
          success: false,
          message: "Unauthorized: You don't have permission to cancel this booking"
        };
      }
      
      if (booking.status === 'cancelled') {
        return {
          success: false,
          message: "Booking is already cancelled"
        };
      }
      
      // Update booking status
      await storage.updateBooking(bookingId, {
        status: 'cancelled'
      });
      
      // Refund amount (minus cancellation fee if applicable)
      // In this basic version, refund 90% of the original amount
      const refundAmount = Math.floor(booking.amount * 0.9);
      
      await walletService.addFunds(
        userId,
        refundAmount,
        'refund',
        `Refund for cancelled ${booking.bookingType} booking #${bookingId}`
      );
      
      return {
        success: true,
        bookingId,
        amount: refundAmount,
        message: "Booking cancelled and refund processed"
      };
    } catch (error) {
      console.error("Booking cancellation error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to cancel booking"
      };
    }
  }
}

export const travelService = new TravelService();