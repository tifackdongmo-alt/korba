import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthContainer } from '@/containers/AuthContainer'
import { ClientHomeContainer } from '@/containers/ClientHomeContainer'
import { ClientCatalogueContainer } from '@/containers/ClientCatalogueContainer'
import { ClientProductDetailContainer } from '@/containers/ClientProductDetailContainer'
import { ClientPaymentChoiceContainer } from '@/containers/ClientPaymentChoiceContainer'
import { ClientCheckoutContainer } from '@/containers/ClientCheckoutContainer'
import { ClientOrdersContainer } from '@/containers/ClientOrdersContainer'
import { ClientTrackingContainer } from '@/containers/ClientTrackingContainer'
import { ClientEscrowListContainer } from '@/containers/ClientEscrowListContainer'
import { ClientEscrowDetailContainer } from '@/containers/ClientEscrowDetailContainer'
import { DisputeContainer } from '@/containers/DisputeContainer'
import { DisputeDetailContainer } from '@/containers/DisputeDetailContainer'
import { MessagingContainer } from '@/containers/MessagingContainer'
import { MessagesInboxContainer } from '@/containers/MessagesInboxContainer'
import { ContactProfileContainer } from '@/containers/ContactProfileContainer'
import { SignupContainer } from '@/containers/SignupContainer'
import { VendorHomeContainer } from '@/containers/VendorHomeContainer'
import { VendorOrderDetailContainer } from '@/containers/VendorOrderDetailContainer'
import { VendorCatalogueContainer } from '@/containers/VendorCatalogueContainer'
import { VendorPartnersContainer } from '@/containers/VendorPartnersContainer'
import { AgencyDashboardContainer } from '@/containers/AgencyDashboardContainer'
import { AgencyTeamZonesContainer } from '@/containers/AgencyTeamZonesContainer'
import { AgencyDeliveryHistoryContainer } from '@/containers/AgencyDeliveryHistoryContainer'
import { AgencyDriversContainer } from '@/containers/AgencyDriversContainer'
import { AgencyRatingsContainer } from '@/containers/AgencyRatingsContainer'
import { AgencyRevenueContainer } from '@/containers/AgencyRevenueContainer'
import { DriverHomeContainer } from '@/containers/DriverHomeContainer'
import { DriverNavigationContainer } from '@/containers/DriverNavigationContainer'
import { DriverProofContainer } from '@/containers/DriverProofContainer'
import { DriverHistoryContainer } from '@/containers/DriverHistoryContainer'
import { DriverEarningsContainer } from '@/containers/DriverEarningsContainer'
import { NotificationsContainer } from '@/containers/NotificationsContainer'
import { ProfileContainer } from '@/containers/ProfileContainer'

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
  { path: '/signup/:role', element: <SignupContainer /> },

  // Client
  {
    element: <RequireAuth allowedRoles={['client']} />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: '/client', element: <ClientHomeContainer /> },
        { path: '/client/catalogue', element: <ClientCatalogueContainer /> },
        { path: '/client/products/:productId', element: <ClientProductDetailContainer /> },
        { path: '/client/payment-choice/:productId', element: <ClientPaymentChoiceContainer /> },
        { path: '/client/checkout', element: <ClientCheckoutContainer /> },
        { path: '/client/orders', element: <ClientOrdersContainer /> },
        { path: '/client/orders/:orderId/tracking', element: <ClientTrackingContainer /> },
        { path: '/client/orders/:orderId/dispute', element: <DisputeContainer /> },
        { path: '/client/orders/:orderId/messaging', element: <MessagingContainer /> },
        { path: '/client/escrow', element: <ClientEscrowListContainer /> },
        { path: '/client/escrow/:escrowId', element: <ClientEscrowDetailContainer /> },
        { path: '/client/messages', element: <MessagesInboxContainer /> },
        { path: '/client/messages/:conversationId', element: <MessagingContainer /> },
        { path: '/client/contacts/:contactId', element: <ContactProfileContainer /> },
        { path: '/client/disputes', element: <MessagesInboxContainer /> },
        { path: '/client/disputes/:disputeId', element: <DisputeDetailContainer /> },
        { path: '/client/notifications', element: <NotificationsContainer /> },
        { path: '/client/profile', element: <ProfileContainer /> },
      ],
    }],
  },

  // Vendeur
  {
    element: <RequireAuth allowedRoles={['vendor']} />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: '/vendor', element: <VendorHomeContainer /> },
        { path: '/vendor/catalogue', element: <VendorCatalogueContainer /> },
        { path: '/vendor/orders/:orderId', element: <VendorOrderDetailContainer /> },
        { path: '/vendor/partners', element: <VendorPartnersContainer /> },
        { path: '/vendor/messages', element: <MessagesInboxContainer /> },
        { path: '/vendor/messages/:conversationId', element: <MessagingContainer /> },
        { path: '/vendor/contacts/:contactId', element: <ContactProfileContainer /> },
        { path: '/vendor/disputes/:disputeId', element: <DisputeDetailContainer /> },
        { path: '/vendor/notifications', element: <NotificationsContainer /> },
        { path: '/vendor/profile', element: <ProfileContainer /> },
      ],
    }],
  },

  // Agence
  {
    element: <RequireAuth allowedRoles={['agency']} />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: '/agency', element: <AgencyDashboardContainer /> },
        { path: '/agency/team', element: <AgencyTeamZonesContainer /> },
        { path: '/agency/deliveries', element: <AgencyDeliveryHistoryContainer /> },
        { path: '/agency/drivers', element: <AgencyDriversContainer /> },
        { path: '/agency/ratings', element: <AgencyRatingsContainer /> },
        { path: '/agency/revenue', element: <AgencyRevenueContainer /> },
        { path: '/agency/messages', element: <MessagesInboxContainer /> },
        { path: '/agency/messages/:conversationId', element: <MessagingContainer /> },
        { path: '/agency/contacts/:contactId', element: <ContactProfileContainer /> },
        { path: '/agency/disputes/:disputeId', element: <DisputeDetailContainer /> },
        { path: '/agency/notifications', element: <NotificationsContainer /> },
        { path: '/agency/profile', element: <ProfileContainer /> },
      ],
    }],
  },

  // Livreur
  {
    element: <RequireAuth allowedRoles={['driver']} />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: '/driver', element: <DriverHomeContainer /> },
        { path: '/driver/orders/:orderId/navigation', element: <DriverNavigationContainer /> },
        { path: '/driver/orders/:orderId/proof', element: <DriverProofContainer /> },
        { path: '/driver/history', element: <DriverHistoryContainer /> },
        { path: '/driver/earnings', element: <DriverEarningsContainer /> },
        { path: '/driver/messages', element: <MessagesInboxContainer /> },
        { path: '/driver/messages/:conversationId', element: <MessagingContainer /> },
        { path: '/driver/contacts/:contactId', element: <ContactProfileContainer /> },
        { path: '/driver/disputes/:disputeId', element: <DisputeDetailContainer /> },
        { path: '/driver/notifications', element: <NotificationsContainer /> },
        { path: '/driver/profile', element: <ProfileContainer /> },
      ],
    }],
  },
])
