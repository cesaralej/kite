import React, { useState, MouseEvent } from "react";
import { Box, Drawer, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../lib/contextLib";
import { Auth } from "aws-amplify";
import AppBarComponent from "./AppBar";
import DrawerComponent from "./Drawer";
import { useWebSocket } from "../../hooks/useWebSocket";
import {
  FaUsers,
  FaDesktop,
  FaFileAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaBell,
  FaCog,
  FaExclamationTriangle,
  FaClock,
  FaUserFriends,
  FaBook,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { userHasAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const {
    disconnectWebSocket, // Get the disconnect function from your hook
  } = useWebSocket();

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    await Auth.signOut();
    disconnectWebSocket();
    userHasAuthenticated(false);
    console.log("Logged out");
    handleMenuClose();
    navigate("/login");
  }

  const drawerItems = [
    {
      text: "User Directory",
      icon: <FaUserFriends />,
      path: "/directory",
    },
    { text: "HR Support", icon: <FaUsers />, path: "/hr-support" },
    { text: "IT Support", icon: <FaDesktop />, path: "/it-support" },
    { text: "Timesheets", icon: <FaClock />, path: "/timesheets" },
    {
      text: "Document Request",
      icon: <FaFileAlt />,
      path: "/document-request",
    },
    {
      text: "Time Off Request",
      icon: <FaCalendarAlt />,
      path: "/time-off-request",
    },
    {
      text: "Company Benefits",
      icon: <FaDollarSign />,
      path: "/company-benefits",
    },
    {
      text: "Learning Resources",
      icon: <FaBook />,
      path: "/learn",
    },
    {
      text: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
      dividerBefore: true,
    },
    { text: "Notifications", icon: <FaBell />, path: "/notifications" },
    { text: "Settings", icon: <FaCog />, path: "/settings" },
    { text: "Help", icon: <FaExclamationTriangle />, path: "/help" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }} textAlign={"center"}>
      <AppBarComponent
        onMenuClick={handleMenuClick}
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
        handleLogout={handleLogout}
        toggleDrawer={toggleDrawer}
      />
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
          },
        }}
      >
        <DrawerComponent
          items={drawerItems} // Ensure the prop name matches
          toggleDrawer={toggleDrawer}
        />
      </Drawer>
      <Toolbar />
      {/* Body content goes here */}
    </Box>
  );
};

export default Navbar;
