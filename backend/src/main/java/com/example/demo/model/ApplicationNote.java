package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** A free-form comment left on a candidate by a member of the hiring team. */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;

    /** Supabase user id of the note's author. */
    private String author;

    @Lob
    private String body;

    private LocalDateTime createdAt;
}
