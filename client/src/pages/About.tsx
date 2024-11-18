import React from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
} from "@mui/material";

const About: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom align="center" color="primary">
        About Me
      </Typography>

      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        paragraph
        sx={{ textAlign: "justify" }}
      >
        Hello! I'm <strong>Mulugeta Linger</strong>, a passionate software
        developer with a BSc and MSc in Software Engineering. I specialize in
        full-stack web development, focusing on the MERN stack (MongoDB,
        Express, React, Node.js). I am dedicated to creating innovative web
        applications and integrating machine learning and deep learning
        technologies to provide more efficient solutions.
      </Typography>

      <Typography variant="h5" gutterBottom align="center" color="primary">
        My Work Experience
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary">
              Assistant Lecturer at Wollo University
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <i>April 2020 – Present</i>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              I prepare and deliver lectures on software engineering topics,
              supervise undergraduate students for their final projects, and
              collaborate on research projects.
            </Typography>
          </Paper>
        </Grid>

        {/* Other Work Experience Cards */}
      </Grid>
    </Container>
  );
};

export default About;
