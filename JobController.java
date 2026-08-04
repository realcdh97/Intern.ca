package com.example.demo.controller;

import com.example.demo.model.Job;
import com.example.demo.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> getJobs(
            @RequestParam(required = false) Boolean remote,
            @RequestParam(required = false) Boolean sponsorship,
            @RequestParam(required = false) String type) {
        return jobService.getJobsWithFilters(remote, sponsorship, type);
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }
}
