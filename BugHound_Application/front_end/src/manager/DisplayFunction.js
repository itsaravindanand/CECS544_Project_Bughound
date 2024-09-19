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

export default function DisplayFunction({ functionList, fetchFunctions }) {
  const navigate = useNavigate();
  const [selectionModel, setSelectionModel] = useState([]);
  const [filterField, setFilterField] = useState("funcName");
  const [filterValue, setFilterValue] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "Function ID",
      width: 150,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() =>
            navigate(`/edit-function/${params.value}`, {
              state: { functionDetails: params.row },
            })
          }
        >
          {params.value}
        </Button>
      ),
    },
    { field: "funcName", headerName: "Function Name", width: 200 },
    { field: "name", headerName: "Program Name", width: 200 },
    { field: "version", headerName: "Program Version", width: 150 },
    { field: "release", headerName: "Program Release", width: 150 },
    { field: "programId", headerName: "Program ID", width: 150 },
  ];

  const filteredFunctions = functionList.filter((func) => {
    const itemValue = func[filterField]
      ? func[filterField].toString().toLowerCase()
      : "";
    return itemValue.includes(filterValue.toLowerCase());
  });

  const handleDelete = async () => {
    const deletePromises = selectionModel.map((funcId) => {
      const functionInfo = functionList.find((func) => func.id === funcId);
      if (functionInfo) {
        return fetch(
          `http://localhost:8080/function/remove/${functionInfo.programId}/${funcId}`,
          {
            method: "DELETE",
          }
        );
      }
    });

    try {
      await Promise.all(deletePromises);
      fetchFunctions(); // Refresh the function list after successful deletion
      setSelectionModel([]);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const exportToASCII = () => {
    const now = new Date();
    const localTimestamp = now.toLocaleString();
    const formattedTimestamp = now
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14);

    const header = `Exported on: ${localTimestamp}\n`;
    const content =
      header +
      filteredFunctions
        .map((func) => {
          return `Function ID: ${func.id}, Program ID: ${func.programId}, Program Name: ${func.name}, Program Version: ${func.version}, Program Release: ${func.release}, Function Name: ${func.funcName}`;
        })
        .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `functions_${formattedTimestamp}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToXML = () => {
    const now = new Date();
    const localTimestamp = now.toLocaleString();
    const formattedTimestamp = now
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14);

    const header = `<!-- Exported on: ${localTimestamp} -->\n`;
    const xmlContent = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      header,
      "<Functions>",
      ...filteredFunctions.map((func) => {
        return `<Function>
                  <FunctionID>${func.id}</FunctionID>
                  <ProgramID>${func.programId}</ProgramID>
                  <ProgramName>${func.name}</ProgramName>
                  <ProgramVersion>${func.version}</ProgramVersion>
                  <ProgramRelease>${func.release}</ProgramRelease>
                  <FunctionName>${func.funcName}</FunctionName>
                </Function>`;
      }),
      "</Functions>",
    ].join("\n");

    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `functions_${formattedTimestamp}.xml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        height: 300,
        width: "80%",
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
        Function List
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
            <MenuItem value="id">Function ID</MenuItem>
            <MenuItem value="funcName">Function Name</MenuItem>
            <MenuItem value="programId">Program ID</MenuItem>
            <MenuItem value="name">Program Name</MenuItem>
            <MenuItem value="version">Program Version</MenuItem>
            <MenuItem value="release">Program Release</MenuItem>
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
        rows={filteredFunctions}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={setSelectionModel}
        rowSelectionModel={selectionModel}
        style={{ width: "auto", height: 450 }}
      />
      <Typography
        variant="overline"
        component="h1"
        textAlign="center"
        sx={{ width: "100%" }}
      >
        Select function area(s) to delete
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        disabled={selectionModel.length === 0}
        style={{ margin: "10px" }}
      >
        Delete Selected Function(s)
      </Button>
      <Button
        variant="outlined"
        onClick={exportToASCII}
        sx={{ marginRight: "10px" }}
      >
        Export to ASCII
      </Button>
      <Button variant="outlined" onClick={exportToXML}>
        Export to XML
      </Button>
    </div>
  );
}
