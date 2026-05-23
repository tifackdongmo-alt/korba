import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/api/products'
import { useAuthStore } from '@/store/auth'
import { ClientHome as _ClientHome } from '../screens/client'

const ClientHome = _ClientHome as React.ComponentType<{ user: object }>

export function ClientHomeContainer() {
  const { name } = useAuthStore.getState()

  const { data: products } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.list({ limit: 10 }).then((r) => r.data),
    staleTime: 60000,
  })

  return <ClientHome user={{ name: name || 'Client', city: 'Dakar', products: products || [] }} />
}
