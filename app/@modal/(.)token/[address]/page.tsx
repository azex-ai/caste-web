import { api } from "@/lib/api/client";
import { getEthUsd } from "@/lib/external/price";
import { InterceptModal } from "@/components/intercept-modal";
import { TokenDetail } from "@/components/token-detail";

export const dynamic = "force-dynamic";

export default async function InterceptedTokenPage(props: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await props.params;
  const [data, ethUsd] = await Promise.all([
    api.token(address).catch(() => null),
    getEthUsd(),
  ]);
  if (!data) return null;

  const title = `${data.token.symbol ?? "Token"} — ${data.token.address}`;
  return (
    <InterceptModal title={title}>
      <TokenDetail data={data} ethUsd={ethUsd} variant="modal" />
    </InterceptModal>
  );
}
