package com.cecs544.bughound.comment;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Embeddable
public class CommentId implements Serializable {
    private Long bugId;
    private LocalDateTime commentTime;
    public CommentId() {}

    public CommentId(Long bugId, LocalDateTime commentTime) {
        this.bugId = bugId;
        this.commentTime = commentTime;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CommentId commentId = (CommentId) o;
        return Objects.equals(bugId, commentId.bugId) && Objects.equals(commentTime, commentId.commentTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bugId, commentTime);
    }
}

