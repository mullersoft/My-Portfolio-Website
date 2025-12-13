import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Function to handle navigation and close the drawer
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <List sx={{ width: 250 }}>
      {["Home","About", "Projects", "Publications" ,"Services",  "Contact"].map(
        (text) => (
          <ListItem
            key={text}
            onClick={() =>
              handleNavigation(text === "Home" ? "/" : `/${text.toLowerCase()}`)
            }
            component="li"
            disablePadding
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ListItemText
                primary={text}
                sx={{ color: "white", cursor: "pointer" }}
              />
            </motion.div>
          </ListItem>
        )
      )}
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
              sx={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Mulersoft
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            // Animated Hamburger Menu for Mobile (on the right)
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ rotate: 90 }}>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ marginLeft: "auto" }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          ) : (
            // Animated Desktop Menu
            <Box sx={{ display: "flex", gap: "10px" }}>
              {[
                "Home",
                "About",


                "Projects",
                "Publications",
                "Services",

                "Contact",
              ].map((text, index) => (
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
                    onClick={() =>
                      handleNavigation(
                        text === "Home" ? "/" : `/${text.toLowerCase()}`
                      )
                    }
                  >
                    {text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (Opens from the LEFT) */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "#2c3e50",
            color: "#ecf0f1",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
