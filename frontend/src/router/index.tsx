import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { AuthContainer } from '@/containers/AuthContainer'
import { ClientHomeContainer } from '@/containers/ClientHomeContainer'
import { ClientTrackingContainer } from '@/containers/ClientTrackingContainer'
import { VendorHomeContainer } from '@/containers/VendorHomeContainer'
import { AgencyDashboardContainer } from '@/containers/AgencyDashboardContainer'
import { DriverHomeContainer } from '@/containers/DriverHomeContainer'

function RequireAuth({ allowedRoles }: { allowedRoles?: string[] }) {
  const { isAuthenticated, role } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && role && !allowedRoles.includes(role)) return <Navigate to={`/${role}`} replace />
  return <Outlet />
}

function RoleRedirect() {
  const { isAuthenticated, role } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={`/${role}`} replace />
}

export const router = createBrowserRouter([
  { path: '/', element: <RoleRedirect /> },
  { path: '/login', element: <AuthContainer /> },

  // Client
  {
    element: <RequireAuth allowedRoles={['client']} />,
    children: [
      { path: '/client', element: <ClientHomeContainer /> },
      { path: '/client/orders/:orderId/tracking', element: <ClientTrackingContainer /> },
    ],
  },

  // Vendeur
  {
    element: <RequireAuth allowedRoles={['vendor']} />,
    children: [
      { path: '/vendor', element: <VendorHomeContainer /> },
    ],
  },

  // Agence
  {
    element: <RequireAuth allowedRoles={['agency']} />,
    children: [
      { path: '/agency', element: <AgencyDashboardContainer /> },
    ],
  },

  // Livreur
  {
    element: <RequireAuth allowedRoles={['driver']} />,
    children: [
      { path: '/driver', element: <DriverHomeContainer /> },
    ],
  },
])
