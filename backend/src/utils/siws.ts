import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

/**
 * Verify an ed25519 signature from a Solana wallet (SIWS).
 * The signed_message and signature come from MWA's authorize() with sign_in_payload.
 */
export function verifySolanaSignature(
  address: string,
  signedMessage: Uint8Array,
  signature: Uint8Array
): boolean {
  try {
    const publicKey = new PublicKey(address);
    return nacl.sign.detached.verify(
      signedMessage,
      signature,
      publicKey.toBytes()
    );
  } catch {
    return false;
  }
}
