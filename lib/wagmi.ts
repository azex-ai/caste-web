import { createConfig, http } from "wagmi";
import { mainnet, base, type Chain } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545";
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "demo-placeholder-id";

const CHAINS_BY_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
};

const activeChain = CHAINS_BY_ID[CHAIN_ID] ?? mainnet;

export const wagmiConfig = createConfig({
  chains: [activeChain],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: WC_PROJECT_ID }),
  ],
  transports: {
    [activeChain.id]: http(RPC_URL),
  },
});

export const activeChainId = activeChain.id;
