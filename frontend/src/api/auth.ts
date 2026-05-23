import { apiClient } from './client'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user_id: string
  role: string
  name: string
}

export const authApi = {
  sendOtp: (phone: string) =>
    apiClient.post('/v1/auth/send-otp', { phone }),

  verifyOtp: (phone: string, otp: string, name?: string) =>
    apiClient.post<TokenResponse>('/v1/auth/verify-otp', { phone, otp, name }),

  refresh: (refreshToken: string) =>
    apiClient.post<TokenResponse>('/v1/auth/refresh', { refresh_token: refreshToken }),

  logout: (refreshToken: string) =>
    apiClient.post('/v1/auth/logout', { refresh_token: refreshToken }),

  me: () => apiClient.get('/v1/auth/me'),
}
