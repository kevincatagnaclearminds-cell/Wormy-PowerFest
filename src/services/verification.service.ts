import { apiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../config/api';

// Request types
export interface VerifyTicketRequest {
  ticketId: string;
}

// Response types
export interface VerifyTicketResponse {
  status: 'success' | 'already_used' | 'not_found';
  message: string;
  data?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    sports: string[];
    status: 'PENDING' | 'CHECKED_IN' | 'NO_SHOW';
    checkInTime: string | null;
    registrationDate: string;
  };
}

// Verification Service
export const verificationService = {
  /**
   * Verify a ticket and perform check-in
   */
  async verifyTicket(
    ticketId: string
  ): Promise<ApiResponse<VerifyTicketResponse>> {
    return apiService.post<VerifyTicketResponse>(
      API_ENDPOINTS.VERIFY_TICKET,
      { ticketId }
    );
  },

  /**
   * Manual check-in by ID
   */
  async checkIn(id: string): Promise<ApiResponse<VerifyTicketResponse>> {
    return apiService.post<VerifyTicketResponse>(
      API_ENDPOINTS.CHECK_IN(id),
      {}
    );
  },
};
