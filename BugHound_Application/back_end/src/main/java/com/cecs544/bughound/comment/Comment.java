package com.cecs544.bughound.comment;

import com.cecs544.bughound.bug.Bug;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@IdClass(CommentId.class)
public class Comment {
    @Id
    @Column(name = "bug_id")
    private Long bugId;

    @Id
    @Column(name = "comment_time")
    private LocalDateTime commentTime;

    @Column(name = "comment", nullable = false)
    private String comment;

    @Column(name = "reported_by", nullable = false)
    private String reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bug_id", insertable = false, updatable = false)
    private Bug bug;

    // Constructors, Getters, and Setters
    @JsonIgnore
    public Bug getBug() {
        return bug;
    }

    public void setBug(Bug bug) {
        this.bug = bug;
    }

    public Long getBugId() {
        return bugId;
    }

    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }

    public LocalDateTime getCommentTime() {
        return commentTime;
    }

    public void setCommentTime(LocalDateTime commentTime) {
        this.commentTime = commentTime;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }


    public String getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

}

