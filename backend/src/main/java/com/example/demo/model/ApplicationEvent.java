package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * An immutable audit record of one stage transition, so a hiring team can see
 * how a candidate reached their current stage and who moved them.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;

    @Enumerated(EnumType.STRING)
    private ApplicationStage fromStage;

    @Enumerated(EnumType.STRING)
    private ApplicationStage toStage;

    /** Supabase user id of whoever made the move. */
    private String actor;

    private String note;

    private LocalDateTime occurredAt;
}
