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
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List sx={{ width: 250 }}>
      {["Home", "Projects", "About", "Contact"].map((text) => (
        <ListItem key={text} onClick={handleDrawerToggle}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              component={Link}
              to={text === "Home" ? "/" : `/${text.toLowerCase()}`} // Ensures Home navigates to "/"
              sx={{ width: "100%", justifyContent: "flex-start", color: "white" }}
            >
              <ListItemText primary={text} />
            </Button>
          </motion.div>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#2c3e50", color: "white" }}>
        <Toolbar>
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h6"
              sx={{ textDecoration: "none", color: "inherit" }}
              component={Link}
              to="/"
            >
              Mulersoft
            </Typography>
          </motion.div>

          {/* Pushes the hamburger menu to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            // Animated Hamburger Menu for Mobile
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ rotate: 90 }}>
              <IconButton
                edge="end" // Ensures the menu icon is aligned to the right
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ marginLeft: "auto" }} // Pushes it to the right
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          ) : (
            // Animated Desktop Menu
            <Box sx={{ display: "flex", gap: "10px" }}>
              {["Home", "Projects", "About", "Contact"].map((text, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    sx={{ color: "#ecf0f1" }}
                    component={Link}
                    to={text === "Home" ? "/" : `/${text.toLowerCase()}`} // Ensures Home navigates to "/"
                  >
                    {text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (Now opens from the LEFT) */}
      <Drawer
        anchor="left" // Now opens from the left
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "#2c3e50",
            color: "#ecf0f1",
            width: 250, // Ensures proper width
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
