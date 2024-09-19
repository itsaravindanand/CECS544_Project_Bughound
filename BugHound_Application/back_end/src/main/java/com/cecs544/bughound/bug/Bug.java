package com.cecs544.bughound.bug;

import com.cecs544.bughound.attachment.Attachment;
import com.cecs544.bughound.comment.Comment;
import com.cecs544.bughound.function.Function;
import com.cecs544.bughound.program.Program;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "bugs")
public class Bug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bug_id;

    @OneToOne
    @JoinColumn(name = "buggy_program_id", referencedColumnName = "program_id")
    private Program buggyProgram;

    @OneToOne
    @JoinColumn(name = "function_id", referencedColumnName = "function_id")
    private Function function;

    @OneToOne
    @JoinColumn(name = "resolution_program_id", referencedColumnName = "program_id")
    private Program resolutionProgram;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false)
    private ReportType reportType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(name = "problem_summary", length = 32, nullable = false)
    private String problemSummary;

    @Column(nullable = false)
    private Boolean reproducible;

    @Column(name = "detailed_summary", length = 64)
    private String detailedSummary;

    @Column(length = 64)
    private String suggestion;

    @Column(name = "reported_by", length = 32, nullable = false)
    private String reportedBy;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Resolution resolution;

    @Column(name = "resolved_by")
    private String resolvedBy;

    @Column(name = "resolved_date")
    private LocalDate resolvedDate;

    @Column(name = "tested_by")
    private String testedBy;

    @Column(name = "tested_date")
    private LocalDate testedDate;

    @Column(name = "treat_as_deferred")
    private Boolean treatAsDeferred;

    @OneToMany(mappedBy = "bug", fetch = FetchType.LAZY)
    @OrderBy("commentTime DESC")
    private Set<Comment> comments;

    @OneToMany(mappedBy = "bug", fetch = FetchType.LAZY)
    @OrderBy("attachmentId ASC")
    private Set<Attachment> attachments;


    // Enum types for report_type, severity, functional_area, status, priority, resolution
    public enum ReportType {
        CODING_ERROR, DESIGN_ISSUE, SUGGESTION, DOCUMENTATION, HARDWARE, QUERY
    }

    public enum Severity {
        MINOR, SERIOUS, FATAL
    }

    public enum Status {
        OPEN, RESOLVED, CLOSED
    }

    public enum Priority {
        FIX_IMMEDIATELY, FIX_AS_SOON_AS_POSSIBLE, FIX_BEFORE_NEXT_MILESTONE, FIX_BEFORE_RELEASE, FIX_IF_POSSIBLE, OPTIONAL
    }

    public enum Resolution {
        PENDING, FIXED, CANNOT_BE_REPRODUCED, DEFERRED, AS_DESIGNED, WITHDRAWN_BY_REPORTER, NEED_MORE_INFO, DISAGREE_WITH_SUGGESTION, DUPLICATE
    }

    // Getters and setters

    public Long getBug_id() {
        return bug_id;
    }

    public void setBug_id(Long bug_id) {
        this.bug_id = bug_id;
    }

    public Program getBuggyProgram() {
        return buggyProgram;
    }

    public void setBuggyProgram(Program buggyProgram) {
        this.buggyProgram = buggyProgram;
    }

    public Function getFunction() {
        return function;
    }

    public void setFunction(Function function) {
        this.function = function;
    }

    public Program getResolutionProgram() {
        return resolutionProgram;
    }

    public void setResolutionProgram(Program resolutionProgram) {
        this.resolutionProgram = resolutionProgram;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
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

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Resolution getResolution() {
        return resolution;
    }

    public void setResolution(Resolution resolution) {
        this.resolution = resolution;
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

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Set<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(Set<Attachment> attachments) {
        this.attachments = attachments;
    }
}
