import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Link,
  Divider,
} from "@mui/material";
import { Email, Phone, GitHub, LinkedIn, Language } from "@mui/icons-material";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const About: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Typography
          variant="h3"
          sx={{ color: "#007bff", fontWeight: 700, textAlign: "center" }}
        >
          Mulugeta Linger
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#444", mb: 1, textAlign: "center" }}
        >
          Software Developer | Odoo ERP Functional Consultant | Full-Stack Engineer
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "0.9rem",
          }}
        >
          <Link
            href="mailto:mulerselinger@gmail.com"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Email sx={{ color: "#007bff" }} /> mulerselinger@gmail.com
          </Link>
          <Link
            href="tel:+251947300026"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Phone sx={{ color: "#007bff" }} /> +251 947 300 026
          </Link>
          <Link
            href="https://github.com/mullersoft"
            target="_blank"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <GitHub sx={{ color: "#007bff" }} /> GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/mulugeta-linger-0890bb19a/"
            target="_blank"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <LinkedIn sx={{ color: "#007bff" }} /> LinkedIn
          </Link>
          <Link
            href="https://aesthetic-stroopwafel-42b2f3.netlify.app/"
            target="_blank"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Language sx={{ color: "#007bff" }} /> Portfolio
          </Link>
        </div>
      </motion.header>

      {/* Professional Summary */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={1}
        variants={fadeInUp}
        style={{ marginBottom: "20px" }}
      >
        <Typography variant="h5" sx={{ color: "#007bff", mb: 1 }}>
          Professional Summary
        </Typography>
        <Typography variant="body1" sx={{ color: "#444", textAlign: "justify" }}>
          Software Developer and Odoo ERP Functional Consultant experienced in full-stack development,
          business process automation, and ERP customization. Skilled in Odoo functional analysis, workflow
          configuration, requirement gathering, and delivering end-to-end ERP solutions. Strong background
          in MERN, Laravel, and modern frontend frameworks. Capable of integrating AI-based features, building
          scalable systems, and providing digital transformation solutions for organizations.
        </Typography>
      </motion.section>

      <Divider sx={{ my: 2 }} />

      {/* Work Experience */}
      <section style={{ marginBottom: "20px" }}>
        <Typography variant="h5" sx={{ color: "#007bff", mb: 1 }}>
          Work Experience
        </Typography>
        {[
          {
            role: "Odoo ERP Functional Consultant (Remote)",
            company: "ET Plus Company",
            duration: "2025 – Present",
            summary:
              "Providing functional consultancy for Odoo ERP implementations including Sales, Purchase, Inventory, HR, Accounting, and CRM modules. Conducting requirement analysis, configuring workflows, preparing technical documentation, training users, and coordinating with developers for customizations. Supporting deployment, testing, and continuous improvement of ERP systems for multiple clients.",
          },
          {
            role: "Software Engineering Lecturer",
            company: "Wollo University",
            duration: "2024 – Present",
            summary:
              "Teaching modern software engineering courses including Full-Stack Web Development, Database Systems, and AI. Mentoring students in project development and research. Contributing to academic research with published work in cybersecurity and machine learning.",
          },
          {
            role: "Full-Stack Developer (Intern)",
            company: "Qelemeda Software Company",
            duration: "Jul – Sep 2025",
            summary:
              "Developed Laravel and Vue.js applications focusing on authentication, dashboards, reporting, and reusable components. Worked closely with the engineering team to deliver product features and API integrations.",
          },
          {
            role: "IT Expert",
            company: "Ethiopian Investment Commission",
            duration: "2022 – 2023",
            summary:
              "Managed enterprise IT infrastructure, supported digital systems, and facilitated workflow automation using SharePoint and Office 365 platforms.",
          },
        ].map((job, idx) => (
          <motion.div
            key={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={idx + 1}
            variants={fadeInUp}
          >
            <Card
              sx={{ mb: 2, backgroundColor: "#fafafa", border: "1px solid #ddd" }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#007bff" }}>
                  {job.role}
                </Typography>
                <Typography variant="body2" sx={{ color: "#1a1a1a" }}>
                  {job.company}
                </Typography>
                <Typography variant="body2" sx={{ color: "#444", mb: 1 }}>
                  {job.duration}
                </Typography>
                <Typography variant="body2" sx={{ color: "#444" }}>
                  {job.summary}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <Divider sx={{ my: 2 }} />

      {/* Technical Skills */}
      <section style={{ marginBottom: "20px" }}>
        <Typography variant="h5" sx={{ color: "#007bff", mb: 1 }}>
          Technical Skills
        </Typography>
        <Grid container spacing={2}>
          {[
            { category: "Odoo ERP", tags: ["Functional Analysis", "Odoo Workflows", "Business Process Mapping", "User Training", "Module Configuration"] },
            { category: "Frontend", tags: ["React.js", "Vue.js", "Pinia", "Redux", "TailwindCSS", "Material-UI"] },
            { category: "Backend", tags: ["Node.js", "Express.js", "NestJS", "PHP", "Laravel", "REST APIs"] },
            { category: "Database & Tools", tags: ["MongoDB", "MySQL", "Docker", "Git", "Postman", "Linux"] },
            { category: "AI / ML", tags: ["Python", "CNN-BiLSTM", "LLM", "Deep Learning", "AI API Integration"] },
            { category: "Microsoft Platforms", tags: ["Office 365", "Power Automate", "Power Apps", "SharePoint"] },
          ].map((skill, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={idx + 1}
                variants={fadeInUp}
              >
                <Card sx={{ p: 1, backgroundColor: "#fafafa", border: "1px solid #ddd" }}>
                  <Typography variant="subtitle1" sx={{ color: "#007bff", mb: 1 }}>
                    {skill.category}
                  </Typography>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {skill.tags.map((tag, i) => (
                      <Chip key={i} label={tag} size="small" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </section>

      <Divider sx={{ my: 2 }} />

      {/* Projects, Education, References */}
      {/* You can apply the same motion.div / fadeInUp animation here for consistency */}

      <footer style={{ textAlign: "center", color: "#444", fontSize: "0.8rem", borderTop: "1px solid #ddd", paddingTop: "10px", marginTop: "10px" }}>
        © 2025 Mulugeta Linger | Telegram: @mulersoft
      </footer>
    </Container>
  );
};

export default About;
