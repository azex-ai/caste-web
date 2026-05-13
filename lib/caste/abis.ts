// $CASTE — contract ABIs derived from interface definitions (spec §4-8)
// These are manually written based on the Solidity interfaces; fill in exact
// signatures once the contracts are compiled.

export const MintManagerAbi = [
  // Write
  {
    name: "batchMint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "size", type: "uint8" }],
    outputs: [],
  },
  {
    name: "revealMint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "mintId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "publicReveal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "maxN", type: "uint256" }],
    outputs: [],
  },
  // Events
  {
    name: "MintCommitted",
    type: "event",
    inputs: [
      { name: "mintId", type: "uint256", indexed: true },
      { name: "minter", type: "address", indexed: true },
      { name: "size", type: "uint8", indexed: false },
      { name: "revealBlock", type: "uint64", indexed: false },
    ],
  },
  {
    name: "MintRevealed",
    type: "event",
    inputs: [
      { name: "mintId", type: "uint256", indexed: true },
      { name: "minter", type: "address", indexed: true },
      { name: "size", type: "uint8", indexed: false },
    ],
  },
] as const;

export const CasteCardAbi = [
  // Read
  {
    name: "getCard",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "data",
        type: "tuple",
        components: [
          { name: "tier", type: "uint8" },
          { name: "variant", type: "uint8" },
          { name: "signatureIdx", type: "uint8" },
          { name: "trait0", type: "uint8" },
          { name: "trait1", type: "uint8" },
          { name: "trait2", type: "uint8" },
          { name: "mintId", type: "uint256" },
          { name: "mintNumber", type: "uint256" },
          { name: "mintTimestamp", type: "uint40" },
          { name: "swapCount", type: "uint32" },
          { name: "jackpotCount", type: "uint32" },
        ],
      },
    ],
  },
  {
    name: "getHighestTier",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "tokenOfOwnerByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Events
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;

export const CasteTokenAbi = [
  // Read
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "transfersLocked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write
  {
    name: "burn",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const CasteHookAbi = [
  // Read
  {
    name: "getPendingHead",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getPendingTail",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "megaPool",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "megaDeadline",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "hourlyPool",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write
  {
    name: "executeBuy",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "buyId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "publicReveal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "maxN", type: "uint256" }],
    outputs: [],
  },
  {
    name: "revealOne",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "buyId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "settleHourly",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "epoch", type: "uint256" }],
    outputs: [],
  },
  {
    name: "settleMega",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // Events
  {
    name: "BuyQueued",
    type: "event",
    inputs: [
      { name: "buyId", type: "uint256", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "units", type: "uint8", indexed: false },
      { name: "executeBlock", type: "uint64", indexed: false },
    ],
  },
  {
    name: "BuyExecuted",
    type: "event",
    inputs: [
      { name: "buyId", type: "uint256", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "units", type: "uint8", indexed: false },
      { name: "multiplier", type: "uint8", indexed: false },
      { name: "tokensOut", type: "uint256", indexed: false },
    ],
  },
  {
    name: "HourlySettled",
    type: "event",
    inputs: [
      { name: "epoch", type: "uint256", indexed: true },
      { name: "winner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "MegaSettled",
    type: "event",
    inputs: [
      { name: "round", type: "uint256", indexed: true },
      { name: "winner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

// Standard ERC20 approve ABI (for USDC approval)
export const Erc20Abi = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
