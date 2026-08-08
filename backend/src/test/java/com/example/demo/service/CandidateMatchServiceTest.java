package com.example.demo.service;

import com.example.demo.model.Application;
import com.example.demo.model.Job;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CandidateMatchServiceTest {

    private CandidateMatchService service;
    private Job job;

    @BeforeEach
    void setUp() {
        service = new CandidateMatchService();
        job = new Job();
        job.setTitle("Frontend Engineer Intern");
        job.setType("Internship");
        job.setDescription("Build delightful React interfaces with TypeScript alongside our design team.");
    }

    private Application candidate(String skills, String coverLetter) {
        Application application = new Application();
        application.setSkills(skills);
        application.setCoverLetter(coverLetter);
        return application;
    }

    @Test
    void scoresZeroWhenNothingOverlaps() {
        assertEquals(0, service.score(candidate("welding, carpentry", null), job));
    }

    @Test
    void scoresHigherAsMoreJobTermsAreMatched() {
        int weak = service.score(candidate("react", null), job);
        int strong = service.score(
                candidate("react, typescript, frontend", "I build delightful interfaces and engineer design systems."),
                job);
        assertTrue(strong > weak, "expected " + strong + " > " + weak);
    }

    @Test
    void neverExceedsOneHundred() {
        Application perfect = candidate(
                "frontend engineer intern internship react typescript interfaces delightful design alongside",
                "frontend engineer intern internship react typescript interfaces delightful design alongside");
        int score = service.score(perfect, job);
        assertTrue(score <= 100, "score was " + score);
        assertTrue(score > 50, "an on-point candidate should score well, got " + score);
    }

    @Test
    void handlesMissingInputsWithoutThrowing() {
        assertEquals(0, service.score(null, job));
        assertEquals(0, service.score(candidate("react", null), null));
        assertEquals(0, service.score(candidate(null, null), job));
        assertEquals(0, service.score(candidate("react", null), new Job()));
    }

    @Test
    void reportsWhichTermsMatchedAndWhichAreMissing() {
        Application application = candidate("react, typescript", null);
        assertTrue(service.matchingTerms(application, job).contains("react"));
        assertTrue(service.matchingTerms(application, job).contains("typescript"));
        assertFalse(service.missingTerms(application, job).contains("react"));
        assertTrue(service.missingTerms(application, job).contains("interfaces"));
    }

    @Test
    void ignoresStopWordsSoFillerTextDoesNotInflateScores() {
        Application filler = candidate(null, "we are the and with our to for from this that will you your");
        assertEquals(0, service.score(filler, job));
    }
}
