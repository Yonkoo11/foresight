import { useQuery } from '@tanstack/react-query';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SOLANA_RPC_URL } from '../constants/api';

export function useSolBalance(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['sol-balance', walletAddress],
    queryFn: async (): Promise<number> => {
      if (!walletAddress) return 0;
      try {
        const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
        const pubkey = new PublicKey(walletAddress);
        const lamports = await connection.getBalance(pubkey);
        return lamports / LAMPORTS_PER_SOL;
      } catch {
        return 0;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30000,
    retry: 2,
  });
}
