package com.example.demo.controller;

import com.example.demo.service.ResearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public, read-only economics research API.
 * Serves anonymized, aggregated labour-market data derived from job postings.
 */
@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
public class ResearchController {

    @Autowired
    private ResearchService researchService;

    /** Self-describing index of the available research endpoints. */
    @GetMapping
    public Map<String, Object> index() {
        return Map.of(
                "description", "Intern.ca anonymized labour-market research API. No personal data is exposed.",
                "endpoints", List.of(
                        Map.of("path", "/api/research/overview", "desc", "Aggregated market overview: counts and salary stats by type, country and currency"),
                        Map.of("path", "/api/research/jobs", "desc", "Anonymized job-market records with normalized annual salaries"),
                        Map.of("path", "/api/research/salaries", "desc", "Salary statistics grouped by job type and country")
                ),
                "license", "CC BY 4.0 — attribute Intern.ca",
                "version", "1.0"
        );
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        return researchService.overview();
    }

    @GetMapping("/jobs")
    public List<Map<String, Object>> jobs() {
        return researchService.allRecords();
    }

    @GetMapping("/salaries")
    public Map<String, Object> salaries() {
        Map<String, Object> overview = researchService.overview();
        return Map.of(
                "salaryByType", overview.get("salaryByType"),
                "salaryByCountry", overview.get("salaryByCountry")
        );
    }
}
