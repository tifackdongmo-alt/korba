import { apiClient } from './client'

export interface Product {
  id: string
  vendor_id: string
  name: string
  description?: string
  price_centimes: number
  category: string
  stock: number
  images: string[]
  is_active: boolean
}

export const productsApi = {
  list: (params?: { city?: string; category?: string; vendor_id?: string; q?: string; limit?: number }) =>
    apiClient.get<Product[]>('/v1/products', { params }),

  get: (id: string) =>
    apiClient.get<Product>(`/v1/products/${id}`),

  create: (payload: Omit<Product, 'id' | 'vendor_id' | 'is_active'>) =>
    apiClient.post<Product>('/v1/products', payload),

  update: (id: string, payload: Partial<Product>) =>
    apiClient.patch<Product>(`/v1/products/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete(`/v1/products/${id}`),
}
