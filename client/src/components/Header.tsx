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

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <List sx={{ width: 250 }}>
      {["Home", "Projects", "About", "Contact"].map((text) => (
        <ListItem key={text} onClick={handleCloseDrawer} button component={Link} to={text === "Home" ? "/" : `/${text.toLowerCase()}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ListItemText primary={text} sx={{ color: "white" }} />
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h6" sx={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} component={Link} to="/">
              Mulersoft
            </Typography>
          </motion.div>

          {/* Pushes the hamburger menu to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ rotate: 90 }}>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ marginLeft: "auto" }}>
                <MenuIcon />
              </IconButton>
            </motion.div>
          ) : (
            <Box sx={{ display: "flex", gap: "10px" }}>
              {["Home", "Projects", "About", "Contact"].map((text, index) => (
                <motion.div key={text} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button sx={{ color: "#ecf0f1" }} component={Link} to={text === "Home" ? "/" : `/${text.toLowerCase()}`}>
                    {text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (Opens from the LEFT) */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ "& .MuiDrawer-paper": { bgcolor: "#2c3e50", color: "#ecf0f1", width: 250 } }}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
