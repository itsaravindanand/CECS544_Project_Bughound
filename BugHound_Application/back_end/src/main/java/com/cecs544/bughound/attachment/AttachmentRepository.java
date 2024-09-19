package com.cecs544.bughound.attachment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, AttachmentId> {
}

