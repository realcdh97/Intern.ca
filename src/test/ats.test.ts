import { describe, it, expect } from "vitest";
import {
  ACTIVE_STAGES,
  allowedTransitions,
  canTransition,
  isTerminal,
  nextStage,
  stageOf,
  STAGE_ORDER,
} from "@/lib/ats";
import { ApplicationStage } from "@/types";

/**
 * These rules are duplicated from ApplicationStage on the backend so the UI can
 * grey out illegal moves. If the backend rules change, these tests should fail.
 */
describe("ats stage rules", () => {
  it("advances through the pipeline in order", () => {
    expect(nextStage("APPLIED")).toBe("SCREENING");
    expect(nextStage("SCREENING")).toBe("INTERVIEW");
    expect(nextStage("INTERVIEW")).toBe("OFFER");
    expect(nextStage("OFFER")).toBe("HIRED");
  });

  it("has no next stage once terminal", () => {
    expect(nextStage("HIRED")).toBeNull();
    expect(nextStage("REJECTED")).toBeNull();
    expect(nextStage("WITHDRAWN")).toBeNull();
  });

  it("identifies terminal stages", () => {
    expect(isTerminal("HIRED")).toBe(true);
    expect(isTerminal("REJECTED")).toBe(true);
    expect(isTerminal("APPLIED")).toBe(false);
  });

  it("allows forward moves including skipping stages", () => {
    expect(canTransition("APPLIED", "SCREENING")).toBe(true);
    expect(canTransition("SCREENING", "OFFER")).toBe(true);
    expect(canTransition("APPLIED", "HIRED")).toBe(true);
  });

  it("refuses backward and self moves", () => {
    expect(canTransition("INTERVIEW", "SCREENING")).toBe(false);
    expect(canTransition("OFFER", "APPLIED")).toBe(false);
    expect(canTransition("SCREENING", "SCREENING")).toBe(false);
  });

  it("allows declining or withdrawing from any active stage", () => {
    for (const stage of ACTIVE_STAGES) {
      expect(canTransition(stage, "REJECTED")).toBe(true);
      expect(canTransition(stage, "WITHDRAWN")).toBe(true);
    }
  });

  it("refuses every move out of a terminal stage", () => {
    for (const stage of ["HIRED", "REJECTED", "WITHDRAWN"] as ApplicationStage[]) {
      for (const target of STAGE_ORDER) {
        expect(canTransition(stage, target)).toBe(false);
      }
      expect(allowedTransitions(stage)).toHaveLength(0);
    }
  });

  it("offers no move back to APPLIED", () => {
    for (const stage of STAGE_ORDER) {
      expect(allowedTransitions(stage)).not.toContain("APPLIED");
    }
  });

  it("falls back to the legacy status field when stage is absent", () => {
    expect(stageOf({ stage: "OFFER" })).toBe("OFFER");
    expect(stageOf({ status: "INTERVIEW" })).toBe("INTERVIEW");
    expect(stageOf({})).toBe("APPLIED");
  });
});
