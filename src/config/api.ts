// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3003/api',
  TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Registrations
  REGISTER: '/registrations',
  GET_REGISTRATIONS: '/registrations',
  GET_REGISTRATION_BY_ID: (id: string) => `/registrations/${id}`,
  
  // Verification
  VERIFY_TICKET: '/verify',
  CHECK_IN: (id: string) => `/registrations/${id}/check-in`,
  
  // Stats
  GET_STATS: '/stats',
} as const;
