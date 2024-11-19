import React from "react";
import {
  Container,
  Typography,
  Box,
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
      {/* Header Section */}
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

      {/* Work Experience Section */}
      <Typography variant="h5" gutterBottom align="center" color="primary">
        My Work Experience
      </Typography>

      {/* Work Experience Cards */}
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary">
              IT Expert at Ethiopian Investment Commission
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <i>December 2022 – November 2023</i>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              Managed IT systems, provided support for Office 365 and
              cloud-based solutions, and maintained hardware infrastructure.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary">
              Assistant Lecturer at Haramaya University
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <i>October 2018 – April 2020</i>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              Conducted lectures, seminars, and tutorials on software
              engineering topics and provided guidance to students.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ margin: "40px 0" }} />

      {/* Education Section */}
      <Typography
        variant="h5"
        gutterBottom
        mt={4}
        align="center"
        color="primary"
      >
        Education
      </Typography>

      {/* Education Cards */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary">
              MSc in Software Engineering
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Addis Ababa Science and Technology University | <i>2021 – 2024</i>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              Currently pursuing my MSc, focusing on software engineering and
              machine learning techniques.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary">
              BSc in Software Engineering
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Jigjiga University | <i>2014 – 2018</i>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              Completed my undergraduate degree with a focus on full-stack web
              development and software engineering principles.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Skills Section */}
      <Typography
        variant="h5"
        gutterBottom
        mt={4}
        align="center"
        color="primary"
      >
        Skills
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Programming & Web Development
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="JavaScript, TypeScript" />
              </ListItem>
              <ListItem>
                <ListItemText primary="React, Redux, Node.js, Express, NestJS" />
              </ListItem>
              <ListItem>
                <ListItemText primary="MongoDB, SQL" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Machine Learning & UI/UX
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Machine Learning: Model Development, Concept Drift Handling" />
              </ListItem>
              <ListItem>
                <ListItemText primary="UI/UX: CSS, Material-UI, Emotion" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tools: Git, Docker, Postman" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
