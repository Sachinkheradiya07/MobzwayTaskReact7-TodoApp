import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const NavBar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ width: "100%" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: "200px",
              },
            }}
          >
            {" "}
            <MenuItem onClick={() => navigate("/todo")}>Todo</MenuItem>
            <MenuItem onClick={() => navigate("/users")}>Users</MenuItem>
            <MenuItem onClick={() => navigate("/tasklist")}>Task List</MenuItem>
            <MenuItem onClick={() => navigate("/tasks")}>Tasks</MenuItem>
          </Menu>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <Button color="inherit" onClick={() => navigate("/Todo")}>
              Todo
            </Button>
            <Button color="inherit" onClick={() => navigate("/users")}>
              Users
            </Button>
            <Button color="inherit" onClick={() => navigate("/tasklist")}>
              Task List
            </Button>
            <Button color="inherit" onClick={() => navigate("/tasks")}>
              Tasks
            </Button>
          </Box>

          <Button
            color="inherit"
            onClick={handleLogoutClick}
            sx={{ ml: "auto", display: { md: "flex" } }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};

export default NavBar;
