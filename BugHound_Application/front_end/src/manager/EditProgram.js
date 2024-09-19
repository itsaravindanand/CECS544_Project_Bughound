import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function EditProgram() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState({
    name: "",
    version: "",
    release: "",
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/program/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgram({
          name: data.progName,
          version: data.progVersion,
          release: data.progRelease,
        });
        updateFormValidity(data.progName, data.progVersion, data.progRelease);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    updateFormValidity(program.name, program.version, program.release);
  }, [program]);

  const updateFormValidity = (name, version, release) => {
    setIsFormValid(
      name.trim() !== "" && version.trim() !== "" && release.trim() !== ""
    );
  };

  const handleUpdate = () => {
    if (!isFormValid) {
      setError("All fields are required to update the program details.");
      setOpen(true);
      return;
    }
    fetch(`http://localhost:8080/program/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progName: program.name,
        progVersion: program.version,
        progRelease: program.release,
      }),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/manage-program");
        } else if (response.status === 409) {
          // Check for conflict
          return response.text(); // Assuming the message is sent as plain text
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((text) => {
        if (text) {
          setError(text);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setOpen(true);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > :not(style)": { m: 1 },
        width: 300,
        margin: "auto",
      }}
    >
      <Typography variant="h5">Edit Program</Typography>
      <TextField
        label="Program ID"
        variant="outlined"
        value={id}
        disabled
        fullWidth
      />
      <TextField
        label="Program Name"
        variant="outlined"
        value={program.name}
        onChange={(e) => setProgram({ ...program, name: e.target.value })}
        fullWidth
      />
      <TextField
        label="Program Version"
        variant="outlined"
        value={program.version}
        onChange={(e) => setProgram({ ...program, version: e.target.value })}
        fullWidth
      />
      <TextField
        label="Program Release"
        variant="outlined"
        value={program.release}
        onChange={(e) => setProgram({ ...program, release: e.target.value })}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        disabled={!isFormValid}
        sx={{ mt: 2 }}
      >
        Update
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/manage-program")}
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
