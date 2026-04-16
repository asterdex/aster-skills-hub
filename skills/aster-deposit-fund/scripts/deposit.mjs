#!/usr/bin/env bun
/**
 * Deposit funds to Aster. Uses viem. Run with Bun.
 * Env: ASTER_DEPOSIT_PRIVATE_KEY (required); optional: ETH_RPC_URL, BSC_RPC_URL, ARBITRUM_RPC_URL.
 * Usage:
 *   - Native: bun run deposit.mjs --chain <eth|bsc|arbitrum> --native --amount <human amount> [--broker <uint256>] [--dry-run]
 *   - ERC20:  bun run deposit.mjs --chain <eth|bsc|arbitrum> --token <0x...> --decimals <n> [--symbol <SYM>] --amount <human amount> [--broker <uint256>] [--dry-run]
 *
 * Security hardening:
 * - SEC-02: Strict key validation + memory cleanup + sanitized error output
 * - SEC-06: Balance check before deposit
 * - SEC-09: Explicit gas limit on all transactions
 * - SEC-10: Per-chain confirmation count
 * - SEC-11: Broker ID documented and validated
 */

import { createWalletClient, createPublicClient, http, parseUnits, formatUnits, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  CHAINS, getDepositAddress, getRpcUrl,
  ERC20_ABI, ERC20_BALANCE_ABI, TREASURY_ABI,
  validatePrivateKey, sanitizeError,
  REQUIRED_CONFIRMATIONS, MAX_GAS_LIMIT,
} from "./common.mjs";

function parseArgs() {
  const args = process.argv.slice(2);
  // SEC-11: broker defaults to 1 (Aster primary broker). Override with --broker <id>.
  // The broker ID identifies which Aster broker account receives the deposit attribution.
  const out = { broker: 1n, dryRun: false, native: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--chain" && args[i + 1]) out.chain = args[++i].toLowerCase();
    else if (args[i] === "--amount" && args[i + 1]) out.amount = args[++i];
    else if (args[i] === "--native") out.native = true;
    else if (args[i] === "--token" && args[i + 1]) out.token = args[++i];
    else if (args[i] === "--decimals" && args[i + 1]) out.decimals = args[++i];
    else if (args[i] === "--symbol" && args[i + 1]) out.symbol = args[++i].toUpperCase();
    else if (args[i] === "--broker" && args[i + 1]) out.broker = BigInt(args[++i]);
    else if (args[i] === "--dry-run") out.dryRun = true;
    else if (args[i] === "--help" || args[i] === "-h") {
      console.log(
        "Usage:\n" +
        "  Native: bun run deposit.mjs --chain <eth|bsc|arbitrum> --native --amount <human amount> [--broker <uint256>] [--dry-run]\n" +
        "  ERC20:  bun run deposit.mjs --chain <eth|bsc|arbitrum> --token <0x...> --decimals <n> [--symbol <SYM>] --amount <human amount> [--broker <uint256>] [--dry-run]\n\n" +
        "Options:\n" +
        "  --chain     Target chain: eth, bsc, or arbitrum\n" +
        "  --amount    Human-readable amount (e.g. 100.5)\n" +
        "  --native    Deposit the chain native currency (ETH/BNB/ETH on Arbitrum)\n" +
        "  --token     ERC20 token contract address\n" +
        "  --decimals  ERC20 decimals (e.g. 6 for USDT/USDC, 18 for many tokens)\n" +
        "  --symbol    Display symbol for logs (optional)\n" +
        "  --broker    Aster broker ID (default: 1 = primary broker). Determines which broker account the deposit is attributed to.\n" +
        "  --dry-run   Simulate without sending transactions\n" +
        "  --help      Show this help\n\n" +
        "Env:\n" +
        "  ASTER_DEPOSIT_PRIVATE_KEY  Wallet private key (0x + 64 hex chars). Required unless --dry-run.\n" +
        "  ETH_RPC_URL / BSC_RPC_URL / ARBITRUM_RPC_URL  Private RPC endpoints (recommended for production)."
      );
      process.exit(0);
    }
  }
  return out;
}

function main() {
  const { chain, amount, broker, dryRun, native, token, decimals, symbol } = parseArgs();
  if (!chain || !amount) {
    console.error(
      "Usage:\n" +
        "  Native: bun run deposit.mjs --chain <eth|bsc|arbitrum> --native --amount <human amount> [--broker <uint256>] [--dry-run]\n" +
        "  ERC20:  bun run deposit.mjs --chain <eth|bsc|arbitrum> --token <0x...> --decimals <n> [--symbol <SYM>] --amount <human amount> [--broker <uint256>] [--dry-run]"
    );
    process.exit(1);
  }

  const chainConf = CHAINS[chain];
  if (!chainConf) {
    console.error("Invalid chain. Use: eth, bsc, arbitrum");
    process.exit(1);
  }

  // SEC-02: Strict key validation (length, format)
  let account = null;
  if (!dryRun) {
    const key = validatePrivateKey(process.env.ASTER_DEPOSIT_PRIVATE_KEY);
    account = privateKeyToAccount(key);
    // SEC-02: Remove key from env after account derivation
    delete process.env.ASTER_DEPOSIT_PRIVATE_KEY;
  }

  const rpcUrl = getRpcUrl(chainConf);
  const publicClient = dryRun ? null : createPublicClient({ chain: chainConf.chain, transport: http(rpcUrl) });
  const walletClient = dryRun ? null : createWalletClient({ account, chain: chainConf.chain, transport: http(rpcUrl) });

  const confirmations = REQUIRED_CONFIRMATIONS[chainConf.chainId] || 2;

  (async () => {
    const depositAddress = await getDepositAddress(chainConf.chainId);

    const isNative = Boolean(native);
    if (isNative && (token || decimals)) {
      console.error("Invalid args: --native cannot be combined with --token/--decimals.");
      process.exit(1);
    }
    if (!isNative) {
      if (!token || decimals == null) {
        console.error("ERC20 deposit requires --token <0x...> and --decimals <n>. Use --native for native deposits.");
        process.exit(1);
      }
    }

    const tokenDecimals = isNative ? (chainConf.chain.nativeCurrency?.decimals ?? 18) : Number(decimals);
    if (!Number.isInteger(tokenDecimals) || tokenDecimals < 0 || tokenDecimals > 255) {
      console.error("Invalid --decimals. Must be an integer between 0 and 255.");
      process.exit(1);
    }

    const amountRaw = parseUnits(amount, tokenDecimals);
    // Audit: reject non-positive amount (parseUnits can return negative)
    if (amountRaw <= 0n) {
      console.error("Amount must be positive. Got:", amount);
      process.exit(1);
    }
    if (broker < 1n) {
      console.error("Broker ID must be >= 1. Got:", broker.toString());
      process.exit(1);
    }

    if (dryRun) {
      console.log("DRY RUN — no transactions will be sent.\n");
      if (isNative) {
        console.log("Chain:", chain, "| Asset:", chainConf.chain.nativeCurrency?.symbol || "NATIVE", "| Amount:", amount, "| Broker:", broker.toString());
      } else {
        const tokenAddress = getAddress(token);
        console.log("Chain:", chain, "| Asset:", symbol || "ERC20", "| Amount:", amount, "| Broker:", broker.toString());
        console.log("Token:", tokenAddress, "| Decimals:", tokenDecimals.toString());
      }
      console.log("Treasury (deposit address):", depositAddress);
      console.log("Amount (raw):", amountRaw.toString());
      console.log("Confirmations required:", confirmations);
      console.log("Max gas limit:", MAX_GAS_LIMIT.toString());
      if (isNative) {
        console.log("\nWould call: treasury.depositNative(" + broker + ") with value:", amountRaw.toString());
      } else {
        const tokenAddress = getAddress(token);
        console.log("\nWould send:");
        console.log("  1. token.approve(" + depositAddress + ", " + amountRaw + ")");
        console.log("  2. treasury.deposit(" + tokenAddress + ", " + amountRaw + ", " + broker + ")");
      }
      return;
    }

    // --- SEC-06: Check balance before deposit ---
    if (isNative) {
      const balance = await publicClient.getBalance({ address: account.address });
      if (balance < amountRaw) {
        console.error(
          `Insufficient native balance. Have: ${formatUnits(balance, tokenDecimals)}, ` +
          `need: ${amount}. Aborting (gas fees also required).`
        );
        process.exit(1);
      }
    } else {
      const tokenAddress = getAddress(token);
      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf",
        args: [account.address],
      });
      if (balance < amountRaw) {
        console.error(
          `Insufficient ${(symbol || "ERC20")} balance. Have: ${formatUnits(balance, tokenDecimals)}, ` +
          `need: ${amount}. Aborting.`
        );
        process.exit(1);
      }
    }

    // --- Native deposit ---
    if (isNative) {
      // SEC-09: Explicit gas limit
      const hash = await walletClient.writeContract({
        address: depositAddress,
        abi: TREASURY_ABI,
        functionName: "depositNative",
        args: [broker],
        value: amountRaw,
        gas: MAX_GAS_LIMIT,
      });
      console.log("Native deposit tx:", hash);
      // SEC-10: Per-chain confirmations
      await publicClient.waitForTransactionReceipt({ hash, confirmations });
      console.log(`Deposit complete (${confirmations} confirmations).`);
      return;
    }

    // --- ERC20 deposit ---
    const tokenAddress = getAddress(token);

    // SEC-09: Explicit gas limit on approve
    const approveHash = await walletClient.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [depositAddress, amountRaw],
      gas: MAX_GAS_LIMIT,
    });
    console.log("Approve tx:", approveHash);
    await publicClient.waitForTransactionReceipt({ hash: approveHash, confirmations });

    // SEC-09: Explicit gas limit on deposit
    const depositHash = await walletClient.writeContract({
      address: depositAddress,
      abi: TREASURY_ABI,
      functionName: "deposit",
      args: [tokenAddress, amountRaw, broker],
      gas: MAX_GAS_LIMIT,
    });
    console.log("Deposit tx:", depositHash);
    // SEC-10: Per-chain confirmations
    await publicClient.waitForTransactionReceipt({ hash: depositHash, confirmations });
    console.log(`Deposit complete (${confirmations} confirmations).`);
  })().catch((err) => {
    // SEC-02: Sanitize error output to prevent key leakage
    console.error(sanitizeError(err));
    process.exit(1);
  });
}

main();
