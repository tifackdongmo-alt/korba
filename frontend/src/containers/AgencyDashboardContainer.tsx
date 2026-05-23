import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { useAuthStore } from '@/store/auth'
import { AgencyDashboard as _AgencyDashboard } from '../screens/agency'

const AgencyDashboard = _AgencyDashboard as React.ComponentType<{ agency: object; stats: object }>

export function AgencyDashboardContainer() {
  const { name } = useAuthStore.getState()

  const { data: stats } = useQuery({
    queryKey: ['agency-stats'],
    queryFn: () => apiClient.get('/v1/agency/stats').then((r) => r.data as object),
    staleTime: 60000,
  })

  return (
    <AgencyDashboard
      agency={{ name: name || 'Agence' }}
      stats={stats || { deliveries_today: 0, success_rate: 0, couriers_online: 0 }}
    />
  )
}
