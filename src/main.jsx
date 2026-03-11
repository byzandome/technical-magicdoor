import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { WagmiProvider } from 'wagmi'
import { getConfig } from '../wagmi.config.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
