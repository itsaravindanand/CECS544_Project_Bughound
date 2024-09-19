import "./App.css";
import CreateBug from "./components/CreateBug";
import DeveloperDashBoard from "./developer/DeveloperDashboard";
import TesterDashboard from "./tester/TesterDashboard";
import DeveloperBugDetails from "./developer/component/BugDetails";
import ManagerDashboard from "./manager/ManagerDashBoard";
import ManageProgram from "./manager/ManageProgram";
import ManageFunction from "./manager/ManageFunction";
import CreateUser from "./manager/CreateUser";
import UserOperation from "./manager/UserOperation";
import ManageUser from "./manager/ManageUser";
import EditUser from "./manager/EditUser";
import EditProgram from "./manager/EditProgram";
import EditFunction from "./manager/EditFunction";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import TesterBugDetails from "./tester/component/BugDetails";
import ManagerBugDetails from "./manager/component/BugDetails";
import DeveloperViewBugs from "./developer/component/DeveloperViewBugs";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/CreateBug" element={<CreateBug />} />
            <Route
              path="/DeveloperDashBoard"
              element={<DeveloperDashBoard />}
            />
            <Route
              path="/developerbugdetails/:bugId"
              element={<DeveloperBugDetails />}
            />
            <Route path="/TesterDashboard" element={<TesterDashboard />} />
            <Route
              path="/testerbugdetails/:bugId"
              element={<TesterBugDetails />}
            />
            <Route path="/AdminDashboard" element={<ManagerDashboard />} />
            <Route path="/manage-program" element={<ManageProgram />} />
            <Route path="/edit-program/:id" element={<EditProgram />} />
            <Route path="/manage-function" element={<ManageFunction />} />
            <Route path="/edit-function/:funcId" element={<EditFunction />} />
            <Route path="/manage-user" element={<UserOperation />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/manage-users" element={<ManageUser />} />
            <Route path="/edit-user/:username" element={<EditUser />} />
            <Route
              path="/managerbugdetails/:bugId"
              element={<ManagerBugDetails />}
            />
            <Route
              path="/developerviewbugdetails/:bugId"
              element={<DeveloperViewBugs />}
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
