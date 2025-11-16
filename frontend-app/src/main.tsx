// frontend-app/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Import our global styles // Import our global styles

// Wagmi & Viem setup
import { WagmiProvider, createConfig, http } from 'wagmi';
import { hardhat } from 'wagmi/chains'; // Use hardhat chain
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure Wagmi
const config = createConfig({
  chains: [hardhat], // Connect to our local hardhat network
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'), // Hardhat's default RPC URL
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);