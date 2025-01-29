import React from "react";
import { Box, Typography, IconButton, Link } from "@mui/material";
import { Telegram, Email, Phone, LinkedIn } from "@mui/icons-material";
import { motion } from "framer-motion"; // Import Framer Motion

const Footer: React.FC = () => {
  return (
    <Box
      textAlign="center"
      p={2}
      sx={{ bgcolor: "#34495e", color: "white" }}
    >
      {/* Animated Footer Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="body2" gutterBottom>
          © {new Date().getFullYear()} My Portfolio. All rights reserved.
        </Typography>
      </motion.div>

      <Box>
        {[
          { icon: <Telegram />, href: "https://t.me/mulersoft", color: "#1DA1F2" },
          { icon: <Email />, href: "mailto:mulerselinger@gmail.com", color: "#EA4335" },
          { icon: <Phone />, href: "tel:+251947300026", color: "#27AE60" },
          { icon: <LinkedIn />, href: "https://www.linkedin.com/in/mulugeta-linger-0890bb19a/", color: "#0A66C2" },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ display: "inline-block", margin: "0 8px" }}
          >
            <IconButton
              component={Link}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: item.color }}
            >
              {item.icon}
            </IconButton>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;
