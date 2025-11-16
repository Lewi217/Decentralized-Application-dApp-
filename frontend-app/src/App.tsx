// frontend-app/src/App.tsx
import './App.css'; // You can keep this or remove it if not needed

// Wagmi hooks for wallet connection
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Import our custom components
import AccountInfo from './components/AccountInfo';
import SendTokens from './components/SendTokens';
import MintTokens from './components/MintTokens';
import TotalSupply from './components/TotalSupply';

function App() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div className="flex-container">
        <h1>Lewis Coin (LWC)</h1>
        <div className="status-indicator">
          {isConnecting && <p>Connecting...</p>}
          {isConnected ? (
            <>
              <span className="dot connected"></span>
              <p>Connected</p>
              <button onClick={() => disconnect()}>Disconnect</button>
            </>
          ) : (
            <>
              <span className="dot"></span>
              <p>Disconnected</p>
              <button onClick={() => connect({ connector: injected() })}>Connect Wallet</button>
            </>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="grid-container">
          {/* Account Overview Card */}
          <div className="card">
            <h2>Account Overview</h2>
            <AccountInfo address={address as `0x${string}`} />
          </div>

          {/* Quick Actions Card */}
          <div className="card">
            <h2>Quick Actions</h2>
            <SendTokens />
            <MintTokens /> {/* Owner-only functionality */}
          </div>

          {/* Total Supply Card (Bottom, spanning full width) */}
          <div className="card" style={{gridColumn: '1 / -1'}}>
            <h2>Total Tokens Minted</h2>
            <TotalSupply />
          </div>
        </div>
      )}

      {!isConnected && (
          <div className="card">
              <p>Connect your wallet to interact with Lewis Coin (LWC).</p>
          </div>
      )}
    </>
  );
}

export default App;