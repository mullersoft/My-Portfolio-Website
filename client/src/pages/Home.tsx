import React from "react";
import { Container, Typography, Button, Box, Avatar } from "@mui/material";
import { Link } from "react-router-dom"; // To enable navigation to other pages

const Home: React.FC = () => {
  return (
    <Container>
      {/* Container for your image and text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        {/* Avatar (Profile picture) */}
        <Avatar
          alt="Mulugeta Linger"
          src="/IMG_20240902_132520_987.jpg" // Replace with your actual image path
          sx={{
            width: 120,
            height: 120,
            mb: 3, // margin bottom for spacing
            border: "4px solid #1976d2", // Optional: border around the image
          }}
        />

        {/* Welcome Text */}
        <Typography variant="h3" gutterBottom>
          Welcome to My Portfolio
        </Typography>

        {/* Short Intro */}
        <Typography variant="body1" paragraph align="justify">
          I am a software developer specializing in full-stack web development
          with expertise in the MERN stack (MongoDB, Express, React, Node.js). I
          am passionate about building scalable web applications and integrating
          machine learning solutions.
        </Typography>

        <Typography variant="h5" paragraph align="justify">
          Let me walk you through some of my recent projects and achievements.
        </Typography>

        {/* Button to navigate to the About page */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/about"
          style={{ marginTop: "20px" }}
        >
          Learn More About Me
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
