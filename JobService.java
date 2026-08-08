package com.example.demo.service;

import com.example.demo.model.Job;
import com.example.demo.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;

    public List<Job> getJobsWithFilters(Boolean remote, Boolean sponsorship, String type) {
        return jobRepository.findJobsWithFilters(remote, sponsorship, type);
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }
}
