import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import {
  Application,
  ApplicationEvent,
  ApplicationNote,
  ApplicationStage,
  MatchBreakdown,
} from "@/types";
import { formatDate, formatDateTime, stageOf, STAGE_LABELS } from "@/lib/ats";
import { toast } from "@/hooks/use-toast";
import StageBadge from "./StageBadge";
import StageActions from "./StageActions";
import StarRating from "./StarRating";
import MatchScore from "./MatchScore";
import { ExternalLink, Mail } from "lucide-react";

interface CandidateDetailProps {
  application: Application | null;
  actor: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after any change so the parent can refresh its lists. */
  onChanged: () => void;
}

/**
 * Everything about one candidate: their submission, why they scored what they
 * scored, and the reviewer tools (stage, rating, assignment, notes, history).
 */
const CandidateDetail = ({
  application,
  actor,
  open,
  onOpenChange,
  onChanged,
}: CandidateDetailProps) => {
  const [timeline, setTimeline] = useState<ApplicationEvent[]>([]);
  const [notes, setNotes] = useState<ApplicationNote[]>([]);
  const [match, setMatch] = useState<MatchBreakdown | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [assignee, setAssignee] = useState("");
  const [busy, setBusy] = useState(false);

  const id = application?.id;

  useEffect(() => {
    if (!id || !open) return;
    setAssignee(application?.assignedTo ?? "");
    Promise.all([api.ats.timeline(id), api.ats.notes(id), api.ats.match(id)])
      .then(([timelineData, notesData, matchData]) => {
        setTimeline(timelineData);
        setNotes(notesData);
        setMatch(matchData);
      })
      .catch(() => {
        toast({
          title: "Could not load candidate details",
          description: "The backend may not be running.",
          variant: "destructive",
        });
      });
  }, [id, open, application?.assignedTo, application?.stage, application?.rating]);

  if (!application || !id) return null;

  const stage = stageOf(application);

  /** Runs a mutation, surfaces failures, and refreshes the parent. */
  const run = async (action: () => Promise<unknown>, successTitle: string) => {
    setBusy(true);
    try {
      await action();
      toast({ title: successTitle });
      onChanged();
    } catch {
      toast({
        title: "That action did not go through",
        description: "The server rejected the change. Refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleMove = (target: ApplicationStage) =>
    run(
      () =>
        target === "REJECTED"
          ? api.ats.reject(id, actor)
          : api.ats.moveStage(id, target, actor),
      `Moved to ${STAGE_LABELS[target]}`
    );

  const handleAddNote = () => {
    if (!noteDraft.trim()) return;
    run(async () => {
      await api.ats.addNote(id, actor, noteDraft.trim());
      setNoteDraft("");
      setNotes(await api.ats.notes(id));
    }, "Note added");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div>
              <SheetTitle className="text-xl">{application.candidateName}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 mt-1">
                <Mail size={14} aria-hidden="true" />
                <a href={`mailto:${application.candidateEmail}`} className="hover:underline">
                  {application.candidateEmail}
                </a>
              </SheetDescription>
            </div>
            <StageBadge stage={stage} />
          </div>
        </SheetHeader>

        <div className="flex flex-wrap items-center gap-3 py-4">
          <StageActions stage={stage} onMove={handleMove} disabled={busy} />
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">Rating</span>
          <StarRating
            value={application.rating}
            onChange={(rating) => run(() => api.ats.rate(id, rating, actor), `Rated ${rating}/5`)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">Match</span>
          <MatchScore score={application.matchScore} />
        </div>

        <div className="flex items-center justify-between py-2 gap-3">
          <Label htmlFor="assignee" className="text-sm text-muted-foreground font-normal">
            Assigned to
          </Label>
          <div className="flex gap-2">
            <Input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Reviewer id"
              className="h-8 w-40"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={busy || assignee === (application.assignedTo ?? "")}
              onClick={() => run(() => api.ats.assign(id, assignee, actor), "Assignment updated")}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-muted-foreground">Applied</span>
          <span>{formatDate(application.appliedAt)}</span>
        </div>

        {application.rejectionReason && (
          <p className="text-sm text-destructive bg-destructive/5 rounded-md p-2 mt-2">
            Declined: {application.rejectionReason}
          </p>
        )}

        <Separator className="my-4" />

        <Tabs defaultValue="application">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="match">Match</TabsTrigger>
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="application" className="space-y-4 pt-4">
            {application.skills && (
              <div>
                <h4 className="text-sm font-medium mb-1.5">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {application.skills.split(",").map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-normal">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {(application.resumeUrl || application.portfolioUrl) && (
              <div className="flex gap-2">
                {application.resumeUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={application.resumeUrl} target="_blank" rel="noreferrer">
                      Resume <ExternalLink size={13} className="ml-1.5" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                {application.portfolioUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={application.portfolioUrl} target="_blank" rel="noreferrer">
                      Portfolio <ExternalLink size={13} className="ml-1.5" aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium mb-1.5">Cover letter</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {application.coverLetter || "No cover letter submitted."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="match" className="space-y-4 pt-4">
            {!match ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Keyword overlap between this candidate and the job description. It ranks a
                  shortlist — it is not a hiring decision.
                </p>
                <div>
                  <h4 className="text-sm font-medium mb-1.5">
                    Matched ({match.matched.length})
                  </h4>
                  {match.matched.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nothing matched.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {match.matched.map((term) => (
                        <Badge
                          key={term}
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 font-normal"
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1.5">
                    Not mentioned ({match.missing.length})
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Worth probing at interview.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.missing.slice(0, 24).map((term) => (
                      <Badge key={term} variant="outline" className="font-normal">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-3 pt-4">
            <div className="space-y-2">
              <Label htmlFor="note" className="sr-only">
                Add a note
              </Label>
              <Textarea
                id="note"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a note for the hiring team…"
                rows={3}
              />
              <Button size="sm" onClick={handleAddNote} disabled={busy || !noteDraft.trim()}>
                Add note
              </Button>
            </div>
            <Separator />
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li key={note.id} className="text-sm">
                    <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                      <span className="font-medium">{note.author}</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{note.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            ) : (
              <ol className="space-y-3">
                {timeline.map((event) => (
                  <li key={event.id} className="text-sm flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                      <p>
                        {event.fromStage && event.fromStage !== event.toStage ? (
                          <>
                            {STAGE_LABELS[event.fromStage]} →{" "}
                            <span className="font-medium">{STAGE_LABELS[event.toStage]}</span>
                          </>
                        ) : (
                          <span className="font-medium">{STAGE_LABELS[event.toStage]}</span>
                        )}
                      </p>
                      {event.note && (
                        <p className="text-muted-foreground text-xs mt-0.5">{event.note}</p>
                      )}
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {event.actor} · {formatDateTime(event.occurredAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default CandidateDetail;
