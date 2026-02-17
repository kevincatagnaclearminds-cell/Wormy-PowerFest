import { apiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { Attendee } from '../hooks/useEventData';

// Request types
export interface CreateRegistrationRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sports: string[];
}

// Response types
export interface RegistrationResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sports: string[];
  status: 'PENDING' | 'CHECKED_IN' | 'NO_SHOW';
  checkInTime: string | null;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationsListResponse {
  data: RegistrationResponse[];
  total: number;
}

// Registration Service
export const registrationService = {
  /**
   * Create a new registration
   */
  async create(
    data: CreateRegistrationRequest
  ): Promise<ApiResponse<RegistrationResponse>> {
    return apiService.post<RegistrationResponse>(
      API_ENDPOINTS.REGISTER,
      data
    );
  },

  /**
   * Get all registrations
   */
  async getAll(params?: {
    status?: 'PENDING' | 'CHECKED_IN' | 'NO_SHOW';
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<RegistrationResponse[]>> {
    let endpoint = API_ENDPOINTS.GET_REGISTRATIONS;
    
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      
      const queryString = queryParams.toString();
      if (queryString) {
        endpoint = `${endpoint}?${queryString}`;
      }
    }

    return apiService.get<RegistrationResponse[]>(endpoint);
  },

  /**
   * Get registration by ID
   */
  async getById(id: string): Promise<ApiResponse<RegistrationResponse>> {
    return apiService.get<RegistrationResponse>(
      API_ENDPOINTS.GET_REGISTRATION_BY_ID(id)
    );
  },

  /**
   * Update registration status
   */
  async updateStatus(
    id: string,
    status: 'PENDING' | 'CHECKED_IN' | 'NO_SHOW'
  ): Promise<ApiResponse<RegistrationResponse>> {
    return apiService.patch<RegistrationResponse>(
      `${API_ENDPOINTS.GET_REGISTRATION_BY_ID(id)}/status`,
      { status }
    );
  },

  /**
   * Update registration data (email and phone)
   */
  async updateData(
    id: string,
    data: { email?: string; phone?: string }
  ): Promise<ApiResponse<RegistrationResponse>> {
    return apiService.patch<RegistrationResponse>(
      API_ENDPOINTS.GET_REGISTRATION_BY_ID(id),
      data
    );
  },

  /**
   * Resend QR notifications (email and WhatsApp)
   */
  async resendNotifications(
    id: string
  ): Promise<ApiResponse<{
    message: string;
    notifications: {
      email: { sent: boolean; messageId?: string };
      whatsapp: { sent: boolean; messageId?: string };
    };
  }>> {
    return apiService.post(
      `${API_ENDPOINTS.GET_REGISTRATION_BY_ID(id)}/resend`,
      {}
    );
  },
};
