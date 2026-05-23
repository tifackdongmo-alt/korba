import React, { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { DriverProof as _DriverProof } from '../screens/driver'

const DriverProof = _DriverProof as React.ComponentType<{
  orderId: string
  otp: string
  onOtpChange: (v: string) => void
  onTakePhoto: () => void
  photoUrl: string | null
  onSlideDelivered: () => void
  loading: boolean
  onBack: () => void
}>

export function DriverProofContainer() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleTakePhoto = () => {
    // Crée un input file caché si pas existant
    if (!fileInputRef.current) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await apiClient.post('/v1/uploads/proof', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setPhotoUrl((data as { url: string }).url)
      }
      fileInputRef.current = input
    }
    fileInputRef.current.click()
  }

  const confirmDelivery = useMutation({
    mutationFn: () =>
      apiClient.post(`/v1/orders/${orderId}/delivered`, {
        otp,
        proof_photo_url: photoUrl,
      }),
    onSuccess: () => navigate('/driver'),
  })

  return (
    <DriverProof
      orderId={orderId || ''}
      otp={otp}
      onOtpChange={setOtp}
      onTakePhoto={handleTakePhoto}
      photoUrl={photoUrl}
      onSlideDelivered={() => confirmDelivery.mutate()}
      loading={confirmDelivery.isPending}
      onBack={() => navigate(-1)}
    />
  )
}
