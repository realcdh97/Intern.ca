package com.example.demo.service;

import com.example.demo.model.Application;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;

    public Application submitApplication(Application application) {
        application.setAppliedAt(LocalDateTime.now());
        if (application.getStatus() == null) {
            application.setStatus("PENDING");
        }
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
}
