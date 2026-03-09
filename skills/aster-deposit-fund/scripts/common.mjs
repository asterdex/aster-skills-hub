/**
 * Shared config, BAPI helpers, and ABIs for Aster deposit scripts.
 *
 * Security hardening applied (see SECURITY-CHANGELOG.md):
 * - SEC-01: Treasury address whitelist against oracle attacks
 * - SEC-04: Public RPC warnings for production usage
 * - SEC-05: Single source of truth for treasury ABI
 * - SEC-09: Max gas limit to prevent gas drain
 * - SEC-10: Per-chain confirmation requirements
 */

import { getAddress } from "viem";
import { mainnet, bsc, arbitrum } from "viem/chains";
import { treasuryContractABI } from "./aster-smart-contract-abi.ts";

export const BAPI_BASE = "https://www.asterdex.com/bapi/futures/v1/public/future";

// --- SEC-10: Required confirmations per chain (reorg protection) ---
export const REQUIRED_CONFIRMATIONS = {
  1: 2,      // ETH: 2 confirmations
  56: 3,     // BSC: 3 confirmations (higher reorg risk)
  42161: 2,  // Arbitrum: 2 confirmations
};

// --- SEC-09: Max gas limit per transaction to prevent gas drain ---
export const MAX_GAS_LIMIT = 500_000n;

export const CHAINS = {
  eth: { chainId: 1, chain: mainnet, rpcEnv: "ETH_RPC_URL", defaultRpc: "https://ethereum-rpc.publicnode.com" },
  bsc: { chainId: 56, chain: bsc, rpcEnv: "BSC_RPC_URL", defaultRpc: "https://bsc-rpc.publicnode.com" },
  arbitrum: { chainId: 42161, chain: arbitrum, rpcEnv: "ARBITRUM_RPC_URL", defaultRpc: "https://arbitrum-one-rpc.publicnode.com" },
};

// --- SEC-01: Treasury address whitelist (hardcoded deposit addresses) ---
// When set, getDepositAddress() returns this and skips the API call.
// Addresses MUST be checksummed (mixed-case EIP-55).
// Set env ASTER_TREASURY_WHITELIST_DISABLED=true ONLY for development/testing.
const TREASURY_WHITELIST = {
  1: "0x604DD02d620633Ae427888d41bfd15e38483736E",     // ETH mainnet (deposit-address?chainId=1)
  56: "0x128463A60784c4D3f46c23Af3f65Ed859Ba87974",    // BSC (deposit-address?chainId=56)
  42161: "0x9E36CB86a159d479cEd94Fa05036f235Ac40E1d5", // Arbitrum (deposit-address?chainId=42161)
};

export const ERC20_ABI = [
  { name: "approve", type: "function", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
];

export const ERC20_BALANCE_ABI = [
  { name: "balanceOf", type: "function", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
];

// --- SEC-05: Single source of truth for treasury ABI (imported from aster-smart-contract-abi.ts) ---
export const TREASURY_ABI = treasuryContractABI;

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const json = await res.json();
  if (json.code !== "000000" && json.success !== true) throw new Error(json.messageDetail || json.message || "API error");
  return json;
}

export async function getAssets(chainId) {
  const url = `${BAPI_BASE}/aster/withdraw/assets?chainIds=${chainId}&networks=EVM&accountType=perp`;
  const json = await fetchJson(url);
  return json.data || [];
}

// --- SEC-01: Hardcoded deposit address when in whitelist; otherwise fetch and validate ---
export async function getDepositAddress(chainId) {
  const hardcoded = TREASURY_WHITELIST[chainId];
  if (hardcoded) {
    return getAddress(hardcoded);
  }

  const url = `${BAPI_BASE}/web3/ae/deposit-address?chainId=${chainId}`;
  const json = await fetchJson(url);
  const addr = json.data;
  if (!addr || typeof addr !== "string") throw new Error("Missing deposit address from API");
  const checksummed = getAddress(addr);

  const whitelistDisabled = process.env.ASTER_TREASURY_WHITELIST_DISABLED === "true";
  if (!whitelistDisabled) {
    console.warn(
      `[SEC-01] WARNING: No whitelisted treasury address for chainId ${chainId}. ` +
      `Set TREASURY_WHITELIST[${chainId}] in common.mjs before using in production. ` +
      `Set ASTER_TREASURY_WHITELIST_DISABLED=true to suppress (dev/test only).`
    );
  }

  return checksummed;
}

// --- SEC-04: RPC URL with production warning ---
export function getRpcUrl(chainConf) {
  const envRpc = process.env[chainConf.rpcEnv];
  if (envRpc) return envRpc;

  console.warn(
    `[SEC-04] WARNING: Using public RPC (${chainConf.defaultRpc}). ` +
    `Public RPCs have no SLA, no auth, and can manipulate responses. ` +
    `Set ${chainConf.rpcEnv} for production (Alchemy, Infura, private node).`
  );
  return chainConf.defaultRpc;
}

// --- SEC-02: Strict private key validation ---
export function validatePrivateKey(key) {
  if (!key) {
    console.error("ASTER_DEPOSIT_PRIVATE_KEY not set in environment.");
    process.exit(1);
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
    console.error("ASTER_DEPOSIT_PRIVATE_KEY invalid: must be 0x followed by exactly 64 hex characters.");
    process.exit(1);
  }
  return key;
}

// --- SEC-02: Sanitize errors to prevent key leakage in logs ---
export function sanitizeError(err) {
  if (!err) return "Unknown error";
  const msg = err.message || String(err);
  return msg.replace(/0x[0-9a-fA-F]{64}/g, "0x[REDACTED]");
}
