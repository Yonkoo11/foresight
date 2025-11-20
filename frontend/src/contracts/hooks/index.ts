/**
 * Contract Hooks Index
 * Export all contract interaction hooks
 */

export {
  useTimecasterArena,
  useGetDuel,
  useHasVoted,
  useGetVotes,
  useArenaConstants,
} from './useTimecasterArena';

export {
  useCTDraft,
  useGetTeam,
  useGetTeamInfluencers,
  useHasTeam,
  useGetAllPlayers,
  useGetPlayerCount,
  useDraftConstants,
} from './useCTDraft';

export {
  useDailyGauntlet,
  useGetGauntlet,
  useGetPrediction,
  useGetEntry,
  useGetParticipants,
  useCurrentDay,
  useGauntletConstants,
} from './useDailyGauntlet';

export {
  useHasForesightNFT,
  useGetUserTokenId,
  useGetTokenURI,
  useGetReputationEngine,
  useGetUserReputation,
  useGetCTMasteryScore,
} from './useForesightNFT';
