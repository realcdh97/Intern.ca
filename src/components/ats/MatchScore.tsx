import { matchTone } from "@/lib/ats";
import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score?: number | null;
  showBar?: boolean;
  className?: string;
}

/**
 * A candidate's 0-100 keyword match. Rendered as a number plus an optional bar;
 * the bar carries no information the number doesn't, so it is decorative and
 * hidden from assistive tech.
 */
const MatchScore = ({ score, showBar = true, className }: MatchScoreProps) => {
  if (score == null) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-sm font-semibold tabular-nums w-9", matchTone(score))}>
        {score}%
      </span>
      {showBar && (
        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden" aria-hidden="true">
          <div
            className={cn(
              "h-full rounded-full",
              score >= 60 ? "bg-emerald-500" : score >= 30 ? "bg-amber-500" : "bg-muted-foreground/40"
            )}
            style={{ width: `${Math.max(2, Math.min(100, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MatchScore;
