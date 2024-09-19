package com.cecs544.bughound.program;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    Optional<Program> findByProgNameAndProgVersionAndProgRelease(String progName, String progVersion, String progRelease);

    Optional<Program> findIDByProgNameAndProgVersionAndProgRelease(String progName, String progVersion, String progRelease);

    @Query("SELECT p FROM Program p WHERE p.progName = ?1 AND p.progVersion = ?2 AND p.progRelease = ?3 AND p.id != ?4")
    Optional<Program> findByProgNameAndProgVersionAndProgReleaseExcludingId(String progName, String progVersion, String progRelease, Long programId);
}
