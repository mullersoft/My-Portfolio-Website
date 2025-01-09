import axios from "axios";

// Get the API URL from environment variables
const API_URL = "https://my-portfolio-website-3.onrender.com"
//const API_URL = process.env.REACT_APP_API_URL;

// Users API
export const fetchUsers = async () => {
  return await axios.get(`${API_URL}/users`);
};

export const createUser = async (user: { name: string; email: string }) => {
  return await axios.post(`${API_URL}/users`, user);
};

// Projects API
export const fetchProjects = async () => {
  return await axios.get(`${API_URL}/projects`);
};

export const createProject = async (project: {
  title: string;
  description: string;
  link: string;
}) => {
  return await axios.post(`${API_URL}/projects`, project);
};

// Contact API
export const sendMessage = async (contact: {
  name: string;
  email: string;
  message: string;
}) => {
  return await axios.post(`${API_URL}/contact`, contact);
};

// Chatbot API
export const askChatbot = async (prompt: string) => {
  return await axios.post(`${API_URL}/chatgpt/ask`, { prompt });
};
