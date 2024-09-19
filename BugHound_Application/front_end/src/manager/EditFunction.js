import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function EditFunction() {
  const location = useLocation();
  const navigate = useNavigate();
  const { functionDetails } = location.state || {};

  const [funcName, setFuncName] = useState(
    functionDetails ? functionDetails.funcName : ""
  );
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    if (!funcName.trim()) {
      setError("Function name cannot be empty.");
      setOpen(true);
      return;
    }
    fetch(
      `http://localhost:8080/function/${functionDetails.programId}/${functionDetails.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcName: funcName }),
      }
    )
      .then(async (response) => {
        const responseData = await response.text(); // Always read the text first
        if (response.ok) {
          navigate("/manage-function"); // Navigate back after successful update
        } else {
          throw new Error(responseData || "Something went wrong"); // Throw the error with the response text or a default message
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message); // Set the error message from the caught error
        setOpen(true);
      });
  };

  return (
    <div>
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
        <Typography variant="h5">Edit Function</Typography>
        <TextField
          label="Function ID"
          value={functionDetails ? functionDetails.id : ""}
          disabled
          fullWidth
        />
        <TextField
          label="Program ID"
          value={functionDetails ? functionDetails.programId : ""}
          disabled
          fullWidth
        />
        <TextField
          label="Program Name"
          value={functionDetails ? functionDetails.name : ""}
          disabled
          fullWidth
        />
        <TextField
          label="Program Version"
          value={functionDetails ? functionDetails.version : ""}
          disabled
          fullWidth
        />
        <TextField
          label="Program Release"
          value={functionDetails ? functionDetails.release : ""}
          disabled
          fullWidth
        />
        <TextField
          label="Function Name"
          value={funcName}
          onChange={(e) => setFuncName(e.target.value)}
          fullWidth
        />
        <Button
          onClick={handleUpdate}
          disabled={!funcName.trim()}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
        <Button
          onClick={() => navigate("/manage-function")}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}
