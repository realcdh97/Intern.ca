package com.example.demo.service;

import com.example.demo.model.Job;
import com.example.demo.model.Application;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> getOverview() {
        List<Job> allJobs = jobRepository.findAll();
        List<Application> allApplications = applicationRepository.findAll();

        long totalJobs = allJobs.size();
        long totalApplications = allApplications.size();
        
        long jobsWithSponsorship = allJobs.stream().filter(Job::isSponsorship).count();
        long remoteJobs = allJobs.stream().filter(Job::isRemote).count();

        long internships = allJobs.stream().filter(j -> "Internship".equalsIgnoreCase(j.getType())).count();
        long newGrads = allJobs.stream().filter(j -> "New Grad".equalsIgnoreCase(j.getType())).count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalJobs", totalJobs);
        response.put("totalApplications", totalApplications);
        response.put("jobsWithSponsorship", jobsWithSponsorship);
        response.put("remoteJobs", remoteJobs);
        
        Map<String, Long> byType = new HashMap<>();
        byType.put("Internship", internships);
        byType.put("New Grad", newGrads);
        response.put("jobsByType", byType);

        return response;
    }
}
