package com.cecs544.bughound.bug;

import com.cecs544.bughound.program.Program;

public class BugSummaryDto {
    private Long bugId;
    private Program buggyProgram;
    private String problemSummary;
    private Bug.Status status;

    // Getters and setters
    public Bug.Status getStatus() {
        return status;
    }

    public void setStatus(Bug.Status status) {
        this.status = status;
    }

    public Long getBugId() {
        return bugId;
    }

    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }

    public Program getBuggyProgram() {
        return buggyProgram;
    }

    public void setBuggyProgram(Program buggyProgram) {
        this.buggyProgram = buggyProgram;
    }

    public String getProblemSummary() {
        return problemSummary;
    }

    public void setProblemSummary(String problemSummary) {
        this.problemSummary = problemSummary;
    }
}
