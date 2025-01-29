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
import { motion } from "framer-motion"; // Import Framer Motion

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {["Home", "Projects", "About", "Contact"].map((text, index) => (
        <ListItem key={text} component="div" onClick={handleDrawerToggle}>
          <motion.div
            whileHover={{ scale: 1.1 }} // Scale effect on hover
            whileTap={{ scale: 0.9 }} // Slight shrink effect on tap
          >
            <Button
              component={Link}
              to={`/${text.toLowerCase()}`}
              sx={{ width: "100%", justifyContent: "flex-start" }}
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
              sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
              component={Link}
              to="/"
            >
              Mulersoft
            </Typography>
          </motion.div>

          {isMobile ? (
            // Animated Hamburger Menu for Mobile
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ rotate: 90 }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
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
                  <Button sx={{ color: "#ecf0f1" }} component={Link} to={`/${text.toLowerCase()}`}>
                    {text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Animated Drawer for Mobile */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: mobileOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.5 }}
      >
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              bgcolor: "#2c3e50",
              color: "#ecf0f1",
            },
          }}
        >
          {drawer}
        </Drawer>
      </motion.div>
    </>
  );
};

export default Header;
