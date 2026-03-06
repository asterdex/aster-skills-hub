/**
 * Aster Treasury contract ABI — single source of truth (SEC-05).
 * common.mjs imports from here. Do NOT duplicate this ABI elsewhere.
 */
export const treasuryContractABI = [
  {
    inputs: [
      { internalType: 'address', name: 'currency', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'broker', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'broker', type: 'uint256' }],
    name: 'depositNative',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  }
] as const
