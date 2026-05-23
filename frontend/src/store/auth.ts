import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  role: 'client' | 'vendor' | 'agency' | 'driver' | 'admin' | null
  name: string | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  setUser: (userId: string, role: string, name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      role: null,
      name: null,
      isAuthenticated: false,

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      setUser: (userId, role, name) =>
        set({
          userId,
          role: role as AuthState['role'],
          name,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          role: null,
          name: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'korba-auth', partialize: (s) => ({ refreshToken: s.refreshToken, role: s.role, userId: s.userId, name: s.name }) }
  )
)
