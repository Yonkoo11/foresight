import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Account, useAuthorization } from "./useAuthorization";
import {
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { SignInPayload } from "@solana-mobile/mobile-wallet-adapter-protocol";

export function useMobileWallet() {
  const { authorizeSessionWithSignIn, authorizeSession, deauthorizeSession } =
    useAuthorization();

  const connect = useCallback(async (): Promise<Account> => {
    try {
      return await transact(async (wallet) => {
        return await authorizeSession(wallet);
      });
    } catch (err: any) {
      if (err?.message?.includes('cancel')) {
        throw new Error('Wallet connection cancelled');
      }
      throw new Error(err?.message || 'Failed to connect wallet. Is a Solana wallet app installed?');
    }
  }, [authorizeSession]);

  const signIn = useCallback(
    async (signInPayload: SignInPayload): Promise<Account> => {
      try {
        return await transact(async (wallet) => {
          return await authorizeSessionWithSignIn(wallet, signInPayload);
        });
      } catch (err: any) {
        if (err?.message?.includes('cancel')) {
          throw new Error('Sign-in cancelled');
        }
        throw new Error(err?.message || 'Failed to sign in. Is a Solana wallet app installed?');
      }
    },
    [authorizeSessionWithSignIn]
  );

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      await transact(async (wallet) => {
        await deauthorizeSession(wallet);
      });
    } catch {
      // Disconnect errors are non-critical - clear local state regardless
    }
  }, [deauthorizeSession]);

  const signAndSendTransaction = useCallback(
    async (
      transaction: Transaction | VersionedTransaction,
      minContextSlot: number,
    ): Promise<TransactionSignature> => {
      return await transact(async (wallet) => {
        await authorizeSession(wallet);
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
          minContextSlot,
        });
        return signatures[0];
      });
    },
    [authorizeSession]
  );

  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      return await transact(async (wallet) => {
        const authResult = await authorizeSession(wallet);
        const signedMessages = await wallet.signMessages({
          addresses: [authResult.address],
          payloads: [message],
        });
        return signedMessages[0];
      });
    },
    [authorizeSession]
  );

  return useMemo(
    () => ({
      connect,
      signIn,
      disconnect,
      signAndSendTransaction,
      signMessage,
    }),
    [connect, signIn, disconnect, signAndSendTransaction, signMessage]
  );
}
