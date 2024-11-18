import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { sendMessage } from "../services/apiService.ts"; // Import the reusable API function

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await sendMessage({ name, email, message }); // Use the `sendMessage` API function
      setFeedback("Thank you! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setFeedback("Oops! Something went wrong. Please try again.");
    }
  };

  return (
    <Container>
      {/* <Typography variant="h3" gutterBottom>
        Contact Me
      </Typography> */}
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
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Send Message
          </Button>
        </Box>
      </form>

      {feedback && (
        <Typography variant="body2" color="secondary" mt={2}>
          {feedback}
        </Typography>
      )}
    </Container>
  );
};

export default Contact;
