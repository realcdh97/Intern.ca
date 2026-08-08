package com.example.demo.service;

import com.example.demo.model.Application;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final AtsService ats;

    public ApplicationService(ApplicationRepository applicationRepository, AtsService ats) {
        this.applicationRepository = applicationRepository;
        this.ats = ats;
    }

    /**
     * Candidate-facing submission. Delegates to the ATS so the application is
     * scored against the job and gets an audit trail from the start.
     */
    public Application submitApplication(Application application) {
        return ats.intake(application);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
}
