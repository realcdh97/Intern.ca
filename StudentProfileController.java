package com.example.demo.controller;

import com.example.demo.model.StudentProfile;
import com.example.demo.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class StudentProfileController {

    @Autowired
    private StudentProfileRepository repository;

    @GetMapping
    public List<StudentProfile> getPublicProfiles() {
        return repository.findByPublicProfileTrue();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<StudentProfile> getByUserId(@PathVariable String userId) {
        return repository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public StudentProfile upsert(@RequestBody StudentProfile profile) {
        if (profile.getUserId() != null) {
            repository.findByUserId(profile.getUserId())
                    .ifPresent(existing -> profile.setId(existing.getId()));
        }
        return repository.save(profile);
    }
}
