/**
 * CT Draft Contract Hooks
 * Wagmi hooks for interacting with the Draft contract
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import CTDraftABI from '../abis/CTDraft.json';
import { getContractAddresses } from '../addresses';
import { useChainId } from 'wagmi';

export function useCTDraft() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Set Team
  const setTeam = async (influencerIds: bigint[]) => {
    return writeContract({
      address: addresses.ctDraft,
      abi: CTDraftABI,
      functionName: 'setTeam',
      args: [influencerIds],
    });
  };

  return {
    setTeam,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Read Hooks

export function useGetTeam(player: `0x${string}` | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'getTeam',
    args: [player!],
    query: {
      enabled: !!player,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useGetTeamInfluencers(player: `0x${string}` | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'getTeamInfluencers',
    args: [player!],
    query: {
      enabled: !!player,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useHasTeam(player: `0x${string}` | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'hasTeam',
    args: [player!],
    query: {
      enabled: !!player,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useGetAllPlayers(offset: number = 0, limit: number = 100) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'getAllPlayers',
    args: [BigInt(offset), BigInt(limit)],
  });
}

export function useGetPlayerCount() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'getPlayerCount',
  });
}

export function useDraftConstants() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const teamSizeResult = useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'TEAM_SIZE',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  const maxInfluencerIdResult = useReadContract({
    address: addresses.ctDraft,
    abi: CTDraftABI,
    functionName: 'MAX_INFLUENCER_ID',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    teamSize: teamSizeResult.data,
    maxInfluencerId: maxInfluencerIdResult.data,
    isLoading: teamSizeResult.isLoading || maxInfluencerIdResult.isLoading,
    isError: teamSizeResult.isError || maxInfluencerIdResult.isError,
    error: teamSizeResult.error || maxInfluencerIdResult.error,
  };
}
