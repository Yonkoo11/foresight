/**
 * Predefined avatar set for user profiles.
 * Uses DiceBear identicon style with crypto-themed seeds.
 */

export interface AvatarOption {
  id: number;
  name: string;
  url: string;
}

const DICEBEAR_BASE = 'https://api.dicebear.com/7.x/identicon/svg';

export const DEFAULT_AVATARS: AvatarOption[] = [
  { id: 1, name: 'Solana Whale', url: `${DICEBEAR_BASE}?seed=SolanaWhale&scale=80` },
  { id: 2, name: 'DeFi Degen', url: `${DICEBEAR_BASE}?seed=DeFi_Degen&scale=80` },
  { id: 3, name: 'Alpha Hunter', url: `${DICEBEAR_BASE}?seed=AlphaHunter&scale=80` },
  { id: 4, name: 'CT Maxi', url: `${DICEBEAR_BASE}?seed=CT_Maxi&scale=80` },
  { id: 5, name: 'GigaBrain', url: `${DICEBEAR_BASE}?seed=GigaBrain&scale=80` },
  { id: 6, name: 'NFT Flipper', url: `${DICEBEAR_BASE}?seed=NFT_Flipper&scale=80` },
  { id: 7, name: 'OnChain Anon', url: `${DICEBEAR_BASE}?seed=OnChainAnon&scale=80` },
  { id: 8, name: 'MEV Chad', url: `${DICEBEAR_BASE}?seed=MevBot_Chad&scale=80` },
  { id: 9, name: 'Yield Farmer', url: `${DICEBEAR_BASE}?seed=YieldFarmer&scale=80` },
  { id: 10, name: 'Ser NGMI', url: `${DICEBEAR_BASE}?seed=Ser_Ngmi&scale=80` },
  { id: 11, name: 'Ape Degen', url: `${DICEBEAR_BASE}?seed=ApeDegen&scale=80` },
  { id: 12, name: 'Chart Master', url: `${DICEBEAR_BASE}?seed=ChartMaster&scale=80` },
  { id: 13, name: 'Diamond Hand', url: `${DICEBEAR_BASE}?seed=DiamondHand&scale=80` },
  { id: 14, name: 'Rekt Proof', url: `${DICEBEAR_BASE}?seed=RektProof&scale=80` },
  { id: 15, name: 'Token Sniper', url: `${DICEBEAR_BASE}?seed=TokenSniper&scale=80` },
  { id: 16, name: 'Moon Runner', url: `${DICEBEAR_BASE}?seed=MoonRunner&scale=80` },
];

/** Get a random avatar URL from the predefined set */
export function getRandomAvatarUrl(): string {
  const idx = Math.floor(Math.random() * DEFAULT_AVATARS.length);
  return DEFAULT_AVATARS[idx].url;
}
