package com.cecs544.bughound.program;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgramService {

    @Autowired
    private ProgramRepository programRepository;

    public Program createProgram(Program program) throws IllegalStateException {
        // Check if the program already exists
        Optional<Program> existingProgram = programRepository.findByProgNameAndProgVersionAndProgRelease(
                program.getProgName(), program.getProgVersion(), program.getProgRelease());

        if (existingProgram.isPresent()) {
            throw new IllegalStateException("Program with the same name, version, and release already exists.");
        }
        try {
            return programRepository.save(program);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Failed to create the program due to data integrity issues.", e);
        }
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Program getProgram(Long programId) {
        return programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program with ID " + programId + " not found"));
    }

    public Optional<Program> getProgramById(Long programId) {
        return programRepository.findById(programId);
    }

    public Optional<Program> getProgramByDetails(String progName, String progVersion, String progRelease) {
        return programRepository.findByProgNameAndProgVersionAndProgRelease(progName, progVersion, progRelease);
    }

    public Optional<Long> getProgramIdByDetails(String progName, String progVersion, String progRelease) {
        return programRepository.findIDByProgNameAndProgVersionAndProgRelease(progName, progVersion, progRelease)
                .map(Program::getId); // Extract the program ID
    }

    public Program updateProgram(Long programId, Program updatedProgram) {
        return programRepository.findById(programId)
                .map(existingProgram -> {
                    // Check if there's another program with the same details but different ID
                    Optional<Program> duplicateProgram = programRepository.findByProgNameAndProgVersionAndProgReleaseExcludingId(
                            updatedProgram.getProgName(),
                            updatedProgram.getProgVersion(),
                            updatedProgram.getProgRelease(),
                            programId
                    );
                    if (duplicateProgram.isPresent()) {
                        throw new IllegalStateException("A program with the same name, version, and release already exists.");
                    }
                    existingProgram.setProgName(updatedProgram.getProgName());
                    existingProgram.setProgVersion(updatedProgram.getProgVersion());
                    existingProgram.setProgRelease(updatedProgram.getProgRelease());
                    return programRepository.save(existingProgram);
                })
                .orElseGet(() -> {
                    updatedProgram.setId(programId);
                    return programRepository.save(updatedProgram);
                });
    }

    @Transactional
    public boolean deleteProgramById(Long programId) {
        if (!programRepository.existsById(programId)) {
            return false;  // Or throw an exception if you prefer
        }

        try {
            programRepository.deleteById(programId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

