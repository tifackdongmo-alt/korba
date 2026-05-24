import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import './styles/tokens.css'
import './index.css'

// On page load, clear demo sessions so the user re-selects a role each time
try {
  const raw = localStorage.getItem('korba-auth')
  if (raw) {
    const parsed = JSON.parse(raw)
    if (parsed?.state?.isDemo) {
      localStorage.removeItem('korba-auth')
    }
  }
} catch { /* ignore */ }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
    mutations: { retry: 0 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
