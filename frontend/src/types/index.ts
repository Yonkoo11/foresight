export interface Prediction {
  id: bigint;
  creator: `0x${string}`;
  text: string;
  createdAt: bigint;
  lockUntil: bigint;
  stake: bigint;
  resolved: boolean;
  outcome: boolean;
}

export interface UserStats {
  totalPredictions: bigint;
  resolvedPredictions: bigint;
  correctPredictions: bigint;
  currentStreak: bigint;
  accuracy: bigint;
}

export interface LeaderboardEntry {
  address: `0x${string}`;
  foresightScore: number;
  accuracy: number;
  streak: number;
  totalPredictions: number;
}
