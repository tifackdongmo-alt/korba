import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi, type Product } from '@/api/products'
import { useCartStore } from '@/store/cart'
import { ClientCatalogue as _ClientCatalogue } from '../screens/client'

const ClientCatalogue = _ClientCatalogue as React.ComponentType<{
  products: object[]
  onAddToCart: (product: object) => void
  onProductPress: (product: object) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}>

export function ClientCatalogueContainer() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { addItem } = useCartStore()

  const { data: products } = useQuery({
    queryKey: ['products', search],
    queryFn: () => productsApi.list({ q: search || undefined, limit: 30 }).then((r) => r.data),
    staleTime: 30000,
  })

  const handleAddToCart = (product: object) => {
    const p = product as Product
    addItem({
      productId: p.id,
      vendorId: p.vendor_id,
      name: p.name,
      price_centimes: p.price_centimes,
      quantity: 1,
      image: p.images[0],
    })
  }

  return (
    <ClientCatalogue
      products={products || []}
      onAddToCart={handleAddToCart}
      onProductPress={(p) => navigate(`/client/products/${(p as Product).id}`)}
      searchQuery={search}
      onSearchChange={setSearch}
    />
  )
}
