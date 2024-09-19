import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../AppBar";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";
import { useAuth } from "../context/AuthProvider";

const TesterDashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { user: username } = auth;
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Define some inline styles
  const buttonStyle = {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50", // Green background
    color: "white",
    border: "none",
    borderRadius: "5px",
  };

  const enumFields = {
    reportType: [
      "CODING_ERROR",
      "DESIGN_ISSUE",
      "SUGGESTION",
      "DOCUMENTATION",
      "HARDWARE",
      "QUERY",
    ],
    severity: ["MINOR", "SERIOUS", "FATAL"],
    status: ["OPEN", "RESOLVED", "CLOSED"],
    priority: [
      "FIX_IMMEDIATELY",
      "FIX_AS_SOON_AS_POSSIBLE",
      "FIX_BEFORE_NEXT_MILESTONE",
      "FIX_BEFORE_RELEASE",
      "FIX_IF_POSSIBLE",
      "OPTIONAL",
    ],
    resolution: [
      "PENDING",
      "FIXED",
      "CANNOT_BE_REPRODUCED",
      "DEFERRED",
      "AS_DESIGNED",
      "WITHDRAWN_BY_REPORTER",
      "NEED_MORE_INFO",
      "DISAGREE_WITH_SUGGESTION",
      "DUPLICATE",
    ],
  };

  const fieldDisplayNameMapping = {
    bug_id: "Bug ID",
    buggyProgram: "Buggy Program", // Updated to match new column name
    version: "Version", // New field
    release: "Release", // New field
    problemSummary: "Problem Summary", // New field
    reportedBy: "Reported By",
    reportType: "Type", // Changed key to match the JSON structure
    severity: "Severity",
    reportDate: "Date", // Changed key to match the JSON structure
    functionalArea: "Area", // Changed key and description
    assignedTo: "Assigned To",
    status: "Status",
    priority: "Priority",
    resolution: "Resolution",
    resolvedBy: "Resolved By",
  };

  const exportToExcel = (apiData, fileName) => {
    const transformedData = apiData.map((data) => ({
      ...data,
      buggyProgram: data.buggyProgram ? data.buggyProgram.progName : "-",
      version: data.buggyProgram ? data.buggyProgram.progVersion : "-",
      release: data.buggyProgram ? data.buggyProgram.progRelease : "-",
      functionalArea: data.function ? data.function.funcName : "-",
      comments: data.comments
        .map(
          (comment) =>
            `Time: ${comment.commentTime}, Comment: ${comment.comment}`
        )
        .join("; "),
      attachments: data.attachments
        .map(
          (attachment) =>
            `ID: ${attachment.attachmentId}, Data: ${attachment.attachment}`
        )
        .join("; "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bugs");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToText = (apiData, fileName) => {
    let textData = apiData
      .map((data) => {
        return Object.values(data).join(", ");
      })
      .join("\n");

    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${fileName}.txt`;
    link.href = url;
    link.click();
  };

  const exportToXML = (apiData, fileName) => {
    let xmlData = '<?xml version="1.0"?>\n<bugs>\n';
    apiData.forEach((data) => {
      xmlData += "  <bug>\n";
      for (const key in data) {
        xmlData += `    <${key}>${data[key]}</${key}>\n`;
      }
      xmlData += "  </bug>\n";
    });
    xmlData += "</bugs>";

    const blob = new Blob([xmlData], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${fileName}.xml`;
    link.href = url;
    link.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        const result = await axios(
          `http://localhost:8080/bugs/reportedBy/${username}`
        );
        setBugs(result.data);
      }
    };
    fetchData();
  }, []);

  const viewBugDetails = (bugId) => {
    navigate(`/testerbugdetails/${bugId}`);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSearchTerm(""); // Reset search term when changing filter
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBugs = filter
    ? bugs.filter((bug) => {
        const key = filter === "buggyProgram" ? "progName" : filter;
        const value =
          filter === "buggyProgram" ? bug.buggyProgram?.progName : bug[filter];
        return value
          ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false;
      })
    : bugs;

  return (
    <div>
      <AppBar title="Tester Dashboard" />
      <TableContainer
        component={Paper}
        style={{ maxWidth: 650, margin: "50px auto", padding: "20px" }}
      >
        <Typography
          style={{ fontFamily: '"Segoe UI", sans-serif', flexGrow: 2 }}
          variant="h4"
          textAlign="auto"
          component="div"
          sx={{ flexGrow: 2 }}
        >
          Tester Operations
        </Typography>
        <div
          style={{
            height: "2px",
            backgroundColor: "black",
            margin: "20px 0",
            width: "100%",
          }}
        ></div>
        <Table aria-label="Dashboard Options">
          <TableBody>
            <TableRow>
              <TableCell
                style={{ fontWeight: "bold" }}
                component="th"
                scope="row"
              >
                Report a New Bug
              </TableCell>
              <TableCell align="auto">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/createbug")}
                >
                  Report Bug
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          height: "2px",
          backgroundColor: "black",
          margin: "20px 0",
          width: "100%",
        }}
      ></div>
      <Typography
        style={{ fontFamily: '"Segoe UI", sans-serif', flexGrow: 2 }}
        variant="h4"
        textAlign="auto"
        component="div"
      >
        Reported Bugs
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TableContainer
          component={Paper}
          style={{
            margin: "20px",
            maxWidth: "95%",
            maxHeight: 500,
            border: "3px solid rgb(0, 0, 0)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: "10px",
            }}
          >
            <TextField
              select
              label="Filter by"
              value={filter}
              onChange={handleFilterChange}
              helperText="Select the column to filter"
              variant="outlined"
              style={{ margin: "10px", width: "200px" }}
            >
              <MenuItem value="">None</MenuItem>
              {Object.entries(fieldDisplayNameMapping).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            {filter === "reportDate" ? (
              <TextField
                type="text"
                label="Enter Date (YYYY-MM-DD)"
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
                placeholder="YYYY-MM-DD"
                helperText="Use date format: YYYY-MM-DD"
              />
            ) : filter && enumFields[filter] ? (
              <TextField
                select
                label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
              >
                <MenuItem value="">-</MenuItem>
                {enumFields[filter].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
                disabled={!filter}
              />
            )}
            <Typography
              style={{ margin: "25px", fontSize: "16px" }}
              variant="body1"
            >
              {`${filteredBugs.length} of ${bugs.length}`} Bugs
            </Typography>
          </div>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ background: "#4fade4", fontWeight: "bold" }}>
              <TableRow>
                {[
                  "Bug ID",
                  "Buggy Program",
                  "Version",
                  "Release",
                  "Problem Summary",
                  "Reported By",
                  "Type",
                  "Severity",
                  "Date",
                  "Area",
                  "Assigned To",
                  "Status",
                  "Priority",
                  "Resolution",
                  "Resolved By",
                ].map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBugs.map((bug) => (
                <TableRow key={bug.bug_id}>
                  <TableCell component="th" scope="row">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        viewBugDetails(bug.bug_id);
                      }}
                    >
                      {bug.bug_id}
                    </a>
                  </TableCell>
                  <TableCell>{bug.buggyProgram?.progName || "-"}</TableCell>
                  <TableCell>{bug.buggyProgram?.progVersion || "-"}</TableCell>
                  <TableCell>{bug.buggyProgram?.progRelease || "-"}</TableCell>
                  <TableCell>{bug.problemSummary || "-"}</TableCell>
                  <TableCell>{bug.reportedBy || "-"}</TableCell>
                  <TableCell>{bug.reportType || "-"}</TableCell>
                  <TableCell>{bug.severity || "-"}</TableCell>
                  <TableCell>
                    {bug.reportDate ? bug.reportDate.split("T")[0] : "-"}
                  </TableCell>
                  <TableCell>{bug.function?.funcName || "-"}</TableCell>
                  <TableCell>{bug.assignedTo || "-"}</TableCell>
                  <TableCell>{bug.status || "-"}</TableCell>
                  <TableCell>{bug.priority || "-"}</TableCell>
                  <TableCell>{bug.resolution || "-"}</TableCell>
                  <TableCell>{bug.resolvedBy || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <button
        onClick={() => exportToExcel(filteredBugs, "Bug_Report")}
        style={buttonStyle}
      >
        Export to Excel
      </button>
      <button
        onClick={() => exportToText(filteredBugs, "Bug_Report_ASCII")}
        style={buttonStyle}
      >
        Export to ASCII Text
      </button>
      <button
        onClick={() => exportToXML(filteredBugs, "Bug_Report_XML")}
        style={buttonStyle}
      >
        Export to XML
      </button>
    </div>
  );
};

export default TesterDashboard;
