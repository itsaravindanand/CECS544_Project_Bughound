package com.cecs544.bughound.attachment;

public class AttachmentDto {

    private String attachmentExt;

    private byte[] attachmentData;

    // Getters and setters
    public byte[] getAttachmentData() {
        return attachmentData;
    }

    public void setAttachmentData(byte[] attachmentData) {
        this.attachmentData = attachmentData;
    }


    public String getAttachmentExt() {
        return attachmentExt;
    }

    public void setAttachmentExt(String attachmentExt) {
        this.attachmentExt = attachmentExt;
    }
}
