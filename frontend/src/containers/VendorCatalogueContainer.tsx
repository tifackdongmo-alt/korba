import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi, type Product } from '@/api/products'
import { VendorCatalogue as _VendorCatalogue } from '../screens/vendor'

const VendorCatalogue = _VendorCatalogue as React.ComponentType<{
  products: object[]
  onCreateProduct: (data: object) => void
  onUpdateProduct: (id: string, data: object) => void
  onDeleteProduct: (id: string) => void
  loading: boolean
}>

export function VendorCatalogueContainer() {
  const qc = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: products } = useQuery({
    queryKey: ['vendor-catalogue'],
    queryFn: () => productsApi.list({ limit: 100 }).then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productsApi.create(data as Omit<Product, 'id' | 'vendor_id' | 'is_active'>),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['vendor-catalogue'] }) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productsApi.update(id, data),
    onSuccess: () => {
      setEditingId(null)
      void qc.invalidateQueries({ queryKey: ['vendor-catalogue'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['vendor-catalogue'] }) },
  })

  return (
    <VendorCatalogue
      products={(products || []).map((p) => ({
        ...p,
        price_fcfa: Math.round(p.price_centimes / 100).toLocaleString('fr-FR'),
      }))}
      onCreateProduct={(data) => createMutation.mutate(data as Partial<Product>)}
      onUpdateProduct={(id, data) => updateMutation.mutate({ id, data: data as Partial<Product> })}
      onDeleteProduct={(id) => deleteMutation.mutate(id)}
      loading={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
    />
  )
}
