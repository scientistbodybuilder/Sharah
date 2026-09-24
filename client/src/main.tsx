import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context.tsx'

const queryClient = new QueryClient()
queryClient.setQueryDefaults(['analysis'], { gcTime: Infinity })
const persister = createAsyncStoragePersister({
    storage: window.sessionStorage,
})
persistQueryClient({
    queryClient,
    persister,
    maxAge: Infinity
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </UserProvider>
    
  </StrictMode>,
)
