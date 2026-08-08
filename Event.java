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
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String host;          // company or university name
    private String type;          // "Career Fair", "Info Session", "Workshop"
    private String date;          // ISO date string
    private String time;
    private boolean virtual;
    private String location;
    private String bannerUrl;

    @Lob
    private String description;
}
