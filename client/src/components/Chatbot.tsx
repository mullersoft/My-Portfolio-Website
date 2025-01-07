import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { askChatbot } from "../services/apiService";

const Chatbot: React.FC = () => {
  const [userMessage, setUserMessage] = useState<string>(""); // User's message
  const [chatbotResponse, setChatbotResponse] = useState<string>(""); // Chatbot's response
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Don't send empty messages

    setIsLoading(true);
    try {
      // Use the service function to send the message
      const response = await askChatbot(userMessage);
      setChatbotResponse(response.data.answer); // Set the chatbot's response
      setUserMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
      setChatbotResponse("Sorry, something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "80px", // Adjust this value to fit above the button
        right: "20px",
        width: "300px",
        height: "400px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", marginBottom: "16px" }}>
        {/* Display chatbot messages here */}
        <Typography variant="body2" color="textSecondary">
          {chatbotResponse || "Welcome! How can I help you?"}
        </Typography>
      </Box>

      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        sx={{ marginBottom: "8px" }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleSendMessage}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </Box>
  );
};

export default Chatbot;
