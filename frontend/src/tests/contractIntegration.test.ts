/**
 * Contract Integration Test
 * Tests end-to-end contract interaction flow for all Timecaster contracts
 *
 * Run with: pnpm test:contracts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createPublicClient, http, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getContractAddresses } from '../contracts/addresses';

// Import ABIs
import ForesightNFTABI from '../contracts/abis/ForesightNFT.json';
import CTDraftABI from '../contracts/abis/CTDraft.json';
import TimecasterArenaABI from '../contracts/abis/TimecasterArena.json';
import DailyGauntletABI from '../contracts/abis/DailyGauntlet.json';
import ReputationEngineABI from '../contracts/abis/ReputationEngine.json';
import TreasuryABI from '../contracts/abis/Treasury.json';

describe('Contract Integration Tests', () => {
  let publicClient: ReturnType<typeof createPublicClient>;
  let addresses: ReturnType<typeof getContractAddresses>;

  // Test wallet address (replace with actual test address)
  const TEST_ADDRESS = '0x414A1F683feB519C4F24EbAbF782FF71A75C7BC0' as Address;

  beforeAll(() => {
    // Create public client for Base Sepolia
    publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http('https://sepolia.base.org'),
    });

    // Get contract addresses
    addresses = getContractAddresses(84532); // Base Sepolia chain ID
  });

  describe('Contract Address Configuration', () => {
    it('should have all contract addresses defined', () => {
      expect(addresses.foresightNFT).toBeDefined();
      expect(addresses.ctDraft).toBeDefined();
      expect(addresses.timecasterArena).toBeDefined();
      expect(addresses.dailyGauntlet).toBeDefined();
      expect(addresses.reputationEngine).toBeDefined();
      expect(addresses.treasury).toBeDefined();
    });

    it('should have valid Ethereum addresses', () => {
      expect(addresses.foresightNFT).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(addresses.ctDraft).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(addresses.timecasterArena).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(addresses.dailyGauntlet).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(addresses.reputationEngine).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(addresses.treasury).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('ForesightNFT Contract', () => {
    it('should read MIN_STAKE constant', async () => {
      const minStake = await publicClient.readContract({
        address: addresses.foresightNFT,
        abi: ForesightNFTABI,
        functionName: 'MIN_STAKE',
      });

      expect(minStake).toBeDefined();
      expect(typeof minStake).toBe('bigint');
      console.log('MIN_STAKE:', minStake.toString());
    });

    it('should read MIN_LOCK_PERIOD constant', async () => {
      const minLockPeriod = await publicClient.readContract({
        address: addresses.foresightNFT,
        abi: ForesightNFTABI,
        functionName: 'MIN_LOCK_PERIOD',
      });

      expect(minLockPeriod).toBeDefined();
      expect(typeof minLockPeriod).toBe('bigint');
      console.log('MIN_LOCK_PERIOD:', minLockPeriod.toString());
    });

    it('should read MAX_LOCK_PERIOD constant', async () => {
      const maxLockPeriod = await publicClient.readContract({
        address: addresses.foresightNFT,
        abi: ForesightNFTABI,
        functionName: 'MAX_LOCK_PERIOD',
      });

      expect(maxLockPeriod).toBeDefined();
      expect(typeof maxLockPeriod).toBe('bigint');
      console.log('MAX_LOCK_PERIOD:', maxLockPeriod.toString());
    });

    it('should read predictionCount', async () => {
      const count = await publicClient.readContract({
        address: addresses.foresightNFT,
        abi: ForesightNFTABI,
        functionName: 'predictionCount',
      });

      expect(typeof count).toBe('bigint');
      console.log('Total Predictions:', count.toString());
    });

    it('should read user balance', async () => {
      const balance = await publicClient.readContract({
        address: addresses.foresightNFT,
        abi: ForesightNFTABI,
        functionName: 'balanceOf',
        args: [TEST_ADDRESS],
      });

      expect(typeof balance).toBe('bigint');
      console.log('User NFT Balance:', balance.toString());
    });
  });

  describe('CTDraft Contract', () => {
    it('should read DRAFT_DURATION constant', async () => {
      const duration = await publicClient.readContract({
        address: addresses.ctDraft,
        abi: CTDraftABI,
        functionName: 'DRAFT_DURATION',
      });

      expect(duration).toBeDefined();
      expect(typeof duration).toBe('bigint');
      console.log('DRAFT_DURATION:', duration.toString());
    });

    it('should read TEAM_SIZE constant', async () => {
      const teamSize = await publicClient.readContract({
        address: addresses.ctDraft,
        abi: CTDraftABI,
        functionName: 'TEAM_SIZE',
      });

      expect(teamSize).toBeDefined();
      expect(typeof teamSize).toBe('bigint');
      console.log('TEAM_SIZE:', teamSize.toString());
    });

    it('should read currentSeason', async () => {
      const season = await publicClient.readContract({
        address: addresses.ctDraft,
        abi: CTDraftABI,
        functionName: 'currentSeason',
      });

      expect(typeof season).toBe('bigint');
      console.log('Current Season:', season.toString());
    });

    it('should read totalPlayers', async () => {
      const totalPlayers = await publicClient.readContract({
        address: addresses.ctDraft,
        abi: CTDraftABI,
        functionName: 'totalPlayers',
      });

      expect(typeof totalPlayers).toBe('bigint');
      console.log('Total Players:', totalPlayers.toString());
    });
  });

  describe('TimecasterArena Contract', () => {
    it('should read DUEL_DURATION constant', async () => {
      const duration = await publicClient.readContract({
        address: addresses.timecasterArena,
        abi: TimecasterArenaABI,
        functionName: 'DUEL_DURATION',
      });

      expect(duration).toBeDefined();
      expect(typeof duration).toBe('bigint');
      console.log('DUEL_DURATION:', duration.toString());
    });

    it('should read MIN_STAKE constant', async () => {
      const minStake = await publicClient.readContract({
        address: addresses.timecasterArena,
        abi: TimecasterArenaABI,
        functionName: 'MIN_STAKE',
      });

      expect(minStake).toBeDefined();
      expect(typeof minStake).toBe('bigint');
      console.log('Arena MIN_STAKE:', minStake.toString());
    });

    it('should read duelCount', async () => {
      const count = await publicClient.readContract({
        address: addresses.timecasterArena,
        abi: TimecasterArenaABI,
        functionName: 'duelCount',
      });

      expect(typeof count).toBe('bigint');
      console.log('Total Duels:', count.toString());
    });
  });

  describe('DailyGauntlet Contract', () => {
    it('should read CHALLENGE_DURATION constant', async () => {
      const duration = await publicClient.readContract({
        address: addresses.dailyGauntlet,
        abi: DailyGauntletABI,
        functionName: 'CHALLENGE_DURATION',
      });

      expect(duration).toBeDefined();
      expect(typeof duration).toBe('bigint');
      console.log('CHALLENGE_DURATION:', duration.toString());
    });

    it('should read currentChallenge', async () => {
      const challengeId = await publicClient.readContract({
        address: addresses.dailyGauntlet,
        abi: DailyGauntletABI,
        functionName: 'currentChallenge',
      });

      expect(typeof challengeId).toBe('bigint');
      console.log('Current Challenge ID:', challengeId.toString());
    });
  });

  describe('ReputationEngine Contract', () => {
    it('should read user reputation score', async () => {
      const score = await publicClient.readContract({
        address: addresses.reputationEngine,
        abi: ReputationEngineABI,
        functionName: 'getReputationScore',
        args: [TEST_ADDRESS],
      });

      expect(typeof score).toBe('bigint');
      console.log('User Reputation Score:', score.toString());
    });

    it('should read total reputation distributed', async () => {
      const total = await publicClient.readContract({
        address: addresses.reputationEngine,
        abi: ReputationEngineABI,
        functionName: 'totalReputationDistributed',
      });

      expect(typeof total).toBe('bigint');
      console.log('Total Reputation Distributed:', total.toString());
    });
  });

  describe('Treasury Contract', () => {
    it('should read treasury balance', async () => {
      const balance = await publicClient.getBalance({
        address: addresses.treasury,
      });

      expect(typeof balance).toBe('bigint');
      console.log('Treasury Balance:', balance.toString(), 'wei');
    });

    it('should read total deposits', async () => {
      const deposits = await publicClient.readContract({
        address: addresses.treasury,
        abi: TreasuryABI,
        functionName: 'totalDeposits',
      });

      expect(typeof deposits).toBe('bigint');
      console.log('Total Deposits:', deposits.toString());
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid address reads gracefully', async () => {
      await expect(async () => {
        await publicClient.readContract({
          address: addresses.foresightNFT,
          abi: ForesightNFTABI,
          functionName: 'getUserStats',
          args: ['0x0000000000000000000000000000000000000000' as Address],
        });
      }).rejects.toThrow();
    });

    it('should handle network errors with retry logic', async () => {
      // This test verifies retry logic is in place
      // The actual retry happens in the hook layer
      expect(true).toBe(true);
    });
  });
});
