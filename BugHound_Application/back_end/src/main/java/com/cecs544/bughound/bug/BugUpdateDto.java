package com.cecs544.bughound.bug;

import com.cecs544.bughound.attachment.AttachmentDto;

import java.time.LocalDate;
import java.util.List;

public class BugUpdateDto {
    private Long buggyProgramId;
    private String reportType;
    private String severity;
    private String problemSummary;
    private Boolean reproducible;
    private String detailedSummary;
    private String suggestion;
    private String reportedBy;
    private LocalDate reportDate;
    private Long functionId;
    private String assignedTo;
    private String status;
    private String priority;
    private String resolution;
    private Long ResolutionProgramId;
    private String resolvedBy;
    private LocalDate resolvedDate;
    private String testedBy;
    private LocalDate testedDate;
    private Boolean treatAsDeferred;
    private String comment;
    private String commentReporter;
    private List<AttachmentDto> attachments;

    // Getters and setters

    public List<AttachmentDto> getAttachments() {
        return attachments;
    }


    public void setAttachments(List<AttachmentDto> attachments) {
        this.attachments = attachments;
    }

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

    public Long getFunctionId() {
        return functionId;
    }

    public void setFunctionId(Long functionId) {
        this.functionId = functionId;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public Long getResolutionProgramId() {
        return ResolutionProgramId;
    }

    public void setResolutionProgramId(Long resolutionProgramId) {
        ResolutionProgramId = resolutionProgramId;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public LocalDate getResolvedDate() {
        return resolvedDate;
    }

    public void setResolvedDate(LocalDate resolvedDate) {
        this.resolvedDate = resolvedDate;
    }

    public String getTestedBy() {
        return testedBy;
    }

    public void setTestedBy(String testedBy) {
        this.testedBy = testedBy;
    }

    public LocalDate getTestedDate() {
        return testedDate;
    }

    public void setTestedDate(LocalDate testedDate) {
        this.testedDate = testedDate;
    }

    public Boolean getTreatAsDeferred() {
        return treatAsDeferred;
    }

    public void setTreatAsDeferred(Boolean treatAsDeferred) {
        this.treatAsDeferred = treatAsDeferred;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getCommentReporter() {
        return commentReporter;
    }

    public void setCommentReporter(String commentReporter) {
        this.commentReporter = commentReporter;
    }
}



