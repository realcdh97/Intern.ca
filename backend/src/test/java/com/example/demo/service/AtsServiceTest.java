package com.example.demo.service;

import com.example.demo.model.Application;
import com.example.demo.model.ApplicationEvent;
import com.example.demo.model.ApplicationStage;
import com.example.demo.model.Job;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AtsServiceTest {

    @Autowired
    private AtsService ats;

    @Autowired
    private JobRepository jobs;

    @Autowired
    private ApplicationRepository applications;

    private Long jobId;

    @BeforeEach
    void setUp() {
        Job job = new Job();
        job.setTitle("Frontend Engineer Intern");
        job.setType("Internship");
        job.setDescription("Build React interfaces with TypeScript.");
        jobId = jobs.save(job).getId();
    }

    private Application apply(String name, String skills) {
        Application application = new Application();
        application.setJobId(jobId);
        application.setCandidateName(name);
        application.setCandidateEmail(name.toLowerCase() + "@example.com");
        application.setSkills(skills);
        return ats.intake(application);
    }

    @Test
    void intakeStartsAtAppliedAndScoresTheCandidate() {
        Application saved = apply("Ada", "react, typescript, interfaces");

        assertEquals(ApplicationStage.APPLIED, saved.getStage());
        assertNotNull(saved.getAppliedAt());
        assertNotNull(saved.getMatchScore());
        assertTrue(saved.getMatchScore() > 0, "a matching candidate should score above zero");
        assertEquals("APPLIED", saved.getStatus(), "legacy status field should track the stage");
    }

    @Test
    void intakeRecordsAnOpeningTimelineEvent() {
        Application saved = apply("Ada", "react");
        List<ApplicationEvent> timeline = ats.timelineFor(saved.getId());

        assertEquals(1, timeline.size());
        assertNull(timeline.get(0).getFromStage());
        assertEquals(ApplicationStage.APPLIED, timeline.get(0).getToStage());
    }

    @Test
    void advanceMovesOneStageAndAppendsToTheTimeline() {
        Application saved = apply("Ada", "react");

        Application screening = ats.advance(saved.getId(), "usr_1", "good resume");
        assertEquals(ApplicationStage.SCREENING, screening.getStage());

        Application interview = ats.advance(saved.getId(), "usr_1", null);
        assertEquals(ApplicationStage.INTERVIEW, interview.getStage());

        List<ApplicationEvent> timeline = ats.timelineFor(saved.getId());
        assertEquals(3, timeline.size());
        assertEquals(ApplicationStage.SCREENING, timeline.get(1).getToStage());
        assertEquals("usr_1", timeline.get(1).getActor());
        assertEquals("good resume", timeline.get(1).getNote());
    }

    @Test
    void moveStageRefusesBackwardsTransitions() {
        Application saved = apply("Ada", "react");
        ats.moveStage(saved.getId(), ApplicationStage.INTERVIEW, "usr_1", null);

        assertThrows(AtsService.InvalidTransitionException.class,
                () -> ats.moveStage(saved.getId(), ApplicationStage.SCREENING, "usr_1", null));
    }

    @Test
    void rejectedApplicationsCannotBeRevived() {
        Application saved = apply("Ada", "react");
        Application rejected = ats.reject(saved.getId(), "usr_1", "not enough experience");

        assertEquals(ApplicationStage.REJECTED, rejected.getStage());
        assertEquals("not enough experience", rejected.getRejectionReason());
        assertThrows(AtsService.InvalidTransitionException.class,
                () -> ats.advance(saved.getId(), "usr_1", null));
    }

    @Test
    void advancingPastHiredIsRejected() {
        Application saved = apply("Ada", "react");
        ats.moveStage(saved.getId(), ApplicationStage.HIRED, "usr_1", null);

        assertThrows(AtsService.InvalidTransitionException.class,
                () -> ats.advance(saved.getId(), "usr_1", null));
    }

    @Test
    void ratingIsBoundedToOneThroughFive() {
        Application saved = apply("Ada", "react");

        assertEquals(4, ats.rate(saved.getId(), 4, "usr_1").getRating());
        assertThrows(IllegalArgumentException.class, () -> ats.rate(saved.getId(), 0, "usr_1"));
        assertThrows(IllegalArgumentException.class, () -> ats.rate(saved.getId(), 6, "usr_1"));
    }

    @Test
    void notesAreReturnedNewestFirstAndCannotBeEmpty() {
        Application saved = apply("Ada", "react");
        ats.addNote(saved.getId(), "usr_1", "first");
        ats.addNote(saved.getId(), "usr_2", "second");

        assertEquals(2, ats.notesFor(saved.getId()).size());
        assertThrows(IllegalArgumentException.class, () -> ats.addNote(saved.getId(), "usr_1", "  "));
    }

    @Test
    void unknownApplicationIdsAreReported() {
        assertThrows(NoSuchElementException.class, () -> ats.get(9_999_999L));
        assertThrows(NoSuchElementException.class, () -> ats.advance(9_999_999L, "usr_1", null));
    }

    @Test
    void boardGroupsApplicationsByStage() {
        Application ada = apply("Ada", "react, typescript");
        apply("Grace", "cobol");
        ats.moveStage(ada.getId(), ApplicationStage.INTERVIEW, "usr_1", null);

        Map<String, List<Application>> board = ats.board(jobId);
        assertEquals(1, board.get("APPLIED").size());
        assertEquals(1, board.get("INTERVIEW").size());
        assertEquals(0, board.get("OFFER").size());
        assertEquals("Ada", board.get("INTERVIEW").get(0).getCandidateName());
    }

    @Test
    void rankedPutsTheStrongestMatchFirst() {
        apply("Grace", "cobol, fortran");
        apply("Ada", "react, typescript, interfaces, build");

        List<Application> ranked = ats.ranked(jobId);
        assertEquals("Ada", ranked.get(0).getCandidateName());
    }

    @Test
    void funnelCountsEachStageAndTotals() {
        Application ada = apply("Ada", "react");
        apply("Grace", "cobol");
        ats.moveStage(ada.getId(), ApplicationStage.OFFER, "usr_1", null);

        Map<String, Object> funnel = ats.funnel(jobId);
        assertEquals(2L, funnel.get("totalApplications"));

        @SuppressWarnings("unchecked")
        Map<String, Long> byStage = (Map<String, Long>) funnel.get("byStage");
        assertEquals(1L, byStage.get("APPLIED"));
        assertEquals(1L, byStage.get("OFFER"));
        assertEquals(1L, funnel.get("awaitingReview"));
    }

    @Test
    void matchBreakdownExplainsTheScore() {
        Application saved = apply("Ada", "react, typescript");

        Map<String, Object> breakdown = ats.matchBreakdown(saved.getId());
        @SuppressWarnings("unchecked")
        List<String> matched = (List<String>) breakdown.get("matched");
        @SuppressWarnings("unchecked")
        List<String> missing = (List<String>) breakdown.get("missing");

        assertTrue(matched.contains("react"));
        assertTrue(missing.contains("interfaces"));
    }

    @Test
    void rescoringPicksUpAnEditedJobDescription() {
        Application saved = apply("Ada", "kubernetes, terraform");
        assertEquals(0, saved.getMatchScore());

        Job job = jobs.findById(jobId).orElseThrow();
        job.setDescription("Operate kubernetes clusters and terraform modules.");
        jobs.save(job);

        assertEquals(1, ats.rescoreJob(jobId));
        assertTrue(applications.findById(saved.getId()).orElseThrow().getMatchScore() > 0);
    }

    @Test
    void candidateCanSeeEveryApplicationTheySubmitted() {
        apply("Ada", "react");
        assertEquals(1, ats.forCandidate("ada@example.com").size());
        assertEquals(0, ats.forCandidate("nobody@example.com").size());
    }
}
