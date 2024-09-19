import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppBar from "../AppBar";
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

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { user: username } = auth;
  const [reportedBugs, setReportedBugs] = useState([]);
  const [assignedBugs, setAssignedBugs] = useState([]);
  const [reportFilter, setReportFilter] = useState("");
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  const [assignFilter, setAssignFilter] = useState("");
  const [assignSearchTerm, setAssignSearchTerm] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        const reportedResponse = await axios(
          `http://localhost:8080/bugs/reportedBy/${username}`
        );
        setReportedBugs(reportedResponse.data);
        const assignedResponse = await axios(
          `http://localhost:8080/bugs/assignedTo/${username}`
        );
        setAssignedBugs(assignedResponse.data);
      }
    };

    fetchData();
  }, [username]);

  const handleReportFilterChange = (event) => {
    setReportFilter(event.target.value);
    setReportSearchTerm("");
  };

  const handleAssignFilterChange = (event) => {
    setAssignFilter(event.target.value);
    setAssignSearchTerm("");
  };

  const handleReportSearchChange = (event) => {
    setReportSearchTerm(event.target.value);
  };

  const handleAssignSearchChange = (event) => {
    setAssignSearchTerm(event.target.value);
  };

  const filteredReportedBugs = reportFilter
    ? reportedBugs.filter((bug) => {
        const key = reportFilter === "buggyProgram" ? "progName" : reportFilter;
        const value =
          reportFilter === "buggyProgram"
            ? bug.buggyProgram?.progName
            : bug[reportFilter];
        return value
          ? value
              .toString()
              .toLowerCase()
              .includes(reportSearchTerm.toLowerCase())
          : false;
      })
    : reportedBugs;

  const filteredAssignedBugs = assignFilter
    ? assignedBugs.filter((bug) => {
        const key = assignFilter === "buggyProgram" ? "progName" : assignFilter;
        const value =
          assignFilter === "buggyProgram"
            ? bug.buggyProgram?.progName
            : bug[assignFilter];
        return value
          ? value
              .toString()
              .toLowerCase()
              .includes(assignSearchTerm.toLowerCase())
          : false;
      })
    : assignedBugs;

  const exportToExcel = (data, fileName) => {
    const transformedData = data.map((bug) => ({
      ...bug,
      reportDate: bug.reportDate
        ? new Date(bug.reportDate).toLocaleDateString()
        : "-",
      comments: bug.comments
        ?.map(
          (comment) =>
            `Time: ${comment.commentTime}, Comment: ${comment.comment}`
        )
        .join("; "),
    }));
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bugs");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const viewBugDetails = (bugId) => {
    navigate(`/developerviewbugdetails/${bugId}`);
  };

  const editBugDetails = (bugId) => {
    navigate(`/developerbugdetails/${bugId}`);
  };

  return (
    <div>
      <AppBar title="Developer Dashboard" />
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
          Developer Operations
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
              value={reportFilter}
              onChange={handleReportFilterChange}
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
            {reportFilter === "reportDate" ? (
              <TextField
                type="text"
                label="Enter Date (YYYY-MM-DD)"
                value={reportSearchTerm}
                onChange={handleReportSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
                placeholder="YYYY-MM-DD"
                helperText="Use date format: YYYY-MM-DD"
              />
            ) : reportFilter && enumFields[reportFilter] ? (
              <TextField
                select
                label="Search"
                value={reportSearchTerm}
                onChange={handleReportSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
              >
                <MenuItem value="">-</MenuItem>
                {enumFields[reportFilter].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label="Search"
                value={reportSearchTerm}
                onChange={handleReportSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
                disabled={!reportFilter}
              />
            )}
            <Typography
              style={{ margin: "25px", fontSize: "16px" }}
              variant="body1"
            >
              {`${filteredReportedBugs.length} of ${reportedBugs.length}`} Bugs
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
              {filteredReportedBugs.map((bug) => (
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
        onClick={() => exportToExcel(filteredReportedBugs, "Bug_Report")}
        style={buttonStyle}
      >
        Export to Excel
      </button>

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
        Assigned Bugs
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
              value={assignFilter}
              onChange={handleAssignFilterChange}
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
            {assignFilter === "reportDate" ? (
              <TextField
                type="text"
                label="Enter Date (YYYY-MM-DD)"
                value={assignSearchTerm}
                onChange={handleAssignSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
                placeholder="YYYY-MM-DD"
                helperText="Use date format: YYYY-MM-DD"
              />
            ) : assignFilter && enumFields[assignFilter] ? (
              <TextField
                select
                label="Search"
                value={assignSearchTerm}
                onChange={handleAssignSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
              >
                <MenuItem value="">-</MenuItem>
                {enumFields[assignFilter].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label="Search"
                value={assignSearchTerm}
                onChange={handleAssignSearchChange}
                variant="outlined"
                style={{ margin: "10px", width: "200px" }}
                disabled={!assignFilter}
              />
            )}
            <Typography
              style={{ margin: "25px", fontSize: "16px" }}
              variant="body1"
            >
              {`${filteredAssignedBugs.length} of ${assignedBugs.length}`} Bugs
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
              {filteredAssignedBugs.map((bug) => (
                <TableRow key={bug.bug_id}>
                  <TableCell component="th" scope="row">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        editBugDetails(bug.bug_id);
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
        onClick={() => exportToExcel(filteredAssignedBugs, "Bug_Report")}
        style={buttonStyle}
      >
        Export to Excel
      </button>

      <div
        style={{
          height: "2px",
          backgroundColor: "black",
          margin: "20px 0",
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export default DeveloperDashboard;
