import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AppBar from "../AppBar";
import "./UserManagement.css";

const UPDATE_ENDPOINT = "http://localhost:8080/user/update/";

// Regular expressions for validation
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const EditUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const errRef = useRef();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [userType, setUserType] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [updatePassword, setUpdatePassword] = useState(false);
  const [updateUserType, setUpdateUserType] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/${username}`
        );
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.emailId);
        setUserType(userData.userType);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
    setValidPwd(PWD_REGEX.test(pwd));
  }, [email, pwd]);

  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, email, pwd, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validEmail || (updatePassword && !validPwd)) {
      setErrMsg("Invalid Entry");
      return;
    }

    const userData = {
      firstName,
      lastName,
      ...(updateEmail && { emailId: email }),
      ...(updateUserType && { userType }),
      ...(updatePassword && { password: pwd }),
    };

    try {
      await axios.put(
        `${UPDATE_ENDPOINT}${username}`,
        JSON.stringify(userData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/manage-users", { replace: true });
    } catch (err) {
      console.error(err); // Debugging line to check the error

      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 409) {
        setErrMsg(err.response.data); // Display custom message from the server
      } else {
        setErrMsg("Registration Failed, Try Later");
      }
      errRef.current.focus();
    }
  };

  const handleCancel = () => {
    navigate("/manage-users", { replace: true }); // Navigates back to Manage Users
  };

  return (
    <div>
      <AppBar title="Edit Employee" />
      <div className="create-user-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameDisplay">Username:</label>
            <input
              type="text"
              id="usernameDisplay"
              value={username}
              disabled
              style={{
                background: "#e9ecef",
                color: "#495057",
                borderWidth: 5,
                borderColor: "#ccc",
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstname">First Name:</label>
            <input
              type="text"
              id="firstname"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
              aria-invalid={!firstName}
              style={{
                borderWidth: 5,
                borderColor: firstName ? "green" : "red",
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input
              type="text"
              id="lastname"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              required
              aria-invalid={!lastName}
              style={{
                borderWidth: 5,
                borderColor: lastName ? "green" : "red",
              }}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={updateEmail}
                onChange={(e) => setUpdateEmail(e.target.checked)}
              />
              Need to Update Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              disabled={!updateEmail}
              aria-invalid={!validEmail}
              style={{
                borderWidth: 5,
                borderColor: updateEmail
                  ? validEmail
                    ? "green"
                    : "red"
                  : "#ccc",
              }}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={updateUserType}
                onChange={(e) => setUpdateUserType(e.target.checked)}
              />
              Need to Update UserType
            </label>
            <select
              id="userType"
              onChange={(e) => setUserType(e.target.value)}
              value={userType}
              required
              disabled={!updateUserType}
              style={{
                borderWidth: 5,
                borderColor: updateUserType ? "blue" : "#ccc",
              }}
            >
              <option value="">Select User Type</option>
              <option value="tester">Tester</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={updatePassword}
                onChange={(e) => setUpdatePassword(e.target.checked)}
              />
              Need to Update Password
            </label>
            {updatePassword && (
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required={updatePassword}
                aria-invalid={!validPwd}
                style={{
                  borderWidth: 5,
                  borderColor: validPwd ? "green" : "red",
                }}
              />
            )}
          </div>
          <button
            type="submit"
            className="btn-submit"
            disabled={
              !validEmail ||
              (updatePassword && !validPwd) ||
              !firstName ||
              !lastName ||
              !userType
            }
          >
            Update
          </button>
          <button type="button" className="btn-submit" onClick={handleCancel}>
            Cancel
          </button>
          <p
            ref={errRef}
            className={`errmsg ${errMsg ? "visible" : "offscreen"}`}
            aria-live="assertive"
          >
            {errMsg}
          </p>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
