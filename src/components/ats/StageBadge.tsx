import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS, STAGE_STYLES } from "@/lib/ats";
import { ApplicationStage } from "@/types";
import { cn } from "@/lib/utils";

interface StageBadgeProps {
  stage: ApplicationStage;
  className?: string;
}

const StageBadge = ({ stage, className }: StageBadgeProps) => (
  <Badge variant="secondary" className={cn(STAGE_STYLES[stage], "font-medium", className)}>
    {STAGE_LABELS[stage]}
  </Badge>
);

export default StageBadge;
