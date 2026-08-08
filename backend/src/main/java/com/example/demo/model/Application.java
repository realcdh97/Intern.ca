package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private String candidateName;
    private String candidateEmail;
    private String portfolioUrl;
    private String coverLetter;
    private LocalDateTime appliedAt;

    // --- ATS pipeline -------------------------------------------------------

    /** Where the candidate sits in the hiring pipeline. */
    @Enumerated(EnumType.STRING)
    private ApplicationStage stage = ApplicationStage.APPLIED;

    /** Recruiter rating, 1-5. Null until someone rates the candidate. */
    private Integer rating;

    /** 0-100 keyword overlap between the candidate and the job. */
    private Integer matchScore;

    /** Supabase user id of the reviewer who owns this application. */
    private String assignedTo;

    /** Comma separated, mirrors StudentProfile.skills. */
    private String skills;

    @Lob
    private String resumeText;

    private String resumeUrl;

    /** Set when the stage moves to REJECTED. */
    private String rejectionReason;

    private LocalDateTime stageChangedAt;
    private LocalDateTime updatedAt;

    /**
     * Legacy field name the frontend reads. Kept on the JSON contract and always
     * derived from {@link #stage} rather than stored, so the two cannot drift.
     */
    @Transient
    public String getStatus() {
        return stage == null ? ApplicationStage.APPLIED.name() : stage.name();
    }

    /** Accepts the pre-pipeline status strings (PENDING, REVIEWED, ...). */
    public void setStatus(String status) {
        this.stage = ApplicationStage.from(status);
    }
}
