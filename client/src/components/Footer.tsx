import React from "react";
import { Box, Typography, IconButton, Link } from "@mui/material";
import { Telegram, Email, Phone, LinkedIn } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      textAlign="center"
      p={2}
      sx={{ bgcolor: "#34495e", color: "white" }} // Custom background and text color
    >
      <Typography variant="body2" gutterBottom>
        © {new Date().getFullYear()} My Portfolio. All rights reserved.
      </Typography>
      <Box>
        {/* Telegram Link */}
        <IconButton
          component={Link}
          href="https://t.me/@mulersoft"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#1DA1F2" }} // Telegram blue color
        >
          <Telegram />
        </IconButton>

        {/* Gmail Link */}
        <IconButton
          component={Link}
          href="mailto:mulerselinger@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#EA4335" }} // Gmail red color
        >
          <Email />
        </IconButton>

        {/* Phone Link */}
        <IconButton
          component={Link}
          href="tel:+251947300026"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#27AE60" }} // Phone green color
        >
          <Phone />
        </IconButton>

        {/* LinkedIn Link */}
        <IconButton
          component={Link}
          href="https://www.linkedin.com/in/mulugeta-linger-0890bb19a/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#0A66C2" }} // LinkedIn blue color
        >
          <LinkedIn />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
