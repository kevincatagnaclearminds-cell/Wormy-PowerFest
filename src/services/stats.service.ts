import { apiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../config/api';

// Response types
export interface StatsResponse {
  total: number;
  checkedIn: number;
  pending: number;
  noShow: number;
  sportsCount: number;
  sportBreakdown: {
    [sport: string]: number;
  };
  recentScans: Array<{
    id: string;
    firstName: string;
    lastName: string;
    checkInTime: string;
    sports: string[];
  }>;
}

// Stats Service
export const statsService = {
  /**
   * Get event statistics
   */
  async getStats(): Promise<ApiResponse<StatsResponse>> {
    return apiService.get<StatsResponse>(API_ENDPOINTS.GET_STATS);
  },
};
