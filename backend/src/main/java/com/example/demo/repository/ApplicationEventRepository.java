package com.example.demo.repository;

import com.example.demo.model.ApplicationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationEventRepository extends JpaRepository<ApplicationEvent, Long> {
    List<ApplicationEvent> findByApplicationIdOrderByOccurredAtAsc(Long applicationId);
}
