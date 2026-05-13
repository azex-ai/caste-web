import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { HookDetail } from "@/components/hook-detail";

export const dynamic = "force-dynamic";

export default async function HookPage(props: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await props.params;
  const data = await api.hook(address).catch(() => null);
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
      <HookDetail data={data} variant="page" />
    </main>
  );
}
