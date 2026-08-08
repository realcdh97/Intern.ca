package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;       // Supabase auth user id
    private String fullName;
    private String headline;     // e.g. "CS Student @ University of Toronto"
    private String school;
    private String major;
    private String gradYear;
    private String location;
    private String avatarUrl;
    private String resumeUrl;
    private String portfolioUrl;

    @Lob
    private String bio;

    private String skills;        // comma separated
    private boolean openToWork;
    private boolean publicProfile;
}
