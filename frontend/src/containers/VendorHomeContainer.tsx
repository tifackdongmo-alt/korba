import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { useAuthStore } from '@/store/auth'
import { useOrderStatus } from '@/socket/useTracking'
import { VendorHome as _VendorHome } from '../screens/vendor'

const VendorHome = _VendorHome as React.ComponentType<{ vendor: object; orders: object[] }>

export function VendorHomeContainer() {
  const { name } = useAuthStore.getState()

  const { data: orders, refetch } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: () => ordersApi.list().then((r) => r.data),
    staleTime: 30000,
  })

  useOrderStatus(null, () => { void refetch() })

  return <VendorHome vendor={{ name: name || 'Vendeur' }} orders={orders || []} />
}
