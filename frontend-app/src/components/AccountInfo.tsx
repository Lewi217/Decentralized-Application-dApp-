// frontend-app/src/components/AccountInfo.tsx
import React from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MYTOKEN_CONTRACT_ADDRESS, MYTOKEN_ABI } from '../constants';

interface AccountInfoProps {
  address: `0x${string}`;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ address }) => {
  // Read the balance of the connected account
  const { data: balance, isLoading, isError } = useReadContract({
    address: MYTOKEN_CONTRACT_ADDRESS,
    abi: MYTOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const formattedBalance = balance ? formatUnits(balance as bigint, 18) : '0';

  // Shorten address for display
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (isLoading) return <p>Loading balance...</p>;
  if (isError) return <p className="error-message">Error loading balance.</p>;

  return (
    <div>
      <h3>Your LWC Balance</h3>
      <p style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{formattedBalance} LWC</p>
      <p className="info-text">Wallet Address: {shortAddress}</p>
    </div>
  );
};

export default AccountInfo;