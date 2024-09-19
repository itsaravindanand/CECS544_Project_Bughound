import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function AddProgram({ onAddProgram }) {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [release, setRelease] = useState("");
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  // Update form filled status based on field values
  useEffect(() => {
    const checkFormFilled =
      name.trim() !== "" && version.trim() !== "" && release.trim() !== "";
    setIsFormFilled(checkFormFilled);
  }, [name, version, release]); // Depend on name, version, release

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const programObject = {
    progName: name,
    progVersion: version,
    progRelease: release,
  };

  function submitInfo(e) {
    e.preventDefault();
    if (isFormFilled) {
      fetch("http://localhost:8080/program/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // This tells the server you expect JSON in response
        },
        body: JSON.stringify(programObject),
      })
        .then((response) => {
          // First check the status code to decide how to proceed
          if (response.ok) {
            return response.json(); // Only parse as JSON if response is OK
          } else if (response.status === 400) {
            // Handle bad request, like existing program
            return response.text(); // Parse as text if there's an expected error
          } else {
            // Handle other types of errors
            throw new Error(`Server responded with status: ${response.status}`);
          }
        })
        .then((data) => {
          if (typeof data === "string") {
            // This means it was parsed as text
            setError(data);
            setOpen(true);
          } else {
            console.log(data);
            onAddProgram(); // Refresh the program list
            setName(""); // Reset the name field
            setVersion(""); // Reset the version field
            setRelease(""); // Reset the release field
          }
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to add the program. " + error.message);
          setOpen(true);
        });
    }
  }

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > :not(style)": { m: 0.5 },
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
        Add Programs
      </Typography>
      <Box sx={{ display: "flex", width: "50%", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          Program Name:
        </Typography>
        <TextField
          label="program_name"
          variant="outlined"
          sx={{ flexGrow: 1 }}
          value={name} // Controlled component
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", width: "50%", alignItems: "center" }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          Program Version:
        </Typography>
        <TextField
          label="program_version"
          variant="outlined"
          sx={{ flexGrow: 1 }}
          value={version} // Controlled component
          onChange={(e) => setVersion(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", width: "50%", alignItems: "center" }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          Program Release:
        </Typography>
        <TextField
          label="program_release"
          variant="outlined"
          sx={{ flexGrow: 1 }}
          value={release} // Controlled component
          onChange={(e) => setRelease(e.target.value)}
        />
      </Box>
      <Button
        onClick={submitInfo}
        variant="contained"
        disabled={!isFormFilled} // Button is disabled unless all fields are filled
      >
        Add Program
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
