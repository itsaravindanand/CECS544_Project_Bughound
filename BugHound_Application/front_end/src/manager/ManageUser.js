import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import for navigation
import AppBar from "../AppBar";

export default function ManageUser() {
  const [userList, setUserList] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetch("http://localhost:8080/user/details")
      .then((res) => res.json())
      .then((data) => {
        setUserList(data.map((user, index) => ({ ...user, id: index }))); // Assume each user needs a unique id for DataGrid
      })
      .catch((e) => console.error(e));
  }, []);

  const handleDelete = async () => {
    const deletePromises = selectionModel.map((id) => {
      const user = userList.find((u) => u.id === id);
      return fetch(`http://localhost:8080/user/remove/${user.username}`, {
        method: "DELETE",
      });
    });

    try {
      await Promise.all(deletePromises);
      setUserList(userList.filter((user) => !selectionModel.includes(user.id))); // Update the list in state
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
      userList
        .map(
          (user) =>
            `Username: ${user.username}, Name: ${user.firstName} ${user.lastName}, Email: ${user.emailId}, Type: ${user.userType}`
        )
        .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `userList_${formattedTimestamp}.txt`;
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
      header,
      "<Users>",
      ...userList.map(
        (user) => `<User>
          <Username>${user.username}</Username>
          <FirstName>${user.firstName}</FirstName>
          <LastName>${user.lastName}</LastName>
          <Email>${user.emailId}</Email>
          <Type>${user.userType}</Type>
        </User>`
      ),
      "</Users>",
    ].join("\n");
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `userList_${formattedTimestamp}.xml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() => navigate(`/edit-user/${params.value}`)}
        >
          {params.value}
        </Button>
      ),
    },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "emailId", headerName: "Email", width: 200 },
    { field: "userType", headerName: "User Type", width: 120 },
  ];

  const handleBack = () => {
    navigate("/manage-user", { replace: true }); // Navigates back to Manage Users
  };

  return (
    <div>
      <AppBar title="Employees Management" />
      <button
        style={{ marginBottom: "20px", marginLeft: "20px" }}
        type="button"
        className="btn-submit"
        onClick={handleBack}
      >
        Back
      </button>
      <div style={{ height: 400, width: "100%", margin: "auto" }}>
        <DataGrid
          rows={userList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={setSelectionModel}
          rowSelectionModel={selectionModel}
        />
        <Typography variant="overline" component="h1" sx={{ width: "100%" }}>
          Select Program(s) to delete
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={selectionModel.length === 0}
          sx={{ m: 2 }}
        >
          Delete Selected Employee(s)
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
    </div>
  );
}
