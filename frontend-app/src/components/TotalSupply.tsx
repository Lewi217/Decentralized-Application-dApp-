import React from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MYTOKEN_CONTRACT_ADDRESS, MYTOKEN_ABI } from '../constants';

const TotalSupply: React.FC = () => {
  // Read the total supply from the contract
  const { data: totalSupply, isLoading, isError } = useReadContract({
    address: MYTOKEN_CONTRACT_ADDRESS,
    abi: MYTOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const formattedSupply = totalSupply ? formatUnits(totalSupply as bigint, 18) : '0';

  if (isLoading) return <p>Loading total supply...</p>;
  if (isError) return <p className="error-message">Error loading total supply.</p>;

  return (
    <div>
      <h3>Current Total Supply</h3>
      <p style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{formattedSupply} LWC</p>
    </div>
  );
};

export default TotalSupply;