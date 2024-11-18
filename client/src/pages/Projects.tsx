import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Chip, // For displaying techStack items
  Button, // For displaying the GitHub and Deployment links
  Link, // For making the links clickable
} from "@mui/material";
import { fetchProjects } from "../services/apiService.ts"; // Correctly imported API function

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[]; // Added techStack field
  githubLink: string; // GitHub link
  deploymentLink: string; // Deployment link
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetchProjects(); // Using the correct API function
        setProjects(response.data); // Assuming `response.data` is an array of projects
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  return (
    <Container>
      {/* <Typography variant="h3" gutterBottom align="center" color="primary">
        About Me
      </Typography> */}
      <Typography variant="h3" gutterBottom align="center" color="primary">
        My Projects
      </Typography>

      {/* Loading State */}
      {loading && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "200px" }}
        >
          <CircularProgress />
        </Grid>
      )}

      {/* Error State */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Projects List */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={4} key={project._id}>
              <Card>
                {/* <CardMedia
                  component="img"
                  height="140"
                  image={project.imageUrl || "https://via.placeholder.com/150"} // Fallback image
                  alt={project.title}
                /> */}
                <CardContent>
                  <Typography variant="h5">{project.title}</Typography>
                  <Typography variant="body2" paragraph>
                    {project.description}
                  </Typography>

                  {/* Tech Stack */}
                  <div style={{ marginTop: "10px" }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Tech Stack:</strong>
                    </Typography>
                    <Grid container spacing={1}>
                      {project.techStack.map((tech, index) => (
                        <Grid item key={index}>
                          <Chip label={tech} size="small" color="primary" />
                        </Grid>
                      ))}
                    </Grid>
                  </div>

                  {/* GitHub and Deployment Links */}
                  <div style={{ marginTop: "15px" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      href={project.githubLink}
                      target="_blank"
                      style={{ marginRight: "10px" }}
                    >
                      GitHub
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      component={Link}
                      href={project.deploymentLink}
                      target="_blank"
                    >
                      Deployment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Projects;
