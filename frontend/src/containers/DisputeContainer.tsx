import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { DisputeScreen as _DisputeScreen } from '../screens/shared'

const DisputeScreen = _DisputeScreen as React.ComponentType<{
  orderId: string
  reason: string
  onReasonChange: (r: string) => void
  description: string
  onDescriptionChange: (d: string) => void
  onSubmit: () => void
  loading: boolean
  onBack: () => void
}>

export function DisputeContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [reason, setReason] = useState('article_manquant')
  const [description, setDescription] = useState('')

  const submit = useMutation({
    mutationFn: () => ordersApi.openDispute(orderId!, reason, description),
    onSuccess: () => navigate(`/client/orders/${orderId}/tracking`),
  })

  return (
    <DisputeScreen
      orderId={orderId || ''}
      reason={reason}
      onReasonChange={setReason}
      description={description}
      onDescriptionChange={setDescription}
      onSubmit={() => submit.mutate()}
      loading={submit.isPending}
      onBack={() => navigate(-1)}
    />
  )
}
