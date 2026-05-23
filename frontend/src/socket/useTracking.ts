import { useEffect, useState } from 'react'
import { getSocket } from './socket'

interface CourierLocation {
  courier_id: string
  lat: number
  lng: number
  bearing?: number
}

export function useTracking(orderId: string | null) {
  const [courierLocation, setCourierLocation] = useState<CourierLocation | null>(null)

  useEffect(() => {
    if (!orderId) return
    const socket = getSocket()
    socket.emit('join_order', { order_id: orderId })
    socket.on('location:update', (data: CourierLocation) => setCourierLocation(data))
    return () => {
      socket.emit('leave_order', { order_id: orderId })
      socket.off('location:update')
    }
  }, [orderId])

  return { courierLocation }
}

export function useOrderStatus(orderId: string | null, onStatusChange?: (status: string) => void) {
  useEffect(() => {
    if (!orderId) return
    const socket = getSocket()
    socket.emit('join_order', { order_id: orderId })
    socket.on('order:status_changed', (data: { status: string }) => onStatusChange?.(data.status))
    return () => {
      socket.off('order:status_changed')
    }
  }, [orderId, onStatusChange])
}

export function useAssignment(onAssignment?: (data: object) => void) {
  useEffect(() => {
    const socket = getSocket()
    socket.on('assignment:new', (data: object) => onAssignment?.(data))
    return () => { socket.off('assignment:new') }
  }, [onAssignment])
}
