import React from "react";
import { Container, Typography, Button, Box, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

const Home: React.FC = () => {
  return (
    <Container>
      {/* Animated Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        {/* Animated Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Avatar
            alt="Mulugeta Linger"
            src="/IMG_20240902_132520_987.jpg"
            sx={{
              width: 120,
              height: 120,
              mb: 3,
              border: "4px solid #1976d2",
            }}
          />
        </motion.div>

        {/* Animated Welcome Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to My Portfolio
          </Typography>
        </motion.div>

        {/* Animated Intro Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography variant="body1" paragraph align="justify">
            I am a software developer specializing in full-stack web development
            with expertise in the MERN stack (MongoDB, Express, React, Node.js).
            I am passionate about building scalable web applications and
            integrating machine learning solutions.
          </Typography>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Typography variant="h5" paragraph align="justify">
            Let me walk you through some of my recent projects and achievements.
          </Typography>
        </motion.div>

        {/* Animated Button with Blinking Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.1 }} // Scale effect on hover
          animate={{ opacity: [1, 0.5, 1] }} // Blinking effect
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/about"
            sx={{ marginTop: "20px" }}
          >
            Learn More About Me
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Home;
