import { createConfig, http } from "wagmi";
import { mainnet, base, type Chain } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545";
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);

const CHAINS_BY_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
};

const activeChain = CHAINS_BY_ID[CHAIN_ID] ?? mainnet;

// Browser-extension wallets only (Metamask / Rabby / Coinbase / etc).
// WalletConnect/Reown is intentionally NOT enabled — it requires a remote
// project ID and adds a network dependency the staging deploy doesn't need.
export const wagmiConfig = createConfig({
  chains: [activeChain],
  connectors: [injected(), metaMask()],
  transports: {
    [activeChain.id]: http(RPC_URL),
  },
});

export const activeChainId = activeChain.id;
