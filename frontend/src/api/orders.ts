import { apiClient } from './client'

export interface OrderItem {
  product_id: string
  quantity: number
}

export interface CreateOrderPayload {
  vendor_id: string
  items: OrderItem[]
  delivery_address: string
  notes?: string
}

export interface Order {
  id: string
  status: string
  total_centimes: number
  delivery_fee_centimes: number
  service_fee_centimes: number
  delivery_address: string
  notes?: string
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<Order>('/v1/orders', payload),

  list: () =>
    apiClient.get<Order[]>('/v1/orders'),

  get: (orderId: string) =>
    apiClient.get<Order>(`/v1/orders/${orderId}`),

  pay: (orderId: string, provider: string, phone: string) =>
    apiClient.post(`/v1/orders/${orderId}/pay`, { provider, phone }),

  validate: (orderId: string) =>
    apiClient.post(`/v1/orders/${orderId}/validate`),

  openDispute: (orderId: string, reason: string, description: string) =>
    apiClient.post('/v1/disputes', { order_id: orderId, reason, description }),
}
