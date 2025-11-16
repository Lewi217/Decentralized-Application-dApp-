import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { MYTOKEN_CONTRACT_ADDRESS, MYTOKEN_ABI } from '../constants';

const MintTokens: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const { address } = useAccount();

  // Read the contract owner to check if the connected user is the owner
  const { data: ownerAddress, isLoading: isOwnerLoading } = useReadContract({
    address: MYTOKEN_CONTRACT_ADDRESS,
    abi: MYTOKEN_ABI,
    functionName: 'owner',
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const isOwner = address && ownerAddress && address === (ownerAddress as `0x${string}`);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash });

  const handleMint = async () => {
    if (!recipient || !amount || !isOwner) {
      alert('Only the contract owner can mint tokens, and fields must be filled.');
      return;
    }

    try {
      const amountWei = parseUnits(amount, 18);
      
      writeContract({
        address: MYTOKEN_CONTRACT_ADDRESS,
        abi: MYTOKEN_ABI,
        functionName: 'mint',
        args: [recipient as `0x${string}`, amountWei],
      });

    } catch (e) {
      console.error("Error preparing mint transaction:", e);
    }
  };

  const displayOwnerAddress = ownerAddress 
    ? `${(ownerAddress as string).slice(0, 6)}...${(ownerAddress as string).slice(-4)}`
    : 'N/A';

  return (
    <div style={{ borderTop: '1px solid #333', paddingTop: '2rem', marginTop: '2rem' }}>
      <h3>Mint New Tokens (Owner Only)</h3>
      {isOwnerLoading ? (
        <p>Checking owner status...</p>
      ) : isOwner ? (
        <>
          <input
            type="text"
            placeholder="Recipient Address (0x...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount to Mint (LWC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
          />
          <button 
            onClick={handleMint} 
            disabled={isPending || isConfirming || !recipient || !amount}
            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
          >
            {(isPending || isConfirming) ? 'Minting...' : 'Mint Tokens'}
          </button>

          {hash && <p className="info-text">Mint Transaction Hash: {hash}</p>}
          {isConfirmed && <p className="success-message">Minting confirmed!</p>}
          {writeError && <p className="error-message">Error minting: {writeError.message}</p>}
          {confirmError && <p className="error-message">Error confirming mint: {confirmError.message}</p>}
        </>
      ) : (
        <p className="info-text" style={{ color: '#ff6b6b' }}>
          🔒 Only accessible by contract owner. Current user is not the owner ({displayOwnerAddress})
        </p>
      )}
    </div>
  );
};

export default MintTokens;