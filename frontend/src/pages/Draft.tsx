/**
 * CT Draft Page
 * Fantasy league where users draft 5 CT influencers
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { InfluencerCard, type Influencer } from '../components/draft/InfluencerCard';
import { TeamCard } from '../components/draft/TeamCard';
import { InfluencerModal } from '../components/draft/InfluencerModal';
import { TeamBoard } from '../components/draft/TeamBoard';
import { PrivateLeagues } from '../components/draft/PrivateLeagues';
import { useCTDraft, useHasTeam, useGetTeamInfluencers, useDraftConstants } from '../contracts/hooks';
import { getInfluencerAvatar } from '../data/influencerAvatars';
import { useNotifications } from '../contexts/NotificationContext';
import { TrendUp, Coin, Fire, SortAscending } from '@phosphor-icons/react';
import * as api from '../utils/api';

type SortOption = 'tier' | 'weekly-score' | 'price' | 'popularity' | 'alphabetical';

export default function Draft() {
  const { address } = useAccount();
  const { showSuccess, showError, showWarning } = useNotifications();
  const [tierFilter, setTierFilter] = useState<'all' | 'S' | 'A' | 'B' | 'C'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('tier');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftedTeam, setDraftedTeam] = useState<Influencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showTeamBoard, setShowTeamBoard] = useState(false);
  const [leagueType, setLeagueType] = useState<'free' | 'paid'>('free');
  const [hasEntered, setHasEntered] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [claimedWeeks, setClaimedWeeks] = useState<Set<number>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [showPrivateLeagues, setShowPrivateLeagues] = useState(false);

  // NEW: Team naming functionality
  const [teamName, setTeamName] = useState('');
  const [savedTeamData, setSavedTeamData] = useState<{
    name: string;
    influencers: Influencer[];
    timestamp: number;
  } | null>(null);

  // API state
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(true);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Contract hooks
  const {
    setTeam,
    isPending,
    isConfirming,
    isSuccess,
    error,
  } = useCTDraft();

  // Read hooks for contract state
  const { data: hasTeam, refetch: refetchHasTeam } = useHasTeam(address);
  const { data: teamInfluencers, refetch: refetchTeamInfluencers } = useGetTeamInfluencers(address);
  const { teamSize, maxInfluencerId } = useDraftConstants();

  // Show transaction status and refetch contract data
  useEffect(() => {
    if (isSuccess) {
      showSuccess(`Team "${teamName}" Created!`, 'Your team has been submitted to the blockchain!');

      // Refetch contract state
      refetchHasTeam();
      refetchTeamInfluencers();

      // Save team name and data to localStorage (convert BigInt to string)
      if (address && teamName && draftedTeam.length > 0) {
        const teamData = {
          name: teamName,
          influencers: draftedTeam.map(inf => ({
            ...inf,
            id: inf.id.toString(),
            weeklyScore: inf.weeklyScore.toString(),
            totalDrafts: inf.totalDrafts.toString(),
            price: inf.price.toString(),
          })),
          timestamp: Date.now(),
        };
        localStorage.setItem(`ctdraft_team_${address}`, JSON.stringify(teamData));
        // Convert back to BigInt for state
        setSavedTeamData({
          name: teamName,
          influencers: draftedTeam,
          timestamp: Date.now(),
        });
      }
    }
  }, [isSuccess, showSuccess, teamName, address, draftedTeam, refetchHasTeam, refetchTeamInfluencers]);

  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
    }
  }, [error]);

  // Load saved team name and data from localStorage
  useEffect(() => {
    if (address) {
      const savedData = localStorage.getItem(`ctdraft_team_${address}`);
      if (savedData) {
        try {
          const teamData = JSON.parse(savedData);
          setTeamName(teamData.name || '');

          // Convert string values back to BigInt
          const convertedData = {
            ...teamData,
            influencers: teamData.influencers.map((inf: any) => ({
              ...inf,
              id: BigInt(inf.id),
              weeklyScore: BigInt(inf.weeklyScore),
              totalDrafts: BigInt(inf.totalDrafts),
              price: BigInt(inf.price),
            }))
          };
          setSavedTeamData(convertedData);
        } catch (e) {
          console.error('Error loading saved team:', e);
        }
      }
    }
  }, [address]);

  // Fetch influencers from backend
  useEffect(() => {
    async function fetchInfluencers() {
      try {
        setIsLoadingInfluencers(true);
        setApiError(null);
        const response = await api.getInfluencers();

        // Transform backend data to frontend format
        const transformedInfluencers: Influencer[] = response.influencers.map((inf: any) => ({
          id: BigInt(inf.id),
          name: inf.name,
          handle: inf.handle,
          avatar: getInfluencerAvatar(inf.handle),
          bio: `${inf.tier}-Tier CT influencer with ${inf.follower_count?.toLocaleString() || '0'} followers`,
          tier: inf.tier,
          weeklyScore: BigInt(Math.floor(Math.random() * 1000)), // TODO: Replace with real score from backend
          totalDrafts: BigInt(Math.floor(Math.random() * 300)), // TODO: Replace with real data from backend
          price: BigInt(inf.base_price),
        }));

        setInfluencers(transformedInfluencers);
      } catch (error: any) {
        console.error('Error fetching influencers:', error);
        setApiError(error.message || 'Failed to load influencers');
        showError('Failed to Load Influencers', 'Could not connect to the backend. Using fallback data.');

        // Keep mock data as fallback
        setInfluencers(mockInfluencers);
      } finally {
        setIsLoadingInfluencers(false);
      }
    }

    fetchInfluencers();
  }, [showError]);

  // Fetch user's saved team from backend
  useEffect(() => {
    async function fetchUserTeam() {
      if (!address || influencers.length === 0) return;

      try {
        setIsLoadingTeam(true);
        const response = await api.getUserTeam(address);

        if (response.team) {
          // User has a saved team - reconstruct it
          const teamInfluencers: Influencer[] = response.team.influencerIds
            .map((id: number) => influencers.find(inf => Number(inf.id) === id))
            .filter(Boolean) as Influencer[];

          if (teamInfluencers.length > 0) {
            setDraftedTeam(teamInfluencers);
            setTeamName(response.team.teamName || '');
            setHasEntered(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching user team:', error);
        // Don't show error to user - it's fine if they don't have a team yet
      } finally {
        setIsLoadingTeam(false);
      }
    }

    fetchUserTeam();
  }, [address, influencers]);

  // TODO: Replace with contract reads

  // Calculate dynamic price based on performance
  const calculateDynamicPrice = (tier: string, weeklyScore: bigint): bigint => {
    const score = Number(weeklyScore);
    let basePrice: number;
    let multiplier: number;

    switch (tier) {
      case 'S':
        basePrice = 45;
        multiplier = 0.05;
        break;
      case 'A':
        basePrice = 35;
        multiplier = 0.04;
        break;
      case 'B':
        basePrice = 25;
        multiplier = 0.03;
        break;
      case 'C':
        basePrice = 15;
        multiplier = 0.025;
        break;
      default:
        basePrice = 20;
        multiplier = 0.03;
    }

    // Price = basePrice + (weeklyScore * multiplier)
    const dynamicPrice = Math.floor(basePrice + (score * multiplier));
    return BigInt(Math.min(dynamicPrice, 100)); // Cap at 100 points
  };

  // Top 50 crypto twitter influencers
  const mockInfluencersRaw: Omit<Influencer, 'price'>[] = [
    // S-Tier (>1M followers)
    { id: 1n, name: 'CZ', handle: 'cz_binance', avatar: getInfluencerAvatar('cz_binance'), bio: 'Former CEO of Binance. Building the future of crypto.', tier: 'S', weeklyScore: 995n, totalDrafts: 289n },
    { id: 2n, name: 'Vitalik Buterin', handle: 'VitalikButerin', avatar: getInfluencerAvatar('VitalikButerin'), bio: 'Founder of Ethereum. Proof of Stake advocate. Building decentralized systems.', tier: 'S', weeklyScore: 985n, totalDrafts: 267n },
    { id: 3n, name: 'Anthony Pompliano', handle: 'APompliano', avatar: getInfluencerAvatar('APompliano'), bio: 'Bitcoin maximalist. Investor. Host of The Pomp Podcast. Building the future.', tier: 'S', weeklyScore: 950n, totalDrafts: 245n },
    { id: 4n, name: 'Cobie', handle: 'cobie', avatar: getInfluencerAvatar('cobie'), bio: 'Crypto trader and investor. Sharing market insights and alpha.', tier: 'S', weeklyScore: 940n, totalDrafts: 234n },
    { id: 5n, name: 'Balaji Srinivasan', handle: 'balajis', avatar: getInfluencerAvatar('balajis'), bio: 'Former CTO of Coinbase. Angel investor. Network State advocate.', tier: 'S', weeklyScore: 930n, totalDrafts: 223n },
    { id: 6n, name: 'Willy Woo', handle: 'woonomic', avatar: getInfluencerAvatar('woonomic'), bio: 'On-chain analyst. Creator of Woobull charts. Bitcoin investor.', tier: 'S', weeklyScore: 920n, totalDrafts: 212n },
    { id: 7n, name: 'Crypto Cobain', handle: 'CryptoCobain', avatar: getInfluencerAvatar('CryptoCobain'), bio: 'Crypto trader. Market commentary. Not financial advice.', tier: 'S', weeklyScore: 910n, totalDrafts: 201n },

    // A-Tier (400K-1M followers)
    { id: 8n, name: 'Andreas Antonopoulos', handle: 'aantonop', avatar: getInfluencerAvatar('aantonop'), bio: 'Bitcoin educator and author. Mastering Bitcoin. Open blockchain advocate.', tier: 'A', weeklyScore: 880n, totalDrafts: 189n },
    { id: 9n, name: 'Peter Brandt', handle: 'PeterLBrandt', avatar: getInfluencerAvatar('PeterLBrandt'), bio: 'Legendary trader with 45+ years experience. Classical charting expert.', tier: 'A', weeklyScore: 870n, totalDrafts: 178n },
    { id: 10n, name: 'icobeast', handle: 'icobeast', avatar: getInfluencerAvatar('icobeast'), bio: 'Crypto analyst and trader. Sharing market insights and trading strategies.', tier: 'A', weeklyScore: 860n, totalDrafts: 167n },
    { id: 11n, name: 'Il Capo', handle: 'CryptoCapo_', avatar: getInfluencerAvatar('CryptoCapo_'), bio: 'Crypto trader and technical analyst. Chart patterns and market cycles.', tier: 'A', weeklyScore: 850n, totalDrafts: 156n },
    { id: 12n, name: 'The Crypto Dog', handle: 'TheCryptoDog', avatar: getInfluencerAvatar('TheCryptoDog'), bio: 'Crypto trader. Technical analysis. Market commentary and memes.', tier: 'A', weeklyScore: 840n, totalDrafts: 145n },
    { id: 13n, name: 'Pentoshi', handle: 'Pentosh1', avatar: getInfluencerAvatar('Pentosh1'), bio: 'Crypto trader and investor. Sharing market analysis and trading ideas.', tier: 'A', weeklyScore: 830n, totalDrafts: 134n },
    { id: 14n, name: 'DonAlt', handle: 'CryptoDonAlt', avatar: getInfluencerAvatar('CryptoDonAlt'), bio: 'Full-time crypto trader. Technical analysis and market insights.', tier: 'A', weeklyScore: 820n, totalDrafts: 123n },
    { id: 15n, name: 'Mert Mumtaz', handle: '0xMert_', avatar: getInfluencerAvatar('0xMert_'), bio: 'CEO of Helius. Building Solana infrastructure. Developer advocate.', tier: 'A', weeklyScore: 810n, totalDrafts: 112n },
    { id: 16n, name: 'Kaleo', handle: 'CryptoKaleo', avatar: getInfluencerAvatar('CryptoKaleo'), bio: 'Crypto trader. Technical analysis and market trends.', tier: 'A', weeklyScore: 800n, totalDrafts: 101n },
    { id: 17n, name: 'Crypto Birb', handle: 'CryptoBirb', avatar: getInfluencerAvatar('CryptoBirb'), bio: 'Crypto analyst. Market research and trading insights.', tier: 'A', weeklyScore: 790n, totalDrafts: 95n },
    { id: 18n, name: 'Tradermayne', handle: 'Tradermayne', avatar: getInfluencerAvatar('Tradermayne'), bio: 'Professional crypto trader. Sharing strategies and market analysis.', tier: 'A', weeklyScore: 780n, totalDrafts: 89n },
    { id: 19n, name: 'Crypto Ed', handle: 'CryptoEd_NL', avatar: getInfluencerAvatar('CryptoEd_NL'), bio: 'Crypto trader and educator. Technical analysis and trading psychology.', tier: 'A', weeklyScore: 770n, totalDrafts: 83n },

    // B-Tier (150K-400K followers)
    { id: 20n, name: 'Thread Guy', handle: 'notthreadguy', avatar: getInfluencerAvatar('notthreadguy'), bio: 'Educational crypto threads. Breaking down complex topics simply.', tier: 'B', weeklyScore: 750n, totalDrafts: 77n },
    { id: 21n, name: 'Mich', handle: 'CryptoMichNL', avatar: getInfluencerAvatar('CryptoMichNL'), bio: 'Crypto trader from Netherlands. Sharing market insights and analysis.', tier: 'B', weeklyScore: 740n, totalDrafts: 71n },
    { id: 22n, name: 'Wale', handle: 'waleswoosh', avatar: getInfluencerAvatar('waleswoosh'), bio: 'NFT collector and crypto investor. Tracking whale wallets and trends.', tier: 'B', weeklyScore: 730n, totalDrafts: 67n },
    { id: 23n, name: 'Crypto Nerd', handle: 'CryptoNerd', avatar: getInfluencerAvatar('CryptoNerd'), bio: 'Deep dives into crypto projects. Research and analysis.', tier: 'B', weeklyScore: 720n, totalDrafts: 63n },
    { id: 24n, name: 'Tony', handle: 'CryptoTony__', avatar: getInfluencerAvatar('CryptoTony__'), bio: 'Day trader and investor. Sharing real-time market updates.', tier: 'B', weeklyScore: 710n, totalDrafts: 59n },
    { id: 25n, name: 'Wizard of Soho', handle: 'wizardofsoho', avatar: getInfluencerAvatar('wizardofsoho'), bio: 'Crypto analyst. Market commentary and trading perspectives.', tier: 'B', weeklyScore: 700n, totalDrafts: 55n },
    { id: 26n, name: 'Bluntz', handle: 'Bluntz_Capital', avatar: getInfluencerAvatar('Bluntz_Capital'), bio: 'Crypto trader. Elliott Wave analysis and market predictions.', tier: 'B', weeklyScore: 690n, totalDrafts: 51n },
    { id: 27n, name: 'Hsaka', handle: 'HsakaTrades', avatar: getInfluencerAvatar('HsakaTrades'), bio: 'Full-time trader. Sharing setups and market analysis.', tier: 'B', weeklyScore: 680n, totalDrafts: 48n },
    { id: 28n, name: 'Degen Spartan', handle: 'DegenSpartan', avatar: getInfluencerAvatar('DegenSpartan'), bio: 'DeFi researcher and investor. Finding alpha in new protocols.', tier: 'B', weeklyScore: 670n, totalDrafts: 45n },
    { id: 29n, name: 'Chase', handle: 'CryptoChase', avatar: getInfluencerAvatar('CryptoChase'), bio: 'Crypto trader and analyst. Daily market insights and trading ideas.', tier: 'B', weeklyScore: 660n, totalDrafts: 42n },
    { id: 30n, name: 'Minh', handle: 'MINHxDYNASTY', avatar: getInfluencerAvatar('MINHxDYNASTY'), bio: 'Crypto investor. Finding gems and sharing research.', tier: 'B', weeklyScore: 650n, totalDrafts: 39n },
    { id: 31n, name: '0xngmi', handle: '0xngmi', avatar: getInfluencerAvatar('0xngmi'), bio: 'Founder of DefiLlama. Building DeFi analytics and data tools.', tier: 'B', weeklyScore: 640n, totalDrafts: 36n },
    { id: 32n, name: 'Tyler', handle: 'Tyler_Did_It', avatar: getInfluencerAvatar('Tyler_Did_It'), bio: 'Crypto educator and analyst. Simplifying complex crypto concepts.', tier: 'B', weeklyScore: 630n, totalDrafts: 34n },
    { id: 33n, name: 'Crypto Rover', handle: 'CryptoRover', avatar: getInfluencerAvatar('CryptoRover'), bio: 'Crypto YouTuber and analyst. Daily market updates and news.', tier: 'B', weeklyScore: 620n, totalDrafts: 32n },
    { id: 34n, name: 'Sammy', handle: 'S4mmyEth', avatar: getInfluencerAvatar('S4mmyEth'), bio: 'Ethereum developer and builder. Web3 and DeFi advocate.', tier: 'B', weeklyScore: 610n, totalDrafts: 30n },
    { id: 35n, name: 'Bandit', handle: 'banditxbt', avatar: getInfluencerAvatar('banditxbt'), bio: 'Bitcoin trader. Technical analysis and market commentary.', tier: 'B', weeklyScore: 600n, totalDrafts: 28n },
    { id: 36n, name: 'Zeus', handle: 'CryptoZeusYT', avatar: getInfluencerAvatar('CryptoZeusYT'), bio: 'Crypto content creator. Educational videos and market analysis.', tier: 'B', weeklyScore: 590n, totalDrafts: 26n },
    { id: 37n, name: 'USD Thinker', handle: 'ThinkingUSD', avatar: getInfluencerAvatar('ThinkingUSD'), bio: 'Macro analyst. Crypto market commentary and economic insights.', tier: 'B', weeklyScore: 580n, totalDrafts: 24n },

    // C-Tier (<150K followers)
    { id: 38n, name: 'Pix', handle: 'PixOnChain', avatar: getInfluencerAvatar('PixOnChain'), bio: 'On-chain analyst. Tracking smart money and whale movements.', tier: 'C', weeklyScore: 560n, totalDrafts: 22n },
    { id: 39n, name: 'chooserich', handle: 'chooserich', avatar: getInfluencerAvatar('chooserich'), bio: 'NFT investor and crypto trader. Sharing market insights.', tier: 'C', weeklyScore: 550n, totalDrafts: 20n },
    { id: 40n, name: 'Ignas', handle: 'DefiIgnas', avatar: getInfluencerAvatar('DefiIgnas'), bio: 'DeFi researcher. Deep dives into protocols and yield strategies.', tier: 'C', weeklyScore: 540n, totalDrafts: 19n },
    { id: 41n, name: 'Fejau', handle: 'fejau_inc', avatar: getInfluencerAvatar('fejau_inc'), bio: 'Crypto analyst and trader. Finding hidden gems and opportunities.', tier: 'C', weeklyScore: 530n, totalDrafts: 18n },
    { id: 42n, name: 'youfadedwealth', handle: 'youfadedwealth', avatar: getInfluencerAvatar('youfadedwealth'), bio: 'Crypto trader. Sharing contrarian takes and market analysis.', tier: 'C', weeklyScore: 520n, totalDrafts: 17n },
    { id: 43n, name: 'vohvohh', handle: 'vohvohh', avatar: getInfluencerAvatar('vohvohh'), bio: 'DeFi degen. Hunting for yields and new protocols.', tier: 'C', weeklyScore: 510n, totalDrafts: 16n },
    { id: 44n, name: 'Crypto Leon', handle: 'cryptoleon_xyz', avatar: getInfluencerAvatar('cryptoleon_xyz'), bio: 'Web3 builder and investor. Exploring new crypto narratives.', tier: 'C', weeklyScore: 500n, totalDrafts: 15n },
    { id: 45n, name: 'Gandalf', handle: 'CryptoGandalf', avatar: getInfluencerAvatar('CryptoGandalf'), bio: 'Altcoin hunter. Finding 100x gems in the crypto market.', tier: 'C', weeklyScore: 490n, totalDrafts: 14n },
    { id: 46n, name: 'eeelistar', handle: 'eeelistar', avatar: getInfluencerAvatar('eeelistar'), bio: 'NFT collector and crypto enthusiast. Sharing market insights.', tier: 'C', weeklyScore: 480n, totalDrafts: 13n },
    { id: 47n, name: 'zaimi', handle: 'zaimiriQ', avatar: getInfluencerAvatar('zaimiriQ'), bio: 'Crypto trader. Technical analysis and chart patterns.', tier: 'C', weeklyScore: 470n, totalDrafts: 12n },
    { id: 48n, name: 'Leon Abboud', handle: 'leonabboud_', avatar: getInfluencerAvatar('leonabboud_'), bio: 'Crypto analyst and researcher. Breaking down market trends.', tier: 'C', weeklyScore: 460n, totalDrafts: 11n },
    { id: 49n, name: 'Yuma', handle: 'matchayuma', avatar: getInfluencerAvatar('matchayuma'), bio: 'Crypto investor. Sharing research and investment strategies.', tier: 'C', weeklyScore: 450n, totalDrafts: 10n },
    { id: 50n, name: 'Udi Wertheimer', handle: 'udiWertheimer', avatar: getInfluencerAvatar('udiWertheimer'), bio: 'Bitcoin developer. Building on Bitcoin and Lightning Network.', tier: 'C', weeklyScore: 440n, totalDrafts: 9n },
  ];

  // Add dynamic pricing to all influencers
  const mockInfluencers: Influencer[] = mockInfluencersRaw.map(inf => ({
    ...inf,
    price: calculateDynamicPrice(inf.tier, inf.weeklyScore)
  }));

  // Use drafted team state or load from contract
  const teamIds = new Set(draftedTeam.map((i) => i.id));

  // Tier priority for sorting (S > A > B > C)
  const tierPriority = { 'S': 4, 'A': 3, 'B': 2, 'C': 1 };

  // Filter and sort influencers
  const filteredInfluencers = influencers
    .filter((influencer) => {
      const matchesTier = tierFilter === 'all' || influencer.tier === tierFilter;
      const matchesSearch =
        searchQuery === '' ||
        influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.handle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    })
    .sort((a, b) => {
      // Primary sort by selected option
      switch (sortBy) {
        case 'tier':
          // S-tier first, then A, B, C
          const tierDiff = (tierPriority[b.tier as keyof typeof tierPriority] || 0) -
                          (tierPriority[a.tier as keyof typeof tierPriority] || 0);
          if (tierDiff !== 0) return tierDiff;
          // Secondary sort by weekly score
          return Number(b.weeklyScore - a.weeklyScore);

        case 'weekly-score':
          // Highest score first
          return Number(b.weeklyScore - a.weeklyScore);

        case 'price':
          // Lowest price first (most affordable)
          return Number(a.price - b.price);

        case 'popularity':
          // Most drafted first
          return Number(b.totalDrafts - a.totalDrafts);

        case 'alphabetical':
          // A-Z by name
          return a.name.localeCompare(b.name);

        default:
          return 0;
      }
    });

  const totalTeamScore = draftedTeam.reduce((sum, influencer) => sum + influencer.weeklyScore, 0n);
  const maxTeamSize = 5;
  const pointsUsed = draftedTeam.reduce((sum, influencer) => sum + influencer.price, 0n);
  const maxPoints = 200n; // Budget cap

  const handleDraft = async (influencerId: bigint) => {
    // Find the influencer
    const influencer = influencers.find(i => i.id === influencerId);
    if (!influencer) return;

    // Toggle influencer in/out of team
    if (teamIds.has(influencerId)) {
      // Remove from team
      setDraftedTeam(draftedTeam.filter(i => i.id !== influencerId));
    } else {
      // Add to team (if within limits)
      if (draftedTeam.length < maxTeamSize && pointsUsed + influencer.price <= maxPoints) {
        setDraftedTeam([...draftedTeam, influencer]);
      }
    }
  };

  const handleSubmitTeam = async () => {
    try {
      if (!address) {
        showWarning('Wallet Not Connected', 'Please connect your wallet first');
        return;
      }

      // Validate team name
      if (!teamName || teamName.trim().length === 0) {
        showWarning('Team Name Required', 'Please enter a name for your team');
        return;
      }

      if (teamName.length > 32) {
        showWarning('Team Name Too Long', 'Team name must be 32 characters or less');
        return;
      }

      if (draftedTeam.length !== maxTeamSize) {
        showWarning('Incomplete Team', `Please select exactly ${maxTeamSize} influencers`);
        return;
      }

      // Check if entering prize league
      if (leagueType === 'paid' && !hasEntered) {
        const confirmEntry = window.confirm(
          `Entry Fee: ${prizeLeagueEntryFee} ETH\n\n` +
          `Prize Pool: ${currentWeekPrizePool} ETH\n\n` +
          `Top 10 teams win prizes. Continue?`
        );
        if (!confirmEntry) return;
      }

      // Extract influencer IDs (convert BigInt to number for API)
      const influencerIds = draftedTeam.map(i => Number(i.id));

      // Submit to backend API
      const response = await api.submitTeam({
        teamName,
        influencerIds,
        walletAddress: address,
        leagueType: leagueType === 'paid' ? 'prize' : 'free',
      });

      // Save team name and data to localStorage (convert BigInt to string)
      if (address && teamName && draftedTeam.length > 0) {
        const teamData = {
          name: teamName,
          influencers: draftedTeam.map(inf => ({
            ...inf,
            id: inf.id.toString(),
            weeklyScore: inf.weeklyScore.toString(),
            totalDrafts: inf.totalDrafts.toString(),
            price: inf.price.toString(),
          })),
          timestamp: Date.now(),
        };
        localStorage.setItem(`ctdraft_team_${address}`, JSON.stringify(teamData));
        setSavedTeamData({
          name: teamName,
          influencers: draftedTeam,
          timestamp: Date.now(),
        });
      }

      setHasEntered(true);
      showSuccess(`Team "${teamName}" Created!`, 'Your team has been submitted successfully!');

      // Optional: Also submit to blockchain contract
      // await setTeam(draftedTeam.map(i => i.id));
    } catch (err: any) {
      console.error('Error setting team:', err);

      // Check if it's because contracts aren't deployed
      if (err.message?.includes('0x0000000000000000000000000000000000000000')) {
        showError('Contracts Not Deployed', 'Please deploy contracts to Base Sepolia first');
      } else {
        showError('Failed to Submit Team', err.message || 'An unknown error occurred');
      }
    }
  };

  const tiers = [
    { id: 'all', label: 'All Tiers', count: influencers.length },
    { id: 'S', label: 'S-Tier', count: influencers.filter((i) => i.tier === 'S').length },
    { id: 'A', label: 'A-Tier', count: influencers.filter((i) => i.tier === 'A').length },
    { id: 'B', label: 'B-Tier', count: influencers.filter((i) => i.tier === 'B').length },
    { id: 'C', label: 'C-Tier', count: influencers.filter((i) => i.tier === 'C').length },
  ];

  // Mock league data
  const nextResetTime = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days from now

  // League-specific data
  const prizeLeagueEntryFee = 0.005; // ETH (~$11 at $2200/ETH)
  const freeLeagueXPReward = 100;

  // Dynamic prize pool based on participants
  const currentParticipants = leagueType === 'paid' ? 250 : 1840;
  const currentWeekPrizePool = leagueType === 'paid'
    ? currentParticipants * prizeLeagueEntryFee
    : 0; // Free league has no prize pool

  // Fetch leaderboard when modal opens
  useEffect(() => {
    async function fetchLeaderboard() {
      if (!showLeaderboard) return;

      try {
        setIsLoadingLeaderboard(true);
        const response = await api.getDraftLeaderboard({ limit: 10 });

        // Transform backend data
        const transformedLeaderboard = response.teams.map((team: any, index: number) => ({
          rank: index + 1,
          address: team.wallet_address,
          teamName: team.team_name,
          score: team.total_score,
          prize: leagueType === 'paid' ? calculatePrize(index + 1) : undefined,
          xp: leagueType === 'free' ? freeLeagueXPReward : undefined,
        }));

        setLeaderboardData(transformedLeaderboard);
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        // Keep using mock data if fetch fails
      } finally {
        setIsLoadingLeaderboard(false);
      }
    }

    fetchLeaderboard();
  }, [showLeaderboard, leagueType]);

  // Calculate prize based on rank
  const calculatePrize = (rank: number): number => {
    if (rank === 1) return currentWeekPrizePool * 0.4;
    if (rank === 2) return currentWeekPrizePool * 0.25;
    if (rank === 3) return currentWeekPrizePool * 0.15;
    if (rank === 4 || rank === 5) return currentWeekPrizePool * 0.05;
    if (rank >= 6 && rank <= 10) return currentWeekPrizePool * 0.02;
    return 0;
  };

  // Mock leaderboard data (fallback)
  const mockPrizeLeaderboard = [
    { rank: 1, address: '0x742d...3f2a', teamName: 'CT Gods', score: 4850, prize: currentWeekPrizePool * 0.4 },
    { rank: 2, address: '0x891c...6b4e', teamName: 'Moon Boys', score: 4720, prize: currentWeekPrizePool * 0.25 },
    { rank: 3, address: '0x3a5f...8d1c', teamName: 'Degen Squad', score: 4590, prize: currentWeekPrizePool * 0.15 },
    { rank: 4, address: '0x6c2b...4a9f', teamName: 'Alpha Hunters', score: 4480, prize: currentWeekPrizePool * 0.05 },
    { rank: 5, address: '0x9f7e...2d3c', teamName: 'Whale Watchers', score: 4370, prize: currentWeekPrizePool * 0.05 },
  ];

  const mockFreeLeaderboard = [
    { rank: 1, address: '0x1234...5678', teamName: 'CT Rookies', score: 4200, xp: 500 },
    { rank: 2, address: '0x2345...6789', teamName: 'Learning Crew', score: 4100, xp: 300 },
    { rank: 3, address: '0x3456...789a', teamName: 'Practice Squad', score: 3950, xp: 200 },
  ];

  const prizeLeagueLeaderboard = leaderboardData.length > 0 ? leaderboardData : mockPrizeLeaderboard;
  const freeLeagueLeaderboard = leaderboardData.length > 0 ? leaderboardData : mockFreeLeaderboard;

  const myRank = leagueType === 'paid' ? 42 : 127;
  const totalParticipants = leagueType === 'paid' ? 250 : 1840;

  // Mock past weeks data (for history)
  interface WeekHistory {
    week: number;
    leagueType: 'free' | 'paid';
    rank: number;
    score: number;
    prizeAmount?: number; // ETH
    xpEarned?: number;
    participants: number;
    resolved: boolean;
    team: Influencer[];
  }

  const pastWeeks: WeekHistory[] = [
    {
      week: 11,
      leagueType: 'paid',
      rank: 8,
      score: 4420,
      prizeAmount: 0.025, // 2% of pool (6th-10th place)
      participants: 240,
      resolved: true,
      team: draftedTeam.length > 0 ? draftedTeam : influencers.slice(0, 5),
    },
    {
      week: 10,
      leagueType: 'free',
      rank: 34,
      score: 3950,
      xpEarned: 100,
      participants: 1720,
      resolved: true,
      team: influencers.slice(5, 10),
    },
    {
      week: 9,
      leagueType: 'paid',
      rank: 2,
      score: 4890,
      prizeAmount: 0.3125, // 25% of 1.25 ETH pool
      participants: 250,
      resolved: true,
      team: influencers.slice(10, 15),
    },
    {
      week: 8,
      leagueType: 'free',
      rank: 15,
      score: 4250,
      xpEarned: 100,
      participants: 1650,
      resolved: true,
      team: influencers.slice(15, 20),
    },
  ];

  // Calculate user stats
  const myStats = address ? {
    totalWeeks: pastWeeks.length + (hasEntered ? 1 : 0),
    bestRank: Math.min(...pastWeeks.map(w => w.rank), myRank),
    avgRank: pastWeeks.length > 0
      ? Math.round(pastWeeks.reduce((sum, w) => sum + w.rank, 0) / pastWeeks.length)
      : 0,
    totalWinnings: pastWeeks
      .filter(w => w.prizeAmount && !claimedWeeks.has(w.week))
      .reduce((sum, w) => sum + (w.prizeAmount || 0), 0),
    totalXP: pastWeeks
      .filter(w => w.xpEarned)
      .reduce((sum, w) => sum + (w.xpEarned || 0), 0),
    unclaimedPrizes: pastWeeks.filter(w => w.prizeAmount && !claimedWeeks.has(w.week)).length,
  } : null;

  const handleClaimReward = async (week: number) => {
    if (claimedWeeks.has(week)) {
      showWarning('Already Claimed', 'You have already claimed rewards for this week');
      return;
    }

    const weekData = pastWeeks.find(w => w.week === week);
    if (!weekData || !weekData.prizeAmount) {
      showWarning('No Rewards', 'No rewards available for this week');
      return;
    }

    // TODO: await claimWeeklyReward(week);

    setClaimedWeeks(prev => new Set(prev).add(week));
    showSuccess('Reward Claimed', `Claimed ${weekData.prizeAmount} ETH for Week ${week}!`);
  };

  // State for info modals
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPrizesModal, setShowPrizesModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Clean Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              CT Draft
            </h1>
            <p className="text-gray-400 text-sm">
              Build your team of 5 influencers • Resets in {Math.floor((nextResetTime.getTime() - Date.now()) / (1000 * 60))} minutes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInfoModal(true)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-sm transition-all"
            >
              How It Works
            </button>
            {myStats && pastWeeks.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-sm transition-all"
              >
                History
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-sm transition-all"
            >
              Leaderboard
            </button>
          </div>
        </div>

        {/* Compact League Info Bar */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">League</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLeagueType('free')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      leagueType === 'free'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setLeagueType('paid')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      leagueType === 'paid'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    Prize (0.005 ETH)
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Prize Pool</div>
                <div className="text-lg font-bold text-white">
                  {leagueType === 'paid' ? `${currentWeekPrizePool.toFixed(2)} ETH` : `${freeLeagueXPReward} XP`}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Players</div>
                <div className="text-lg font-bold text-white">{currentParticipants}</div>
              </div>
              {hasEntered && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Your Rank</div>
                  <div className="text-lg font-bold text-cyan-400">#{myRank}</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowPrizesModal(true)}
              className="text-xs text-gray-400 hover:text-gray-300 underline"
            >
              Prize breakdown
            </button>
          </div>
        </div>

        {/* Unclaimed Winnings - Compact */}
        {myStats && myStats.unclaimedPrizes > 0 && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="text-sm font-bold text-yellow-400">
                    {myStats.totalWinnings.toFixed(4)} ETH Unclaimed
                  </div>
                  <div className="text-xs text-gray-400">
                    {myStats.unclaimedPrizes} week{myStats.unclaimedPrizes !== 1 ? 's' : ''} ready to claim
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                Claim
              </button>
            </div>
          </div>
        )}
      </div>

      {!address ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Connect to Draft</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Connect your wallet to draft your fantasy team of crypto influencers and compete for glory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Team */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {/* Team Name Input - Compact */}
              <div className="mb-3 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                <label htmlFor="teamName" className="block text-xs font-medium text-gray-400 mb-2">
                  Team Name
                </label>
                <input
                  id="teamName"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name..."
                  maxLength={32}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {teamName.length}/32
                </div>
              </div>

              {/* Saved Team - Compact */}
              {savedTeamData && !draftedTeam.length && !isLoadingTeam && (
                <div className="mb-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-cyan-400">{savedTeamData.name}</div>
                      <div className="text-xs text-gray-500">Saved team</div>
                    </div>
                    <button
                      onClick={() => {
                        setDraftedTeam(savedTeamData.influencers);
                        setTeamName(savedTeamData.name);
                      }}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-all"
                    >
                      Load
                    </button>
                  </div>
                </div>
              )}

              <TeamCard
                teamName={teamName || "My Team"}
                team={draftedTeam}
                totalScore={totalTeamScore}
                rank={BigInt(myRank)}
                maxTeamSize={maxTeamSize}
              />

              {/* Budget Tracker - Very Compact */}
              <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">Budget</div>
                  <div className="text-sm font-bold text-white">
                    {Number(pointsUsed)}/{Number(maxPoints)}
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{ width: `${(Number(pointsUsed) / Number(maxPoints)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              {draftedTeam.length > 0 && (
                <button
                  onClick={handleSubmitTeam}
                  disabled={isPending || isConfirming || draftedTeam.length !== maxTeamSize}
                  className="w-full mt-3 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending || isConfirming ? 'Submitting...' : `Submit Team (${draftedTeam.length}/${maxTeamSize})`}
                </button>
              )}

              {/* Status Indicator */}
              {hasEntered && (
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-green-400 font-medium">Entered • Rank #{myRank}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Available Influencers */}
          <div className="lg:col-span-2">
            {/* Compact Search & Filter */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search influencers..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
              />

              <div className="flex items-center justify-between gap-3">
                {/* Tier Filter */}
                <div className="flex gap-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setTierFilter(tier.id as any)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        tierFilter === tier.id
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {tier.label === 'All Tiers' ? 'All' : tier.label}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="tier">Sort: Tier</option>
                  <option value="weekly-score">Sort: Score</option>
                  <option value="price">Sort: Price</option>
                  <option value="popularity">Sort: Popular</option>
                  <option value="alphabetical">Sort: A-Z</option>
                </select>
              </div>
            </div>

            {/* Influencers Grid */}
            {isLoadingInfluencers ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                <div className="text-4xl mb-3 animate-pulse">⏳</div>
                <p className="text-gray-400">Loading influencers from backend...</p>
              </div>
            ) : apiError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-12 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-400 font-bold mb-2">Failed to Load Influencers</p>
                <p className="text-gray-400 text-sm">{apiError}</p>
              </div>
            ) : filteredInfluencers.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-400">No influencers found matching your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInfluencers.map((influencer) => (
                  <InfluencerCard
                    key={Number(influencer.id)}
                    influencer={influencer}
                    onDraft={handleDraft}
                    onClick={setSelectedInfluencer}
                    disabled={
                      draftedTeam.length >= maxTeamSize ||
                      pointsUsed + influencer.price > maxPoints ||
                      teamIds.has(influencer.id)
                    }
                    inTeam={teamIds.has(influencer.id)}
                  />
                ))}
              </div>
            )}

            {/* Influencer Detail Modal */}
            <InfluencerModal
              influencer={selectedInfluencer}
              onClose={() => setSelectedInfluencer(null)}
              onDraft={handleDraft}
              inTeam={selectedInfluencer ? teamIds.has(selectedInfluencer.id) : false}
              disabled={
                selectedInfluencer
                  ? draftedTeam.length >= maxTeamSize ||
                    pointsUsed + selectedInfluencer.price > maxPoints ||
                    teamIds.has(selectedInfluencer.id)
                  : true
              }
            />

            {/* Team Board Modal */}
            {showTeamBoard && (
              <TeamBoard
                team={draftedTeam}
                totalScore={totalTeamScore}
                rank={BigInt(myRank)}
                onClose={() => setShowTeamBoard(false)}
              />
            )}

            {/* Leaderboard Modal */}
            {showLeaderboard && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowLeaderboard(false)}>
                <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {leagueType === 'paid' ? 'Prize' : 'Free'} League Leaderboard
                        </h2>
                        <p className="text-sm text-gray-400">
                          Week 12 • {totalParticipants} participants
                        </p>
                      </div>
                      <button
                        onClick={() => setShowLeaderboard(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Your Rank */}
                    {address && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-400">Your Rank</div>
                            <div className="text-2xl font-bold text-cyan-400">#{myRank}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Your Score</div>
                            <div className="text-2xl font-bold text-white">{Number(totalTeamScore)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              {leagueType === 'paid' ? 'Prize' : 'XP'}
                            </div>
                            <div className="text-lg font-bold text-green-400">
                              {leagueType === 'paid' ? 'Not in top 10' : `${freeLeagueXPReward} XP`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Leaderboard List */}
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-2">
                      {(leagueType === 'paid' ? prizeLeagueLeaderboard : freeLeagueLeaderboard).map((entry) => (
                        <div
                          key={entry.rank}
                          className={`p-4 rounded-lg border transition-all ${
                            entry.rank <= 3
                              ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                              : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 text-xl' :
                                entry.rank === 2 ? 'bg-gray-400/20 text-gray-300 text-lg' :
                                entry.rank === 3 ? 'bg-orange-500/20 text-orange-400 text-lg' :
                                'bg-gray-700 text-gray-400'
                              }`}>
                                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                              </div>
                              <div>
                                <div className="font-bold text-white">{entry.teamName || `Team ${entry.rank}`}</div>
                                <div className="text-xs text-gray-500 font-mono">{entry.address}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-sm text-gray-400">Score</div>
                                <div className="text-lg font-bold text-cyan-400">{entry.score}</div>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <div className="text-sm text-gray-400">
                                  {leagueType === 'paid' ? 'Prize' : 'XP'}
                                </div>
                                <div className="text-lg font-bold text-green-400">
                                  {leagueType === 'paid' && 'prize' in entry
                                    ? `${entry.prize.toFixed(2)} ETH`
                                    : `${'xp' in entry ? entry.xp : freeLeagueXPReward} XP`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                      <h4 className="text-sm font-bold text-gray-300 mb-2">Scoring Details</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Scores update daily at midnight UTC</li>
                        <li>• Based on engagement (likes, RTs, replies)</li>
                        <li>• Quality matters: Long-form threads score higher</li>
                        <li>• Viral moments get bonus multipliers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Modal */}
            {showHistory && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowHistory(false)}>
                <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Week History</h2>
                        <p className="text-sm text-gray-400">
                          Your past performance across all weeks
                        </p>
                      </div>
                      <button
                        onClick={() => setShowHistory(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Summary Stats */}
                    {myStats && (
                      <div className="mt-4 grid grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                          <div className="text-xs text-gray-500 mb-1">Total Weeks</div>
                          <div className="text-lg font-bold text-cyan-400">{myStats.totalWeeks}</div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                          <div className="text-xs text-gray-500 mb-1">Best Rank</div>
                          <div className="text-lg font-bold text-yellow-400">#{myStats.bestRank}</div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                          <div className="text-xs text-gray-500 mb-1">Total Won</div>
                          <div className="text-lg font-bold text-green-400">
                            {pastWeeks.filter(w => w.prizeAmount).reduce((sum, w) => sum + (w.prizeAmount || 0), 0).toFixed(2)} ETH
                          </div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                          <div className="text-xs text-gray-500 mb-1">Unclaimed</div>
                          <div className="text-lg font-bold text-orange-400">
                            {myStats.totalWinnings.toFixed(2)} ETH
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Week List */}
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-4">
                      {pastWeeks.map((week) => {
                        const canClaim = week.prizeAmount && !claimedWeeks.has(week.week);
                        const hasClaimed = week.prizeAmount && claimedWeeks.has(week.week);

                        return (
                          <div
                            key={week.week}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all"
                          >
                            {/* Week Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="text-lg font-bold text-gray-200">Week {week.week}</div>
                                  <span className={`px-2 py-1 text-xs rounded border ${
                                    week.leagueType === 'paid'
                                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                                      : 'bg-green-500/20 text-green-400 border-green-500/30'
                                  }`}>
                                    {week.leagueType === 'paid' ? 'Prize League' : 'Free League'}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {week.participants} participants
                                </div>
                              </div>

                              {/* Rank Badge */}
                              <div className={`px-4 py-2 rounded-lg ${
                                week.rank <= 3
                                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                                  : week.rank <= 10
                                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                  : 'bg-gray-900/50 border border-gray-700'
                              }`}>
                                <div className="text-xs text-gray-500 mb-1">Rank</div>
                                <div className={`text-2xl font-bold ${
                                  week.rank === 1 ? 'text-yellow-400' :
                                  week.rank === 2 ? 'text-gray-300' :
                                  week.rank === 3 ? 'text-orange-400' :
                                  week.rank <= 10 ? 'text-green-400' :
                                  'text-gray-400'
                                }`}>
                                  {week.rank === 1 ? '🥇' : week.rank === 2 ? '🥈' : week.rank === 3 ? '🥉' : `#${week.rank}`}
                                </div>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-gray-900/50 rounded p-2 text-center">
                                <div className="text-xs text-gray-500 mb-1">Score</div>
                                <div className="text-sm font-bold text-cyan-400">{week.score}</div>
                              </div>
                              <div className="bg-gray-900/50 rounded p-2 text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {week.leagueType === 'paid' ? 'Prize' : 'XP'}
                                </div>
                                <div className="text-sm font-bold text-green-400">
                                  {week.leagueType === 'paid' && week.prizeAmount
                                    ? `${week.prizeAmount.toFixed(4)} ETH`
                                    : week.xpEarned
                                    ? `${week.xpEarned} XP`
                                    : 'N/A'}
                                </div>
                              </div>
                              <div className="bg-gray-900/50 rounded p-2 text-center">
                                <div className="text-xs text-gray-500 mb-1">Team Size</div>
                                <div className="text-sm font-bold text-purple-400">{week.team.length}</div>
                              </div>
                            </div>

                            {/* Team Preview */}
                            <div className="mb-4">
                              <div className="text-xs text-gray-500 mb-2">Your Team</div>
                              <div className="flex gap-2 overflow-x-auto">
                                {week.team.map((influencer) => (
                                  <div
                                    key={Number(influencer.id)}
                                    className="flex-shrink-0 bg-gray-900/50 rounded p-2 text-center min-w-[80px]"
                                  >
                                    <div className="text-xs text-gray-400 mb-1">{influencer.name}</div>
                                    <div className="text-xs font-bold text-cyan-400">
                                      {influencer.tier}-Tier
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {canClaim && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClaimReward(week.week);
                                  }}
                                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded font-medium transition-all"
                                >
                                  💰 Claim {week.prizeAmount?.toFixed(4)} ETH
                                </button>
                              )}

                              {hasClaimed && (
                                <div className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded text-center text-sm border border-green-500/30">
                                  ✓ Claimed
                                </div>
                              )}

                              {!canClaim && !hasClaimed && week.leagueType === 'free' && (
                                <div className="flex-1 px-4 py-2 bg-gray-900/50 text-gray-400 rounded text-center text-sm">
                                  XP Earned
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Empty State */}
                    {pastWeeks.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="text-gray-400">No week history yet</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Submit your first team to start competing!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Private Leagues Modal */}
            {showPrivateLeagues && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPrivateLeagues(false)}>
                <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="overflow-y-auto max-h-[90vh] p-6">
                    <PrivateLeagues onClose={() => setShowPrivateLeagues(false)} />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowInfoModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">How CT Draft Works</h2>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h4 className="font-bold text-white mb-1">Draft Your Team</h4>
                  <p className="text-sm text-gray-400">Pick 5 influencers within 200 points budget</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h4 className="font-bold text-white mb-1">Earn Points</h4>
                  <p className="text-sm text-gray-400">Score based on engagement and activity</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h4 className="font-bold text-white mb-1">Weekly Reset</h4>
                  <p className="text-sm text-gray-400">Competitions reset every week</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl mb-2">4️⃣</div>
                  <h4 className="font-bold text-white mb-1">Win Prizes</h4>
                  <p className="text-sm text-gray-400">Top 10 teams earn rewards</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-bold text-white mb-3">Scoring System</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• <strong className="text-cyan-400">Engagement:</strong> Likes, retweets, replies count toward score</li>
                  <li>• <strong className="text-green-400">Quality:</strong> Thread depth and insights earn bonus points</li>
                  <li>• <strong className="text-yellow-400">Viral moments:</strong> Breakout tweets get multiplier bonuses</li>
                  <li>• <strong className="text-orange-400">Dynamic Pricing:</strong> Influencer costs change weekly based on performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prize Breakdown Modal */}
      {showPrizesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPrizesModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Prize Distribution</h2>
                <button
                  onClick={() => setShowPrizesModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Total Prize Pool</div>
                <div className="text-3xl font-bold text-white">
                  {leagueType === 'paid' ? `${currentWeekPrizePool.toFixed(2)} ETH` : `${freeLeagueXPReward} XP`}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥇</span>
                      <div>
                        <div className="font-bold text-white">1st Place</div>
                        <div className="text-sm text-gray-400">40% of pool</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">
                      {leagueType === 'paid' ? `${(currentWeekPrizePool * 0.4).toFixed(2)} ETH` : `${freeLeagueXPReward * 5} XP`}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🥈</span>
                      <span className="text-sm text-white">2nd Place - 25%</span>
                    </div>
                    <div className="text-sm font-bold text-gray-300">
                      {leagueType === 'paid' ? `${(currentWeekPrizePool * 0.25).toFixed(2)} ETH` : `${freeLeagueXPReward * 3} XP`}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🥉</span>
                      <span className="text-sm text-white">3rd Place - 15%</span>
                    </div>
                    <div className="text-sm font-bold text-orange-400">
                      {leagueType === 'paid' ? `${(currentWeekPrizePool * 0.15).toFixed(2)} ETH` : `${freeLeagueXPReward * 2} XP`}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">4th-5th Place</span>
                    <span className="text-sm text-gray-300">5% each</span>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">6th-10th Place</span>
                    <span className="text-sm text-gray-300">2% each</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
