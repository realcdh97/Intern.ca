package com.example.demo.repository;

import com.example.demo.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j WHERE " +
           "(:remote IS NULL OR j.remote = :remote) AND " +
           "(:sponsorship IS NULL OR j.sponsorship = :sponsorship) AND " +
           "(:type IS NULL OR j.type = :type)")
    List<Job> findJobsWithFilters(
            @Param("remote") Boolean remote,
            @Param("sponsorship") Boolean sponsorship,
            @Param("type") String type);
}
