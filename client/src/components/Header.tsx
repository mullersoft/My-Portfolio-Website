import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#2c3e50", color: "white" }} // Custom background and text color
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Portfolio
        </Typography>
        <Button
          sx={{ color: "#ecf0f1" }} // Button text color
          component={Link}
          to="/"
        >
          Home
        </Button>
        <Button sx={{ color: "#ecf0f1" }} component={Link} to="/projects">
          Projects
        </Button>
        <Button sx={{ color: "#ecf0f1" }} component={Link} to="/about">
          About
        </Button>
        <Button sx={{ color: "#ecf0f1" }} component={Link} to="/contact">
          Contact
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
