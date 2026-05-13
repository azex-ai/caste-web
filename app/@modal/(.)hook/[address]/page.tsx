import { api } from "@/lib/api/client";
import { InterceptModal } from "@/components/intercept-modal";
import { HookDetail } from "@/components/hook-detail";

export const dynamic = "force-dynamic";

export default async function InterceptedHookPage(props: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await props.params;
  const data = await api.hook(address).catch(() => null);
  if (!data) return null;
  const title = `Hook ${data.hook.address} — ${data.hook.behavior}`;
  return (
    <InterceptModal title={title}>
      <HookDetail data={data} variant="modal" />
    </InterceptModal>
  );
}
