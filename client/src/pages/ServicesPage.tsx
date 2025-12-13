// src/pages/ServicesPage.tsx
import React from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
import { motion } from "framer-motion";
import BuildIcon from '@mui/icons-material/Build';
import SecurityIcon from '@mui/icons-material/Security';
import ApiIcon from '@mui/icons-material/IntegrationInstructions';
import StorageIcon from '@mui/icons-material/Storage';
import ChatIcon from '@mui/icons-material/Chat';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const services = [
  {
    title: "Full-Stack Web Development",
    description: "MERN stack, Laravel, TypeScript — scalable, responsive, and modern web applications.",
    icon: <BuildIcon color="primary" />
  },
  {
    title: "Odoo ERP Customization & Module Development",
    description: "End-to-end functional and technical consultancy for ERP implementations.",
    icon: <AutoAwesomeIcon color="primary" />
  },
  {
    title: "SharePoint / PowerApps / Automated Workflows",
    description: "Streamlining business processes, approvals, and automation using Microsoft platforms.",
    icon: <StorageIcon color="primary" />
  },
  {
    title: "AI-Powered Chatbot Development & Automation",
    description: "Integrating AI chatbots for enhanced business interaction and automation.",
    icon: <ChatIcon color="primary" />
  },
  {
    title: "API Development & Integrations",
    description: "Secure and robust API design, development, and integration with third-party systems.",
    icon: <ApiIcon color="primary" />
  },
  {
    title: "Database Design & Backend Services",
    description: "Efficient database design, optimization, and backend services for reliable applications.",
    icon: <SecurityIcon color="primary" />
  },
];

const ServicesPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
        style={{ textAlign: "center", marginBottom: "30px" }}
      >
        <Typography variant="h3" sx={{ color: "#007bff", fontWeight: 700 }}>
          Services & Expertise
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#444" }}>
          What I offer remotely — secure, scalable, and clean solutions
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {services.map((service, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={idx + 1}
              variants={fadeInUp}
            >
              <Card sx={{ p: 2, backgroundColor: "#fafafa", border: "1px solid #ddd", display: "flex", alignItems: "start", gap: 1 }}>
                <div style={{ fontSize: "2rem", marginRight: "12px" }}>{service.icon}</div>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" sx={{ color: "#007bff", mb: 0.5 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#444" }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        custom={services.length + 1}
        style={{ marginTop: "30px", textAlign: "center" }}
      >
        <Typography variant="body1" sx={{ color: "#444" }}>
          I’m open to short-term or long-term roles, remote collaborations, and specialized development projects.
          My goal is to deliver secure, scalable, and clean solutions that solve real business problems.
        </Typography>
        <Typography variant="body1" sx={{ color: "#007bff", mt: 1 }}>
          I am also seeking opportunities for a PhD scholarship abroad in software engineering, AI, or cybersecurity.
        </Typography>
      </motion.div>
    </Container>
  );
};

export default ServicesPage;
