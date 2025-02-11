// client/src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { Box, Button } from "@mui/material";
import PublicationsPage from "./components/PublicationsPage";
import ServicesPage from "./components/ServicesPage";


const App: React.FC = () => {
  // State to toggle chatbot visibility
  const [isChatbotVisible, setChatbotVisible] = useState(false);

  // Toggle function for chatbot visibility
  const toggleChatbot = () => {
    setChatbotVisible((prevState) => !prevState);
  };

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensures the container fills the viewport height
        }}
      >
        <Header />
        <Box sx={{ flex: 1 }}>
          {/* This grows to fill remaining space */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
			<Route path="/publications" element={<PublicationsPage />} />
            <Route path="/services" element={<ServicesPage />} />
        
          </Routes>
        </Box>
        <Footer />

        {/* Chatbot Button */}
        <Button
          variant="contained"
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            borderRadius: "50%",
            padding: "10px",
          }}
          onClick={toggleChatbot}
        >
          Chat
        </Button>

        {/* Conditionally render Chatbot */}
        {isChatbotVisible && <Chatbot />}
      </Box>
    </Router>
  );
};

export default App;
