import { Hex } from "viem";
/**
 * Convert SHA-256 hash string to bytes32 format (0x + 64 hex chars)
 */
export function normalizeHashToBytes32(hash: string): Hex {
  // Remove any existing 0x prefix
  const cleanHash = hash.replace(/^0x/, "");

  // Ensure it's exactly 64 hex characters
  if (cleanHash.length !== 64) {
    throw new Error(
      `Invalid hash length: expected 64 chars, got ${cleanHash.length}`
    );
  }

  // Validate hex format
  if (!/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
    throw new Error("Hash contains invalid hex characters");
  }

  return `0x${cleanHash}` as Hex;
}
