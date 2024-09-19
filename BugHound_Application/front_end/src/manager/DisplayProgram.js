import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DisplayProgram({ programList, fetchPrograms }) {
  const navigate = useNavigate();
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterField, setFilterField] = useState("name"); // Default filter field
  const [filterValue, setFilterValue] = useState("");
  const columns = [
    {
      field: "id",
      headerName: "Program ID",
      width: 130,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() => navigate(`/edit-program/${params.value}`)}
        >
          {params.value}
        </Button>
      ),
    },
    { field: "name", headerName: "Program Name", width: 150 },
    { field: "version", headerName: "Program Version", width: 130 },
    { field: "release", headerName: "Program Release", width: 130 },
  ];
  const handleDelete = async () => {
    const deletePromises = selectionModel.map((id) => {
      return fetch(`http://localhost:8080/program/delete/${id}`, {
        method: "DELETE",
      });
    });

    try {
      await Promise.all(deletePromises);
      fetchPrograms();
      setSelectionModel([]);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const exportToASCII = () => {
    const now = new Date(); // Current date and time in UTC
    const localTimestamp = now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    const formattedTimestamp = now
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14);

    const header = `Exported on: ${localTimestamp}\n`;
    const content =
      header +
      programList
        .map(
          (prog) =>
            `ID: ${prog.id}, Name: ${prog.name}, Version: ${prog.version}, Release: ${prog.release}`
        )
        .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `programs_${formattedTimestamp}.txt`; // Append timestamp to filename
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToXML = () => {
    const now = new Date(); // Current date and time in UTC
    const localTimestamp = now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    }); // Adjust the 'timeZone' according to your location
    const formattedTimestamp = now
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14); // Simplified ISO string without special characters
    const header = `<!-- Exported on: ${localTimestamp} -->\n`;
    const xmlContent = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      header, // Include timestamp as a comment in the XML
      "<Programs>",
      ...programList.map(
        (prog) =>
          `<Program>
                <ID>${prog.id}</ID>
                <Name>${prog.name}</Name>
                <Version>${prog.version}</Version>
                <Release>${prog.release}</Release>
            </Program>`
      ),
      "</Programs>",
    ].join("\n");

    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `programs_${formattedTimestamp}.xml`; // Append timestamp to filename
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPrograms = programList.filter((program) => {
    const itemValue = program[filterField]
      ? program[filterField].toString().toLowerCase()
      : "";
    return itemValue.includes(filterValue.toLowerCase());
  });

  return (
    <div
      style={{
        height: 300,
        width: "60%",
        margin: "auto",
        marginTop: "30px",
        marginBottom: "50px",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        textAlign="center"
        sx={{ width: "100%" }}
      >
        Program List
      </Typography>
      <Box
        sx={{
          display: "flex",
          padding: "20px",
        }}
      >
        <FormControl variant="outlined" sx={{ width: 200 }}>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filterField}
            label="Filter By"
            onChange={(e) => setFilterField(e.target.value)}
          >
            <MenuItem value="name">Program Name</MenuItem>
            <MenuItem value="version">Version</MenuItem>
            <MenuItem value="release">Release</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          variant="outlined"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ marginLeft: "10px" }}
          sx={{ width: 300 }}
        />
      </Box>
      <DataGrid
        rows={filteredPrograms}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={setSelectionModel}
        rowSelectionModel={selectionModel}
      />
      <Typography
        variant="overline"
        component="h1"
        textAlign="center"
        sx={{ width: "100%" }}
      >
        Select Program(s) to delete
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        disabled={selectionModel.length === 0}
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        Delete Selected Program(s)
      </Button>
      <Button
        variant="outlined"
        onClick={exportToASCII}
        style={{ margin: "10px" }}
      >
        Export to ASCII
      </Button>
      <Button
        variant="outlined"
        onClick={exportToXML}
        style={{ margin: "10px" }}
      >
        Export to XML
      </Button>
    </div>
  );
}
