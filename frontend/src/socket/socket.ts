import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/auth'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const userId = useAuthStore.getState().userId
    socket = io(import.meta.env.VITE_WS_URL || '', {
      auth: { user_id: userId },
      transports: ['websocket'],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })
  }
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
