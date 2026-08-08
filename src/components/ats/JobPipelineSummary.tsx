import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Application, Job, PipelineFunnel } from "@/types";
import { ACTIVE_STAGES, stageOf, STAGE_LABELS } from "@/lib/ats";
import StageBadge from "./StageBadge";
import MatchScore from "./MatchScore";
import { ArrowRight } from "lucide-react";

interface JobPipelineSummaryProps {
  job: Job;
}

/**
 * Compact pipeline read-out for the employer dashboard: stage counts and the
 * strongest candidates, with a link through to the full applicant pipeline.
 */
const JobPipelineSummary = ({ job }: JobPipelineSummaryProps) => {
  const [funnel, setFunnel] = useState<PipelineFunnel | null>(null);
  const [top, setTop] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    Promise.all([api.ats.funnel(job.id), api.ats.ranked(job.id)])
      .then(([funnelData, ranked]) => {
        if (cancelled) return;
        setFunnel(funnelData);
        setTop(ranked.slice(0, 3));
      })
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [job.id]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Pipeline</CardTitle>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/jobs/${job.id}/pipeline`}>
            Review applicants
            <ArrowRight size={15} className="ml-1.5" aria-hidden="true" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading pipeline…</p>
        ) : failed ? (
          <p className="text-sm text-muted-foreground">
            Pipeline unavailable — the backend is not reachable.
          </p>
        ) : !funnel || funnel.totalApplications === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {ACTIVE_STAGES.map((stage) => (
                <div key={stage} className="rounded-md border px-2.5 py-1.5 min-w-16">
                  <p className="text-xs text-muted-foreground">{STAGE_LABELS[stage]}</p>
                  <p className="text-lg font-semibold leading-tight">{funnel.byStage[stage]}</p>
                </div>
              ))}
              <div className="rounded-md border px-2.5 py-1.5 min-w-16 bg-muted/40">
                <p className="text-xs text-muted-foreground">Awaiting</p>
                <p className="text-lg font-semibold leading-tight">{funnel.awaitingReview}</p>
              </div>
            </div>

            {top.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">Strongest matches</h4>
                  {funnel.strongMatches > 0 && (
                    <Badge variant="secondary" className="font-normal">
                      {funnel.strongMatches} above {funnel.strongMatchThreshold}%
                    </Badge>
                  )}
                </div>
                <ul className="divide-y rounded-md border">
                  {top.map((application) => (
                    <li
                      key={application.id}
                      className="flex items-center justify-between gap-3 px-3 py-2"
                    >
                      <span className="text-sm font-medium truncate">
                        {application.candidateName}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <MatchScore score={application.matchScore} showBar={false} />
                        <StageBadge stage={stageOf(application)} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPipelineSummary;
