import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AttachmentViewer = ({ attachment, onClose }) => {
  if (!attachment) return null;

  const { url, extension, bugId, attachmentId } = attachment;
  
  let content;
  const mimeType = getMimeType(extension);
  switch (mimeType) {
    case "application/pdf":
      content = (
        <iframe src={url} width="500" height="500" title="PDF Viewer"></iframe>
      );
      break;
    case "image/jpeg":
    case "image/png":
      content = (
        <img
          src={url}
          alt={`Attachment ${extension}`}
          style={{ maxWidth: "1000px" }}
        />
      );
      break;
    case "text/plain":
    case "application/xml":
    case "text/xml":
      content = (
        <iframe src={url} width="500" height="500" title="Text Viewer"></iframe>
      );
      break;
    // Add more cases as needed
    default:
      if (["xlsx", "docx"].includes(extension.toLowerCase())) {
        content = (
          <p>
            This file type cannot be previewed directly in the browser. Please
            download it to view.
          </p>
        );
      } else {
        content = <p>Unsupported file type</p>;
      }
      break;
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="attachment-viewer-title"
      aria-describedby="attachment-viewer-description"
    >
      <Box sx={style}>
        <h2 id="attachment-viewer-title">
          Attachment Bug_{bugId}_{attachmentId}
        </h2>
        {content}
        <Button onClick={onClose}>Close</Button>
        {/* Modify the download attribute here */}
        <a
          href={url}
          download={`Bug_${bugId}_Attachment_${attachmentId}.${extension}`}
          style={{ marginLeft: "10px" }}
        >
          Download
        </a>
      </Box>
    </Modal>
  );
};

// Function to map file extensions to MIME types
function getMimeType(extension) {
  if (!extension) {
    console.error("Received undefined or null extension for MIME type detection");
    return "application/octet-stream"; // Safe fallback
  }

  switch (extension.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "png":
      return "image/png";
    case "txt":
      return "text/plain";
    case "xml":
      return "text/xml";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
}

export default AttachmentViewer;
