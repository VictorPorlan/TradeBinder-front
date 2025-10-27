import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  CreateAnnouncementRequest, 
  SendMessageRequest,
  Announcement,
  Message,
  AuthUser,
  PaginatedResponse,
  CardBase,
  Edition,
  Listing,
  Location,
  SearchCardsParams,
  SearchListingsParams,
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionStatusRequest,
  CompleteTransactionRequest,
  SearchTransactionsParams
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        console.log('API Request - URL:', config.url);
        console.log('API Request - Token length:', token ? token.length : 0);
        console.log('API Request - Token preview:', token ? `${token.substring(0, 50)}...` : 'Missing');
        console.log('API Request - Token format check:', token ? (token.includes('.') ? 'Valid format' : 'Invalid format') : 'No token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('API Request - Authorization header added');
        } else {
          console.log('API Request - No token found in localStorage');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await this.api.get('/auth/me');
    return response.data;
  }

  // Locations endpoints
  async getLocations(): Promise<Location[]> {
    const response: AxiosResponse<Location[]> = await this.api.get('/auth/locations');
    return response.data;
  }

  // Cards endpoints
  async getCards(params: SearchCardsParams = {}): Promise<PaginatedResponse<CardBase>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<PaginatedResponse<CardBase>> = await this.api.get(
      `/cards?${queryParams.toString()}`
    );
    return response.data;
  }

  async getCardById(id: number): Promise<CardBase> {
    const response: AxiosResponse<CardBase> = await this.api.get(`/cards/${id}`);
    return response.data;
  }

  async searchCards(searchTerm: string, limit = 10): Promise<CardBase[]> {
    const response: AxiosResponse<CardBase[]> = await this.api.get(
      `/cards/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`
    );
    return response.data;
  }

  async getCardStats(): Promise<{ total: number; active: number; inactive: number }> {
    const response: AxiosResponse<{ total: number; active: number; inactive: number }> = await this.api.get('/cards/stats');
    return response.data;
  }

  // Editions endpoints (if available)
  async getEditions(): Promise<Edition[]> {
    const response: AxiosResponse<Edition[]> = await this.api.get('/editions');
    return response.data;
  }

  // Listings endpoints
  async getListings(params: SearchListingsParams = {}): Promise<PaginatedResponse<Listing>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<PaginatedResponse<Listing>> = await this.api.get(
      `/listings?${queryParams.toString()}`
    );
    return response.data;
  }

  async getListingById(id: number): Promise<Listing> {
    const response: AxiosResponse<Listing> = await this.api.get(`/listings/${id}`);
    return response.data;
  }

  async getMyListings(page = 1, limit = 20): Promise<PaginatedResponse<Listing>> {
    const response: AxiosResponse<PaginatedResponse<Listing>> = await this.api.get(
      `/listings/my-listings?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getListingStats(): Promise<{ total: number; active: number; inactive: number; totalValue: number }> {
    const response: AxiosResponse<{ total: number; active: number; inactive: number; totalValue: number }> = await this.api.get('/listings/stats');
    return response.data;
  }

  async createListing(listingData: Partial<Listing>): Promise<Listing> {
    const response: AxiosResponse<Listing> = await this.api.post('/listings', listingData);
    return response.data;
  }

  async updateListing(id: number, listingData: Partial<Listing>): Promise<Listing> {
    const response: AxiosResponse<Listing> = await this.api.put(`/listings/${id}`, listingData);
    return response.data;
  }

  async deleteListing(id: number): Promise<void> {
    console.log('API Service: Eliminando listing con ID:', id);
    const response = await this.api.delete(`/listings/${id}`);
    console.log('API Service: Respuesta del servidor:', response);
    return response.data;
  }

  async toggleListingStatus(id: number): Promise<Listing> {
    // Primero obtenemos el listing actual para saber su estado
    const currentListing = await this.getListingById(id);
    const newStatus = currentListing.isActive ? 'cancelled' : 'available';
    
    const response: AxiosResponse<Listing> = await this.api.put(`/listings/${id}/status`, {
      status: newStatus
    });
    return response.data;
  }

  // Announcements endpoints (legacy)
  async getAnnouncements(page = 1, limit = 10): Promise<PaginatedResponse<Announcement>> {
    const response: AxiosResponse<PaginatedResponse<Announcement>> = await this.api.get(
      `/announcements?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getAnnouncementById(id: number): Promise<Announcement> {
    const response: AxiosResponse<Announcement> = await this.api.get(`/announcements/${id}`);
    return response.data;
  }

  async createAnnouncement(announcementData: CreateAnnouncementRequest): Promise<Announcement> {
    const response: AxiosResponse<Announcement> = await this.api.post('/announcements', announcementData);
    return response.data;
  }

  async getUserAnnouncements(userId: number): Promise<Announcement[]> {
    const response: AxiosResponse<Announcement[]> = await this.api.get(`/users/${userId}/announcements`);
    return response.data;
  }


  // Messages endpoints (based on listingId)
  async getMessagesByListing(listingId: number): Promise<Message[]> {
    const response: AxiosResponse<Message[]> = await this.api.get(`/messages/listing/${listingId}`);
    return response.data;
  }

  async sendMessage(messageData: SendMessageRequest): Promise<Message> {
    const response: AxiosResponse<Message> = await this.api.post('/messages', messageData);
    return response.data;
  }

  async getConversations(): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.api.get('/messages');
    return response.data;
  }

  async markMessageAsRead(messageId: number): Promise<Message> {
    const response: AxiosResponse<Message> = await this.api.put(`/messages/${messageId}/read`);
    return response.data;
  }

  async markAllMessagesAsRead(listingId: number): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.put(`/messages/listing/${listingId}/read-all`);
    return response.data;
  }

  async getUnreadCount(): Promise<{ count: number }> {
    const response: AxiosResponse<{ count: number }> = await this.api.get('/messages/unread/count');
    return response.data;
  }

  // Users endpoints
  async getUserById(id: number): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<AuthUser>): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  // Transactions endpoints
  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.post('/transactions', transactionData);
    return response.data;
  }

  async getTransactions(params: SearchTransactionsParams = {}): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<PaginatedResponse<Transaction>> = await this.api.get(
      `/transactions?${queryParams.toString()}`
    );
    return response.data;
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.get(`/transactions/${id}`);
    return response.data;
  }

  async updateTransactionStatus(id: number, statusData: UpdateTransactionStatusRequest): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.put(`/transactions/${id}/status`, statusData);
    return response.data;
  }

  async completeTransaction(id: number, completeData: CompleteTransactionRequest = {}): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.post(`/transactions/${id}/complete`, completeData);
    return response.data;
  }

  async cancelTransaction(id: number): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.post(`/transactions/${id}/cancel`);
    return response.data;
  }
}

export default new ApiService();
