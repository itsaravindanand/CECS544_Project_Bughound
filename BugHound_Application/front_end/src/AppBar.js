import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "./context/AuthProvider";

export default function ButtonAppBar({ title }) {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if user and userType are null when the component mounts
    if (!auth.user && !auth.userType) {
      navigate("/", { replace: true }); // Navigate to the login page
    }
  }, [auth.user, auth.userType, navigate]); // Dependencies for the effect

  const handleLogout = () => {
    setAuth({ user: null, userType: null });
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            textAlign="left"
            component="div"
            sx={{ flexGrow: 2 }}
          >
            {title} {/* Use the passed title prop here */}
          </Typography>
          <Typography variant="h6" component="div" sx={{ marginRight: "20px" }}>
            Hello {auth.user || "Guest"}!
          </Typography>
          {/* Optional: Show user type */}
          {/* <Typography variant="h6" component="div" sx={{ marginRight: '20px' }}>
            Role: {auth.userType || 'Guest'}
          </Typography> */}
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              border: "1px solid white",
              "&:hover": {
                border: "1px solid rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
