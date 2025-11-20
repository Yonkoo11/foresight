/**
 * Timecaster Arena Contract Hooks
 * Wagmi hooks for interacting with the Arena contract
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import TimecasterArenaABI from '../abis/TimecasterArena.json';
import { getContractAddresses } from '../addresses';
import { useChainId } from 'wagmi';

export function useTimecasterArena() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  // Write functions
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Create Price Duel
  const createPriceDuel = async (
    question: string,
    oracleKey: string,
    creatorPosition: boolean,
    stake: string
  ) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'createPriceDuel',
      args: [question, oracleKey, creatorPosition],
      value: parseEther(stake),
    });
  };

  // Create Protocol Duel
  const createProtocolDuel = async (
    question: string,
    oracleKey: string,
    targetValue: bigint,
    isAbove: boolean,
    stake: string
  ) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'createProtocolDuel',
      args: [question, oracleKey, targetValue, isAbove],
      value: parseEther(stake),
    });
  };

  // Create Narrative Duel
  const createNarrativeDuel = async (
    question: string,
    creatorPosition: string,
    stake: string
  ) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'createNarrativeDuel',
      args: [question, creatorPosition],
      value: parseEther(stake),
    });
  };

  // Accept Duel
  const acceptDuel = async (duelId: bigint, stake: string) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'acceptDuel',
      args: [duelId],
      value: parseEther(stake),
    });
  };

  // Vote on Duel
  const voteOnDuel = async (duelId: bigint, position: boolean) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'vote',
      args: [duelId, position],
      value: parseEther('0.01'), // VOTE_STAKE from contract
    });
  };

  // Cancel Duel
  const cancelDuel = async (duelId: bigint) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'cancelDuel',
      args: [duelId],
    });
  };

  // Claim Vote Reward
  const claimVoteReward = async (duelId: bigint) => {
    return writeContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'claimVoteReward',
      args: [duelId],
    });
  };

  return {
    createPriceDuel,
    createProtocolDuel,
    createNarrativeDuel,
    acceptDuel,
    voteOnDuel,
    cancelDuel,
    claimVoteReward,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Read Hooks

export function useGetDuel(duelId: bigint | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'getDuel',
    args: duelId !== undefined ? [duelId] : undefined,
    query: {
      enabled: duelId !== undefined,
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

export function useHasVoted(duelId: bigint | undefined, voter: `0x${string}` | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'hasVoted',
    args: duelId !== undefined && voter ? [duelId, voter] : undefined,
    query: {
      enabled: !!voter && duelId !== undefined,
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

export function useGetVotes(duelId: bigint | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'getVotes',
    args: duelId !== undefined ? [duelId] : undefined,
    query: {
      enabled: duelId !== undefined,
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

export function useArenaConstants() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const minVotesResult = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'MIN_VOTES',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  const voteStakeResult = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'VOTE_STAKE',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  const votingPeriodResult = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'VOTING_PERIOD',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  const acceptDeadlineResult = useReadContract({
    address: addresses.timecasterArena,
    abi: TimecasterArenaABI,
    functionName: 'ACCEPT_DEADLINE',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    minVotes: minVotesResult.data,
    voteStake: voteStakeResult.data,
    votingPeriod: votingPeriodResult.data,
    acceptDeadline: acceptDeadlineResult.data,
    isLoading: minVotesResult.isLoading || voteStakeResult.isLoading || votingPeriodResult.isLoading || acceptDeadlineResult.isLoading,
    isError: minVotesResult.isError || voteStakeResult.isError || votingPeriodResult.isError || acceptDeadlineResult.isError,
    error: minVotesResult.error || voteStakeResult.error || votingPeriodResult.error || acceptDeadlineResult.error,
  };
}
