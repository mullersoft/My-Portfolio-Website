import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/projects">
        <ListItemText primary="Projects" />
      </ListItem>
      <ListItem button component={Link} to="/about">
        <ListItemText primary="About" />
      </ListItem>
      <ListItem button component={Link} to="/contact">
        <ListItemText primary="Contact" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{ bgcolor: "#2c3e50", color: "white" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Portfolio
          </Typography>
          {/* Hamburger menu for mobile */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          {/* Horizontal menu for desktop */}
          <div style={{ display: "flex", gap: "10px", display: { xs: "none", md: "flex" } }}>
            <Button sx={{ color: "#ecf0f1" }} component={Link} to="/">
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
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "#2c3e50",
            color: "#ecf0f1",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
