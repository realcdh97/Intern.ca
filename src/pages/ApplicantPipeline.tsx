import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/services/api";
import { Application, ApplicationStage, Job, PipelineFunnel } from "@/types";
import {
  ACTIVE_STAGES,
  formatDate,
  stageOf,
  STAGE_LABELS,
  STAGE_ORDER,
  TERMINAL_STAGES,
} from "@/lib/ats";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import StageBadge from "@/components/ats/StageBadge";
import StageActions from "@/components/ats/StageActions";
import MatchScore from "@/components/ats/MatchScore";
import StarRating from "@/components/ats/StarRating";
import CandidateDetail from "@/components/ats/CandidateDetail";
import PipelineFunnelChart from "@/components/ats/PipelineFunnelChart";
import { ArrowLeft, ChevronDown, RefreshCw, Search } from "lucide-react";

type SortKey = "match" | "rating" | "applied" | "name";

const ApplicantPipeline = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const id = Number(jobId);
  const { user } = useAuth();
  const actor = user?.id ?? "recruiter";

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [funnel, setFunnel] = useState<PipelineFunnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ApplicationStage | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detail, setDetail] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setError("That job id is not valid.");
      setLoading(false);
      return;
    }
    try {
      const [ranked, funnelData, jobs] = await Promise.all([
        api.ats.ranked(id),
        api.ats.funnel(id),
        api.jobs.getAll(),
      ]);
      setApplications(ranked);
      setFunnel(funnelData);
      setJob(jobs.find((j) => j.id === id) ?? null);
      setError(null);
    } catch {
      setError("Could not reach the backend. Start it with ./gradlew bootRun in backend/.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the open detail panel in sync with refreshed data.
  useEffect(() => {
    if (!detail) return;
    const fresh = applications.find((a) => a.id === detail.id);
    if (fresh && fresh !== detail) setDetail(fresh);
  }, [applications, detail]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: applications.length };
    for (const stage of STAGE_ORDER) {
      result[stage] = applications.filter((a) => stageOf(a) === stage).length;
    }
    return result;
  }, [applications]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = applications.filter((a) => {
      if (activeTab !== "ALL" && stageOf(a) !== activeTab) return false;
      if ((a.matchScore ?? 0) < minScore) return false;
      if (minRating > 0 && (a.rating ?? 0) < minRating) return false;
      if (!term) return true;
      return (
        a.candidateName?.toLowerCase().includes(term) ||
        a.candidateEmail?.toLowerCase().includes(term) ||
        a.skills?.toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sortKey) {
        case "rating":
          return (b.rating ?? -1) - (a.rating ?? -1);
        case "applied":
          return (b.appliedAt ?? "").localeCompare(a.appliedAt ?? "");
        case "name":
          return (a.candidateName ?? "").localeCompare(b.candidateName ?? "");
        default:
          return (b.matchScore ?? -1) - (a.matchScore ?? -1);
      }
    });
    return sorted;
  }, [applications, activeTab, search, minScore, minRating, sortKey]);

  // Drop selections that are no longer visible, so bulk actions can never act
  // on a candidate the user cannot see.
  useEffect(() => {
    setSelected((prev) => {
      const visibleIds = new Set(visible.map((a) => a.id));
      const next = new Set([...prev].filter((selectedId) => visibleIds.has(selectedId)));
      return next.size === prev.size ? prev : next;
    });
  }, [visible]);

  const allVisibleSelected = visible.length > 0 && visible.every((a) => selected.has(a.id!));

  const toggleAll = () =>
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map((a) => a.id!)));

  const toggleOne = (applicationId: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(applicationId) ? next.delete(applicationId) : next.add(applicationId);
      return next;
    });

  const run = async (action: () => Promise<unknown>, successTitle: string) => {
    setBusy(true);
    try {
      await action();
      toast({ title: successTitle });
      await load();
    } catch {
      toast({
        title: "That action did not go through",
        description: "The server rejected the change.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleMove = (applicationId: number, target: ApplicationStage) =>
    run(
      () =>
        target === "REJECTED"
          ? api.ats.reject(applicationId, actor)
          : api.ats.moveStage(applicationId, target, actor),
      `Moved to ${STAGE_LABELS[target]}`
    );

  /**
   * Bulk moves report per-candidate outcomes, so the toast reflects what the
   * server actually did rather than how many rows were ticked — a selection can
   * include candidates already past, or at, the target stage.
   */
  const handleBulkMove = async (target: ApplicationStage) => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const result = await api.ats.bulkMoveStage(ids, target, actor);
      setSelected(new Set());
      const moved = result.movedCount;
      toast({
        title:
          moved === 0
            ? `No candidates moved to ${STAGE_LABELS[target]}`
            : `Moved ${moved} candidate${moved === 1 ? "" : "s"} to ${STAGE_LABELS[target]}`,
        description:
          result.skippedCount > 0
            ? `${result.skippedCount} skipped — already at or past ${STAGE_LABELS[target]}, or already closed.`
            : undefined,
        variant: moved === 0 ? "destructive" : undefined,
      });
      await load();
    } catch {
      toast({
        title: "That action did not go through",
        description: "The server rejected the change.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const tabs: (ApplicationStage | "ALL")[] = ["ALL", ...ACTIVE_STAGES, ...TERMINAL_STAGES];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-4 container mx-auto max-w-7xl">
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link to="/employer-dashboard">
            <ArrowLeft size={16} className="mr-1.5" aria-hidden="true" />
            Back to dashboard
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{job?.title ?? "Applicants"}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {job ? `${job.company} · ${job.location}` : `Job #${jobId}`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => run(() => api.ats.rescore(id), "Match scores recalculated")}
          >
            <RefreshCw size={15} className="mr-1.5" aria-hidden="true" />
            Recalculate matches
          </Button>
        </div>

        {error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={load}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-[220px_1fr] gap-6">
            {/* Filters */}
            <aside className="space-y-5">
              <div>
                <Label htmlFor="search" className="text-xs font-medium">
                  Search
                </Label>
                <div className="relative mt-1.5">
                  <Search
                    size={15}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, email, skill"
                    className="pl-8 h-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="minScore" className="text-xs font-medium">
                  Minimum match: {minScore}%
                </Label>
                <input
                  id="minScore"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full mt-2 accent-primary"
                />
              </div>

              <div>
                <span className="text-xs font-medium">Minimum rating</span>
                <div className="flex gap-1 mt-1.5">
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={minRating === value ? "default" : "outline"}
                      className="h-7 w-7 p-0 text-xs"
                      onClick={() => setMinRating(value)}
                      aria-pressed={minRating === value}
                    >
                      {value === 0 ? "Any" : value}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-xs font-medium">Sort by</span>
                <div className="flex flex-col gap-1 mt-1.5">
                  {(
                    [
                      ["match", "Match score"],
                      ["rating", "Rating"],
                      ["applied", "Date applied"],
                      ["name", "Name"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={sortKey === key ? "secondary" : "ghost"}
                      className="justify-start h-8"
                      onClick={() => setSortKey(key)}
                      aria-pressed={sortKey === key}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {funnel && (
                <div className="hidden lg:block">
                  <PipelineFunnelChart funnel={funnel} />
                </div>
              )}
            </aside>

            {/* Applicants */}
            <main className="min-w-0 space-y-4">
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by stage">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    size="sm"
                    variant={activeTab === tab ? "default" : "outline"}
                    onClick={() => setActiveTab(tab)}
                    className="h-8"
                  >
                    {tab === "ALL" ? "All" : STAGE_LABELS[tab]}
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs font-normal">
                      {counts[tab] ?? 0}
                    </Badge>
                  </Button>
                ))}
              </div>

              {selected.size > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background px-3 py-2">
                  <span className="text-sm font-medium">
                    {selected.size} selected
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" disabled={busy}>
                        Move to
                        <ChevronDown size={15} className="ml-1" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Move selected to</DropdownMenuLabel>
                      {["SCREENING", "INTERVIEW", "OFFER", "HIRED"].map((stage) => (
                        <DropdownMenuItem
                          key={stage}
                          onClick={() => handleBulkMove(stage as ApplicationStage)}
                        >
                          {STAGE_LABELS[stage as ApplicationStage]}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleBulkMove("REJECTED")}
                      >
                        Decline
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                    Clear
                  </Button>
                </div>
              )}

              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <p className="text-muted-foreground text-sm p-8 text-center">
                      Loading applicants…
                    </p>
                  ) : visible.length === 0 ? (
                    <p className="text-muted-foreground text-sm p-8 text-center">
                      {applications.length === 0
                        ? "No one has applied to this job yet."
                        : "No applicants match these filters."}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">
                              <Checkbox
                                checked={allVisibleSelected}
                                onCheckedChange={toggleAll}
                                aria-label="Select all applicants"
                              />
                            </TableHead>
                            <TableHead>Candidate</TableHead>
                            <TableHead className="w-32">Match</TableHead>
                            <TableHead className="w-28">Rating</TableHead>
                            <TableHead className="w-28">Stage</TableHead>
                            <TableHead className="w-28">Applied</TableHead>
                            <TableHead className="w-56 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {visible.map((application) => {
                            const stage = stageOf(application);
                            return (
                              <TableRow key={application.id} className="group">
                                <TableCell>
                                  <Checkbox
                                    checked={selected.has(application.id!)}
                                    onCheckedChange={() => toggleOne(application.id!)}
                                    aria-label={`Select ${application.candidateName}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <button
                                    type="button"
                                    onClick={() => setDetail(application)}
                                    className="text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                                  >
                                    <span className="font-medium block">
                                      {application.candidateName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {application.candidateEmail}
                                    </span>
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <MatchScore score={application.matchScore} />
                                </TableCell>
                                <TableCell>
                                  <StarRating value={application.rating} readOnly size={13} />
                                </TableCell>
                                <TableCell>
                                  <StageBadge stage={stage} />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(application.appliedAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end">
                                    <StageActions
                                      stage={stage}
                                      disabled={busy}
                                      onMove={(target) => handleMove(application.id!, target)}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {funnel && (
                <div className="lg:hidden">
                  <PipelineFunnelChart funnel={funnel} />
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      <CandidateDetail
        application={detail}
        actor={actor}
        open={detail !== null}
        onOpenChange={(open) => !open && setDetail(null)}
        onChanged={load}
      />
      <Footer />
    </div>
  );
};

export default ApplicantPipeline;
