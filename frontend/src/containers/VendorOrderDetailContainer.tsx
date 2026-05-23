import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { apiClient } from '@/api/client'
import { useOrderStatus } from '@/socket/useTracking'
import { VendorOrderDetail as _VendorOrderDetail } from '../screens/vendor'

const VendorOrderDetail = _VendorOrderDetail as React.ComponentType<{
  order: object | null
  onMarkReady: () => void
  onBack: () => void
  loading: boolean
}>

export function VendorOrderDetailContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: order, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.get(orderId!).then((r) => r.data),
    enabled: !!orderId,
  })

  useOrderStatus(orderId ?? null, () => { void refetch() })

  const markReady = useMutation({
    mutationFn: () => apiClient.post(`/v1/orders/${orderId}/status`, { status: 'prete' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['order', orderId] }) },
  })

  return (
    <VendorOrderDetail
      order={order ? {
        ...order,
        total_fcfa: Math.round(order.total_centimes / 100).toLocaleString('fr-FR'),
      } : null}
      onMarkReady={() => markReady.mutate()}
      onBack={() => navigate('/vendor')}
      loading={markReady.isPending}
    />
  )
}
