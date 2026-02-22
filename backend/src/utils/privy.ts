import { PrivyClient, AuthTokenClaims, User as PrivyUser } from '@privy-io/server-auth';
import logger from './logger';

// Privy client singleton — initialized lazily when first needed
let privyClient: PrivyClient | null = null;

/**
 * Check if Privy is configured with required environment variables
 */
export function isPrivyConfigured(): boolean {
  return !!(process.env.PRIVY_APP_ID && process.env.PRIVY_APP_SECRET);
}

/**
 * Get or create the Privy client singleton.
 * Throws if Privy env vars are not configured.
 */
export function getPrivyClient(): PrivyClient {
  if (privyClient) return privyClient;

  const appId = process.env.PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error(
      'Privy is not configured. Set PRIVY_APP_ID and PRIVY_APP_SECRET environment variables. ' +
        'Get these from https://dashboard.privy.io'
    );
  }

  privyClient = new PrivyClient(appId, appSecret);
  logger.info('Privy client initialized', { context: 'Privy' });
  return privyClient;
}

/**
 * Verify a Privy auth token and return the claims.
 * Returns null if verification fails.
 */
export async function verifyPrivyToken(
  token: string
): Promise<AuthTokenClaims | null> {
  try {
    const client = getPrivyClient();
    const claims = await client.verifyAuthToken(token);
    return claims;
  } catch (error) {
    logger.error('Privy token verification failed', error, {
      context: 'Privy',
    });
    return null;
  }
}

export interface PrivyWalletInfo {
  address: string;
  chainType: string;
}

/**
 * Get a Privy user by their DID and extract wallet info.
 * Returns the user's wallet address (preferring Solana, falling back to Ethereum).
 */
export async function getPrivyUserWallet(
  privyUserId: string
): Promise<PrivyWalletInfo | null> {
  try {
    const client = getPrivyClient();
    const user: PrivyUser = await client.getUser(privyUserId);

    if (!user.linkedAccounts || user.linkedAccounts.length === 0) {
      logger.warn('Privy user has no linked accounts', {
        context: 'Privy',
        data: { privyUserId },
      });
      return null;
    }

    // Find wallet accounts — prefer Solana, fall back to Ethereum
    const wallets = user.linkedAccounts.filter(
      (account): account is Extract<typeof account, { type: 'wallet' }> =>
        account.type === 'wallet'
    );

    // Prefer Solana wallet
    const solanaWallet = wallets.find((w) => w.chainType === 'solana');
    if (solanaWallet) {
      return { address: solanaWallet.address, chainType: 'solana' };
    }

    // Any wallet as last resort
    if (wallets.length > 0) {
      return {
        address: wallets[0].address,
        chainType: wallets[0].chainType || 'unknown',
      };
    }

    logger.warn('Privy user has no wallet accounts', {
      context: 'Privy',
      data: { privyUserId, accountTypes: user.linkedAccounts.map((a) => a.type) },
    });
    return null;
  } catch (error) {
    logger.error('Failed to get Privy user wallet', error, {
      context: 'Privy',
      data: { privyUserId },
    });
    return null;
  }
}

/**
 * Reset the Privy client (for testing)
 */
export function resetPrivyClient(): void {
  privyClient = null;
}
