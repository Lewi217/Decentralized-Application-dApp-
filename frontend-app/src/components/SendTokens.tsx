import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { MYTOKEN_CONTRACT_ADDRESS, MYTOKEN_ABI } from '../constants';

const SendTokens: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const { address } = useAccount();

  // Wagmi hook to prepare and send a write transaction
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  // Wagmi hook to wait for the transaction to be confirmed on the blockchain
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash });

  const handleSend = async () => {
    if (!recipient || !amount || !address) {
      alert('Please enter recipient address and amount.');
      return;
    }

    try {
      // Convert human-readable amount to raw token units (with 18 decimals)
      const amountWei = parseUnits(amount, 18);
      
      writeContract({
        address: MYTOKEN_CONTRACT_ADDRESS,
        abi: MYTOKEN_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountWei],
      });
      
    } catch (e) {
      console.error("Error preparing transaction:", e);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Send LWC</h3>
      <input
        type="text"
        placeholder="Recipient Address (0x...)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (LWC)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="any"
      />
      <button 
        onClick={handleSend} 
        disabled={isPending || isConfirming || !address || !recipient || !amount}
      >
        {(isPending || isConfirming) ? 'Sending...' : 'Send Tokens'}
      </button>

      {hash && <p className="info-text">Transaction Hash: {hash}</p>}
      {isConfirmed && <p className="success-message">Transaction confirmed!</p>}
      {writeError && <p className="error-message">Error sending transaction: {writeError.message}</p>}
      {confirmError && <p className="error-message">Error confirming transaction: {confirmError.message}</p>}
    </div>
  );
};

export default SendTokens;