package com.example.demo.controller;

import com.example.demo.model.Application;
import com.example.demo.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public Application submitApplication(@RequestBody Application application) {
        return applicationService.submitApplication(application);
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getApplicationsForJob(@PathVariable Long jobId) {
        return applicationService.getApplicationsForJob(jobId);
    }
}
