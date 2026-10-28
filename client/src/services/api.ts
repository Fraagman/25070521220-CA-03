import type {
  Sunglasses,
  NewSunglassesInput,
  Order,
  CreateOrderPayload,
  OrderConfirmation,
  Inquiry,
  InquiryPayload,
  InquiryResponse,
  FilterOptions,
  StoreStats,
  HealthStatus,
} from '../types';

const API_BASE = '/api';

/**
 * Handle API responses with comprehensive error extraction
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `Server returned ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        errorMsg = errData.error;
      }
    } catch {
      // response was not JSON
    }
    throw new Error(errorMsg);
  }
  return response.json() as Promise<T>;
}

/**
 * Check backend and MongoDB connection health
 */
export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse<HealthStatus>(response);
}

/**
 * Fetch sunglasses catalog from MongoDB with optional search, filtering, and sorting
 */
export async function fetchSunglasses(filters?: FilterOptions): Promise<Sunglasses[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters?.splatterLevel && filters.splatterLevel !== 'ALL') params.append('splatterLevel', filters.splatterLevel);
  if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);

  const queryString = params.toString();
  const url = queryString ? `${API_BASE}/sunglasses?${queryString}` : `${API_BASE}/sunglasses`;

  const response = await fetch(url);
  return handleResponse<Sunglasses[]>(response);
}

/**
 * Fetch a single sunglasses item by ObjectId or slug from MongoDB
 */
export async function fetchSunglassesById(id: string): Promise<Sunglasses> {
  const response = await fetch(`${API_BASE}/sunglasses/${encodeURIComponent(id)}`);
  return handleResponse<Sunglasses>(response);
}

/**
 * Add a new sunglasses product to MongoDB
 */
export async function createSunglasses(item: NewSunglassesInput): Promise<Sunglasses> {
  const response = await fetch(`${API_BASE}/sunglasses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return handleResponse<Sunglasses>(response);
}

/**
 * Update sunglasses details in MongoDB
 */
export async function updateSunglasses(id: string, updates: Partial<Sunglasses>): Promise<Sunglasses> {
  const response = await fetch(`${API_BASE}/sunglasses/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Sunglasses>(response);
}

/**
 * Delete a sunglasses item from MongoDB
 */
export async function deleteSunglasses(id: string): Promise<{ message: string; deletedId: string }> {
  const response = await fetch(`${API_BASE}/sunglasses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string; deletedId: string }>(response);
}

/**
 * Add customer review to a sunglasses item in MongoDB
 */
export async function submitReview(
  id: string,
  review: { author: string; rating: number; comment: string }
): Promise<Sunglasses> {
  const response = await fetch(`${API_BASE}/sunglasses/${encodeURIComponent(id)}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return handleResponse<Sunglasses>(response);
}

/**
 * Place a real order, decrementing stock in MongoDB
 */
export async function createOrder(payload: CreateOrderPayload): Promise<OrderConfirmation> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<OrderConfirmation>(response);
}

/**
 * Fetch order details by orderNumber or ID from MongoDB
 */
export async function fetchOrderById(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`);
  return handleResponse<Order>(response);
}

/**
 * Fetch all orders from MongoDB (admin view)
 */
export async function fetchAllOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE}/orders`);
  return handleResponse<Order[]>(response);
}

/**
 * Submit custom bespoke sunglasses / blood oath inquiry to MongoDB
 */
export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  const response = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<InquiryResponse>(response);
}

/**
 * Fetch store stats from MongoDB
 */
export async function fetchStoreStats(): Promise<StoreStats> {
  const response = await fetch(`${API_BASE}/stats`);
  return handleResponse<StoreStats>(response);
}

/**
 * Re-seed MongoDB database with catalog
 */
export async function reseedDatabase(): Promise<{ message: string; count: number }> {
  const response = await fetch(`${API_BASE}/seed`, {
    method: 'POST',
  });
  return handleResponse<{ message: string; count: number }>(response);
}

