import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import AppBar from "../../AppBar";
import { useAuth } from "../../context/AuthProvider";
import AttachmentViewer from "../../AttachmentViewer";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";

const DeveloperBugDetails = () => {
  const { bugId } = useParams();
  const [editDetails, setEditDetails] = useState({});
  const { auth } = useAuth();
  const { user: username } = auth;
  const [programs, setPrograms] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const navigate = useNavigate();
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState("");
  const [buggyProgramId, setBuggyProgramId] = useState(null);
  const [functionId, setFunctionId] = useState(null);
  const [resolutionProgramId, setResolutionProgramId] = useState(null);
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const selectedFunction = functionalAreas.find(
      (f) =>
        f.funcName === editDetails.functionalArea &&
        f.progName === editDetails.buggyProgram &&
        f.progVersion === editDetails.buggyProgramVersion &&
        f.progRelease === editDetails.buggyProgramRelease
    );

    if (selectedFunction) {
      setFunctionId(selectedFunction.funcId);
    } else {
      setFunctionId(null); // Reset if no match found
    }
  }, [
    editDetails.buggyProgram,
    editDetails.buggyProgramVersion,
    editDetails.buggyProgramRelease,
    editDetails.functionalArea,
    functionalAreas,
  ]);

  useEffect(() => {
    const selectedProgram = programs.find(
      (p) =>
        p.progName === editDetails.buggyProgram &&
        p.progVersion === editDetails.resolutionVersion &&
        p.progRelease === editDetails.resolutionRelease
    );

    if (selectedProgram) {
      setResolutionProgramId(selectedProgram.id);
    } else {
      setResolutionProgramId(null); // Reset if no match is found
    }
  }, [
    editDetails.buggyProgram,
    editDetails.resolutionVersion,
    editDetails.resolutionRelease,
    programs,
  ]);

  useEffect(() => {
    fetch("http://localhost:8080/functions")
      .then((response) => response.json())
      .then((data) => {
        setFunctionalAreas(
          data.map((item) => ({
            ...item,
            progName: item.progName,
            progVersion: item.progVersion,
            progRelease: item.progRelease,
          }))
        );
      })
      .catch((error) =>
        console.error("Error fetching functional areas: ", error)
      );

    fetch(`http://localhost:8080/bugs/${bugId}`)
      .then((response) => response.json())
      .then((data) => setEditDetails(data))
      .catch((error) => console.error("Error fetching bug details: ", error));

    fetch("http://localhost:8080/programs")
      .then((response) => response.json())
      .then(setPrograms)
      .catch((error) => console.error("Error fetching programs: ", error));

    fetch("http://localhost:8080/user/usernames")
      .then((response) => response.json())
      .then(setAllUsers)
      .catch((error) => console.error("Error fetching developers: ", error));

    fetch("http://localhost:8080/user/developers")
      .then((response) => response.json())
      .then(setDevelopers)
      .catch((error) => console.error("Error fetching developers: ", error));
  }, [bugId]);

  useEffect(() => {
    const selectedProgram = programs.find(
      (p) =>
        p.progName === editDetails.buggyProgram &&
        p.progVersion === editDetails.buggyProgramVersion &&
        p.progRelease === editDetails.buggyProgramRelease
    );

    if (selectedProgram) {
      setBuggyProgramId(selectedProgram.id);
    } else {
      setBuggyProgramId(null); // Reset if no match found
    }
  }, [
    editDetails.buggyProgram,
    editDetails.buggyProgramVersion,
    editDetails.buggyProgramRelease,
    programs,
  ]); // Depend on these values

  useEffect(() => {
    fetch(`http://localhost:8080/bugs/${bugId}`)
      .then((response) => response.json())
      .then((data) => {
        setEditDetails({
          ...data,
          buggyProgram: data.buggyProgram ? data.buggyProgram.progName : "",
          buggyProgramVersion: data.buggyProgram
            ? data.buggyProgram.progVersion
            : "",
          buggyProgramRelease: data.buggyProgram
            ? data.buggyProgram.progRelease
            : "",
          reportDate: data.reportDate.split("T")[0], // Format the date for input[type="date"]
          resolvedDate: data.resolvedDate
            ? data.resolvedDate.split("T")[0]
            : "",
          testedDate: data.testedDate ? data.testedDate.split("T")[0] : "",
          functionalArea: data.function ? data.function.funcName : "",
          resolutionVersion: data.resolutionProgram
            ? data.resolutionProgram.progVersion
            : "",
          resolutionRelease: data.resolutionProgram
            ? data.resolutionProgram.progRelease
            : "",
        });
        if (data.attachments && data.attachments.length > 0) {
          const fetchedAttachments = data.attachments.map((attachment) => ({
            ...attachment,
            url: byteArrayToBlobUrl(
              attachment.attachment,
              attachment.attachmentExt
            ),
            extension: attachment.attachmentExt,
          }));
          setAttachments(fetchedAttachments);
        }
      })
      .catch((error) => console.error("Error fetching bug details: ", error));
  }, [bugId]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEditDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add these states to manage the viewer modal
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Handler function to open the viewer
  const openViewer = (attachment) => {
    setSelectedAttachment({ ...attachment, bugId }); // Pass the bugId here
    setIsViewerOpen(true);
  };

  // Handler function to close the viewer
  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedAttachment(null);
  };

  const handleAddComment = () => {
    if (editDetails.newComment.trim() !== "") {
      const newComment = {
        comment: editDetails.newComment,
        commentTime: new Date().toISOString(),
        reportedBy: username,
      };
      const updatedComments = [...(editDetails.comments || []), newComment];
      setEditDetails((prev) => ({
        ...prev,
        comments: updatedComments,
        newComment: "",
      }));
      fetch(`http://localhost:8080/bugs/${bugId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: newComment.comment,
          commentReporter: newComment.reportedBy,
        }),
      })
        .then((response) => response.json())
        .then(() => alert("Comment added successfully!"))
        .catch((error) => {
          console.error("Failed to add comment: ", error);
          alert("Failed to add comment.");
        });
    }
  };

  const handleFileChange = (event) => {
    if (files.length >= 3) {
      setWarning("You can only attach a maximum of three files.");
      event.target.value = "";
      return;
    }

    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.filter((file) => file.size <= 2097152); // 2MB size limit
    if (selectedFiles.some((file) => file.size > 2097152)) {
      setWarning(
        "One or more files exceed the maximum size limit of 2MB and were not added."
      );
      event.target.value = "";
    }
    const totalFiles = [...files, ...newFiles].slice(0, 3);
    setFiles(totalFiles);
    setWarning("");
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const uploadAttachments = async () => {
    const newAttachments = await Promise.all(
      files.map(async (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const byteArray = new Uint8Array(reader.result);
            resolve({
              attachmentExt: file.name.split(".").pop(),
              attachmentData: btoa(String.fromCharCode(...byteArray)),
            });
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
      })
    );

    const updatedAttachments = [...attachments, ...newAttachments];

    fetch(`http://localhost:8080/bugs/${bugId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attachments: newAttachments }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Attachments updated successfully!");
        setAttachments(
          data.attachments.map((attachment) => ({
            ...attachment,
            url: byteArrayToBlobUrl(
              attachment.attachment,
              attachment.attachmentExt
            ),
            extension: attachment.attachmentExt,
          }))
        );
        setFiles([]); // Clear the file input after successful upload
      })
      .catch((error) => {
        console.error("Failed to update attachments: ", error);
        alert("Failed to update attachments.");
      });
  };

  const removeAttachment = (index) => {
    setAttachments((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...editDetails,
      buggyProgramId: buggyProgramId, // Add buggyProgramId to the payload
      functionId: functionId,
      resolutionProgramId: resolutionProgramId,
    };

    // Exclude program details from payload
    delete payload.buggyProgram;
    delete payload.buggyProgramVersion;
    delete payload.buggyProgramRelease;
    delete payload.attachments;
    delete payload.functionalArea;

    delete payload.resolutionProgram;
    delete payload.resolutionVersion;
    delete payload.resolutionRelease;

    fetch(`http://localhost:8080/bugs/${bugId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Bug updated successfully!");
        navigate("/AdminDashboard");
      })
      .catch((error) => {
        console.error("Error updating bug: ", error);
        alert("Failed to update bug.");
      });
  };

  function byteArrayToBlobUrl(byteArray, fileExtension) {
    const byteArrayInFormat = new Uint8Array(
      atob(byteArray)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArrayInFormat], {
      type: getMimeType(fileExtension),
    });
    return URL.createObjectURL(blob);
  }

  function getMimeType(extension) {
    switch (extension.toLowerCase()) {
      case "pdf":
        return "application/pdf";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "txt":
        return "text/plain";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      default:
        return "application/octet-stream"; // A generic binary data MIME type
    }
  }

  const goToDashboard = () => {
    navigate("/DeveloperDashboard");
  };

  return (
    <div>
      <AppBar title="Edit Bug Record" />
      <Button
        onClick={goToDashboard}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        style={{ margin: "20px" }}
      >
        Back to Dashboard
      </Button>
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Edit Bug Details (ID: {bugId})
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <FormControl fullWidth>
            <InputLabel id="buggyProgram-label">Program</InputLabel>
            <Select
              labelId="buggyProgram-label"
              name="buggyProgram"
              value={editDetails.buggyProgram || ""}
              label="Program"
              onChange={handleInputChange}
            >
              {[...new Set(programs.map((p) => p.progName))].map(
                (programName, index) => (
                  <MenuItem key={index} value={programName}>
                    {programName}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="buggyProgramVersion-label">
              Program Version
            </InputLabel>
            <Select
              labelId="buggyProgramVersion-label"
              name="buggyProgramVersion"
              value={editDetails.buggyProgramVersion || ""}
              label="Program Version"
              onChange={handleInputChange}
            >
              {[
                ...new Set(
                  programs
                    .filter((p) => p.progName === editDetails.buggyProgram)
                    .map((program) => program.progVersion)
                ),
              ].map((version, index) => (
                <MenuItem key={index} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="release-label">Release</InputLabel>
            <Select
              labelId="release-label"
              name="buggyProgramRelease"
              value={editDetails.buggyProgramRelease || ""}
              label="Program Release"
              onChange={handleInputChange}
            >
              {[
                ...new Set(
                  programs
                    .filter((p) => p.progName === editDetails.buggyProgram)
                    .map((program) => program.progRelease)
                ),
              ].map((release, index) => (
                <MenuItem key={index} value={release}>
                  {release}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="reportType-label">Report Type</InputLabel>
            <Select
              labelId="reportType-label"
              name="reportType"
              value={editDetails.reportType || ""}
              label="Report Type"
              onChange={handleInputChange}
            >
              <MenuItem value="CODING_ERROR">Coding Error</MenuItem>
              <MenuItem value="DESIGN_ISSUE">Design Issue</MenuItem>
              <MenuItem value="NEW_REQUIREMENT">New Requirement</MenuItem>
              <MenuItem value="QUERY">Query</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="severity-label">Severity</InputLabel>
            <Select
              labelId="severity-label"
              name="severity"
              value={editDetails.severity || ""}
              label="Severity"
              onChange={handleInputChange}
            >
              <MenuItem value="MINOR">MINOR</MenuItem>
              <MenuItem value="SERIOUS">SERIOUS</MenuItem>
              <MenuItem value="FATAL">FATAL</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Problem Summary"
            name="problemSummary"
            value={editDetails.problemSummary || ""}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={editDetails.reproducible || false}
                onChange={handleInputChange}
                name="reproducible"
              />
            }
            label="Reproducible"
          />

          <TextField
            label="Detailed Summary"
            name="detailedSummary"
            value={editDetails.detailedSummary || ""}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
          />

          <TextField
            label="Suggested Fix"
            name="suggestion"
            value={editDetails.suggestion || ""}
            onChange={handleInputChange}
            inputProps={{
              maxLength: 200,
            }}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="reportedBy-label">Reported By</InputLabel>
            <Select
              labelId="reportedBy-label"
              name="reportedBy"
              value={editDetails.reportedBy || ""}
              label="Reported By"
              onChange={handleInputChange}
              disabled
            >
              {allusers.map((developer, index) => (
                <MenuItem key={index} value={developer}>
                  {developer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Report Date"
            name="reportDate"
            type="date"
            value={
              editDetails.reportDate ? editDetails.reportDate.split("T")[0] : ""
            }
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled
          />

          <FormControl fullWidth>
            <InputLabel id="functionalArea-label">Functional Area</InputLabel>
            <Select
              labelId="functionalArea-label"
              name="functionalArea"
              value={editDetails.functionalArea || ""}
              label="Functional Area"
              onChange={handleInputChange}
            >
              {functionalAreas
                .filter(
                  (area) =>
                    area.progName === editDetails.buggyProgram &&
                    area.progVersion === editDetails.buggyProgramVersion &&
                    area.progRelease === editDetails.buggyProgramRelease
                )
                .map((area, index) => (
                  <MenuItem key={index} value={area.funcName}>
                    {area.funcName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="assignedTo-label">Assigned To</InputLabel>
            <Select
              labelId="assignedTo-label"
              name="assignedTo"
              value={editDetails.assignedTo || ""}
              label="Assigned To"
              onChange={handleInputChange}
            >
              {developers.map((developer, index) => (
                <MenuItem key={index} value={developer}>
                  {developer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="Status-label">Status</InputLabel>
            <Select
              labelId="Status-label"
              name="status"
              value={editDetails.status || ""}
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value="OPEN">OPEN</MenuItem>
              <MenuItem value="CLOSED">CLOSED</MenuItem>
              <MenuItem value="RESOLVED">RESOLVED</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={editDetails.priority || ""}
              label="Priority"
              onChange={handleInputChange}
            >
              <MenuItem value="FIX_IMMEDIATELY">Fix immediately</MenuItem>
              <MenuItem value="FIX_AS_SOON_AS_POSSIBLE">
                Fix as soon as possible
              </MenuItem>
              <MenuItem value="FIX_BEFORE_NEXT_MILESTONE">
                Fix before next milestone
              </MenuItem>
              <MenuItem value="FIX_BEFORE_RELEASE">Fix before release</MenuItem>
              <MenuItem value="FIX_IF_POSSIBLE">Fix if possible</MenuItem>
              <MenuItem value="OPTIONAL">Optional</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="resolution-label">Resolution</InputLabel>
            <Select
              labelId="resolution-label"
              name="resolution"
              value={editDetails.resolution || ""}
              label="Resolution"
              onChange={handleInputChange}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FIXED">Fixed</MenuItem>
              <MenuItem value="CANNOT_BE_REPRODUCED">
                Cannot be reproduced
              </MenuItem>
              <MenuItem value="DEFERRED">Deferred</MenuItem>
              <MenuItem value="AS_DESIGNED">As designed</MenuItem>
              <MenuItem value="WITHDRAWN_BY_REPORTER">
                Withdrawn by reporter
              </MenuItem>
              <MenuItem value="NEED_MORE_INFO">Need more info</MenuItem>
              <MenuItem value="DISAGREE_WITH_SUGGESTION">
                Disagree with suggestion
              </MenuItem>
              <MenuItem value="DUPLICATE">Duplicate</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="resolutionVersion-label">
              Resolution Version
            </InputLabel>
            <Select
              labelId="resolutionVersion-label"
              name="resolutionVersion"
              value={editDetails.resolutionVersion || ""}
              label="Resolution Version"
              onChange={handleInputChange}
            >
              {/* Dynamic list of software versions */}
              {[
                ...new Set(
                  programs
                    .filter((p) => p.progName === editDetails.buggyProgram)
                    .map((program) => program.progVersion)
                ),
              ].map((version, index) => (
                <MenuItem key={index} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="resolutionRelease-label">
              Resolution Release
            </InputLabel>
            <Select
              labelId="resolutionRelease-label"
              name="resolutionRelease"
              value={editDetails.resolutionRelease || ""}
              label="Resolution Release"
              onChange={handleInputChange}
            >
              {/* Dynamic list of software versions */}
              {[
                ...new Set(
                  programs
                    .filter((p) => p.progName === editDetails.buggyProgram)
                    .map((program) => program.progRelease)
                ),
              ].map((release, index) => (
                <MenuItem key={index} value={release}>
                  {release}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="resolvedBy-label">Resolved By</InputLabel>
            <Select
              labelId="resolvedBy-label"
              name="resolvedBy"
              value={editDetails.resolvedBy || ""}
              label="Resolved By"
              onChange={handleInputChange}
            >
              {developers.map((developer, index) => (
                <MenuItem key={index} value={developer}>
                  {developer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Resolved Date"
            name="resolvedDate"
            type="date"
            value={
              editDetails.resolvedDate
                ? editDetails.resolvedDate.split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
          />

          <FormControl fullWidth>
            <InputLabel id="testedBy-label">Tested By</InputLabel>
            <Select
              labelId="testedBy-label"
              name="testedBy"
              value={editDetails.testedBy || ""}
              label="Tested By"
              onChange={handleInputChange}
            >
              {developers.map((developer, index) => (
                <MenuItem key={index} value={developer}>
                  {developer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Tested Date"
            name="testedDate"
            type="date"
            value={
              editDetails.testedDate ? editDetails.testedDate.split("T")[0] : ""
            }
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={editDetails.treatAsDeferred || false}
                onChange={handleInputChange}
                name="treatAsDeferred"
              />
            }
            label="Treat As Deferred"
          />

          <Typography variant="h6" gutterBottom mt={2}>
            Attachments
          </Typography>
          <div>
            {attachments.length > 0 ? (
              attachments.map((attachment, index) => (
                <div key={index}>
                  <Button
                    onClick={() => openViewer(attachment)}
                    variant="outlined"
                    color="primary"
                  >
                    View Attachment_{bugId}_{attachment.attachmentId}
                  </Button>
                  <Button
                    onClick={() => removeAttachment(index)}
                    color="secondary"
                  >
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p>{error}</p>
            )}
          </div>
          <div className="file-input-container">
            <input type="file" id="file" multiple onChange={handleFileChange} />
            <label htmlFor="file" className="file-input-label">
              Choose Attachments
            </label>
          </div>
          {files.map((file, index) => (
            <div key={index}>
              {file.name}{" "}
              <Button onClick={() => removeFile(index)} color="secondary">
                Remove
              </Button>
            </div>
          ))}
          {warning && <p className="warning">{warning}</p>}
          <Button
            onClick={uploadAttachments}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Upload New Attachments
          </Button>

          {isViewerOpen && (
            <AttachmentViewer
              attachment={selectedAttachment}
              onClose={closeViewer}
            />
          )}

          <TextField
            label="Add a Comment"
            name="newComment"
            value={editDetails.newComment}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
          />
          <Button
            onClick={handleAddComment}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Add Comment
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
          <Typography variant="h6" gutterBottom mt={2}>
            Previous Comments
          </Typography>
          {editDetails.comments &&
            [...editDetails.comments] // Copy to a new array to avoid mutating the original state
              .sort((a, b) => new Date(b.commentTime) - new Date(a.commentTime)) // Sorting
              .map((comment, index) => (
                <Card
                  key={index}
                  sx={{
                    mt: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar aria-label="comment">
                        {comment.reportedBy.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        {/* Add any action icons if needed */}
                      </IconButton>
                    }
                    title={`Comment by ${comment.reportedBy}`}
                    subheader={
                      comment.commentTime
                        ? new Date(comment.commentTime).toLocaleString()
                        : "Recent"
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {comment.comment}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </form>
      </Box>
    </div>
  );
};

export default DeveloperBugDetails;
