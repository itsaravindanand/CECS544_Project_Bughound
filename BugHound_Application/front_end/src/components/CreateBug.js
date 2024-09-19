import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import AppBar from "../AppBar";
import "./CreateBug.css";

function CreateBug() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { user: username, userType } = auth;
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedRelease, setSelectedRelease] = useState("");
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState("");
  const [bugData, setBugData] = useState({
    buggyProgramId: "",
    reportType: "",
    severity: "",
    attachments: [],
    problemSummary: "",
    reproducible: false,
    detailedSummary: "",
    suggestion: "",
    reportedBy: username,
    reportDate: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/programs")
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBugData({ ...bugData, [name]: type === "checkbox" ? checked : value });
  };

  const handleProgramChange = (event) => {
    const programName = event.target.value;
    setSelectedProgram(programName);
    setSelectedVersion("");
    setSelectedRelease("");
  };

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
    setSelectedRelease("");
  };

  const handleReleaseChange = (event) => {
    setSelectedRelease(event.target.value);
    const program = programs.find(
      (p) =>
        p.progName === selectedProgram &&
        p.progVersion === selectedVersion &&
        p.progRelease === event.target.value
    );
    if (program) {
      setBugData({ ...bugData, buggyProgramId: program.id });
    }
  };

  const handleFileChange = (event) => {
    if (files.length >= 3) {
      alert("You can only attach a maximum of three files.");
      event.target.value = "";
      return;
    }

    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.filter((file) => file.size <= 2097152);
    if (selectedFiles.some((file) => file.size > 2097152)) {
      alert(
        "One or more files exceed the maximum size limit of 2MB and were not added."
      );
      event.target.value = "";
    }
    const totalFiles = [...files, ...newFiles].slice(0, 3);
    setFiles(totalFiles);
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attachments = await Promise.all(
      files.map(async (file, index) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const byteArray = new Uint8Array(reader.result);
            let binaryString = "";
            for (let i = 0; i < byteArray.byteLength; i++) {
              binaryString += String.fromCharCode(byteArray[i]);
            }
            const base64Data = btoa(binaryString);
            resolve({
              attachmentExt: file.name.split(".").pop(),
              attachmentData: base64Data,
            });
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      })
    );

    const fullBugData = { ...bugData, attachments };
    try {
      const response = await axios.post(
        "http://localhost:8080/bugs/createBug",
        fullBugData
      );
      console.log("Bug report submitted:", response.data);
      if (userType === "DEVELOPER") {
        navigate("/DeveloperDashboard");
      } else if (userType === "TESTER") {
        navigate("/TesterDashboard");
      } else if (userType === "ADMIN") {
        navigate("/AdminDashboard");
      } else {
        console.log(
          "Role not recognized or user does not have a specific dashboard"
        );
        // Optionally navigate to a default or error page
        // navigate('/default');
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
    }
  };

  const goToDashboard = () => {
    if (userType === "DEVELOPER") {
      navigate("/DeveloperDashboard");
    } else if (userType === "TESTER") {
      navigate("/TesterDashboard");
    } else if (userType === "ADMIN") {
      navigate("/AdminDashboard");
    } else {
      console.log(
        "Role not recognized or user does not have a specific dashboard"
      );
      // Optionally navigate to a default or error page
      // navigate('/default');
    }
  };

  return (
    <div>
      <AppBar title="Report Bug" />
      <div className="create-bug-form">
        <h1>New Bug Report Entry Page</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            required
            value={selectedProgram}
            label="Program"
            onChange={handleProgramChange}
          >
            {Array.from(new Set(programs.map((p) => p.progName))).map(
              (program, index) => (
                <MenuItem key={index} value={program}>
                  {program}
                </MenuItem>
              )
            )}
          </TextField>
          {/* <FormControl fullWidth>
            <InputLabel>Program</InputLabel>
            <Select
              required
              value={selectedProgram}
              label="Program*"
              onChange={handleProgramChange}
            >
              {Array.from(new Set(programs.map((p) => p.progName))).map(
                (program, index) => (
                  <MenuItem key={index} value={program}>
                    {program}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl> */}
          <TextField
            select
            required
            value={selectedVersion}
            label="Version"
            onChange={handleVersionChange}
            disabled={!selectedProgram}
          >
            {Array.from(
              new Set(
                programs
                  .filter((p) => p.progName === selectedProgram)
                  .map((p) => p.progVersion)
              )
            ).map((version, index) => (
              <MenuItem key={index} value={version}>
                {version}
              </MenuItem>
            ))}
          </TextField>
          {/* <FormControl fullWidth disabled={!selectedProgram}>
            <InputLabel>Version</InputLabel>
            <Select
              value={selectedVersion}
              label="Version*"
              onChange={handleVersionChange}
            >
              {Array.from(
                new Set(
                  programs
                    .filter((p) => p.progName === selectedProgram)
                    .map((p) => p.progVersion)
                )
              ).map((version, index) => (
                <MenuItem key={index} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <TextField
            select
            required
            value={selectedRelease}
            label="Release"
            onChange={handleReleaseChange}
            disabled={!selectedVersion}
          >
            {programs
              .filter(
                (p) =>
                  p.progName === selectedProgram &&
                  p.progVersion === selectedVersion
              )
              .map((p, index) => (
                <MenuItem key={index} value={p.progRelease}>
                  {p.progRelease}
                </MenuItem>
              ))}
          </TextField>
          {/* <FormControl fullWidth>
            <InputLabel>Release</InputLabel>
            <Select
              value={selectedRelease}
              label="Release*"
              onChange={handleReleaseChange}
            >
              {programs
                .filter(
                  (p) =>
                    p.progName === selectedProgram &&
                    p.progVersion === selectedVersion
                )
                .map((p, index) => (
                  <MenuItem key={index} value={p.progRelease}>
                    {p.progRelease}
                  </MenuItem>
                ))}
            </Select>
          </FormControl> */}
          <TextField
            select
            required
            id="reportType"
            label="Report Type"
            value={bugData.reportType}
            onChange={handleChange}
            name="reportType"
          >
            <MenuItem value="CODING_ERROR">CODING ERROR</MenuItem>
            <MenuItem value="DESIGN_ISSUE">DESIGN ISSUE</MenuItem>
            <MenuItem value="SUGGESTION">SUGGESTION</MenuItem>
            <MenuItem value="DOCUMENTATION">DOCUMENTATION</MenuItem>
            <MenuItem value="HARDWARE">HARDWARE</MenuItem>
            <MenuItem value="QUERY">QUERY</MenuItem>
          </TextField>
          <TextField
            select
            required
            id="severity"
            label="Severity"
            value={bugData.severity}
            onChange={handleChange}
            name="severity"
          >
            <MenuItem value="MINOR">MINOR</MenuItem>
            <MenuItem value="SERIOUS">SERIOUS</MenuItem>
            <MenuItem value="FATAL">FATAL</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={bugData.reproducible}
                onChange={handleChange}
                name="reproducible"
              />
            }
            label="Reproducible"
          />
          <TextField
            required
            id="problemSummary"
            label="Problem Summary"
            multiline
            rows={2}
            value={bugData.problemSummary}
            onChange={handleChange}
            name="problemSummary"
            inputProps={{
              maxLength: 100,
            }}
          />
          <TextField
            required
            id="detailedSummary"
            label="Detailed Summary"
            multiline
            rows={4}
            value={bugData.detailedSummary}
            onChange={handleChange}
            name="detailedSummary"
            inputProps={{
              maxLength: 200,
            }}
          />
          <TextField
            id="suggestion"
            label="Suggested Fix"
            multiline
            rows={4}
            value={bugData.suggestion}
            onChange={handleChange}
            name="suggestion"
            inputProps={{
              maxLength: 200,
            }}
          />
          <TextField
            select
            required
            id="reportedBy"
            label="Reported By"
            value={bugData.reportedBy}
            onChange={handleChange}
            name="reportedBy"
          >
            <MenuItem value={username}>{username}</MenuItem>
          </TextField>
          <TextField
            required
            id="reportDate"
            label="Reported Date"
            type="date"
            value={bugData.reportDate}
            onChange={handleChange}
            name="reportDate"
            InputLabelProps={{
              shrink: true, // This ensures the label does not overlap with the placeholder text
            }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
          />
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
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button
            onClick={goToDashboard}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateBug;
