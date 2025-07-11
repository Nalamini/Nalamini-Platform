export type User = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  userType: UserType;
  parentId?: number;
  district?: string;
  taluk?: string;
  pincode?: string;
  walletBalance?: number;
  createdAt: string;
};

export type UserType = "admin" | "branch_manager" | "taluk_manager" | "service_agent" | "customer" | "provider";

export type Transaction = {
  id: number;
  userId: number;
  amount: number;
  type: "credit" | "debit";
  description: string;
  serviceType?: string;
  createdAt: string;
};

export type Feedback = {
  id: number;
  userId: number;
  serviceType: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type Recharge = {
  id: number;
  userId: number;
  mobileNumber: string;
  amount: number;
  provider: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
};

export type Booking = {
  id: number;
  userId: number;
  bookingType: "bus" | "flight" | "hotel";
  origin?: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  passengers?: number;
  amount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

export type Rental = {
  id: number;
  userId: number;
  itemName: string;
  category: "power_tools" | "construction" | "cleaning" | "medical" | "ornament";
  startDate: string;
  endDate: string;
  amount: number;
  status: "pending" | "active" | "returned" | "cancelled";
  createdAt: string;
};

export type TaxiRide = {
  id: number;
  userId: number;
  pickup: string;
  dropoff: string;
  distance: number;
  amount: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
};

export type Delivery = {
  id: number;
  userId: number;
  pickupAddress: string;
  deliveryAddress: string;
  packageDetails: string;
  amount: number;
  status: "pending" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  createdAt: string;
};

export type GroceryProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discountedPrice?: number;
  farmerId?: number;
  stock: number;
  unit: string;
  isOrganic: boolean;
  district: string;
  createdAt: string;
};

export type LocalProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discountedPrice?: number;
  manufacturerId?: number;
  stock: number;
  district: string;
  createdAt: string;
};

export type RecyclingRequest = {
  id: number;
  userId: number;
  address: string;
  pincode: string;
  date: string;
  timeSlot: "morning" | "afternoon" | "evening";
  materials: string;
  additionalNotes?: string;
  status: "pending" | "confirmed" | "collected" | "cancelled";
  agentId?: number;
  totalWeight?: number;
  amount?: number;
  createdAt: string;
};

export type StatCard = {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
};

export type ActivityItem = {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  iconColor: string;
};

export type ServiceItem = {
  id: number;
  name: string;
  count: string;
  icon: React.ReactNode;
  color: string;
  link: string;
};

export type TopManager = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  revenue: number;
  period: string;
};
