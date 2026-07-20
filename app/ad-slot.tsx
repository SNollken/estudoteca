export type ViewerPlan = "free" | "plus";

type AdSlotProps = {
  placement: string;
  viewerPlan?: ViewerPlan;
  format?: "banner" | "rectangle";
  compact?: boolean;
};

/** Paid viewers render no container at all, so ads never leave an empty gap. */
export function AdSlot({
  placement,
  viewerPlan = "free",
  format = "banner",
  compact = false,
}: AdSlotProps) {
  if (viewerPlan === "plus") return null;

  return (
    <aside
      className={`ad-slot ad-slot-${format}${compact ? " ad-slot-compact" : ""}`}
      aria-label="Publicidade"
      data-ad-placement={placement}
    >
      <span>Publicidade</span>
      <div aria-hidden="true"><i /><i /><i /></div>
    </aside>
  );
}
