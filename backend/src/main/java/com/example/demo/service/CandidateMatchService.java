package com.example.demo.service;

import com.example.demo.model.Application;
import com.example.demo.model.Job;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Scores how well a candidate matches a job, 0-100.
 *
 * <p>Deliberately transparent rather than clever: the score is keyword overlap
 * between what the candidate wrote and what the job asks for, so a recruiter can
 * always see why a number came out the way it did via
 * {@link #matchingTerms(Application, Job)}. It ranks a shortlist; it does not
 * decide anything on its own.
 */
@Service
public class CandidateMatchService {

    /** Words too common to carry signal in a job description. */
    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have",
            "in", "is", "it", "its", "of", "on", "or", "our", "that", "the", "to", "we",
            "with", "you", "your", "will", "who", "this", "us", "their", "they", "help",
            "work", "working", "team", "teams", "join", "new", "up", "out", "all", "can",
            "across", "into", "over", "more", "most", "make", "makes", "build", "builds"
    );

    private static final int MIN_TERM_LENGTH = 3;

    /**
     * The candidate's score against the job.
     *
     * @return 0-100, where 100 means every term the job asks for appears in the
     *         candidate's skills, cover letter or resume.
     */
    public int score(Application application, Job job) {
        if (application == null || job == null) {
            return 0;
        }

        Set<String> jobTerms = jobTerms(job);
        if (jobTerms.isEmpty()) {
            return 0;
        }

        Set<String> candidateTerms = candidateTerms(application);
        if (candidateTerms.isEmpty()) {
            return 0;
        }

        long overlap = jobTerms.stream().filter(candidateTerms::contains).count();
        int base = (int) Math.round((overlap * 100.0) / jobTerms.size());

        // Skills listed explicitly are stronger evidence than prose, so a
        // candidate whose declared skills hit the job gets a modest lift.
        Set<String> declaredSkills = terms(application.getSkills());
        long skillHits = jobTerms.stream().filter(declaredSkills::contains).count();
        int bonus = skillHits > 0 ? Math.min(10, (int) skillHits * 2) : 0;

        return Math.min(100, base + bonus);
    }

    /** The job terms the candidate actually hit, for showing your work in the UI. */
    public List<String> matchingTerms(Application application, Job job) {
        if (application == null || job == null) {
            return List.of();
        }
        Set<String> candidateTerms = candidateTerms(application);
        return jobTerms(job).stream()
                .filter(candidateTerms::contains)
                .sorted()
                .collect(Collectors.toList());
    }

    /** The job terms the candidate is missing — the gaps worth probing at interview. */
    public List<String> missingTerms(Application application, Job job) {
        if (application == null || job == null) {
            return List.of();
        }
        Set<String> candidateTerms = candidateTerms(application);
        return jobTerms(job).stream()
                .filter(term -> !candidateTerms.contains(term))
                .sorted()
                .collect(Collectors.toList());
    }

    private Set<String> jobTerms(Job job) {
        Set<String> result = new LinkedHashSet<>();
        result.addAll(terms(job.getTitle()));
        result.addAll(terms(job.getDescription()));
        result.addAll(terms(job.getType()));
        return result;
    }

    private Set<String> candidateTerms(Application application) {
        Set<String> result = new LinkedHashSet<>();
        result.addAll(terms(application.getSkills()));
        result.addAll(terms(application.getCoverLetter()));
        result.addAll(terms(application.getResumeText()));
        return result;
    }

    /** Lowercases, strips punctuation and drops stop words and short tokens. */
    private Set<String> terms(String text) {
        if (text == null || text.isBlank()) {
            return Set.of();
        }
        return Arrays.stream(text.toLowerCase(Locale.ROOT).split("[^a-z0-9+#]+"))
                .filter(t -> t.length() >= MIN_TERM_LENGTH)
                .filter(t -> !STOP_WORDS.contains(t))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
