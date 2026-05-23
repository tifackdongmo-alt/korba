import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth'
import { ProfileScreen as _ProfileScreen } from '../screens/shared'

const ProfileScreen = _ProfileScreen as React.ComponentType<{
  user: object | null
  onLogout: () => void
  onEdit: () => void
}>

export function ProfileContainer() {
  const navigate = useNavigate()
  const { logout, refreshToken } = useAuthStore()

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me().then((r) => r.data),
    staleTime: 60000,
  })

  const handleLogout = async () => {
    if (refreshToken) {
      try { await authApi.logout(refreshToken) } catch { /* ignore */ }
    }
    logout()
    navigate('/login')
  }

  return (
    <ProfileScreen
      user={user || null}
      onLogout={handleLogout}
      onEdit={() => navigate('/profile/edit')}
    />
  )
}
