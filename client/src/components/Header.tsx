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
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Adjusts for mobile view

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen); // Toggles the state of the Drawer
  };

  const drawer = (
    <List>
      <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/projects" onClick={handleDrawerToggle}>
        <ListItemText primary="Projects" />
      </ListItem>
      <ListItem button component={Link} to="/about" onClick={handleDrawerToggle}>
        <ListItemText primary="About" />
      </ListItem>
      <ListItem button component={Link} to="/contact" onClick={handleDrawerToggle}>
        <ListItemText primary="Contact" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#2c3e50", color: "white" }}>
        <Toolbar>
          {/* Clickable Title */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            component={Link}
            to="/"
          >
            Mulersoft
          </Typography>

          {/* Mobile view: Hamburger menu */}
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // Desktop view: Horizontal menu
            <Box sx={{ display: "flex", gap: "10px" }}>
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
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Keeps the drawer mounted for better performance
        }}
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
