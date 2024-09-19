package com.cecs544.bughound.attachment;

import com.cecs544.bughound.bug.Bug;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "attachments")
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bug_id", referencedColumnName = "bug_id")
    @JsonIgnore
    private Bug bug;

    @Column(name = "attachment_ext", length = 64)
    private String attachmentExt;

    @Lob
    @Column(name = "attachment", nullable = false, columnDefinition = "MEDIUMBLOB")
    private byte[] attachment;

    // Getters and setters
    public Long getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(Long attachmentId) {
        this.attachmentId = attachmentId;
    }

    public Bug getBug() {
        return bug;
    }

    public void setBug(Bug bug) {
        this.bug = bug;
    }

    public String getAttachmentExt() {
        return attachmentExt;
    }

    public void setAttachmentExt(String attachmentExt) {
        this.attachmentExt = attachmentExt;
    }

    public byte[] getAttachment() {
        return attachment;
    }

    public void setAttachment(byte[] attachment) {
        this.attachment = attachment;
    }
}
