// Types mirror the JSON shape served by the Hono API in src/api/index.ts.
// Bigint fields arrive as decimal strings.

export type DecodedHookFlags = {
  beforeInitialize: boolean;
  afterInitialize: boolean;
  beforeAddLiquidity: boolean;
  afterAddLiquidity: boolean;
  beforeRemoveLiquidity: boolean;
  afterRemoveLiquidity: boolean;
  beforeSwap: boolean;
  afterSwap: boolean;
  beforeDonate: boolean;
  afterDonate: boolean;
  beforeSwapReturnsDelta: boolean;
  afterSwapReturnsDelta: boolean;
  afterAddLiquidityReturnsDelta: boolean;
  afterRemoveLiquidityReturnsDelta: boolean;
};

export type Hook = {
  address: `0x${string}`;
  firstSeenBlock: string;
  firstSeenAt: string;
  flags: number;
  behavior: string;
  poolCount: number;
  swapCount: number;
  totalAmount0Abs: string;
  totalAmount1Abs: string;
  decodedFlags: DecodedHookFlags;
};

export type Token = {
  address: `0x${string}`;
  symbol: string | null;
  name: string | null;
  decimals: number;
  isBase: boolean;
  firstSeenBlock: string;
  firstSeenAt: string;
  poolCount: number;
  swapCount: number;
  totalVolumeAbs: string;
  volumeUsd18: string;
  volumeEth18: string;
};

export type Pool = {
  poolId: `0x${string}`;
  hook: `0x${string}`;
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  createdBlock: string;
  createdAt: string;
  swapCount: number;
  quoteIndex: number;
  quoteKind: "usd" | "eth" | "none";
};

export type Swap = {
  id: string;
  poolId: `0x${string}`;
  hook: `0x${string}`;
  sender: `0x${string}`;
  amount0: string;
  amount1: string;
  sqrtPriceX96: string;
  tick: number;
  blockNumber: string;
  blockTimestamp: string;
  txHash: `0x${string}`;
};

export type Stats = {
  hookCount: number;
  hookedPoolCount: number;
  totalPoolCount: number;
  unhookedPoolCount: number;
  swapsThroughHookedPools: number;
  tokenCount: number;
  memeCount: number;
  ethUsd: number | null;
  ethUsdUpdatedAt: string | null;
};

export type TokenDetail = {
  token: Token;
  pools: Pool[];
  hooks: Hook[];
};

export type PoolDetail = {
  pool: Pool;
  token0: Token | null;
  token1: Token | null;
  hook: Hook | null;
  swaps: Swap[];
};

export type HookDetail = {
  hook: Hook;
  pools: Pool[];
};
