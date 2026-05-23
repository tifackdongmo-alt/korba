import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import { useCartStore } from '@/store/cart'
import { ClientCheckout as _ClientCheckout } from '../screens/client'

const ClientCheckout = _ClientCheckout as React.ComponentType<{
  items: object[]
  total_fcfa: string
  delivery_fee_fcfa: string
  service_fee_fcfa: string
  address: string
  onAddressChange: (a: string) => void
  provider: string
  onProviderChange: (p: string) => void
  phone: string
  onPhoneChange: (p: string) => void
  onConfirm: () => void
  loading: boolean
}>

const DELIVERY_CENTIMES = 50000
const SERVICE_CENTIMES = 20000

export function ClientCheckoutContainer() {
  const navigate = useNavigate()
  const { items, vendorId, total, clear } = useCartStore()
  const [address, setAddress] = useState('')
  const [provider, setProvider] = useState('orange_money')
  const [phone, setPhone] = useState('')

  const createOrder = useMutation({
    mutationFn: async () => {
      const { data: order } = await ordersApi.create({
        vendor_id: vendorId!,
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        delivery_address: address,
      })
      const { data: payment } = await ordersApi.pay(order.id, provider, phone)
      return { order, payment }
    },
    onSuccess: ({ order, payment }) => {
      clear()
      // Redirection vers le paiement externe si URL disponible
      if (payment.redirect_url) {
        window.location.href = payment.redirect_url as string
      } else {
        navigate(`/client/orders/${order.id}/tracking`)
      }
    },
  })

  const subtotal = total()
  const grandTotal = subtotal + DELIVERY_CENTIMES + SERVICE_CENTIMES

  return (
    <ClientCheckout
      items={items.map((i) => ({
        ...i,
        price_fcfa: Math.round(i.price_centimes / 100).toLocaleString('fr-FR'),
        subtotal_fcfa: Math.round(i.price_centimes * i.quantity / 100).toLocaleString('fr-FR'),
      }))}
      total_fcfa={Math.round(subtotal / 100).toLocaleString('fr-FR')}
      delivery_fee_fcfa={Math.round(DELIVERY_CENTIMES / 100).toLocaleString('fr-FR')}
      service_fee_fcfa={Math.round(SERVICE_CENTIMES / 100).toLocaleString('fr-FR')}
      address={address}
      onAddressChange={setAddress}
      provider={provider}
      onProviderChange={setProvider}
      phone={phone}
      onPhoneChange={setPhone}
      onConfirm={() => createOrder.mutate()}
      loading={createOrder.isPending}
    />
  )
}
