import type { DecodedHookFlags } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";

// Map of decoded flag keys to display labels, in the canonical bit order.
const FLAG_DISPLAY: Array<{ key: keyof DecodedHookFlags; label: string }> = [
  { key: "beforeInitialize", label: "beforeInit" },
  { key: "afterInitialize", label: "afterInit" },
  { key: "beforeAddLiquidity", label: "beforeAddLiq" },
  { key: "afterAddLiquidity", label: "afterAddLiq" },
  { key: "beforeRemoveLiquidity", label: "beforeRemoveLiq" },
  { key: "afterRemoveLiquidity", label: "afterRemoveLiq" },
  { key: "beforeSwap", label: "beforeSwap" },
  { key: "afterSwap", label: "afterSwap" },
  { key: "beforeDonate", label: "beforeDonate" },
  { key: "afterDonate", label: "afterDonate" },
  { key: "beforeSwapReturnsDelta", label: "beforeSwap+Δ" },
  { key: "afterSwapReturnsDelta", label: "afterSwap+Δ" },
  { key: "afterAddLiquidityReturnsDelta", label: "afterAddLiq+Δ" },
  { key: "afterRemoveLiquidityReturnsDelta", label: "afterRemoveLiq+Δ" },
];

export function HookFlagsGrid({ flags }: { flags: DecodedHookFlags }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FLAG_DISPLAY.map(({ key, label }) =>
        flags[key] ? (
          <Badge key={key} variant="accent">
            {label}
          </Badge>
        ) : (
          <Badge key={key} variant="outline" className="opacity-30">
            {label}
          </Badge>
        ),
      )}
    </div>
  );
}
