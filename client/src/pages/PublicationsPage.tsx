// src/pages/PublicationsPage.tsx
import React from "react";
import { Container, Typography, Card, CardContent, Link, Grid } from "@mui/material";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const publications = [
  {
    title: "Enhancing Cross-Site Scripting Attack Detection in Web Applications with a Hybrid CNN-BiLSTM and Online Learning Approach",
    link: "https://link.springer.com/chapter/10.1007/978-3-032-05063-2_1",
  },
  {
    title: "Intelligent Fault Diagnosis Method for Bearings Using Deep Transfer Learning on Time-Series Vibration Data Under Varying Load Conditions",
    link: "https://link.springer.com/chapter/10.1007/978-3-032-05063-2_10",
  },
];

const PublicationsPage: React.FC = () => {
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
          Publications
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#444" }}>
          Selected research papers and contributions
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {publications.map((pub, idx) => (
          <Grid item xs={12} key={idx}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={idx + 1}
              variants={fadeInUp}
            >
              <Card sx={{ p: 2, backgroundColor: "#fafafa", border: "1px solid #ddd" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#007bff", mb: 1 }}>
                    {pub.title}
                  </Typography>
                  <Link href={pub.link} target="_blank" sx={{ fontSize: "0.9rem" }}>
                    View Publication
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PublicationsPage;
