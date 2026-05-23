import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { AgencyTeamZones as _AgencyTeamZones } from '../screens/agency'

const AgencyTeamZones = _AgencyTeamZones as React.ComponentType<{
  couriers: object[]
  zones: object[]
}>

export function AgencyTeamZonesContainer() {
  const { data: couriers } = useQuery({
    queryKey: ['agency-couriers'],
    queryFn: () => apiClient.get('/v1/agency/couriers').then((r) => r.data as object[]),
    staleTime: 30000,
  })

  // Les zones ne sont pas encore exposées via API — placeholder pour l'instant
  const zones: object[] = []

  return <AgencyTeamZones couriers={couriers || []} zones={zones} />
}
