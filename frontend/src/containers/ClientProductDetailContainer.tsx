import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi, type Product } from '@/api/products'
import { useCartStore } from '@/store/cart'
import { ClientProductDetail as _ClientProductDetail } from '../screens/client'

const ClientProductDetail = _ClientProductDetail as React.ComponentType<{
  product: object | null
  cartCount: number
  onAddToCart: () => void
  onBack: () => void
  onViewCart: () => void
}>

export function ClientProductDetailContainer() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addItem, items } = useCartStore()

  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.get(productId!).then((r) => r.data),
    enabled: !!productId,
  })

  const handleAdd = () => {
    if (!product) return
    addItem({
      productId: product.id,
      vendorId: product.vendor_id,
      name: product.name,
      price_centimes: product.price_centimes,
      quantity: 1,
      image: product.images[0],
    })
  }

  const cartCount = items.reduce((a, i) => a + i.quantity, 0)

  return (
    <ClientProductDetail
      product={product ? { ...product, price_fcfa: Math.round(product.price_centimes / 100).toLocaleString('fr-FR') } : null}
      cartCount={cartCount}
      onAddToCart={handleAdd}
      onBack={() => navigate(-1)}
      onViewCart={() => navigate('/client/checkout')}
    />
  )
}
