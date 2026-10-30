
// src/pages/PublicationsPage.tsx

import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Link,
  Grid,
  Chip,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const publications = [
  {
    title:
      "Enhancing Cross-Site Scripting Attack Detection in Web Applications with a Hybrid CNN-BiLSTM and Online Learning Approach",
    authors: "M. Linger Tariku, S. Zemene Melese, and T. Tadesse Feisa",
    journal: "Communications in Computer and Information Science",
    year: "2025",
    publisher: "Springer",
    doi: "10.1007/978-3-032-05063-2_1",
    link: "https://doi.org/10.1007/978-3-032-05063-2_1",
  },
  {
    title:
      "A Hybrid K-Means Clustering and Ensemble Model for Predicting Road Traffic Accident Severity",
    authors: "G. G. Enyew, S. Zemene, T. Tadesse, and M. Linger Tariku",
    journal: "Engineering Reports",
    year: "2026",
    publisher: "Wiley",
    doi: "10.1002/eng2.70697",
    link: "https://doi.org/10.1002/eng2.70697",
  },
  {
    title:
      "Intelligent Fault Diagnosis Method for Bearings Using Deep Transfer Learning",
    authors:
      "T. T. Feisa, H. S. Gebremedhen, F. Kibrete, D. E. Woldemichael, and M. Linger Tariku",
    journal: "Communications in Computer and Information Science",
    year: "2025",
    publisher: "Springer",
    doi: "10.1007/978-3-032-05063-2_10",
    link: "https://doi.org/10.1007/978-3-032-05063-2_10",
  },
  {
    title:
      "A Comprehensive Review of GAN-CNN Hybrid Methods for Intelligent Fault Diagnosis of Rotating Machinery",
    authors: "M. Linger Tariku et al.",
    journal: "Engineering Reports",
    year: "2026",
    publisher: "Wiley",
    doi: "10.1002/eng2.71097",
    link: "https://doi.org/10.1002/eng2.71097",
  },
];

const manuscripts = [
  {
    title:
      "Comparative Evaluation of Traditional Machine Learning, Deep Learning, and Transformer Models for Six-Category Amharic News Classification",
    role: "Corresponding Author",
    description:
      "An empirical comparison of traditional machine learning, deep learning, and transformer-based approaches for six-category Amharic news classification.",
  },
  {
    title:
      "AmExVoice-MCQ: An Amharic Voice-Command Intent Dataset for Accessible Multiple-Choice Examinations",
    role: "Corresponding Author",
    description:
      "A dataset development study supporting Amharic voice-command understanding and accessible voice-based multiple-choice examination systems.",
  },
];

const ongoingResearch = [
  {
    title:
      "AI-Based Voice-Interactive Examination Framework for Independent Assessment of Blind and Visually Impaired Students",
    role: "Principal Investigator",
    period: "2026–Present",
    institution: "Wollo University",
    description:
      "Developing an Amharic voice-interactive examination framework that enables blind and visually impaired students to independently navigate and answer multiple-choice examination questions.",
    topics: [
      "Accessible AI",
      "Amharic NLP",
      "Voice Interaction",
      "Intent Classification",
    ],
  },
  {
    title: "Amharic AI-Based Digital Health Education",
    role: "Co-Investigator",
    period: "2025–Present",
    institution: "Wollo University",
    description:
      "Researching Amharic health-education question answering using multilingual language models and low-resource NLP methods to improve access to health-education information.",
    topics: [
      "Digital Health",
      "Question Answering",
      "Multilingual NLP",
      "mT5",
    ],
  },
  {
    title: "Amharic NLP and Dataset Research",
    role: "Researcher",
    period: "2025–Present",
    institution: "Wollo University and Collaborative Research",
    description:
      "Developing and evaluating Amharic language resources, including six-category news classification and AmExVoice-MCQ, with emphasis on dataset preparation, annotation, quality control, and empirical model evaluation.",
    topics: [
      "Amharic NLP",
      "Dataset Development",
      "Transformer Models",
      "Low-Resource Languages",
    ],
  },
];

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <Box sx={{ mb: 3, mt: 6 }}>
    <Typography
      variant="h4"
      sx={{ fontWeight: 700, color: "#007bff", mb: 1 }}
    >
      {title}
    </Typography>
    <Typography color="text.secondary">{subtitle}</Typography>
    <Divider sx={{ mt: 2, borderColor: "#007bff", borderBottomWidth: 2 }} />
  </Box>
);

const PublicationsPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Page Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={{ textAlign: "center", marginBottom: "35px" }}
      >
        <Typography
          variant="h3"
          sx={{ color: "#007bff", fontWeight: 800, mb: 1 }}
        >
          Publications & Research
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Peer-reviewed publications, manuscripts under review, and ongoing
          research contributions.
        </Typography>
      </motion.div>

      {/* Research Statistics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { number: "04", label: "Publications" },
          { number: "02", label: "Under Review" },
          { number: "03", label: "Ongoing Research Areas" },
        ].map((item) => (
          <Grid item xs={12} sm={4} key={item.label}>
            <Card
              elevation={0}
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: "#f4f8ff",
                border: "1px solid #dce8f8",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "#007bff", fontWeight: 800 }}
              >
                {item.number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Published Papers */}
      <SectionHeading
        title="Peer-Reviewed Publications"
        subtitle="Published research articles and conference proceedings."
      />

      <Grid container spacing={3}>
        {publications.map((pub, idx) => (
          <Grid item xs={12} key={pub.doi}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              custom={idx}
            >
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1, flexWrap: "wrap" }}
                  >
                    <Chip label={pub.year} color="primary" size="small" />
                    <Chip
                      label={pub.publisher}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, lineHeight: 1.5 }}
                  >
                    {pub.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {pub.authors}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", mb: 2 }}
                  >
                    {pub.journal}
                  </Typography>

                  <Link
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    fontWeight={600}
                  >
                    View Publication (DOI) →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Manuscripts Under Review */}
      <SectionHeading
        title="Manuscripts Under Review"
        subtitle="Ongoing scholarly contributions currently under peer review."
      />

      <Grid container spacing={3}>
        {manuscripts.map((paper, idx) => (
          <Grid item xs={12} key={paper.title}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              custom={idx}
            >
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderLeft: "4px solid #ed9b22",
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Chip
                    label="Under Review"
                    color="warning"
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, lineHeight: 1.5 }}
                  >
                    {paper.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#007bff", fontWeight: 600, mb: 1 }}
                  >
                    {paper.role}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {paper.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Ongoing Research */}
      <SectionHeading
        title="Ongoing Research"
        subtitle="Current research projects and collaborative research activities."
      />

      <Grid container spacing={3}>
        {ongoingResearch.map((research, idx) => (
          <Grid item xs={12} key={research.title}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              custom={idx}
            >
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderLeft: "4px solid #007bff",
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      label={research.role}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {research.period}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, lineHeight: 1.5 }}
                  >
                    {research.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {research.institution}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }}>
                    {research.description}
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {research.topics.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          For research collaboration and academic inquiries, feel free to
          get in touch.
        </Typography>
      </Box>
    </Container>
  );
};

export default PublicationsPage;
