package com.example.demo.model;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * The stages an application moves through in the hiring pipeline.
 *
 * <p>Candidates advance in {@link #order} sequence, and may be rejected or
 * withdrawn from any active stage. The three terminal stages accept no further
 * transitions.
 */
public enum ApplicationStage {

    APPLIED(0, "Applied"),
    SCREENING(1, "Screening"),
    INTERVIEW(2, "Interview"),
    OFFER(3, "Offer"),
    HIRED(4, "Hired"),
    REJECTED(-1, "Rejected"),
    WITHDRAWN(-1, "Withdrawn");

    /** Position in the forward pipeline; -1 for stages outside it. */
    private final int order;
    private final String label;

    ApplicationStage(int order, String label) {
        this.order = order;
        this.label = label;
    }

    public int getOrder() {
        return order;
    }

    public String getLabel() {
        return label;
    }

    private static final Set<ApplicationStage> TERMINAL =
            Set.of(HIRED, REJECTED, WITHDRAWN);

    /** Active stages, in pipeline order — the columns of a pipeline board. */
    public static List<ApplicationStage> activeStages() {
        return List.of(APPLIED, SCREENING, INTERVIEW, OFFER);
    }

    /** Every stage in pipeline order, terminal stages last. */
    public static List<ApplicationStage> pipelineOrder() {
        return List.of(APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED, WITHDRAWN);
    }

    /** True once an application has reached an outcome and cannot move again. */
    public boolean isTerminal() {
        return TERMINAL.contains(this);
    }

    /** The next stage forward, or empty if this stage is terminal. */
    public ApplicationStage next() {
        if (isTerminal()) {
            return null;
        }
        return Arrays.stream(values())
                .filter(s -> s.order == this.order + 1)
                .findFirst()
                .orElse(null);
    }

    /**
     * Whether a move from this stage to {@code target} is legal.
     *
     * <p>Forward moves may skip stages (a strong candidate can go straight from
     * screening to an offer), but an application never moves backwards and never
     * leaves a terminal stage.
     */
    public boolean canTransitionTo(ApplicationStage target) {
        if (target == null || target == this || isTerminal()) {
            return false;
        }
        if (target == REJECTED || target == WITHDRAWN) {
            return true;
        }
        if (target == APPLIED) {
            return false;
        }
        return target.order > this.order;
    }

    /** Parses a stage name leniently, falling back to {@link #APPLIED}. */
    public static ApplicationStage from(String value) {
        if (value == null || value.isBlank()) {
            return APPLIED;
        }
        String normalized = value.trim().toUpperCase().replace(' ', '_');
        // Statuses used before the pipeline existed.
        if (normalized.equals("PENDING")) {
            return APPLIED;
        }
        if (normalized.equals("REVIEWED")) {
            return SCREENING;
        }
        return Arrays.stream(values())
                .filter(s -> s.name().equals(normalized))
                .findFirst()
                .orElse(APPLIED);
    }
}
