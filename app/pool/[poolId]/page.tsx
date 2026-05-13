import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { PoolDetail } from "@/components/pool-detail";

export const dynamic = "force-dynamic";

export default async function PoolPage(props: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await props.params;
  const data = await api.pool(poolId).catch(() => null);
  if (!data) notFound();

  return (
    <main>
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <Link
          href="/"
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          ← all tokens
        </Link>
      </div>
      <PoolDetail data={data} variant="page" />
    </main>
  );
}
