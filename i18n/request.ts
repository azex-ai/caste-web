import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const SUPPORTED_LOCALES = ["en", "ko"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

function isLocale(v: string | undefined): v is Locale {
  return !!v && (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

export async function resolveLocale(): Promise<Locale> {
  const cookie = (await cookies()).get("locale")?.value;
  if (isLocale(cookie)) return cookie;

  const accept = (await headers()).get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

// Static imports so the bundler can statically resolve + split each locale's
// JSON chunk. The previous `import(\`../messages/${locale}.json\`)` template
// literal forced webpack into a wildcard chunk for every file in messages/.
import enMessages from "../messages/en.json";
import koMessages from "../messages/ko.json";

const MESSAGES: Record<Locale, typeof enMessages> = {
  en: enMessages,
  ko: koMessages,
};

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  return {
    locale,
    messages: MESSAGES[locale],
  };
});
