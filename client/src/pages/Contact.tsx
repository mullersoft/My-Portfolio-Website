import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { sendMessage } from "../services/apiService";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!isEmailValid(email)) {
      setFeedback("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      setFeedback("Message should be at least 10 characters long.");
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      await sendMessage({ name, email, message });
      setFeedback("Thank you! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFeedback(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Contact Me
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions, feel free to reach out through the form
        below!
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Name"
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message"
        />
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            aria-label="Send Message"
          >
            {isLoading ? <CircularProgress size={24} /> : "Send Message"}
          </Button>
        </Box>
      </form>

      {feedback && (
        <Box mt={2}>
          <Typography
            variant="body2"
            color={feedback.startsWith("Error") ? "error" : "secondary"}
          >
            {feedback}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Contact;
