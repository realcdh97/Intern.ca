import { ApplicationStage } from "@/types";

/** Pipeline order, matching ApplicationStage on the backend. */
export const STAGE_ORDER: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
];

/** The forward pipeline, excluding terminal outcomes. */
export const ACTIVE_STAGES: ApplicationStage[] = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER"];

export const TERMINAL_STAGES: ApplicationStage[] = ["HIRED", "REJECTED", "WITHDRAWN"];

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  HIRED: "Hired",
  REJECTED: "Declined",
  WITHDRAWN: "Withdrawn",
};

/** Badge styling per stage; muted for terminal outcomes. */
export const STAGE_STYLES: Record<ApplicationStage, string> = {
  APPLIED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  SCREENING: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  INTERVIEW: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  OFFER: "bg-amber-100 text-amber-900 hover:bg-amber-100",
  HIRED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  REJECTED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  WITHDRAWN: "bg-muted text-muted-foreground hover:bg-muted",
};

export function isTerminal(stage: ApplicationStage): boolean {
  return TERMINAL_STAGES.includes(stage);
}

function orderOf(stage: ApplicationStage): number {
  const index = ACTIVE_STAGES.indexOf(stage);
  if (index >= 0) return index;
  return stage === "HIRED" ? ACTIVE_STAGES.length : -1;
}

/**
 * Mirrors ApplicationStage.canTransitionTo on the backend: forward moves may
 * skip stages, nothing moves backwards, and terminal stages are final.
 *
 * <p>The server is still the authority — this only keeps the UI from offering
 * moves that would be rejected.
 */
export function canTransition(from: ApplicationStage, to: ApplicationStage): boolean {
  if (to === from || isTerminal(from)) return false;
  if (to === "REJECTED" || to === "WITHDRAWN") return true;
  if (to === "APPLIED") return false;
  return orderOf(to) > orderOf(from);
}

/** Every stage a candidate can legally be moved to right now. */
export function allowedTransitions(from: ApplicationStage): ApplicationStage[] {
  return STAGE_ORDER.filter((stage) => canTransition(from, stage));
}

/** The next stage forward, or null at a terminal stage. */
export function nextStage(from: ApplicationStage): ApplicationStage | null {
  if (isTerminal(from)) return null;
  const index = ACTIVE_STAGES.indexOf(from);
  if (index < 0) return null;
  return index === ACTIVE_STAGES.length - 1 ? "HIRED" : ACTIVE_STAGES[index + 1];
}

export function stageOf(application: { stage?: ApplicationStage; status?: string }): ApplicationStage {
  return application.stage ?? ((application.status as ApplicationStage) || "APPLIED");
}

/** Colour cue for a 0-100 match score. */
export function matchTone(score: number | null | undefined): string {
  if (score == null) return "text-muted-foreground";
  if (score >= 60) return "text-emerald-600";
  if (score >= 30) return "text-amber-600";
  return "text-muted-foreground";
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
