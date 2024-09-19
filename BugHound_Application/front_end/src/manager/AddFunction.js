import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

export default function AddFunction({ onAddFunction }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramName, setSelectedProgramName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedRelease, setSelectedRelease] = useState("");
  const [funcName, setFuncName] = useState("");
  const [programId, setProgramId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/programs")
      .then((res) => res.json())
      .then(setPrograms)
      .catch((e) => console.error(e));
  }, []);

  const handleProgramNameChange = (event) => {
    setSelectedProgramName(event.target.value);
    setSelectedVersion("");
    setSelectedRelease("");
    setProgramId(null); // Reset program ID when program name changes
  };

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
    setSelectedRelease("");
    setProgramId(null); // Reset program ID when version changes
  };

  const handleReleaseChange = (event) => {
    setSelectedRelease(event.target.value);
    const foundProgram = programs.find(
      (p) =>
        p.progName === selectedProgramName &&
        p.progVersion === selectedVersion &&
        p.progRelease === event.target.value
    );
    if (foundProgram) {
      setProgramId(foundProgram.id);
    }
  };

  const submitInfo = (e) => {
    e.preventDefault();
    if (!programId || !funcName.trim()) return;

    const functionObject = {
      funcName: funcName.trim(),
      programId: programId,
    };

    fetch("http://localhost:8080/function/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(functionObject),
    })
      .then((response) => {
        if (response.ok) {
          onAddFunction(); // Refresh the list if the POST was successful
          resetForm();
        } else {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage(error.message);
        setOpenSnackbar(true);
      });
  };

  const resetForm = () => {
    setSelectedProgramName("");
    setSelectedVersion("");
    setSelectedRelease("");
    setFuncName("");
    setProgramId(null);
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > :not(style)": { m: 0.5 },
        width: "100%",
        maxWidth: 500,
        margin: "auto",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        variant="h4"
        component="h1"
        textAlign="center"
        sx={{ width: "100%" }}
      >
        Add Function Area
      </Typography>
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel>Program Name</InputLabel>
        <Select
          value={selectedProgramName}
          label="Program Name"
          onChange={handleProgramNameChange}
        >
          {[...new Set(programs.map((item) => item.progName))].map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }} disabled={!selectedProgramName}>
        <InputLabel>Version</InputLabel>
        <Select
          value={selectedVersion}
          label="Version"
          onChange={handleVersionChange}
        >
          {[
            ...new Set(
              programs
                .filter((p) => p.progName === selectedProgramName)
                .map((item) => item.progVersion)
            ),
          ].map((version) => (
            <MenuItem key={version} value={version}>
              {version}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }} disabled={!selectedVersion}>
        <InputLabel>Release</InputLabel>
        <Select
          value={selectedRelease}
          label="Release"
          onChange={handleReleaseChange}
        >
          {[
            ...new Set(
              programs
                .filter(
                  (p) =>
                    p.progName === selectedProgramName &&
                    p.progVersion === selectedVersion
                )
                .map((item) => item.progRelease)
            ),
          ].map((release) => (
            <MenuItem key={release} value={release}>
              {release}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Function Area"
        variant="outlined"
        sx={{ flexGrow: 1, m: 1 }}
        value={funcName}
        onChange={(e) => setFuncName(e.target.value)}
        required
        disabled={!programId}
      />
      <Button
        onClick={submitInfo}
        variant="contained"
        disabled={!funcName.trim() || !programId}
      >
        Add Function
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
