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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem
        component="div"
        onClick={handleDrawerToggle}
        sx={{ textDecoration: "none" }}
      >
        <Button
          component={Link}
          to="/"
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <ListItemText primary="Home" />
        </Button>
      </ListItem>
      <ListItem
        component="div"
        onClick={handleDrawerToggle}
        sx={{ textDecoration: "none" }}
      >
        <Button
          component={Link}
          to="/projects"
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <ListItemText primary="Projects" />
        </Button>
      </ListItem>
      <ListItem
        component="div"
        onClick={handleDrawerToggle}
        sx={{ textDecoration: "none" }}
      >
        <Button
          component={Link}
          to="/about"
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <ListItemText primary="About" />
        </Button>
      </ListItem>
      <ListItem
        component="div"
        onClick={handleDrawerToggle}
        sx={{ textDecoration: "none" }}
      >
        <Button
          component={Link}
          to="/contact"
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          <ListItemText primary="Contact" />
        </Button>
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

          {isMobile ? (
            // Hamburger menu for mobile
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // Horizontal menu for desktop
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
