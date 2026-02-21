import { API_CONFIG, API_ENDPOINTS } from '../config/api';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

export interface ApiError {
  success: false;
  error: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'La solicitud tardó demasiado tiempo',
        };
      }
      return {
        success: false,
        error: error.message || 'Error de conexión',
      };
    }
    return {
      success: false,
      error: 'Error desconocido',
    };
  }
}

// Export the API service
export const apiService = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, data: unknown) =>
    apiCall<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: unknown) =>
    apiCall<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) =>
    apiCall<T>(endpoint, { method: 'DELETE' }),
};
