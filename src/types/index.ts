// Location types
export interface Location {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User {
  id: number;
  email: string;
  username: string;
  locationId: number;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  locationId: number;
  location?: Location;
}

// Card Base types (from backend endpoints)
export interface CardBase {
  id: number;
  name: string;
  manaCost?: string;
  type?: string;
  subtype?: string;
  rarity?: string;
  text?: string;
  flavorText?: string;
  power?: string;
  toughness?: string;
  loyalty?: number;
  imageUrl?: string;
  artist?: string;
  number?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Edition types
export interface Edition {
  id: number;
  name: string;
  releaseDate?: string;
  hasFoil: boolean;
  createdAt: string;
  updatedAt: string;
}

// Listing types
export interface Listing {
  id: number;
  userId: number;
  cardId: number;
  editionId: number;
  locationId: number;
  condition: ListingCondition;
  isFoil: boolean;
  price: number;
  quantity: number;
  description?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    location?: Location;
  };
  cardBase?: CardBase;
  edition?: Edition;
  location?: Location;
}

export enum ListingCondition {
  MINT = 'mint',
  NEAR_MINT = 'near_mint',
  LIGHTLY_PLAYED = 'lightly_played',
  MODERATELY_PLAYED = 'moderately_played',
  HEAVILY_PLAYED = 'heavily_played',
  DAMAGED = 'damaged',
}

// Search and filter types
export interface SearchCardsParams {
  name?: string;
  manaCost?: string;
  type?: string;
  subtype?: string;
  rarity?: string;
  artist?: string;
  text?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchListingsParams {
  cardName?: string;
  cardId?: number;
  editionId?: number;
  locationId?: number;
  condition?: ListingCondition;
  isFoil?: boolean;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Legacy Card types (for backward compatibility)
export interface Card {
  id: number;
  name: string;
  edition: string;
  condition: string;
  price: number;
  sellerId: number;
}

// Announcement types
export interface Announcement {
  id: number;
  cardId: number;
  sellerId: number;
  description?: string;
  createdAt: string;
  card?: Card;
  seller?: User;
}

// Message types
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  listingId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: number;
    username: string;
    email: string;
  };
  receiver?: {
    id: number;
    username: string;
    email: string;
  };
  listing?: {
    id: number;
    title: string;
    price: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  locationId: number;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

// Form types
export interface CreateAnnouncementRequest {
  card: {
    name: string;
    edition: string;
    condition: string;
    price: number;
  };
  description?: string;
}

export interface SendMessageRequest {
  listingId: number;
  receiverId: number;
  content: string;
}

// Transaction types
export interface Transaction {
  id: number;
  listingId: number;
  buyerId: number;
  sellerId: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  status: TransactionStatus;
  paymentMethod?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  listing?: Listing;
  buyer?: User;
  seller?: User;
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface CreateTransactionRequest {
  listingId: number;
  quantity: number;
  paymentMethod: string;
  shippingAddress: string;
}

export interface UpdateTransactionStatusRequest {
  status: TransactionStatus;
}

export interface CompleteTransactionRequest {
  trackingNumber?: string;
}

export interface SearchTransactionsParams {
  status?: TransactionStatus;
  type?: 'buyer' | 'seller' | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Card selection types for listings
export interface CardSelection {
  card: CardBase;
  edition: Edition;
  condition: ListingCondition;
  isFoil: boolean;
  price: number;
  quantity: number;
  description?: string;
  images?: string[];
}
