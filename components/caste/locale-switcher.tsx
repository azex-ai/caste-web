"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Locale = "en" | "ko";
const ONE_YEAR = 60 * 60 * 24 * 365;

function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

export function LocaleSwitcher() {
  const current = useLocale() as Locale;
  const t = useTranslations("language");
  // Destructure the one method we use so React Compiler can memoize cleanly
  // (the full router object isn't a stable reference).
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();

  function pick(next: Locale) {
    if (next === current || isPending) return;
    setLocaleCookie(next);
    startTransition(() => {
      refresh();
    });
  }

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ko", label: "KO" },
  ];

  return (
    <div
      role="group"
      aria-label={t("label")}
      style={{
        display: "inline-flex",
        gap: 1,
        padding: 2,
        border: "1px solid var(--ink-400)",
        borderRadius: 3,
        background: "var(--ink-100)",
        fontFamily: "var(--f-mono)",
      }}
    >
      {options.map((opt) => {
        const on = opt.value === current;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => pick(opt.value)}
            disabled={isPending}
            aria-pressed={on}
            style={{
              padding: "4px 8px",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: on ? "var(--ink-000)" : "var(--bone-dim)",
              background: on ? "var(--acid)" : "transparent",
              border: "none",
              borderRadius: 2,
              cursor: isPending ? "wait" : on ? "default" : "pointer",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
