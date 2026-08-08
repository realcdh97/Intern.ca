package com.example.demo.service;

import com.example.demo.model.Application;
import com.example.demo.model.ApplicationEvent;
import com.example.demo.model.ApplicationNote;
import com.example.demo.model.ApplicationStage;
import com.example.demo.model.Job;
import com.example.demo.repository.ApplicationEventRepository;
import com.example.demo.repository.ApplicationNoteRepository;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.JobRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * The hiring pipeline: moving candidates between stages, recording why, and
 * reporting on the result.
 *
 * <p>Every stage change goes through {@link #moveStage} so that the audit trail
 * and the application's own state can never disagree.
 */
@Service
public class AtsService {

    private final ApplicationRepository applications;
    private final ApplicationEventRepository events;
    private final ApplicationNoteRepository notes;
    private final JobRepository jobs;
    private final CandidateMatchService matchService;
    private final int strongMatchThreshold;

    public AtsService(ApplicationRepository applications,
                      ApplicationEventRepository events,
                      ApplicationNoteRepository notes,
                      JobRepository jobs,
                      CandidateMatchService matchService,
                      @Value("${app.ats.strong-match-threshold:60}") int strongMatchThreshold) {
        this.applications = applications;
        this.events = events;
        this.notes = notes;
        this.jobs = jobs;
        this.matchService = matchService;
        this.strongMatchThreshold = strongMatchThreshold;
    }

    /** Thrown when a caller asks for a stage change the pipeline does not allow. */
    public static class InvalidTransitionException extends RuntimeException {
        public InvalidTransitionException(String message) {
            super(message);
        }
    }

    // --- Intake -------------------------------------------------------------

    /**
     * Records a new application at {@link ApplicationStage#APPLIED} and scores it
     * against the job it targets.
     */
    @Transactional
    public Application intake(Application application) {
        application.setId(null);
        application.setAppliedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        application.setStageChangedAt(LocalDateTime.now());
        if (application.getStage() == null) {
            application.setStage(ApplicationStage.APPLIED);
        }
        application.setMatchScore(scoreAgainstJob(application));

        Application saved = applications.save(application);
        recordEvent(saved.getId(), null, saved.getStage(), "system", "Application received");
        return saved;
    }

    // --- Stage transitions --------------------------------------------------

    /**
     * Moves an application to {@code target}, recording an audit event.
     *
     * @throws InvalidTransitionException if the pipeline forbids the move
     */
    @Transactional
    public Application moveStage(Long applicationId, ApplicationStage target, String actor, String note) {
        Application application = require(applicationId);
        ApplicationStage current = application.getStage() == null
                ? ApplicationStage.APPLIED
                : application.getStage();

        if (!current.canTransitionTo(target)) {
            throw new InvalidTransitionException(
                    "Cannot move application " + applicationId + " from " + current + " to " + target);
        }

        application.setStage(target);
        application.setStageChangedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        if (target != ApplicationStage.REJECTED) {
            application.setRejectionReason(null);
        }

        Application saved = applications.save(application);
        recordEvent(applicationId, current, target, actor, note);
        return saved;
    }

    /** Advances one stage along the pipeline. */
    @Transactional
    public Application advance(Long applicationId, String actor, String note) {
        Application application = require(applicationId);
        ApplicationStage current = application.getStage() == null
                ? ApplicationStage.APPLIED
                : application.getStage();
        ApplicationStage next = current.next();
        if (next == null) {
            throw new InvalidTransitionException(
                    "Application " + applicationId + " is already at a terminal stage (" + current + ")");
        }
        return moveStage(applicationId, next, actor, note);
    }

    @Transactional
    public Application reject(Long applicationId, String actor, String reason) {
        Application saved = moveStage(applicationId, ApplicationStage.REJECTED, actor, reason);
        saved.setRejectionReason(reason);
        return applications.save(saved);
    }

    @Transactional
    public Application withdraw(Long applicationId, String actor, String reason) {
        return moveStage(applicationId, ApplicationStage.WITHDRAWN, actor, reason);
    }

    // --- Reviewer actions ---------------------------------------------------

    /** Rates a candidate 1-5. */
    @Transactional
    public Application rate(Long applicationId, int rating, String actor) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5, got " + rating);
        }
        Application application = require(applicationId);
        application.setRating(rating);
        application.setUpdatedAt(LocalDateTime.now());
        Application saved = applications.save(application);
        recordEvent(applicationId, saved.getStage(), saved.getStage(), actor, "Rated " + rating + "/5");
        return saved;
    }

    @Transactional
    public Application assign(Long applicationId, String assignee, String actor) {
        Application application = require(applicationId);
        application.setAssignedTo(assignee);
        application.setUpdatedAt(LocalDateTime.now());
        Application saved = applications.save(application);
        recordEvent(applicationId, saved.getStage(), saved.getStage(), actor, "Assigned to " + assignee);
        return saved;
    }

    @Transactional
    public ApplicationNote addNote(Long applicationId, String author, String body) {
        require(applicationId);
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Note body cannot be empty");
        }
        ApplicationNote note = new ApplicationNote();
        note.setApplicationId(applicationId);
        note.setAuthor(author);
        note.setBody(body);
        note.setCreatedAt(LocalDateTime.now());
        return notes.save(note);
    }

    public List<ApplicationNote> notesFor(Long applicationId) {
        return notes.findByApplicationIdOrderByCreatedAtDesc(applicationId);
    }

    public List<ApplicationEvent> timelineFor(Long applicationId) {
        return events.findByApplicationIdOrderByOccurredAtAsc(applicationId);
    }

    // --- Reads --------------------------------------------------------------

    public Application get(Long applicationId) {
        return require(applicationId);
    }

    /** The pipeline board for a job: applications grouped by stage. */
    public Map<String, List<Application>> board(Long jobId) {
        Map<String, List<Application>> board = new LinkedHashMap<>();
        for (ApplicationStage stage : ApplicationStage.pipelineOrder()) {
            board.put(stage.name(), applications.findByJobIdAndStage(jobId, stage));
        }
        return board;
    }

    /** Applications for a job, best match first — the shortlisting view. */
    public List<Application> ranked(Long jobId) {
        List<Application> forJob = new ArrayList<>(applications.findByJobId(jobId));
        forJob.sort(Comparator
                .comparing((Application a) -> a.getMatchScore() == null ? -1 : a.getMatchScore())
                .thenComparing(a -> a.getRating() == null ? -1 : a.getRating())
                .reversed());
        return forJob;
    }

    public List<Application> byStage(Long jobId, ApplicationStage stage) {
        return applications.findByJobIdAndStage(jobId, stage);
    }

    /** Every application a candidate has submitted, newest first. */
    public List<Application> forCandidate(String email) {
        return applications.findByCandidateEmailOrderByAppliedAtDesc(email);
    }

    /**
     * Funnel counts plus conversion rates for one job — how many candidates
     * entered each stage and what share of applicants got there.
     */
    public Map<String, Object> funnel(Long jobId) {
        Map<String, Long> counts = new LinkedHashMap<>();
        long total = 0;
        for (ApplicationStage stage : ApplicationStage.pipelineOrder()) {
            long count = applications.countByJobIdAndStage(jobId, stage);
            counts.put(stage.name(), count);
            total += count;
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("jobId", jobId);
        result.put("totalApplications", total);
        result.put("byStage", counts);

        Map<String, Double> conversion = new LinkedHashMap<>();
        for (Map.Entry<String, Long> entry : counts.entrySet()) {
            double rate = total == 0 ? 0.0 : (entry.getValue() * 100.0) / total;
            conversion.put(entry.getKey(), Math.round(rate * 10.0) / 10.0);
        }
        result.put("conversionRates", conversion);

        List<Application> forJob = applications.findByJobId(jobId);
        result.put("strongMatches", forJob.stream()
                .filter(a -> a.getMatchScore() != null && a.getMatchScore() >= strongMatchThreshold)
                .count());
        result.put("awaitingReview", applications.countByJobIdAndStage(jobId, ApplicationStage.APPLIED));
        result.put("strongMatchThreshold", strongMatchThreshold);
        return result;
    }

    /** Why a candidate scored what they did — matched and missing job terms. */
    public Map<String, Object> matchBreakdown(Long applicationId) {
        Application application = require(applicationId);
        Job job = application.getJobId() == null
                ? null
                : jobs.findById(application.getJobId()).orElse(null);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("applicationId", applicationId);
        result.put("score", application.getMatchScore() == null ? 0 : application.getMatchScore());
        result.put("strongMatch", application.getMatchScore() != null
                && application.getMatchScore() >= strongMatchThreshold);
        result.put("matched", matchService.matchingTerms(application, job));
        result.put("missing", matchService.missingTerms(application, job));
        return result;
    }

    /** Recomputes match scores, for use after a job description is edited. */
    @Transactional
    public int rescoreJob(Long jobId) {
        List<Application> forJob = applications.findByJobId(jobId);
        for (Application application : forJob) {
            application.setMatchScore(scoreAgainstJob(application));
            application.setUpdatedAt(LocalDateTime.now());
        }
        applications.saveAll(forJob);
        return forJob.size();
    }

    // --- Internals ----------------------------------------------------------

    private int scoreAgainstJob(Application application) {
        if (application.getJobId() == null) {
            return 0;
        }
        Job job = jobs.findById(application.getJobId()).orElse(null);
        return matchService.score(application, job);
    }

    private Application require(Long applicationId) {
        return applications.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("No application with id " + applicationId));
    }

    private void recordEvent(Long applicationId, ApplicationStage from, ApplicationStage to,
                             String actor, String note) {
        ApplicationEvent event = new ApplicationEvent();
        event.setApplicationId(applicationId);
        event.setFromStage(from);
        event.setToStage(to);
        event.setActor(actor == null ? "system" : actor);
        event.setNote(note);
        event.setOccurredAt(LocalDateTime.now());
        events.save(event);
    }
}
