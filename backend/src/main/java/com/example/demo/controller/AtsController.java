package com.example.demo.controller;

import com.example.demo.model.Application;
import com.example.demo.model.ApplicationEvent;
import com.example.demo.model.ApplicationNote;
import com.example.demo.model.ApplicationStage;
import com.example.demo.service.AtsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/** Employer-facing hiring pipeline API. */
@RestController
@RequestMapping("/api/ats")
@CrossOrigin(origins = "*")
public class AtsController {

    private final AtsService ats;

    public AtsController(AtsService ats) {
        this.ats = ats;
    }

    // --- Pipeline views -----------------------------------------------------

    /** The stage columns a board should render, in order. */
    @GetMapping("/stages")
    public List<Map<String, Object>> stages() {
        return ApplicationStage.pipelineOrder().stream()
                .map(stage -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("name", stage.name());
                    entry.put("label", stage.getLabel());
                    entry.put("terminal", stage.isTerminal());
                    entry.put("active", ApplicationStage.activeStages().contains(stage));
                    return entry;
                })
                .toList();
    }

    /** Applications for a job grouped by stage. */
    @GetMapping("/jobs/{jobId}/board")
    public Map<String, List<Application>> board(@PathVariable Long jobId) {
        return ats.board(jobId);
    }

    /** Applications for a job, best match first. */
    @GetMapping("/jobs/{jobId}/ranked")
    public List<Application> ranked(@PathVariable Long jobId) {
        return ats.ranked(jobId);
    }

    @GetMapping("/jobs/{jobId}/stage/{stage}")
    public List<Application> byStage(@PathVariable Long jobId, @PathVariable String stage) {
        return ats.byStage(jobId, ApplicationStage.from(stage));
    }

    @GetMapping("/jobs/{jobId}/funnel")
    public Map<String, Object> funnel(@PathVariable Long jobId) {
        return ats.funnel(jobId);
    }

    @PostMapping("/jobs/{jobId}/rescore")
    public Map<String, Object> rescore(@PathVariable Long jobId) {
        return Map.of("jobId", jobId, "rescored", ats.rescoreJob(jobId));
    }

    // --- A single application ----------------------------------------------

    @GetMapping("/applications/{id}")
    public Application get(@PathVariable Long id) {
        return ats.get(id);
    }

    @GetMapping("/applications/{id}/timeline")
    public List<ApplicationEvent> timeline(@PathVariable Long id) {
        return ats.timelineFor(id);
    }

    @GetMapping("/applications/{id}/match")
    public Map<String, Object> match(@PathVariable Long id) {
        return ats.matchBreakdown(id);
    }

    @GetMapping("/candidates/{email}/applications")
    public List<Application> forCandidate(@PathVariable String email) {
        return ats.forCandidate(email);
    }

    // --- Actions ------------------------------------------------------------

    /** Body: {"stage": "INTERVIEW", "actor": "usr_1", "note": "strong screen"} */
    @PostMapping("/applications/{id}/stage")
    public Application moveStage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ats.moveStage(id, ApplicationStage.from(body.get("stage")),
                body.get("actor"), body.get("note"));
    }

    @PostMapping("/applications/{id}/advance")
    public Application advance(@PathVariable Long id,
                               @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        return ats.advance(id, payload.get("actor"), payload.get("note"));
    }

    @PostMapping("/applications/{id}/reject")
    public Application reject(@PathVariable Long id,
                              @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        return ats.reject(id, payload.get("actor"), payload.get("reason"));
    }

    @PostMapping("/applications/{id}/withdraw")
    public Application withdraw(@PathVariable Long id,
                                @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        return ats.withdraw(id, payload.get("actor"), payload.get("reason"));
    }

    @PostMapping("/applications/{id}/rating")
    public Application rate(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        int rating = Integer.parseInt(String.valueOf(body.get("rating")));
        return ats.rate(id, rating, String.valueOf(body.getOrDefault("actor", "system")));
    }

    @PostMapping("/applications/{id}/assign")
    public Application assign(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ats.assign(id, body.get("assignee"), body.get("actor"));
    }

    @GetMapping("/applications/{id}/notes")
    public List<ApplicationNote> notes(@PathVariable Long id) {
        return ats.notesFor(id);
    }

    @PostMapping("/applications/{id}/notes")
    public ApplicationNote addNote(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ats.addNote(id, body.get("author"), body.get("body"));
    }

    /**
     * Bulk stage change for the applicant table's multi-select actions.
     * Body: {"ids": [1,2,3], "stage": "REJECTED", "actor": "usr_1", "note": "..."}
     */
    @PostMapping("/applications/bulk/stage")
    public Map<String, Object> bulkMoveStage(@RequestBody Map<String, Object> body) {
        Object rawIds = body.get("ids");
        if (!(rawIds instanceof List<?> list)) {
            throw new IllegalArgumentException("'ids' must be an array of application ids");
        }
        List<Long> ids = list.stream()
                .map(value -> Long.parseLong(String.valueOf(value)))
                .toList();
        return ats.bulkMoveStage(
                ids,
                ApplicationStage.from(String.valueOf(body.get("stage"))),
                body.get("actor") == null ? null : String.valueOf(body.get("actor")),
                body.get("note") == null ? null : String.valueOf(body.get("note")));
    }

    // --- Error mapping ------------------------------------------------------

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> notFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler({AtsService.InvalidTransitionException.class, IllegalArgumentException.class})
    public ResponseEntity<Map<String, String>> badRequest(RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
