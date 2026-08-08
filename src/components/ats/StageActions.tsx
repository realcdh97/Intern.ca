import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { allowedTransitions, isTerminal, nextStage, STAGE_LABELS } from "@/lib/ats";
import { ApplicationStage } from "@/types";

interface StageActionsProps {
  stage: ApplicationStage;
  onMove: (target: ApplicationStage) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "default";
}

/**
 * Stage change menu. Only lists moves the pipeline allows from the current
 * stage, so an illegal move is not offered rather than failing on the server.
 */
const StageActions = ({ stage, onMove, disabled, label, size = "sm" }: StageActionsProps) => {
  const targets = allowedTransitions(stage);
  const next = nextStage(stage);
  const forward = targets.filter((t) => t !== "REJECTED" && t !== "WITHDRAWN");
  const outcomes = targets.filter((t) => t === "REJECTED" || t === "WITHDRAWN");

  if (isTerminal(stage)) {
    return (
      <Button variant="ghost" size={size} disabled title={`${STAGE_LABELS[stage]} is final`}>
        No actions
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {next && (
        <Button size={size} variant="outline" disabled={disabled} onClick={() => onMove(next)}>
          Move to {STAGE_LABELS[next]}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={size} variant="ghost" disabled={disabled} aria-label="More stage actions">
            {label ?? <ChevronDown size={16} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Move to</DropdownMenuLabel>
          {forward.map((target) => (
            <DropdownMenuItem key={target} onClick={() => onMove(target)}>
              {STAGE_LABELS[target]}
            </DropdownMenuItem>
          ))}
          {outcomes.length > 0 && <DropdownMenuSeparator />}
          {outcomes.map((target) => (
            <DropdownMenuItem
              key={target}
              onClick={() => onMove(target)}
              className={target === "REJECTED" ? "text-destructive focus:text-destructive" : ""}
            >
              {STAGE_LABELS[target]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StageActions;
