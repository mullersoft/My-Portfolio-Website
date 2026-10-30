
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

const GITHUB_USERNAME = "mullersoft";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve GitHub repositories.");
        }

        const data: GitHubRepo[] = await response.json();

        // Exclude forks and archived repositories
        const filteredProjects = data
          .filter((repo) => !repo.fork && !repo.archived)
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );

        setProjects(filteredProjects);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch GitHub projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubProjects();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          color="primary"
          gutterBottom
        >
          My Projects
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          A collection of my software development projects,
          research implementations, and open-source contributions.
        </Typography>

        <Button
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Visit My GitHub Profile →
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Projects */}
      {!loading && !error && (
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Showing {projects.length} public repositories
          </Typography>

          {projects.length === 0 ? (
            <Alert severity="info">
              No public repositories found.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project, index) => {
                const technologies = [
                  ...(project.language ? [project.language] : []),
                  ...project.topics,
                ];

                return (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 3,
                          transition: "0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 3,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                          >
                            {project.name.replace(/-/g, " ")}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              minHeight: 65,
                              lineHeight: 1.7,
                            }}
                          >
                            {project.description ||
                              "No description provided for this repository."}
                          </Typography>

                          {/* Technologies */}
                          <Box sx={{ mb: 2 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              {technologies.slice(0, 6).map((tech) => (
                                <Chip
                                  key={tech}
                                  label={tech}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ mb: 1 }}
                                />
                              ))}
                            </Stack>
                          </Box>

                          <Box sx={{ mt: "auto" }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mb: 2 }}
                            >
                              Last updated:{" "}
                              {new Date(
                                project.updated_at
                              ).toLocaleDateString()}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                href={project.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                fullWidth
                              >
                                GitHub
                              </Button>

                              {project.homepage && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  href={project.homepage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  fullWidth
                                >
                                  Live Demo
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Projects;
