package com.cecs544.bughound.bug;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BugRepository extends JpaRepository<Bug, Long> {
    @Query("SELECT b FROM Bug b WHERE b.reportedBy = :reportedBy ORDER BY b.bug_id ASC")
    List<Bug> findByReportedBy(String reportedBy);

    @Query("SELECT b FROM Bug b WHERE b.assignedTo = :assignedTo ORDER BY b.bug_id ASC")
    List<Bug> findByAssignedTo(String assignedTo);

    List<Bug> findAll();
}
