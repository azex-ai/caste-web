import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { getEthUsd } from "@/lib/external/price";
import { TokenDetail } from "@/components/token-detail";

export const dynamic = "force-dynamic";

export default async function TokenPage(props: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await props.params;
  const [data, ethUsd] = await Promise.all([
    api.token(address).catch(() => null),
    getEthUsd(),
  ]);
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
      <TokenDetail data={data} ethUsd={ethUsd} variant="page" />
    </main>
  );
}
