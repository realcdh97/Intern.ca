package com.example.demo.repository;

import com.example.demo.model.Application;
import com.example.demo.model.ApplicationStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    List<Application> findByJobIdAndStage(Long jobId, ApplicationStage stage);

    List<Application> findByStage(ApplicationStage stage);

    List<Application> findByCandidateEmailOrderByAppliedAtDesc(String candidateEmail);

    List<Application> findByAssignedTo(String assignedTo);

    long countByJobIdAndStage(Long jobId, ApplicationStage stage);

    boolean existsByJobIdAndCandidateEmail(Long jobId, String candidateEmail);
}
