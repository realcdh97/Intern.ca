package com.example.demo.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApplicationStageTest {

    @Test
    void advancesThroughThePipelineInOrder() {
        assertEquals(ApplicationStage.SCREENING, ApplicationStage.APPLIED.next());
        assertEquals(ApplicationStage.INTERVIEW, ApplicationStage.SCREENING.next());
        assertEquals(ApplicationStage.OFFER, ApplicationStage.INTERVIEW.next());
        assertEquals(ApplicationStage.HIRED, ApplicationStage.OFFER.next());
    }

    @Test
    void terminalStagesHaveNoNextStage() {
        assertNull(ApplicationStage.HIRED.next());
        assertNull(ApplicationStage.REJECTED.next());
        assertNull(ApplicationStage.WITHDRAWN.next());
        assertTrue(ApplicationStage.HIRED.isTerminal());
        assertFalse(ApplicationStage.APPLIED.isTerminal());
    }

    @Test
    void allowsForwardMovesIncludingSkippingStages() {
        assertTrue(ApplicationStage.APPLIED.canTransitionTo(ApplicationStage.SCREENING));
        assertTrue(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.OFFER));
    }

    @Test
    void refusesBackwardsAndSelfMoves() {
        assertFalse(ApplicationStage.INTERVIEW.canTransitionTo(ApplicationStage.SCREENING));
        assertFalse(ApplicationStage.OFFER.canTransitionTo(ApplicationStage.APPLIED));
        assertFalse(ApplicationStage.SCREENING.canTransitionTo(ApplicationStage.SCREENING));
    }

    @Test
    void allowsRejectionAndWithdrawalFromAnyActiveStage() {
        for (ApplicationStage stage : ApplicationStage.activeStages()) {
            assertTrue(stage.canTransitionTo(ApplicationStage.REJECTED), stage + " should be rejectable");
            assertTrue(stage.canTransitionTo(ApplicationStage.WITHDRAWN), stage + " should be withdrawable");
        }
    }

    @Test
    void refusesAnyMoveOutOfATerminalStage() {
        assertFalse(ApplicationStage.HIRED.canTransitionTo(ApplicationStage.OFFER));
        assertFalse(ApplicationStage.REJECTED.canTransitionTo(ApplicationStage.SCREENING));
        assertFalse(ApplicationStage.WITHDRAWN.canTransitionTo(ApplicationStage.REJECTED));
    }

    @Test
    void mapsLegacyStatusStrings() {
        assertEquals(ApplicationStage.APPLIED, ApplicationStage.from("PENDING"));
        assertEquals(ApplicationStage.SCREENING, ApplicationStage.from("REVIEWED"));
        assertEquals(ApplicationStage.REJECTED, ApplicationStage.from("rejected"));
        assertEquals(ApplicationStage.APPLIED, ApplicationStage.from(null));
        assertEquals(ApplicationStage.APPLIED, ApplicationStage.from("nonsense"));
    }
}
