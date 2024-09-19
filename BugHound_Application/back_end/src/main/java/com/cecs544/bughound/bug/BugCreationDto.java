package com.cecs544.bughound.bug;

import com.cecs544.bughound.attachment.AttachmentDto;

import java.time.LocalDate;
import java.util.List;

public class BugCreationDto {
    private Long buggyProgramId;
    private String reportType;
    private String severity;
    private List<AttachmentDto> attachments;
    private String problemSummary;
    private Boolean reproducible;
    private String detailedSummary;
    private String suggestion;
    private String reportedBy;
    private LocalDate reportDate;

    // Getters and setters

    public Long getBuggyProgramId() {
        return buggyProgramId;
    }

    public void setBuggyProgramId(Long buggyProgramId) {
        this.buggyProgramId = buggyProgramId;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public List<AttachmentDto> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentDto> attachments) {
        this.attachments = attachments;
    }

    public String getProblemSummary() {
        return problemSummary;
    }

    public void setProblemSummary(String problemSummary) {
        this.problemSummary = problemSummary;
    }

    public Boolean getReproducible() {
        return reproducible;
    }

    public void setReproducible(Boolean reproducible) {
        this.reproducible = reproducible;
    }

    public String getDetailedSummary() {
        return detailedSummary;
    }

    public void setDetailedSummary(String detailedSummary) {
        this.detailedSummary = detailedSummary;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }
}
