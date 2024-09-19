import React, { useEffect, useState } from "react";
import AppBar from "../AppBar";
import AddFunction from "./AddFunction";
import DisplayFunction from "./DisplayFunction";
import { useNavigate } from "react-router-dom";

function ManageFunction() {
  const [functionList, setFunctionList] = useState([]);
  const navigate = useNavigate();

  const fetchFunctions = () => {
    fetch("http://localhost:8080/functions")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const transformedData = result.map((item, index) => ({
          id: item.funcId,
          funcName: item.funcName,
          programId: item.programId, // Now using program_id as the primary field
          name: item.progName,
          version: item.progVersion,
          release: item.progRelease,
        }));
        setFunctionList(transformedData);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  const handleBack = () => {
    navigate("/AdminDashboard", { replace: true }); // Navigates back to Manage Users
  };

  return (
    <div>
      <AppBar title={"Manage Functions"} />
      <button
        style={{ marginLeft: "20px" }}
        type="button"
        className="btn-submit"
        onClick={handleBack}
      >
        Back
      </button>
      <AddFunction onAddFunction={fetchFunctions} />
      <DisplayFunction
        functionList={functionList}
        fetchFunctions={fetchFunctions}
      />
    </div>
  );
}

export default ManageFunction;
