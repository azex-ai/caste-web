import { api } from "@/lib/api/client";
import { InterceptModal } from "@/components/intercept-modal";
import { PoolDetail } from "@/components/pool-detail";

export const dynamic = "force-dynamic";

export default async function InterceptedPoolPage(props: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await props.params;
  const data = await api.pool(poolId).catch(() => null);
  if (!data) return null;
  const title = `Pool ${data.pool.poolId}`;
  return (
    <InterceptModal title={title}>
      <PoolDetail data={data} variant="modal" />
    </InterceptModal>
  );
}
