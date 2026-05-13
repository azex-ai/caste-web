import { Badge } from "@/components/ui/badge";

const TONE: Record<string, "accent" | "positive" | "warning" | "negative" | "default" | "outline"> =
  {
    "custom-curve": "accent",
    "swap-router": "accent",
    "fee-rebate": "positive",
    "dynamic-fee": "warning",
    "permissioned-lp": "warning",
    initializer: "outline",
    "no-op": "outline",
    unknown: "default",
  };

const LABEL: Record<string, string> = {
  "custom-curve": "Custom Curve",
  "swap-router": "Swap Router",
  "fee-rebate": "Fee Rebate",
  "dynamic-fee": "Dynamic Fee",
  "permissioned-lp": "Permissioned LP",
  initializer: "Init Only",
  "no-op": "No-op",
  unknown: "Unknown",
};

export function HookBehaviorBadge({ behavior }: { behavior: string }) {
  const tone = TONE[behavior] ?? "default";
  const label = LABEL[behavior] ?? behavior;
  return <Badge variant={tone}>{label}</Badge>;
}
