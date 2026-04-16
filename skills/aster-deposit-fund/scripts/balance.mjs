#!/usr/bin/env bun
/**
 * Wallet token balances (offline config). Uses viem only; no Aster API calls.
 * Usage:
 *   bun run balance.mjs --chain <eth|bsc|arbitrum> --address <0x...> [--no-native] [--token <SYM:0xADDR:DECIMALS>]...
 *
 * SEC-07: This is a read-only operation. Only a public address is needed.
 * The private key is NEVER loaded. Use --address or ASTER_WALLET_ADDRESS env.
 */

import { createPublicClient, http, getAddress, formatUnits } from "viem";
import { CHAINS, getRpcUrl, ERC20_BALANCE_ABI, sanitizeError } from "./common.mjs";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { tokens: [], includeNative: true };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--chain" && args[i + 1]) out.chain = args[++i].toLowerCase();
    else if (args[i] === "--address" && args[i + 1]) out.address = args[++i];
    else if (args[i] === "--no-native") out.includeNative = false;
    else if (args[i] === "--token" && args[i + 1]) out.tokens.push(args[++i]);
  }
  return out;
}

function parseTokenSpec(spec) {
  // Format: SYMBOL:0xADDR:DECIMALS
  const [symbol, address, decimals] = String(spec).split(":");
  if (!symbol || !address || decimals == null) {
    throw new Error(`Invalid --token value "${spec}". Expected: SYMBOL:0xADDR:DECIMALS`);
  }
  const dec = Number(decimals);
  if (!Number.isInteger(dec) || dec < 0 || dec > 255) {
    throw new Error(`Invalid decimals in --token "${spec}". Must be integer 0..255`);
  }
  return { symbol: symbol.toUpperCase(), address: getAddress(address), decimals: dec };
}

function main() {
  const { chain, address: cliAddress, tokens, includeNative } = parseArgs();
  if (!chain) {
    console.error(
      "Usage: bun run balance.mjs --chain <eth|bsc|arbitrum> --address <0x...> [--no-native] [--token <SYM:0xADDR:DECIMALS>]..."
    );
    process.exit(1);
  }

  const chainConf = CHAINS[chain];
  if (!chainConf) {
    console.error("Invalid chain. Use: eth, bsc, arbitrum");
    process.exit(1);
  }

  // SEC-07: Use --address flag or ASTER_WALLET_ADDRESS env. Never load private key for reads.
  let walletAddress = cliAddress || process.env.ASTER_WALLET_ADDRESS;
  if (!walletAddress) {
    console.error(
      "Address required. Use --address <0x...> or set ASTER_WALLET_ADDRESS in env.\n" +
      "This is a read-only operation; no private key is needed."
    );
    process.exit(1);
  }
  walletAddress = getAddress(walletAddress);

  const publicClient = createPublicClient({
    chain: chainConf.chain,
    transport: http(getRpcUrl(chainConf)),
  });

  (async () => {
    const nativeDecimals = chainConf.chain.nativeCurrency?.decimals ?? 18;
    const parsedTokens = tokens.map(parseTokenSpec);

    const nativeBalance = includeNative
      ? await publicClient.getBalance({ address: walletAddress })
      : 0n;

    const erc20Balances =
      parsedTokens.length > 0
        ? await publicClient.readContracts({
            contracts: parsedTokens.map((t) => ({
              address: t.address,
              abi: ERC20_BALANCE_ABI,
              functionName: "balanceOf",
              args: [walletAddress],
            })),
          })
        : [];

    console.log("Chain:", chain, "| Address:", walletAddress, "\n");
    console.log("Asset".padEnd(12), "Balance (raw)".padEnd(24), "Balance");
    console.log("-".repeat(52));

    if (includeNative) {
      const sym = chainConf.chain.nativeCurrency?.symbol || "NATIVE";
      const raw = nativeBalance.toString();
      const human = formatUnits(nativeBalance, nativeDecimals);
      console.log(String(sym).padEnd(12), raw.padEnd(24), human);
    }

    for (let i = 0; i < parsedTokens.length; i++) {
      const t = parsedTokens[i];
      const result = erc20Balances[i];
      const raw = result?.status === "success" ? result.result.toString() : "?";
      const human = result?.status === "success" ? formatUnits(result.result, t.decimals) : "?";
      console.log(String(t.symbol).padEnd(12), raw.padEnd(24), human);
    }
  })().catch((err) => {
    console.error(sanitizeError(err));
    process.exit(1);
  });
}

main();
