import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { AuthContainer } from '@/containers/AuthContainer'
import { ClientHomeContainer } from '@/containers/ClientHomeContainer'
import { ClientCatalogueContainer } from '@/containers/ClientCatalogueContainer'
import { ClientProductDetailContainer } from '@/containers/ClientProductDetailContainer'
import { ClientCheckoutContainer } from '@/containers/ClientCheckoutContainer'
import { ClientTrackingContainer } from '@/containers/ClientTrackingContainer'
import { DisputeContainer } from '@/containers/DisputeContainer'
import { VendorHomeContainer } from '@/containers/VendorHomeContainer'
import { VendorOrderDetailContainer } from '@/containers/VendorOrderDetailContainer'
import { AgencyDashboardContainer } from '@/containers/AgencyDashboardContainer'
import { DriverHomeContainer } from '@/containers/DriverHomeContainer'
import { NotificationsContainer } from '@/containers/NotificationsContainer'

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
      { path: '/client/catalogue', element: <ClientCatalogueContainer /> },
      { path: '/client/products/:productId', element: <ClientProductDetailContainer /> },
      { path: '/client/checkout', element: <ClientCheckoutContainer /> },
      { path: '/client/orders/:orderId/tracking', element: <ClientTrackingContainer /> },
      { path: '/client/orders/:orderId/dispute', element: <DisputeContainer /> },
      { path: '/client/notifications', element: <NotificationsContainer /> },
    ],
  },

  // Vendeur
  {
    element: <RequireAuth allowedRoles={['vendor']} />,
    children: [
      { path: '/vendor', element: <VendorHomeContainer /> },
      { path: '/vendor/orders/:orderId', element: <VendorOrderDetailContainer /> },
      { path: '/vendor/notifications', element: <NotificationsContainer /> },
    ],
  },

  // Agence
  {
    element: <RequireAuth allowedRoles={['agency']} />,
    children: [
      { path: '/agency', element: <AgencyDashboardContainer /> },
      { path: '/agency/notifications', element: <NotificationsContainer /> },
    ],
  },

  // Livreur
  {
    element: <RequireAuth allowedRoles={['driver']} />,
    children: [
      { path: '/driver', element: <DriverHomeContainer /> },
      { path: '/driver/notifications', element: <NotificationsContainer /> },
    ],
  },
])
