export type SplatterLevel =
  | 'Moderate'
  | 'Brutal'
  | 'Lethal'
  | 'Extreme'
  | 'Catastrophic'
  | 'Apocalyptic';

export type SunglassesCategory =
  | 'ALL'
  | 'Cyber-Visor'
  | 'Razor-Edge'
  | 'Aviator'
  | 'Brutal Acetate'
  | 'Spiked Cat-Eye'
  | 'Sports Shield'
  | 'Geometric Wire';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedGore: boolean;
}

export interface Dimensions {
  lensWidth: number;
  bridge: number;
  temple: number;
  weightGrams: number;
}

export interface Sunglasses {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: number;
  splatterLevel: SplatterLevel;
  rating: number;
  reviewCount: number;
  description: string;
  frameMaterial: string;
  lensSpecs: string;
  dimensions: Dimensions;
  features: string[];
  badge?: string;
  svgVariant: string;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NewSunglassesInput {
  name: string;
  tagline: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: number;
  splatterLevel: SplatterLevel;
  description: string;
  frameMaterial: string;
  lensSpecs: string;
  badge?: string;
  svgVariant?: string;
}

export interface CartItem {
  product: Sunglasses;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  svgVariant: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  shippingAddress: ShippingAddress;
  bloodPledge: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  promoCode?: string | null;
  total: number;
  status: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  paymentStatus: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  email: string;
  shippingAddress: ShippingAddress;
  bloodPledge: string;
  promoCode?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export interface OrderConfirmation {
  success: boolean;
  orderNumber: string;
  orderId: string;
  order: Order;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  bloodType: string;
  frameStyle: string;
  tintColor: string;
  visionNotes: string;
  status: string;
  createdAt: string;
}

export interface InquiryPayload {
  name: string;
  email: string;
  bloodType: string;
  frameStyle: string;
  tintColor: string;
  visionNotes: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  inquiryId: string;
  inquiry: Inquiry;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  splatterLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name';
}

export interface StoreStats {
  totalProducts: number;
  lowStockCount: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded';
  database: 'connected' | 'disconnected';
  service: string;
  timestamp: string;
}

