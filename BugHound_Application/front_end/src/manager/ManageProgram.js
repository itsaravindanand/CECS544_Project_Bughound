import React, { useEffect, useState } from "react";
import AppBar from "../AppBar";
import AddProgram from "./AddProgram";
import DisplayProgram from "./DisplayProgram";
import { useNavigate } from "react-router-dom";

function ManageProgram() {
  const [programList, setProgramList] = useState([]);
  const navigate = useNavigate();

  const fetchPrograms = () => {
    fetch("http://localhost:8080/programs")
      .then((res) => res.json())
      .then((result) => {
        const transformedData = result.map((item) => ({
          id: item.id, // Now using program_id as the primary field
          name: item.progName,
          version: item.progVersion,
          release: item.progRelease, // Added new field
        }));
        setProgramList(transformedData);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleBack = () => {
    navigate("/AdminDashboard", { replace: true }); // Navigates back to Manage Users
  };

  return (
    <div>
      <AppBar title={"Manage Programs"} />
      <button
        style={{ marginLeft: "20px" }}
        type="button"
        className="btn-submit"
        onClick={handleBack}
      >
        Back
      </button>
      <AddProgram onAddProgram={fetchPrograms} />
      <DisplayProgram programList={programList} fetchPrograms={fetchPrograms} />
    </div>
  );
}

export default ManageProgram;
