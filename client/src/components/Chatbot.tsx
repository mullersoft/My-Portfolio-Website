import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { askChatbot } from "../services/apiService";

const Chatbot: React.FC = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setChatbotResponse("");

    try {
      const response = await askChatbot(userMessage);
      setChatbotResponse(response.data.answer);
      setUserMessage("");
    } catch (error) {
      setChatbotResponse("AI service is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "320px",
        height: "420px",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6">AI Assistant</Typography>

      <Box sx={{ flex: 1, overflowY: "auto", my: 1 }}>
        <Typography variant="body2">
          {chatbotResponse || "Hello! How can I help you?"}
        </Typography>
      </Box>

      <TextField
        size="small"
        placeholder="Ask something..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 1 }}
        onClick={handleSendMessage}
        disabled={isLoading}
      >
        {isLoading ? "Thinking..." : "Send"}
      </Button>
    </Box>
  );
};

export default Chatbot;
